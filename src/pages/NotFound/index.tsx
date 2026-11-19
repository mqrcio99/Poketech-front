import { Link } from 'react-router';
import styles from './styles.module.css';
export function NotFound(){return <main className={styles.page}><span>404 / POKETECH</span><h1>Essa rota se perdeu.</h1><p>Mas a Pokédex continua por aqui.</p><Link to="/Pokedex">Voltar para a Pokédex</Link></main>;}
