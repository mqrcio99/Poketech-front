import { pokemonCatalog, typeHints, type PokemonSummary } from '../data/pokemon';

export type PokedexSort = 'number' | 'name' | 'similarity';

export type PokemonDetails = PokemonSummary & {
  types: string[];
  height: string;
  weight: string;
  stats: { label: string; value: number }[];
};

const api = 'https://pokeapi.co/api/v2/pokemon';
export const matchedPokemonStorageKey = 'poketech:matched-pokemon-ids';

export function getMatchedPokemonIds(): number[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = JSON.parse(window.localStorage.getItem(matchedPokemonStorageKey) ?? '[]');
    return Array.isArray(stored) ? stored.filter((id): id is number => Number.isInteger(id) && id > 0) : [];
  } catch {
    return [];
  }
}

export function rememberMatchedPokemon(id: number) {
  const ids = new Set(getMatchedPokemonIds());
  ids.add(id);
  window.localStorage.setItem(matchedPokemonStorageKey, JSON.stringify([...ids].sort((a, b) => a - b)));
}

export function getPokemonList(
  search = '',
  sort: PokedexSort = 'number',
  matchedIds: number[] = [],
  sorterOrder: number[] | null = null,
): PokemonSummary[] {
  const query = search.trim().toLowerCase();
  const items = pokemonCatalog.filter(pokemon => !query || pokemon.name.includes(query) || pokemon.displayName.toLowerCase().includes(query) || String(pokemon.id) === query);
  const matched = new Set(matchedIds);

  return [...items].sort((a, b) => {
    if (sort === 'name') return a.displayName.localeCompare(b.displayName);

    if (sort === 'similarity') {
      if (sorterOrder?.length) {
        const rank = new Map(sorterOrder.map((id, index) => [id, index]));
        return (rank.get(a.id) ?? Number.MAX_SAFE_INTEGER) - (rank.get(b.id) ?? Number.MAX_SAFE_INTEGER) || a.id - b.id;
      }

      const aMatched = matched.has(a.id) ? 0 : 1;
      const bMatched = matched.has(b.id) ? 0 : 1;
      return aMatched - bMatched || a.id - b.id;
    }

    return a.id - b.id;
  });
}

export async function getPokemonDetails(name: string): Promise<PokemonDetails> {
  try {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 1600);
    const response = await fetch(`${api}/${encodeURIComponent(name)}`, { signal: controller.signal });
    window.clearTimeout(timeout);
    if (!response.ok) throw new Error('Pokémon não encontrado');
    const data = await response.json();
    return {
      id: data.id,
      name: data.name,
      displayName: pokemonCatalog[data.id - 1]?.displayName ?? data.name,
      spriteUrl: data.sprites.front_default ?? pokemonCatalog[data.id - 1]?.spriteUrl,
      artworkUrl: data.sprites.other?.['official-artwork']?.front_default ?? pokemonCatalog[data.id - 1]?.artworkUrl,
      types: data.types.map((item: { type: { name: string } }) => translateType(item.type.name)),
      height: `${(data.height / 10).toFixed(1).replace('.', ',')} m`,
      weight: `${(data.weight / 10).toFixed(1).replace('.', ',')} kg`,
      stats: data.stats.map((item: { stat: { name: string }; base_stat: number }) => ({ label: translateStat(item.stat.name), value: item.base_stat })),
    };
  } catch {
    const pokemon = pokemonCatalog.find(item => item.name === name);
    if (!pokemon) throw new Error('Pokémon não encontrado');
    return { ...pokemon, types: [typeHints[name] ?? 'Pokémon'], height: '—', weight: '—', stats: [] };
  }
}

function translateType(type: string) {
  const map: Record<string, string> = { grass: 'Planta', poison: 'Veneno', fire: 'Fogo', water: 'Água', electric: 'Elétrico', psychic: 'Psíquico', rock: 'Pedra', ground: 'Terrestre', flying: 'Voador', bug: 'Inseto', normal: 'Normal', ghost: 'Fantasma', ice: 'Gelo', fighting: 'Lutador', steel: 'Aço', dragon: 'Dragão' };
  return map[type] ?? type;
}
function translateStat(stat: string) {
  const map: Record<string, string> = { hp: 'Vida', attack: 'Ataque', defense: 'Defesa', 'special-attack': 'Ataque especial', 'special-defense': 'Defesa especial', speed: 'Velocidade' };
  return map[stat] ?? stat;
}
