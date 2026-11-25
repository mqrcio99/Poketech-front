import { createServer } from 'node:http';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const port = Number(process.env.PORT ?? 8787);
const corsOrigin = process.env.CORS_ORIGIN ?? '*';
const currentDir = dirname(fileURLToPath(import.meta.url));
const dataFile = join(currentDir, 'data', 'profiles.json');
const emptyStore = { profiles: {} };

async function loadStore() {
  try {
    return JSON.parse(await readFile(dataFile, 'utf8'));
  } catch {
    return structuredClone(emptyStore);
  }
}

let store = await loadStore();

async function persistStore() {
  await mkdir(dirname(dataFile), { recursive: true });
  await writeFile(dataFile, JSON.stringify(store, null, 2) + '\n');
}

function json(response, status, payload) {
  response.writeHead(status, {
    'Access-Control-Allow-Origin': corsOrigin,
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET,PUT,POST,OPTIONS',
    'Content-Type': 'application/json; charset=utf-8',
  });
  response.end(JSON.stringify(payload));
}

function getProfile(profileId) {
  store.profiles[profileId] ??= { name: '', characterId: null, avatarTone: 'blue', matchedPokemonIds: [], favoritePokemonIds: [], history: [] };
  return store.profiles[profileId];
}

function validPokemonId(value) {
  const id = Number(value);
  return Number.isInteger(id) && id >= 1 && id <= 151 ? id : null;
}

function dayNumber(dateString) {
  const date = new Date(`${dateString}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return null;
  return Math.floor(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()) / 86_400_000);
}

function achievements(profile) {
  return [
    { id: 'first-discovery', title: 'Primeiro registro', description: 'Descubra seu primeiro Pokémon.', unlocked: profile.matchedPokemonIds.length >= 1 },
    { id: 'five-discoveries', title: 'Colecionador', description: 'Descubra cinco Pokémon.', unlocked: profile.matchedPokemonIds.length >= 5 },
    { id: 'ten-discoveries', title: 'Rota completa', description: 'Descubra dez Pokémon.', unlocked: profile.matchedPokemonIds.length >= 10 },
    { id: 'sharp-eye', title: 'Olho afiado', description: 'Acerte usando até três tentativas.', unlocked: profile.history.some(item => item.won && item.attempts <= 3) },
    { id: 'daily-win', title: 'Desafio diário', description: 'Complete um desafio diário.', unlocked: profile.history.some(item => item.won) },
  ];
}

async function body(request) {
  let raw = '';
  for await (const chunk of request) raw += chunk;
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

const server = createServer(async (request, response) => {
  if (request.method === 'OPTIONS') return json(response, 204, {});
  if (request.url === '/health' && request.method === 'GET') return json(response, 200, { status: 'ok', service: 'poketech-api' });

  const url = new URL(request.url ?? '/', `http://${request.headers.host ?? 'localhost'}`);
  const parts = url.pathname.split('/').filter(Boolean);

  if (parts[0] !== 'api' || parts[1] !== 'v1') return json(response, 404, { error: 'Rota não encontrada.' });

  if (parts[2] === 'daily-challenge' && request.method === 'GET') {
    const date = url.searchParams.get('date') ?? new Date().toISOString().slice(0, 10);
    const day = dayNumber(date);
    if (day === null) return json(response, 422, { error: 'Data inválida. Use YYYY-MM-DD.' });
    return json(response, 200, { date, pokemonId: (day % 151) + 1, attemptLimit: 5 });
  }

  if (parts[2] !== 'profiles' || !parts[3]) return json(response, 404, { error: 'Rota não encontrada.' });

  const profileId = decodeURIComponent(parts[3]);
  const profile = getProfile(profileId);

  if (parts.length === 4 && request.method === 'GET') {
    return json(response, 200, { name: profile.name, characterId: profile.characterId, avatarTone: profile.avatarTone });
  }

  if (parts.length === 4 && request.method === 'PUT') {
    const payload = await body(request);
    const validCharacters = ['pikachu', 'ash', 'misty', 'brock', 'team-rocket'];
    const validName = typeof payload?.name === 'string' && payload.name.trim().length >= 2 && payload.name.trim().length <= 18;
    if (!payload || !validName || !validCharacters.includes(payload.characterId) || !['blue', 'pink'].includes(payload.avatarTone)) {
      return json(response, 422, { error: 'Perfil inválido.' });
    }
    profile.name = payload.name.trim().replace(/\s+/g, ' ').slice(0, 18);
    profile.characterId = payload.characterId;
    profile.avatarTone = payload.avatarTone;
    await persistStore();
    return json(response, 200, { profile: { name: profile.name, characterId: profile.characterId, avatarTone: profile.avatarTone } });
  }

  if (parts[4] === 'progress' && request.method === 'GET') {
    return json(response, 200, profile);
  }

  if (parts[4] === 'achievements' && request.method === 'GET') {
    return json(response, 200, achievements(profile));
  }

  if (parts[4] === 'favorites' && parts[5] && request.method === 'PUT') {
    const pokemonId = validPokemonId(parts[5]);
    const payload = await body(request);
    if (!pokemonId || !payload || typeof payload.favorite !== 'boolean') return json(response, 422, { error: 'favorite e pokemonId são obrigatórios.' });

    const favorites = new Set(profile.favoritePokemonIds);
    if (payload.favorite) favorites.add(pokemonId);
    else favorites.delete(pokemonId);
    profile.favoritePokemonIds = [...favorites].sort((a, b) => a - b);
    await persistStore();
    return json(response, 200, { favorite: payload.favorite });
  }

  if (parts[4] === 'games' && request.method === 'POST') {
    const payload = await body(request);
    const validDate = typeof payload?.date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(payload.date);
    const validAttemptCount = Number.isInteger(payload?.attempts) && payload.attempts >= 1 && payload.attempts <= 5;
    const pokemonId = validPokemonId(payload?.pokemonId);
    if (!payload || !validDate || !validAttemptCount || !pokemonId || typeof payload.won !== 'boolean' || typeof payload.completedAt !== 'string') {
      return json(response, 422, { error: 'Partida inválida.' });
    }

    const session = { date: payload.date, pokemonId, attempts: payload.attempts, won: payload.won, completedAt: payload.completedAt, ...(typeof payload.characterId === 'string' ? { characterId: payload.characterId } : {}) };
    profile.history = [session, ...profile.history.filter(item => item.completedAt !== session.completedAt)].slice(0, 50);
    if (session.won && !profile.matchedPokemonIds.includes(pokemonId)) profile.matchedPokemonIds.push(pokemonId);
    profile.matchedPokemonIds.sort((a, b) => a - b);
    await persistStore();
    return json(response, 201, { saved: true });
  }

  return json(response, 404, { error: 'Rota não encontrada.' });
});

server.listen(port, '0.0.0.0', () => {
  console.log(`Poketech API listening on port ${port}`);
});
