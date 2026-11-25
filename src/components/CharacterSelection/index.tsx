import { useState } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { usePlayerProfile } from '../../contexts/PlayerProfileContext';
import { characterOptions, type CharacterId } from '../../services/playerProfile';
import styles from './styles.module.css';

export function CharacterSelection() {
  const { setProfile } = usePlayerProfile();
  const [name, setName] = useState('');
  const [selected, setSelected] = useState<CharacterId>('pikachu');
  const selectedCharacter = characterOptions.find(character => character.id === selected) ?? characterOptions[0];
  const normalizedName = name.trim().replace(/\s+/g, ' ');

  function submit() {
    if (normalizedName.length < 2) return;
    setProfile({ name: normalizedName, characterId: selected, avatarTone: selectedCharacter.tone });
  }

  return <main className={styles.page}><section className={styles.hero}><div><span className={styles.kicker}><Sparkles size={14} /> SUA JORNADA COMEÇA AQUI</span><h1>Escolha seu parceiro de aventura.</h1><p>Digite seu nome, escolha uma companhia e depois tente descobrir o Pokémon do dia.</p></div><div className={styles.heroMark}>?</div></section><section className={styles.panel}><div className={styles.sectionHeading}><div><span className={styles.kicker}>PERSONAGEM</span><h2>Quem vai com você?</h2></div><span className={styles.counter}>{characterOptions.length} opções</span></div><div className={styles.cards}>{characterOptions.map(character => <button className={`${styles.card} ${selected === character.id ? styles.selected : ''}`} type="button" key={character.id} onClick={() => setSelected(character.id)} aria-pressed={selected === character.id}><span className={styles.imageFrame}><img src={character.image} alt={`Escolher ${character.name}`} /></span><span className={styles.cardCopy}><strong>{character.name}</strong><small>{character.description}</small></span><span className={styles.radio} /></button>)}</div><div className={styles.footer}><label className={styles.nameField}><span>Seu nome</span><input value={name} maxLength={18} onChange={event => setName(event.target.value)} onKeyDown={event => { if (event.key === 'Enter') submit(); }} placeholder="Ex.: Márcio" autoComplete="given-name" /></label><button className={styles.continue} type="button" onClick={submit} disabled={normalizedName.length < 2}>Começar jornada <ArrowRight size={17} /></button></div><small className={styles.note}>Você pode trocar o personagem depois clicando no seu avatar.</small></section></main>;
}
