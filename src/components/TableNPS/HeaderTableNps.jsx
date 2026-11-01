const tags = ['Det', 'Neu', 'Pro'];
const headerTable = ['Loja', 'Nome', 'Atual', 'Dif.', 'Antes', 'Resp.'];

// estilizacao
import styles from './TableNPS.module.css';

export const HeaderTableNps = () => {
  return (
    <div className={`${styles.HeaderTable} ${'printHeaderTable'}`}>
      {headerTable &&
        headerTable.map((e) => (
          <p
            key={e}
            className={`${'textDefault'} ${styles.cell} ${'printCell'}`}>
            {e}
          </p>
        ))}
      {Array.from({ length: 11 }, (_, i) => {
        return (
          <p
            key={i}
            className={`${'textDefault'} ${styles.deskView} ${styles.cell} ${'printCell'} ${i <= 6 ? `${styles.regression}` : ''}
                    ${i <= 8 && i >= 7 ? `${styles.neutros}` : ''}
                    ${i >= 9 ? `${styles.growth}` : ''}`}>
            {i}
          </p>
        );
      })}
      {tags.map((e, i) => {
        return (
          <p
            key={i}
            className={`${'textDefault'} ${styles.mobileView} ${styles.cell} ${'printCell'} ${i === 0 ? `${styles.regression}` : ''}
                    ${i === 1 ? `${styles.neutros}` : ''}
                    ${i === 2 ? `${styles.growth}` : ''}`}>
            {e}
          </p>
        );
      })}
      <p className={`${'textDefault'} ${styles.cell} ${'printCell'}`}>
        Justif. Detratores
      </p>
    </div>
  );
};
