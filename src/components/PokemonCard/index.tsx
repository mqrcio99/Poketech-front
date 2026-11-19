import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router';
import type { PokemonSummary } from '../../data/pokemon';
import { typeHints } from '../../data/pokemon';
import styles from './styles.module.css';

export function PokemonCard({ pokemon }: { pokemon: PokemonSummary }) {
  return (
    <Link to={`/pokemon/${pokemon.name}`} className={styles.card}>
      <div className={styles.number}>#{String(pokemon.id).padStart(3, '0')}</div>
      <div className={styles.imageWrap}><img src={pokemon.artworkUrl} alt={pokemon.displayName} loading="lazy" /></div>
      <div className={styles.info}><span className={styles.eyebrow}>{typeHints[pokemon.name] ?? 'Pokémon'}</span><h3>{pokemon.displayName}</h3></div>
      <ArrowUpRight className={styles.arrow} size={19} />
    </Link>
  );
}
