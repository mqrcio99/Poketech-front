import { CalendarDays, Check, CircleHelp, Lightbulb, Medal, RotateCcw, Target, Trophy } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { Link } from 'react-router';
import { CharacterSelection } from '../../components/CharacterSelection';
import { usePlayerProfile } from '../../contexts/PlayerProfileContext';
import { pokemonCatalog } from '../../data/pokemon';
import { gifAssets } from '../../data/gifAssets';
import { getMatchedPokemonIds, rememberMatchedPokemon } from '../../services/pokemonService';
import { getAchievements, getDailyLabel, getDailyPokemon, getDayKey, getGameHistory, getPlayerStats, saveGameSession, type Achievement, type GameSession } from '../../services/playerProgress';
import { syncGameSession } from '../../services/poketechApi';
import styles from './styles.module.css';

type Attempt = { guess: string; match: boolean };
const MAX_HINTS = 3;

function normalizeGuess(value: string) {
  return value.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function buildHint(name: string, level: number) {
  const lettersToReveal = Math.min(Math.max(level, 0), name.replace(/[^\p{L}\p{N}]/gu, '').length);
  let revealed = 0;
  return [...name].map(character => {
    if (!/[\p{L}\p{N}]/u.test(character)) return character;
    revealed += 1;
    return revealed <= lettersToReveal ? character : '·';
  }).join(' ');
}

export function Principal() {
  const { profile } = usePlayerProfile();
  const secret = useMemo(() => getDailyPokemon(), []);
  const [guess, setGuess] = useState('');
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [hintLevel, setHintLevel] = useState(0);
  const [matchedCount, setMatchedCount] = useState(() => getMatchedPokemonIds().length);
  const [history, setHistory] = useState<GameSession[]>(() => getGameHistory());
  const [stats, setStats] = useState(() => getPlayerStats(matchedCount, history));
  const [achievements, setAchievements] = useState<Achievement[]>(() => getAchievements(matchedCount, history));
  const won = attempts.some(item => item.match);
  const finished = won || attempts.length >= 5;

  if (!profile) return <CharacterSelection />;

  function submit(event: FormEvent) {
    event.preventDefault();
    const value = guess.trim();
    if (!value || finished) return;

    const match = normalizeGuess(value) === normalizeGuess(secret.name) || normalizeGuess(value) === normalizeGuess(secret.displayName);
    if (match) rememberMatchedPokemon(secret.id);
    const nextAttempts = [...attempts, { guess: value, match }];
    setAttempts(nextAttempts);
    setGuess('');

    if (match || nextAttempts.length >= 5) {
      const session = { date: getDayKey(), pokemonId: secret.id, attempts: nextAttempts.length, won: match, completedAt: new Date().toISOString(), characterId: profile?.characterId };
      saveGameSession(session);
      void syncGameSession(session);
      const nextHistory = getGameHistory();
      const nextMatchedCount = getMatchedPokemonIds().length;
      setHistory(nextHistory);
      setMatchedCount(nextMatchedCount);
      setStats(getPlayerStats(nextMatchedCount, nextHistory));
      setAchievements(getAchievements(nextMatchedCount, nextHistory));
    }
  }

  function useHint() {
    if (finished || hintLevel >= MAX_HINTS) return;
    setHintLevel(level => level + 1);
  }

  function resetGame() {
    setAttempts([]);
    setGuess('');
    setHintLevel(0);
  }

  const recentHistory = history.slice(0, 3);
  const hintText = buildHint(secret.displayName, hintLevel);
  const hintsRemaining = MAX_HINTS - hintLevel;

  return <main className={styles.home}><div className={styles.layout}><section className={styles.gameBox}><header className={styles.topBar}><div><span className={styles.eyebrow}>DESAFIO DIÁRIO</span><h1>Quem é esse Pokémon?</h1><p>Uma tentativa por vez. Cinco chances para registrar o Pokémon do dia.</p></div><div className={styles.dailyBadge}><CalendarDays size={16} /><span>{getDailyLabel()}</span></div></header><div className={styles.challengeLine}><span><Target size={14} /> {attempts.length}/5 tentativas</span><span>{matchedCount}/151 descobertos</span></div><div className={`${styles.mystery} ${finished ? styles.mysteryFinished : ''}`}><img className={finished ? styles.revealedPokemon : styles.silhouettePokemon} src={secret.artworkUrl} alt={finished ? secret.displayName : 'Silhueta de um Pokémon'} />{!finished && <b>?</b>}{finished && <strong>{won ? 'Acertou' : secret.displayName}</strong>}</div><form className={styles.form} onSubmit={submit}><input value={guess} onChange={event => setGuess(event.target.value)} placeholder="Escreva o nome do Pokémon" aria-label="Palpite" disabled={finished} /><button type="submit" disabled={finished || !guess.trim()} aria-label="Confirmar palpite"><Check size={18} /></button></form>{!finished && <div className={styles.hintBox} aria-live="polite"><div className={styles.hintCopy}><Lightbulb size={17} /><div><strong>{hintLevel === 0 ? 'Travou? Peça uma dica.' : `Dica ${hintLevel} de ${MAX_HINTS}`}</strong><span>{hintLevel === 0 ? 'Revele uma letra por vez sem gastar tentativa.' : hintText}</span></div></div><button className={styles.hintButton} type="button" onClick={useHint} disabled={hintsRemaining === 0}>{hintsRemaining > 0 ? `Usar dica (${hintsRemaining})` : 'Sem dicas'}</button></div>}{hintLevel > 0 && <div className={styles.hintReveal} aria-label={`Nome parcialmente revelado: ${hintText}`}>{hintText}</div>}<div className={styles.attempts}>{attempts.length === 0 ? <div className={styles.empty}><img src={gifAssets.bulbasaurHeart} alt="" /><CircleHelp size={17} /> Nenhuma tentativa ainda.</div> : attempts.map((item, index) => <div className={styles.attempt} key={`${item.guess}-${index}`}><span>#{index + 1}</span><strong>{item.guess}</strong>{item.match ? <img className={styles.attemptGif} src={gifAssets.pokemonWave} alt="Comemoração do acerto" /> : <b className={styles.wrongStamp}>OPA!</b>}<i className={item.match ? styles.good : styles.bad} />{item.match && <small>Acerto</small>}</div>)}</div>{finished && <button className={styles.reset} type="button" onClick={resetGame}><RotateCcw size={15} /> Jogar novamente</button>}<Link className={styles.pokedexLink} to="/Pokedex">Abrir Pokédex</Link></section><aside className={styles.dashboard}><section className={styles.statsCard}><img className={styles.waveGif} src={gifAssets.pokemonWave} alt="Pokémon acenando" /><div className={styles.panelHeading}><div><span className={styles.eyebrow}>SEU PROGRESSO</span><h2>Resumo da jornada</h2></div><Trophy size={20} /></div><div className={styles.statsGrid}><div><strong>{stats.discovered}</strong><span>descobertos</span></div><div><strong>{stats.wins}</strong><span>vitórias</span></div><div><strong>{stats.bestStreak}</strong><span>melhor sequência</span></div></div><div className={styles.progressTrack}><span style={{ width: `${Math.min((stats.discovered / 151) * 100, 100)}%` }} /></div><small className={styles.progressLabel}>{stats.discovered} de 151 Pokémon registrados</small></section><section className={styles.achievementsCard}><div className={styles.panelHeading}><div><span className={styles.eyebrow}>CONQUISTAS</span><h2>Pequenas vitórias</h2></div><Medal size={20} /></div><div className={styles.achievementList}>{achievements.map(item => <div className={`${styles.achievement} ${item.unlocked ? styles.unlocked : ''}`} key={item.id}><span className={styles.achievementIcon}><Check size={14} /></span><div><strong>{item.title}</strong><small>{item.description}</small></div></div>)}</div></section>{recentHistory.length > 0 && <section className={styles.historyCard}><div className={styles.panelHeading}><div><span className={styles.eyebrow}>HISTÓRICO</span><h2>Últimas partidas</h2></div></div><div className={styles.historyList}>{recentHistory.map(session => <div className={styles.historyItem} key={session.completedAt}><span>#{String(session.pokemonId).padStart(3, '0')} {pokemonCatalog[session.pokemonId - 1]?.displayName}</span><strong className={session.won ? styles.historyWin : styles.historyLoss}>{session.won ? `${session.attempts} tent.` : 'não descoberto'}</strong></div>)}</div></section>}</aside></div></main>;
}
