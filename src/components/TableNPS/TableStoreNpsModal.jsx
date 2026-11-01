import { detractorsByStore } from '../../services/tableNpsStore/detractorsByStore';
import styles from './TableNPS.module.css';

export function TableStoreNpsModal({ store }) {
  const customerReviews = detractorsByStore(store.detractorsResult).split('>');

  const microDet = customerReviews[1].split(',');

  return (
    <div className={styles.modalContent}>
      <div className={styles.rowModal}>
        <p className="textSmall">Loja:</p>
        <p className="textDefault">
          <b>{`${store.storeName} (${store.nroempresa})`}</b>
        </p>
      </div>
      <div className={styles.rowModal}>
        <p className="textSmall">NPS:</p>
        <p className="textDefault">
          <b>
            {store.npsCalc}{' '}
            <span className="textDefault" style={{ color: 'var(--gray-05)' }}>
              / 100
            </span>
          </b>
        </p>
      </div>
      <div className={styles.rowModal}>
        <p className="textDefault">
          <b>Detratores:</b>
        </p>
        <p className="textDefault">{customerReviews[0].trim()}</p>
        <p className="textLarger">
          <span className={`${'textSmall'} ${styles.labelDetractors}`}>
            ↓ Justificativa(s) ↓
          </span>
        </p>
        <div className={styles.rowModal}>
          {microDet.map((e) => (
            <p key={e} className="textDefault">
              {e.trim()}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
