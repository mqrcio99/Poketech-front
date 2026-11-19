import styles from './styles.module.css';
export function LoadingState({ label = 'Carregando dados...' }: { label?: string }) { return <div className={styles.loading}><span className={styles.dot} /><p>{label}</p></div>; }
