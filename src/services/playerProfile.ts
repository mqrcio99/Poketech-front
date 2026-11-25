export type CharacterId = 'pikachu' | 'ash' | 'misty' | 'brock' | 'team-rocket';

export type PlayerProfile = {
  name: string;
  characterId: CharacterId;
  avatarTone: 'blue' | 'pink';
};

export type CharacterOption = {
  id: CharacterId;
  name: string;
  description: string;
  tone: 'blue' | 'pink';
  image: string;
};

const profileKey = 'poketech:player-profile';

export const characterOptions: CharacterOption[] = [
  {
    id: 'pikachu',
    name: 'Pikachu',
    description: 'O parceiro elétrico que nunca abandona uma aventura.',
    tone: 'pink',
    image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png',
  },
  {
    id: 'ash',
    name: 'Ash',
    description: 'Coragem, mochila pronta e vontade de vencer.',
    tone: 'blue',
    image: '/characters/ash.webp',
  },
  {
    id: 'misty',
    name: 'Misty',
    description: 'Energia de líder e coração de treinadora de água.',
    tone: 'pink',
    image: '/characters/misty.jpg',
  },
  {
    id: 'brock',
    name: 'Brock',
    description: 'Olhar estratégico e um time sempre bem cuidado.',
    tone: 'blue',
    image: '/characters/brock.png',
  },
  {
    id: 'team-rocket',
    name: 'Equipe Rocket',
    description: 'Planos questionáveis, estilo impecável e muita confusão.',
    tone: 'pink',
    image: '/characters/team-rocket.jpg',
  },
];

export function getCharacterOption(id: CharacterId) {
  return characterOptions.find(character => character.id === id) ?? characterOptions[0];
}

export function readPlayerProfile(): PlayerProfile | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(profileKey);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<PlayerProfile>;
    if (typeof parsed.name !== 'string' || !parsed.name.trim() || !characterOptions.some(item => item.id === parsed.characterId)) return null;
    return {
      name: parsed.name.trim().slice(0, 18),
      characterId: parsed.characterId as CharacterId,
      avatarTone: parsed.avatarTone === 'pink' ? 'pink' : 'blue',
    };
  } catch {
    return null;
  }
}

export function savePlayerProfile(profile: PlayerProfile) {
  const normalized: PlayerProfile = {
    name: profile.name.trim().replace(/\s+/g, ' ').slice(0, 18),
    characterId: profile.characterId,
    avatarTone: profile.avatarTone,
  };
  window.localStorage.setItem(profileKey, JSON.stringify(normalized));
  window.dispatchEvent(new CustomEvent('poketech:profile-updated', { detail: normalized }));
  return normalized;
}
