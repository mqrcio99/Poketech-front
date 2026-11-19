import { Header } from '../Header';
export function SiteLayout({ children }: { children: React.ReactNode }) { return <><Header />{children}<footer style={{maxWidth:'1240px',margin:'auto',padding:'24px 28px 34px',color:'var(--muted)',fontSize:'11px',borderTop:'1px solid var(--line)'}}>Poketech · uma Pokédex feita para descobrir.</footer></>; }
