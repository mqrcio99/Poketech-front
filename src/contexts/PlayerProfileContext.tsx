import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { readPlayerProfile, savePlayerProfile, type PlayerProfile } from '../services/playerProfile';
import { syncPlayerProfile } from '../services/poketechApi';

type PlayerProfileContextValue = {
  profile: PlayerProfile | null;
  setProfile: (profile: PlayerProfile) => void;
  clearProfile: () => void;
};

const PlayerProfileContext = createContext<PlayerProfileContextValue | null>(null);

export function PlayerProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfileState] = useState<PlayerProfile | null>(() => readPlayerProfile());

  useEffect(() => {
    function refresh(event: Event) {
      const detail = (event as CustomEvent<PlayerProfile>).detail;
      setProfileState(detail ?? readPlayerProfile());
    }
    window.addEventListener('poketech:profile-updated', refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener('poketech:profile-updated', refresh);
      window.removeEventListener('storage', refresh);
    };
  }, []);

  const value = useMemo(() => ({
    profile,
    setProfile(nextProfile: PlayerProfile) {
      const saved = savePlayerProfile(nextProfile);
      setProfileState(saved);
      void syncPlayerProfile(saved);
    },
    clearProfile() {
      window.localStorage.removeItem('poketech:player-profile');
      setProfileState(null);
    },
  }), [profile]);

  return <PlayerProfileContext.Provider value={value}>{children}</PlayerProfileContext.Provider>;
}

// O hook vive junto do provider para manter a API de perfil pequena e coesa.
// eslint-disable-next-line react-refresh/only-export-components
export function usePlayerProfile() {
  const context = useContext(PlayerProfileContext);
  if (!context) throw new Error('usePlayerProfile precisa estar dentro de PlayerProfileProvider');
  return context;
}
