import { ArrowDownAZ, AudioLines, BookOpen, Heart, Search, Sparkles, Volume2, VolumeX, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router';
import { PokemonCard } from '../../components/PokemonCard';
import { gifAssets } from '../../data/gifAssets';
import { getMatchedPokemonIds, getPokemonList, type PokedexSort } from '../../services/pokemonService';
import { getFavoritePokemonIds, toggleFavoritePokemon } from '../../services/playerProgress';
import { syncFavoritePokemon } from '../../services/poketechApi';
import { requestSorterOrder } from '../../services/pokedexSorter';
import { getAudioPreferences, saveAudioPreferences, type CryVersion } from '../../services/pokemonCry';
import styles from './styles.module.css';

const sortLabels: Record<PokedexSort, string> = { number: 'Nº', name: 'A–Z', similarity: 'SIM' };

export function Pokedex() {
  const [isOpen, setIsOpen] = useState(false);
  const [params, setParams] = useSearchParams();
  const search = params.get('search') ?? '';
  const [searchInput, setSearchInput] = useState(search);
  const sortParam = params.get('sort');
  const sort: PokedexSort = sortParam === 'name' || sortParam === 'similarity' ? sortParam : 'number';
  const [sorterOrder, setSorterOrder] = useState<number[] | null>(null);
  const [matchedIds] = useState(() => getMatchedPokemonIds());
  const [favoriteIds, setFavoriteIds] = useState(() => getFavoritePokemonIds());
  const [showFavorites, setShowFavorites] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(() => getAudioPreferences().enabled);
  const [cryVersion, setCryVersion] = useState<CryVersion>(() => getAudioPreferences().version);
  const matchedSet = useMemo(() => new Set(matchedIds), [matchedIds]);
  const favoriteSet = useMemo(() => new Set(favoriteIds), [favoriteIds]);
  const similarSet = useMemo(() => new Set(sorterOrder?.filter(id => !matchedSet.has(id)) ?? []), [sorterOrder, matchedSet]);
  const list = useMemo(() => getPokemonList(searchInput, sort, matchedIds, sorterOrder), [searchInput, sort, matchedIds, sorterOrder]);
  const visibleList = useMemo(() => showFavorites ? list.filter(pokemon => favoriteSet.has(pokemon.id)) : list, [favoriteSet, list, showFavorites]);

  useEffect(() => {
    let active = true;
    if (sort !== 'similarity') return () => { active = false; };
    requestSorterOrder(matchedIds).then(order => {
      if (active) setSorterOrder(order);
    });
    return () => { active = false; };
  }, [sort, matchedIds]);

  function updateSearch(value: string) {
    setSearchInput(value);
    setParams(value ? { search: value, sort } : { sort });
  }

  function toggleSort() {
    const next: PokedexSort = sort === 'number' ? 'name' : sort === 'name' ? 'similarity' : 'number';
    setParams(search ? { search, sort: next } : { sort: next });
  }

  function toggleAudio() {
    const nextEnabled = !audioEnabled;
    setAudioEnabled(nextEnabled);
    saveAudioPreferences({ enabled: nextEnabled, version: cryVersion });
  }

  function toggleCryVersion() {
    const nextVersion: CryVersion = cryVersion === 'latest' ? 'legacy' : 'latest';
    setCryVersion(nextVersion);
    saveAudioPreferences({ enabled: audioEnabled, version: nextVersion });
  }

  function handleFavorite(id: number) {
    const favorite = toggleFavoritePokemon(id);
    void syncFavoritePokemon(id, favorite);
    setFavoriteIds(getFavoritePokemonIds());
  }

  if (!isOpen) {
    return <main className={styles.page}><section className={styles.closed}><div className={styles.deviceGlow}><img src="/pokedex-closed.png" alt="Pokédex fechada" /><img className={styles.scanGif} src={gifAssets.pokedexScan} alt="" /></div><div className={styles.closedInfo}><span className={styles.kicker}>POKÉDEX</span><h1>Pronta para abrir?</h1><p>Seu catálogo pessoal dos 151 Pokémon.</p><button className={styles.openButton} type="button" onClick={() => setIsOpen(true)}><BookOpen size={18} /> Abrir Pokédex</button></div></section></main>;
  }

  return <main className={styles.page}><section className={styles.openView}><div className={styles.deviceSide}><img src="/pokedex-closed.png" alt="Pokédex" /><button className={styles.closeButton} type="button" onClick={() => setIsOpen(false)} aria-label="Fechar Pokédex"><X size={17} /></button></div><div className={styles.screen}><header className={styles.screenHeader}><div><span className={styles.kicker}>CATÁLOGO</span><h1>Pokédex <em>151</em></h1><p className={styles.subtitle}>Organize sua coleção do seu jeito.</p></div><div className={styles.counterBlock}><span className={styles.count}>{visibleList.length}</span><small>exibidos</small></div></header><div className={styles.discoveryBar}><div className={styles.ballPattern} aria-label={`${matchedIds.length} Pokémon acertados`}>{Array.from({ length: 8 }, (_, index) => <span className={index < matchedIds.length ? styles.ballActive : ''} key={index} />)}</div><span>{matchedIds.length} / 151 descobertos</span><strong>{favoriteIds.length} favoritos</strong></div><div className={styles.audioDock} aria-label="Controles de áudio"><AudioLines size={15} /><span>CRIES</span><button className={styles.audioButton} type="button" onClick={toggleAudio} aria-label={audioEnabled ? 'Silenciar cries' : 'Ativar cries'} title={audioEnabled ? 'Silenciar cries' : 'Ativar cries'}>{audioEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}{audioEnabled ? 'SOM ON' : 'SOM OFF'}</button><button className={`${styles.audioButton} ${styles.versionButton}`} type="button" onClick={toggleCryVersion} aria-label={`Usar cry ${cryVersion === 'latest' ? 'clássico' : 'moderno'}`} title="Alternar versão do cry">{cryVersion === 'latest' ? 'ATUAL' : 'CLÁSSICO'}</button></div><div className={styles.toolbar}><label className={styles.filter}><Search size={16} /><input value={searchInput} onChange={event => updateSearch(event.target.value)} placeholder="Buscar Pokémon" aria-label="Buscar Pokémon" /></label><button className={styles.sort} type="button" onClick={toggleSort} title={`Ordenar por ${sort === 'number' ? 'nome' : sort === 'name' ? 'similaridade' : 'número'}`} aria-label={`Ordenar por ${sort === 'number' ? 'número' : sort === 'name' ? 'nome' : 'similaridade'}`}>{sort === 'similarity' ? <Sparkles size={16} /> : <ArrowDownAZ size={16} />}{sortLabels[sort]}</button><button className={`${styles.favoriteFilter} ${showFavorites ? styles.favoriteFilterActive : ''}`} type="button" onClick={() => setShowFavorites(value => !value)} aria-pressed={showFavorites} title="Mostrar apenas favoritos"><Heart size={16} fill={showFavorites ? 'currentColor' : 'none'} /> <span>Favoritos</span></button></div>{visibleList.length ? <div className={styles.grid}>{visibleList.map(pokemon => <PokemonCard key={pokemon.id} pokemon={pokemon} matched={matchedSet.has(pokemon.id)} similar={sort === 'similarity' && similarSet.has(pokemon.id)} favorite={favoriteSet.has(pokemon.id)} onToggleFavorite={handleFavorite} />)}</div> : <div className={styles.empty}><img src={gifAssets.bulbasaurHeart} alt="" /><Heart size={20} /><span>{showFavorites ? 'Você ainda não favoritou nenhum Pokémon.' : 'Nenhum resultado.'}</span></div>}</div></section></main>;
}
