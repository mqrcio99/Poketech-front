import { ArrowDownAZ, BookOpen, Search, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router';
import { PokemonCard } from '../../components/PokemonCard';
import { gifAssets } from '../../data/gifAssets';
import { getPokemonList } from '../../services/pokemonService';
import styles from './styles.module.css';

export function Pokedex() {
  const [isOpen, setIsOpen] = useState(false);
  const [params, setParams] = useSearchParams();
  const search = params.get('search') ?? '';
  const sort = params.get('sort') ?? 'number';
  const list = useMemo(() => {
    const items = [...getPokemonList(search)];
    return items.sort((a, b) => sort === 'name' ? a.displayName.localeCompare(b.displayName) : a.id - b.id);
  }, [search, sort]);

  function updateSearch(value: string) {
    if (value) setParams({ search: value, sort });
    else setParams({ sort });
  }

  function toggleSort() {
    setParams({ search, sort: sort === 'number' ? 'name' : 'number' });
  }

  if (!isOpen) {
    return <main className={styles.page}><section className={styles.closed}><div className={styles.deviceGlow}><img src="/pokedex-closed.png" alt="Pokédex fechada" /><img className={styles.scanGif} src={gifAssets.pokedexScan} alt="" /></div><div className={styles.closedInfo}><span className={styles.kicker}>POKÉDEX</span><h1>Pronta para abrir?</h1><button className={styles.openButton} type="button" onClick={() => setIsOpen(true)}><BookOpen size={18} /> Abrir Pokédex</button></div></section></main>;
  }

  return <main className={styles.page}><section className={styles.openView}><div className={styles.deviceSide}><img src="/pokedex-closed.png" alt="Pokédex" /><button className={styles.closeButton} type="button" onClick={() => setIsOpen(false)} aria-label="Fechar Pokédex"><X size={17} /></button></div><div className={styles.screen}><header className={styles.screenHeader}><div><span className={styles.kicker}>CATÁLOGO</span><h1>Pokédex <em>151</em></h1></div><span className={styles.count}>{list.length}</span></header><div className={styles.toolbar}><label className={styles.filter}><Search size={16} /><input value={search} onChange={event => updateSearch(event.target.value)} placeholder="Buscar Pokémon" aria-label="Buscar Pokémon" /></label><button className={styles.sort} type="button" onClick={toggleSort}><ArrowDownAZ size={16} />{sort === 'number' ? 'Nº' : 'A–Z'}</button></div>{list.length ? <div className={styles.grid}>{list.map(pokemon => <PokemonCard key={pokemon.id} pokemon={pokemon} />)}</div> : <div className={styles.empty}>Nenhum resultado.</div>}</div></section></main>;
}
