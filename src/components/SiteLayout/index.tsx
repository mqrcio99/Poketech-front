import { BookOpen, ChevronLeft, ChevronRight, Gamepad2, Menu, X } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { NavLink } from 'react-router';
import { Header } from '../Header';
import styles from './styles.module.css';

type SiteLayoutProps = {
  children: ReactNode;
};

export function SiteLayout({ children }: SiteLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  function closeMobileMenu() {
    setMobileOpen(false);
  }

  return (
    <>
      <Header />
      <div className={`${styles.frame} ${collapsed ? styles.collapsed : ''} ${mobileOpen ? styles.mobileOpen : ''}`}>
        <button className={styles.backdrop} type="button" aria-label="Fechar menu" onClick={closeMobileMenu} />
        <aside className={styles.sidebar} aria-label="Navegação principal">
          <div className={styles.sidebarHeader}>
            <span className={styles.sidebarLabel}>Navegação</span>
            <button
              className={styles.collapseButton}
              type="button"
              onClick={() => setCollapsed(value => !value)}
              aria-label={collapsed ? 'Expandir menu lateral' : 'Recolher menu lateral'}
              aria-expanded={!collapsed}
            >
              {collapsed ? <ChevronRight size={17} /> : <ChevronLeft size={17} />}
            </button>
          </div>

          <nav className={styles.nav}>
            <NavLink to="/" end className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`} onClick={closeMobileMenu}>
              <Gamepad2 size={19} />
              <span>Jogar</span>
            </NavLink>
            <NavLink to="/Pokedex" className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`} onClick={closeMobileMenu}>
              <BookOpen size={19} />
              <span>Pokédex</span>
            </NavLink>
          </nav>

          <div className={styles.sidebarFooter}>
            <span className={styles.sidebarDot} />
            <span>Explore no seu ritmo</span>
          </div>
        </aside>

        <div className={styles.content}>
          <button className={styles.mobileMenuButton} type="button" onClick={() => setMobileOpen(true)} aria-label="Abrir menu lateral">
            <Menu size={18} />
            <span>Menu</span>
          </button>
          <button className={styles.mobileCloseButton} type="button" onClick={closeMobileMenu} aria-label="Fechar menu lateral">
            <X size={18} />
          </button>
          {children}
          <footer className={styles.footer}>Poketech · uma Pokédex feita para descobrir.</footer>
        </div>
      </div>
    </>
  );
}
