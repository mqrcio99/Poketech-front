import { MainTemplate } from '../../templates/MainTemplates';
import styles from './styles.module.css';

export function Principal() {
  return (
    <MainTemplate>
      <div className={styles.container}>
        <div className={styles.gameBox}>
          <div className={styles.topBar}>
            <h1 className={styles.titulo}>Quem é esse Pokemon?</h1>
            <span className={`${styles.contador} ${styles.TextoBase}`}>
              Tentativas: 5
            </span>
          </div>

          <div className={styles.form}>
            <input
              type='text'
              placeholder='Escreva aqui...'
              className={styles.input}
            />
          </div>

          <div className={styles.listaTentativas}>
            <div className={styles.card}>
              <img src='LogoPoketech.png' />
              <div className={styles.bolinhasContainer}>
                <span className={`${styles.bolinha} ${styles.acerto}`} />
                <span className={`${styles.bolinha} ${styles.erro}`} />
                <span className={`${styles.bolinha} ${styles.erro}`} />
                <span className={`${styles.bolinha} ${styles.erro}`} />
                <span className={`${styles.bolinha} ${styles.erro}`} />
              </div>
            </div>

            <div className={styles.card}>
              <img src='LogoPoketech.png' />
              <div className={styles.bolinhasContainer}>
                <span className={`${styles.bolinha} ${styles.acerto}`} />
                <span className={`${styles.bolinha} ${styles.erro}`} />
                <span className={`${styles.bolinha} ${styles.erro}`} />
                <span className={`${styles.bolinha} ${styles.erro}`} />
                <span className={`${styles.bolinha} ${styles.erro}`} />
              </div>
            </div>

            <div className={styles.card}>
              <img src='LogoPoketech.png' />
              <div className={styles.bolinhasContainer}>
                <span className={`${styles.bolinha} ${styles.acerto}`} />
                <span className={`${styles.bolinha} ${styles.acerto}`} />
                <span className={`${styles.bolinha} ${styles.erro}`} />
                <span className={`${styles.bolinha} ${styles.erro}`} />
                <span className={`${styles.bolinha} ${styles.erro}`} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainTemplate>
  );
}
