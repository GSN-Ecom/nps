import styles from './TableNPS.module.css';

export const TableAnswersHeader = ({ arr }) => {
  return (
    <div className={styles.HeaderTable}>
      {arr.map((e) => (
        <p key={e} className={`textDefault ${styles.cell}`}>
          {e}
        </p>
      ))}
    </div>
  );
};
