import { CircleUserRound, Search } from 'lucide-react';

// import { Link } from 'react-router';

import styles from './styles.module.css';
import { BotaoTrocaCor } from '../BotaoTrocaCor';

export function Header() {
  return (
    <div className={styles.container}>
      <div className={styles.Logo}>
        <a href='/'>
          <img src='LogoPoketech.png' alt='Logo Poketech' />
        </a>
      </div>
      <div className={styles.Search}>
        <form action=''>
          <input
            type='text'
            placeholder='Pesquise o Pokemon...'
            className={styles.inputSearch}
          />

          <button className={styles.SearchButton}>
            <Search />
          </button>
        </form>
      </div>

      <div>
        <BotaoTrocaCor />
      </div>

      <div className={styles.Login}>
        <div>
          <button className={styles.userButton}>
            <CircleUserRound />
          </button>
        </div>

        <div>
          <p className={styles.TextoBase}>
            Olá, bem vindo(a)
            <br />
            <a href='' className={styles.LinkA}>
              Entrar
            </a>{' '}
            ou{' '}
            <a href='' className={styles.LinkA}>
              Cadastre-se
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
