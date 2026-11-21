export type SorterResponse = number[] | { pokemonIds?: number[]; results?: { pokemonId: number }[] };

const sorterUrl = import.meta.env.VITE_POKEDEX_SORTER_URL as string | undefined;

/**
 * O endpoint pode devolver uma lista de IDs ou { pokemonIds } / { results }.
 * Sem URL configurada, o catálogo usa o fallback local e continua offline.
 */
export async function requestSorterOrder(matchedIds: number[]): Promise<number[] | null> {
  if (!sorterUrl || matchedIds.length === 0) return null;

  try {
    const response = await fetch(sorterUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ matchedPokemonIds: matchedIds, limit: 151 }),
    });
    if (!response.ok) return null;

    const payload = await response.json() as SorterResponse;
    if (Array.isArray(payload)) return payload.filter(Number.isInteger);
    if (payload.pokemonIds) return payload.pokemonIds.filter(Number.isInteger);
    return payload.results?.map(item => item.pokemonId).filter(Number.isInteger) ?? null;
  } catch {
    return null;
  }
}
