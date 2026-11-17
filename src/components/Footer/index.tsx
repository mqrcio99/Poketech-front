import { BookOpen, GraduationCap, Heart, Code2 } from 'lucide-react';
import styles from './styles.module.css';

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.about}>
          <img src='LogoPoketech.png' alt='Logo Poketech' />
          <p>
            Explore o universo Pokémon! Uma Pokédex desenvolvida para reunir
            informações, curiosidades e dados sobre os Pokémon de uma maneira
            simples e interativa.
          </p>
        </div>

        <div className={styles.project}>
          <h3>
            <BookOpen size={18} />
            Sobre o projeto
          </h3>
          <p>
            Este site é um projeto escolar desenvolvido para fins exclusivamente
            educacionais. Não possui finalidade comercial ou intenção de lucro.
          </p>
        </div>

        <div className={styles.institution}>
          <h3>
            <GraduationCap size={20} />
            Instituição
          </h3>
          <p>
            Litoral Tech
            <br />
            SENAC RS — Tramandaí
          </p>
          <span>Projeto de estudos • 2026</span>
        </div>
      </div>

      <div className={styles.disclaimer}>
        <p>
          <Heart size={14} />
          Desenvolvido com dedicação para fins educacionais.
        </p>

        <p>
          Poketech não possui vínculo oficial com a Nintendo, The Pokémon
          Company ou Game Freak.
        </p>
      </div>

      <div className={styles.bottom}>
        <span>© 2026 Poketech — Todos os direitos reservados ao projeto.</span>
        <span>
          <Code2 size={15} />
          Projeto acadêmico
        </span>
      </div>
    </footer>
  );
}
