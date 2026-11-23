export type CryVersion = 'latest' | 'legacy';

type AudioPreferences = {
  enabled: boolean;
  version: CryVersion;
};

const criesUrl = 'https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon';
const preferencesKey = 'poketech:audio-preferences';
const defaultPreferences: AudioPreferences = { enabled: true, version: 'latest' };
let currentAudio: HTMLAudioElement | null = null;

export function getAudioPreferences(): AudioPreferences {
  if (typeof window === 'undefined') return defaultPreferences;

  try {
    const stored = JSON.parse(window.localStorage.getItem(preferencesKey) ?? '{}') as Partial<AudioPreferences>;
    return {
      enabled: stored.enabled !== false,
      version: stored.version === 'legacy' ? 'legacy' : 'latest',
    };
  } catch {
    return defaultPreferences;
  }
}

export function saveAudioPreferences(preferences: AudioPreferences) {
  window.localStorage.setItem(preferencesKey, JSON.stringify(preferences));
}

export function playPokemonCry(id: number) {
  const preferences = getAudioPreferences();
  currentAudio?.pause();
  if (!preferences.enabled) return;

  currentAudio = new Audio(`${criesUrl}/${preferences.version}/${id}.ogg`);
  currentAudio.volume = 0.72;
  void currentAudio.play().catch(() => {
    currentAudio = null;
  });
}
