import { ArrowUpRight, Check, Heart, Sparkles } from 'lucide-react';
import { Link } from 'react-router';
import type { PokemonSummary } from '../../data/pokemon';
import { typeHints } from '../../data/pokemon';
import { playPokemonCry } from '../../services/pokemonCry';
import styles from './styles.module.css';

type PokemonCardProps = {
  pokemon: PokemonSummary;
  matched?: boolean;
  similar?: boolean;
  favorite?: boolean;
  onToggleFavorite?: (id: number) => void;
};

export function PokemonCard({ pokemon, matched = false, similar = false, favorite = false, onToggleFavorite }: PokemonCardProps) {
  const cardState = `${matched ? styles.matched : styles.undiscovered} ${similar && !matched ? styles.similar : ''}`;

  function toggleFavorite() {
    onToggleFavorite?.(pokemon.id);
  }

  return (
    <article className={`${styles.card} ${cardState}`}>
      <Link to={`/pokemon/${pokemon.name}`} className={styles.cardLink} onClick={() => playPokemonCry(pokemon.id)} title={`Ouvir o som de ${pokemon.displayName}`}>
        <div className={styles.number}>#{String(pokemon.id).padStart(3, '0')}</div>
        {matched && <span className={styles.status} title="Você acertou este Pokémon" aria-label="Você acertou este Pokémon"><Check size={13} /></span>}
        {!matched && similar && <span className={styles.status} title="Recomendado pelo sorter" aria-label="Recomendado pelo sorter"><Sparkles size={13} /></span>}
        <div className={styles.imageWrap}><img src={pokemon.artworkUrl} alt={pokemon.displayName} loading="lazy" /></div>
        <div className={styles.info}><span className={styles.eyebrow}>{typeHints[pokemon.name] ?? 'Pokémon'}</span><h3>{pokemon.displayName}</h3></div>
        <ArrowUpRight className={styles.arrow} size={19} />
      </Link>
      <button className={`${styles.favorite} ${favorite ? styles.favoriteActive : ''}`} type="button" onClick={toggleFavorite} aria-label={favorite ? `Remover ${pokemon.displayName} dos favoritos` : `Adicionar ${pokemon.displayName} aos favoritos`} title={favorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}>
        <Heart size={16} fill={favorite ? 'currentColor' : 'none'} />
      </button>
    </article>
  );
}
