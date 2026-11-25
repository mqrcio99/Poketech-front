import { pokemonCatalog, type PokemonSummary } from '../data/pokemon';
import type { CharacterId } from './playerProfile';

export type GameSession = {
  date: string;
  pokemonId: number;
  attempts: number;
  won: boolean;
  completedAt: string;
  characterId?: CharacterId;
};

export type Achievement = {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
};

const favoritesKey = 'poketech:favorite-pokemon-ids';
const historyKey = 'poketech:game-history';

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;

  try {
    const value = JSON.parse(window.localStorage.getItem(key) ?? 'null') as T | null;
    return value ?? fallback;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T) {
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function getFavoritePokemonIds(): number[] {
  const stored = readJson<unknown>(favoritesKey, []);
  return Array.isArray(stored)
    ? stored.filter((id): id is number => Number.isInteger(id) && id > 0)
    : [];
}

export function toggleFavoritePokemon(id: number): boolean {
  const favorites = new Set(getFavoritePokemonIds());
  const isFavorite = favorites.has(id);

  if (isFavorite) favorites.delete(id);
  else favorites.add(id);

  writeJson(favoritesKey, [...favorites].sort((a, b) => a - b));
  return !isFavorite;
}

export function getGameHistory(): GameSession[] {
  const stored = readJson<unknown>(historyKey, []);
  if (!Array.isArray(stored)) return [];

  return stored
    .filter((item): item is GameSession => {
      if (!item || typeof item !== 'object') return false;
      const session = item as Partial<GameSession>;
      return Number.isInteger(session.pokemonId)
        && Number.isInteger(session.attempts)
        && typeof session.date === 'string'
        && typeof session.completedAt === 'string'
        && typeof session.won === 'boolean';
    })
    .slice(0, 20);
}

export function saveGameSession(session: GameSession) {
  const history = [session, ...getGameHistory().filter(item => item.completedAt !== session.completedAt)].slice(0, 20);
  writeJson(historyKey, history);
}

export function getDayKey(date = new Date()): string {
  return [date.getFullYear(), String(date.getMonth() + 1).padStart(2, '0'), String(date.getDate()).padStart(2, '0')].join('-');
}

export function getDailyPokemon(date = new Date()): PokemonSummary {
  const dayNumber = Math.floor(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86_400_000);
  return pokemonCatalog[dayNumber % pokemonCatalog.length];
}

export function getDailyLabel(date = new Date()): string {
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' });
}

export function getPlayerStats(matchedCount: number, history = getGameHistory()) {
  const wins = history.filter(session => session.won);
  const bestStreak = history.reduce((best, session, index) => {
    if (!session.won) return best;
    let streak = 1;
    for (let cursor = index + 1; cursor < history.length && history[cursor].won; cursor += 1) streak += 1;
    return Math.max(best, streak);
  }, 0);

  return {
    discovered: matchedCount,
    games: history.length,
    wins: wins.length,
    bestStreak,
  };
}

export function getAchievements(matchedCount: number, history = getGameHistory()): Achievement[] {
  return [
    {
      id: 'first-discovery',
      title: 'Primeiro registro',
      description: 'Descubra seu primeiro Pokémon.',
      unlocked: matchedCount >= 1,
    },
    {
      id: 'five-discoveries',
      title: 'Colecionador',
      description: 'Descubra cinco Pokémon.',
      unlocked: matchedCount >= 5,
    },
    {
      id: 'ten-discoveries',
      title: 'Rota completa',
      description: 'Descubra dez Pokémon.',
      unlocked: matchedCount >= 10,
    },
    {
      id: 'sharp-eye',
      title: 'Olho afiado',
      description: 'Acerte usando até três tentativas.',
      unlocked: history.some(session => session.won && session.attempts <= 3),
    },
    {
      id: 'daily-win',
      title: 'Desafio diário',
      description: 'Complete um desafio diário.',
      unlocked: history.some(session => session.won),
    },
  ];
}
