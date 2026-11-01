import { normalizeDateVerb } from '../../services/normalizeDate';
import styles from './TableNPS.module.css';

export const TableAnswerDetails = ({ answer }) => {
  const verb = () => {
    const detratorJustif = answer?.detrator?.justif?.trim();
    const neutPromoJustif = answer?.neutPromo?.justif?.trim();

    return detratorJustif || neutPromoJustif || '-';
  };

  return (
    <div className={styles.answerModalContent}>
      <div className={styles.row}>
        <div className={styles.col}>
          <p className="textDefault">
            Nome: <b>{answer?.name || '-'}</b>
          </p>
          <p className="textDefault">
            Email: <b>{answer?.email || '-'}</b>
          </p>
          <p className="textDefault" style={{ marginTop: '.5rem' }}>
            Verbalização:
            <br />
            <span style={{ fontStyle: 'italic', fontWeight: '400' }}>
              "{verb()}"
            </span>
          </p>
        </div>
        <div className={styles.col}>
          <p className="textDefault">
            Nota NPS: <b>{answer?.nps ?? '-'}</b>
          </p>
          <p className="textDefault">
            Pedido: <b>{answer?.orderid || '-'}</b>
          </p>
          <p className="textDefault">
            Data: <b>{answer?.date ? normalizeDateVerb(answer.date) : '-'}</b>
          </p>
          <p className="textDefault">
            Nº loja: <b>{answer?.store ?? '-'}</b>
          </p>
          <p className="textDefault">
            Entrega: <b>{answer?.delivery || '-'}</b>
          </p>
        </div>
      </div>
    </div>
  );
};
