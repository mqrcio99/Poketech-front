import type { GameSession } from './playerProgress';
import type { PlayerProfile } from './playerProfile';

export type RemoteProgress = {
  matchedPokemonIds: number[];
  favoritePokemonIds: number[];
  history: GameSession[];
};

export type RemoteProfile = PlayerProfile;

const apiBase = (import.meta.env.VITE_POKETECH_API_URL as string | undefined)?.replace(/\/$/, '');
const profileId = (import.meta.env.VITE_POKETECH_PROFILE_ID as string | undefined) ?? 'demo';

export const isRestApiConfigured = Boolean(apiBase);

async function request<T>(path: string, options?: RequestInit): Promise<T | null> {
  if (!apiBase) return null;

  try {
    const response = await fetch(`${apiBase}${path}`, {
      ...options,
      headers: { 'Content-Type': 'application/json', ...options?.headers },
    });
    if (!response.ok) return null;
    return await response.json() as T;
  } catch {
    return null;
  }
}

export function fetchRemoteProgress() {
  return request<RemoteProgress>(`/api/v1/profiles/${encodeURIComponent(profileId)}/progress`);
}

export function syncFavoritePokemon(pokemonId: number, favorite: boolean) {
  return request<{ favorite: boolean }>(`/api/v1/profiles/${encodeURIComponent(profileId)}/favorites/${pokemonId}`, {
    method: 'PUT',
    body: JSON.stringify({ favorite }),
  });
}

export function syncGameSession(session: GameSession) {
  return request<{ saved: boolean }>(`/api/v1/profiles/${encodeURIComponent(profileId)}/games`, {
    method: 'POST',
    body: JSON.stringify(session),
  });
}

export function syncPlayerProfile(profile: PlayerProfile) {
  return request<{ profile: PlayerProfile }>(`/api/v1/profiles/${encodeURIComponent(profileId)}`, {
    method: 'PUT',
    body: JSON.stringify(profile),
  });
}
