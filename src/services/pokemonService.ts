import { pokemonCatalog, typeHints, type PokemonSummary } from '../data/pokemon';

export type PokemonDetails = PokemonSummary & {
  types: string[];
  height: string;
  weight: string;
  stats: { label: string; value: number }[];
};

const api = 'https://pokeapi.co/api/v2/pokemon';

export function getPokemonList(search = ''): PokemonSummary[] {
  const query = search.trim().toLowerCase();
  if (!query) return pokemonCatalog;
  return pokemonCatalog.filter(pokemon => pokemon.name.includes(query) || String(pokemon.id) === query);
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
