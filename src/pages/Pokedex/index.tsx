import { ArrowDownAZ, BookOpen, Search, Sparkles, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router';
import { PokemonCard } from '../../components/PokemonCard';
import { gifAssets } from '../../data/gifAssets';
import { getMatchedPokemonIds, getPokemonList, type PokedexSort } from '../../services/pokemonService';
import { requestSorterOrder } from '../../services/pokedexSorter';
import styles from './styles.module.css';

const sortLabels: Record<PokedexSort, string> = { number: 'Nº', name: 'A–Z', similarity: 'SIM' };

export function Pokedex() {
  const [isOpen, setIsOpen] = useState(false);
  const [params, setParams] = useSearchParams();
  const search = params.get('search') ?? '';
  const sortParam = params.get('sort');
  const sort: PokedexSort = sortParam === 'name' || sortParam === 'similarity' ? sortParam : 'number';
  const [sorterOrder, setSorterOrder] = useState<number[] | null>(null);
  const matchedIds = useMemo(() => getMatchedPokemonIds(), []);
  const matchedSet = useMemo(() => new Set(matchedIds), [matchedIds]);
  const similarSet = useMemo(() => new Set(sorterOrder?.filter(id => !matchedSet.has(id)) ?? []), [sorterOrder, matchedSet]);
  const list = useMemo(() => getPokemonList(search, sort, matchedIds, sorterOrder), [search, sort, matchedIds, sorterOrder]);

  useEffect(() => {
    let active = true;
    if (sort !== 'similarity') {
      return () => { active = false; };
    }

    requestSorterOrder(matchedIds).then(order => {
      if (active) setSorterOrder(order);
    });

    return () => { active = false; };
  }, [sort, matchedIds]);

  function updateSearch(value: string) {
    setParams(value ? { search: value, sort } : { sort });
  }

  function toggleSort() {
    const next: PokedexSort = sort === 'number' ? 'name' : sort === 'name' ? 'similarity' : 'number';
    setParams(search ? { search, sort: next } : { sort: next });
  }

  if (!isOpen) {
    return <main className={styles.page}><section className={styles.closed}><div className={styles.deviceGlow}><img src="/pokedex-closed.png" alt="Pokédex fechada" /><img className={styles.scanGif} src={gifAssets.pokedexScan} alt="" /></div><div className={styles.closedInfo}><span className={styles.kicker}>POKÉDEX</span><h1>Pronta para abrir?</h1><button className={styles.openButton} type="button" onClick={() => setIsOpen(true)}><BookOpen size={18} /> Abrir Pokédex</button></div></section></main>;
  }

  return <main className={styles.page}><section className={styles.openView}><div className={styles.deviceSide}><img src="/pokedex-closed.png" alt="Pokédex" /><button className={styles.closeButton} type="button" onClick={() => setIsOpen(false)} aria-label="Fechar Pokédex"><X size={17} /></button></div><div className={styles.screen}><header className={styles.screenHeader}><div><span className={styles.kicker}>CATÁLOGO</span><h1>Pokédex <em>151</em></h1></div><span className={styles.count}>{list.length}</span></header><div className={styles.discoveryBar}><div className={styles.ballPattern} aria-label={`${matchedIds.length} Pokémon acertados`}>{Array.from({ length: 8 }, (_, index) => <span className={index < matchedIds.length ? styles.ballActive : ''} key={index} />)}</div><span>{matchedIds.length ? `${matchedIds.length} acerto${matchedIds.length > 1 ? 's' : ''}` : 'Acertos'}</span></div><div className={styles.toolbar}><label className={styles.filter}><Search size={16} /><input value={search} onChange={event => updateSearch(event.target.value)} placeholder="Buscar Pokémon" aria-label="Buscar Pokémon" /></label><button className={styles.sort} type="button" onClick={toggleSort} title={`Ordenar por ${sort === 'number' ? 'nome' : sort === 'name' ? 'similaridade' : 'número'}`} aria-label={`Ordenar por ${sort === 'number' ? 'número' : sort === 'name' ? 'nome' : 'similaridade'}`}>{sort === 'similarity' ? <Sparkles size={16} /> : <ArrowDownAZ size={16} />}{sortLabels[sort]}</button></div>{list.length ? <div className={styles.grid}>{list.map(pokemon => <PokemonCard key={pokemon.id} pokemon={pokemon} matched={matchedSet.has(pokemon.id)} similar={sort === 'similarity' && similarSet.has(pokemon.id)} />)}</div> : <div className={styles.empty}>Nenhum resultado.</div>}</div></section></main>;
}
