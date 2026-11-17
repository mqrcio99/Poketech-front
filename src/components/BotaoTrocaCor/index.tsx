import { MoonIcon, SunIcon } from 'lucide-react';
import styles from './styles.module.css';
import React, { useEffect, useState } from 'react';

type AvaliableTheme = 'dark' | 'light';

export function BotaoTrocaCor() {
  const [theme, setTheme] = useState<AvaliableTheme>(() => {
    const storageTheme =
      (localStorage.getItem('theme') as AvaliableTheme) || 'dark';
    return storageTheme;
  });

  function handleMouseEvent(
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
  ) {
    event.preventDefault();
    setTheme(prevTheme => {
      const nextTheme = prevTheme === 'dark' ? 'light' : 'dark';
      return nextTheme;
    });
  }

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const nextThemeIcon = {
    dark: <SunIcon />,
    light: <MoonIcon />,
  };

  return (
    <nav className={styles.menu}>
      <a href='' onClick={handleMouseEvent} className={styles.menuLink}>
        {nextThemeIcon[theme]}
      </a>
    </nav>
  );
}
