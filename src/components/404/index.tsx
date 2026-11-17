import styles from './styles.module.css';

export default function NotFound() {
  return (
    <main className={styles.notfound}>
      <div className={styles.notfoundcontent}>
        <div className={styles.notfoundicon}>
          <img src="Luxio404.png" alt="Pokemon Luxio" />
        </div>

        <span className={styles.notfoundlabel}>ERRO 404</span>

        <h1>Ops! Página não encontrada.</h1>

        <p>
          Parece que você se perdeu pelo caminho. A página que você está
          procurando não existe ou foi movida para outro endereço.
        </p>

        <div className={styles.notfoundcode}>
          <span>404</span>
        </div>

        <span className={styles.notfoundfooter}>
          NÃO SE PREOCUPE, ACONTECE COM OS MELHORES.
        </span>
      </div>
    </main>
  );
}
