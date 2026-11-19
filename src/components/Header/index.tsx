import { Moon, Search, Sun, UserRound } from 'lucide-react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router';
import { useTheme } from '../../hooks/useTheme';
import styles from './styles.module.css';

export function Header() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  function handleSubmit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); const value = new FormData(event.currentTarget).get('search')?.toString().trim(); navigate(value ? `/Pokedex?search=${encodeURIComponent(value)}` : '/Pokedex'); }
  return <header className={styles.header}><div className={styles.inner}><Link to="/" className={styles.brand}><img src="/LogoPoketech.png" alt="Poketech" /></Link><form className={styles.search} onSubmit={handleSubmit}><Search size={18}/><input name="search" aria-label="Buscar Pokémon" placeholder="Buscar por nome ou número"/><button type="submit" aria-label="Buscar Pokémon"><Search size={17}/></button></form><div className={styles.actions}><button className={styles.iconButton} type="button" onClick={toggleTheme} aria-label="Alternar tema">{theme === 'dark' ? <Sun size={18}/> : <Moon size={18}/>}</button><button className={styles.account} type="button"><UserRound size={17}/><span>Entrar</span></button></div></div></header>;
}
