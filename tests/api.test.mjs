import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawn } from 'node:child_process';
import { test, before, after } from 'node:test';

const projectDir = new URL('..', import.meta.url).pathname;
let temporaryDir;
let apiProcess;
let baseUrl;

function waitForServer(process) {
  return new Promise((resolve, reject) => {
    let output = '';
    const timeout = setTimeout(() => reject(new Error(`API não iniciou a tempo. Saída: ${output}`)), 5000);

    process.stdout.setEncoding('utf8');
    process.stdout.on('data', chunk => {
      output += chunk;
      const match = output.match(/listening on port (\d+)/);
      if (match) {
        clearTimeout(timeout);
        resolve(`http://127.0.0.1:${match[1]}`);
      }
    });
    process.once('error', error => {
      clearTimeout(timeout);
      reject(error);
    });
    process.once('exit', code => {
      if (code !== null && !baseUrl) {
        clearTimeout(timeout);
        reject(new Error(`API encerrou com código ${code}. Saída: ${output}`));
      }
    });
  });
}

async function request(path, options) {
  const response = await fetch(`${baseUrl}${path}`, options);
  const payload = await response.json();
  return { response, payload };
}

before(async () => {
  temporaryDir = await mkdtemp(join(tmpdir(), 'poketech-api-test-'));
  apiProcess = spawn(process.execPath, ['server/index.mjs'], {
    cwd: projectDir,
    env: {
      ...process.env,
      PORT: '0',
      POKETECH_DATA_FILE: join(temporaryDir, 'profiles.json'),
      CORS_ORIGIN: 'http://localhost:4173',
    },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  baseUrl = await waitForServer(apiProcess);
});

after(async () => {
  if (apiProcess && !apiProcess.killed) apiProcess.kill();
  if (temporaryDir) await rm(temporaryDir, { recursive: true, force: true });
});

test('expõe health check e desafio diário determinístico', async () => {
  const health = await request('/health');
  assert.equal(health.response.status, 200);
  assert.deepEqual(health.payload, { status: 'ok', service: 'poketech-api' });

  const daily = await request('/api/v1/daily-challenge?date=2026-11-25');
  assert.equal(daily.response.status, 200);
  assert.equal(daily.payload.date, '2026-11-25');
  assert.equal(daily.payload.attemptLimit, 5);
  assert.ok(Number.isInteger(daily.payload.pokemonId));
  assert.ok(daily.payload.pokemonId >= 1 && daily.payload.pokemonId <= 151);
});

test('persiste perfil, favorito, partida, progresso e conquistas', async () => {
  const profilePath = '/api/v1/profiles/test-runner';
  const profile = await request(profilePath, {
    method: 'PUT',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ name: 'Marcio', characterId: 'ash', avatarTone: 'blue' }),
  });
  assert.equal(profile.response.status, 200);
  assert.equal(profile.payload.profile.name, 'Marcio');

  const favorite = await request(`${profilePath}/favorites/4`, {
    method: 'PUT',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ favorite: true }),
  });
  assert.equal(favorite.response.status, 200);
  assert.equal(favorite.payload.favorite, true);

  const game = await request(`${profilePath}/games`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      date: '2026-11-25',
      pokemonId: 4,
      attempts: 2,
      won: true,
      completedAt: '2026-11-25T12:00:00.000Z',
      characterId: 'ash',
    }),
  });
  assert.equal(game.response.status, 201);

  const progress = await request(`${profilePath}/progress`);
  assert.equal(progress.response.status, 200);
  assert.deepEqual(progress.payload.favoritePokemonIds, [4]);
  assert.deepEqual(progress.payload.matchedPokemonIds, [4]);
  assert.equal(progress.payload.history.length, 1);

  const achievements = await request(`${profilePath}/achievements`);
  assert.equal(achievements.response.status, 200);
  assert.equal(achievements.payload.find(item => item.id === 'first-discovery').unlocked, true);
  assert.equal(achievements.payload.find(item => item.id === 'sharp-eye').unlocked, true);
});

test('rejeita perfil inválido', async () => {
  const result = await request('/api/v1/profiles/invalid', {
    method: 'PUT',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ name: 'A', characterId: 'unknown', avatarTone: 'green' }),
  });
  assert.equal(result.response.status, 422);
});
