export type PokemonSummary = {
  id: number;
  name: string;
  displayName: string;
  spriteUrl: string;
  artworkUrl: string;
};

const names = `bulbasaur ivysaur venusaur charmander charmeleon charizard squirtle wartortle blastoise caterpie metapod butterfree weedle kakuna beedrill pidgey pidgeotto pidgeot rattata raticate spearow fearow ekans arbok pikachu raichu sandshrew sandslash nidoran-f nidorina nidoqueen nidoran-m nidorino nidoking clefairy clefable vulpix ninetales jigglypuff wigglytuff zubat golbat oddish gloom vileplume paras parasect venonat venomoth diglett dugtrio meowth persian psyduck golduck mankey primeape growlithe arcanine poliwag poliwhirl poliwrath abra kadabra alakazam machop machoke machamp bellsprout weepinbell victreebel tentacool tentacruel geodude graveler golem ponyta rapidash slowpoke slowbro magnemite magneton farfetchd doduo dodrio seel dewgong grimer muk shellder cloyster gastly haunter gengar onix drowzee hypno krabby kingler voltorb electrode exeggcute exeggutor cubone marowak hitmonlee hitmonchan lickitung koffing weezing rhyhorn rhydon chansey tangela kangaskhan horsea seadra goldeen seaking staryu starmie mr-mime scyther jynx electabuzz magmar pinsir tauros magikarp gyarados lapras ditto eevee vaporeon jolteon flareon porygon omanyte omastar kabuto kabutops aerodactyl snorlax articuno zapdos moltres dratini dragonair dragonite mewtwo mew`.split(' ');

const displayNames: Record<string, string> = { 'nidoran-f': 'Nidoran♀', 'nidoran-m': 'Nidoran♂', 'mr-mime': 'Mr. Mime', farfetchd: 'Farfetch’d' };

export const pokemonCatalog: PokemonSummary[] = names.map((name, index) => {
  const id = index + 1;
  return {
    id,
    name,
    displayName: displayNames[name] ?? name.split('-').map(part => part[0].toUpperCase() + part.slice(1)).join(' '),
    spriteUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`,
    artworkUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,
  };
});

export const typeHints: Record<string, string> = {
  bulbasaur: 'Planta', charmander: 'Fogo', squirtle: 'Água', pikachu: 'Elétrico',
  meowth: 'Normal', psyduck: 'Água', growlithe: 'Fogo', gastly: 'Fantasma',
  gengar: 'Fantasma', onix: 'Pedra', eevee: 'Normal', lapras: 'Água', mewtwo: 'Psíquico', mew: 'Psíquico',
};
