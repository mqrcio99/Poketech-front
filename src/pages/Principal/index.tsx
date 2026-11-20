import { Check, CircleHelp, RotateCcw } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { Link } from 'react-router';
import { pokemonCatalog } from '../../data/pokemon';
import { gifAssets } from '../../data/gifAssets';
import styles from './styles.module.css';

type Attempt = { guess: string; match: boolean };

export function Principal() {
  const secret = useMemo(() => pokemonCatalog[24], []);
  const [guess, setGuess] = useState('');
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const won = attempts.some(item => item.match);
  const finished = won || attempts.length >= 5;

  function submit(event: FormEvent) {
    event.preventDefault();
    const value = guess.trim();
    if (!value || finished) return;
    setAttempts(current => [...current, { guess: value, match: value.toLowerCase() === secret.name }]);
    setGuess('');
  }

  return <main className={styles.home}><section className={styles.gameBox}><div className={styles.topBar}><h1>Quem é esse Pokémon?</h1><span>Tentativas: {attempts.length}/5</span></div><div className={styles.mystery}>{finished ? <img src={secret.artworkUrl} alt={secret.displayName} /> : <><img src="/LogoPoketech.png" alt="Poketech" /><b>?</b></>}{finished && <strong>{won ? 'Acertou' : secret.displayName}</strong>}</div><form className={styles.form} onSubmit={submit}><input value={guess} onChange={event => setGuess(event.target.value)} placeholder="Escreva aqui..." aria-label="Palpite" disabled={finished} /><button type="submit" disabled={finished || !guess.trim()}><Check size={18} /></button></form><div className={styles.attempts}>{attempts.length === 0 ? <div className={styles.empty}><img src={gifAssets.bulbasaurHeart} alt="" /><CircleHelp size={17} /> Nenhuma tentativa ainda.</div> : attempts.map((item, index) => <div className={styles.attempt} key={`${item.guess}-${index}`}><span>#{index + 1}</span><strong>{item.guess}</strong><i className={item.match ? styles.good : styles.bad} /></div>)}</div>{finished && <button className={styles.reset} type="button" onClick={() => setAttempts([])}><RotateCcw size={15} /> Jogar novamente</button>}<Link className={styles.pokedexLink} to="/Pokedex">Abrir Pokédex</Link></section></main>;
}
