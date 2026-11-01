import { useState } from 'react';
import useModal from '../../hooks/useModal';
import { normalizeDateVerb } from '../../services/normalizeDate';
import Modal from '../Modal/Modal';
import styles from './TableNPS.module.css';
import { TableAnswerDetails } from './TableAnswerDetails';

export const TableAnswersRows = ({ dados = [] }) => {
  const { isOpen, openModal, closeModal } = useModal();
  const [selectedVerb, setSelectedVerb] = useState(null);

  const handleOpenModal = (verb) => {
    setSelectedVerb(verb);
    openModal();
  };

  const handleCloseModal = () => {
    closeModal();
    setSelectedVerb(null);
  };

  const modalContent = <TableAnswerDetails answer={selectedVerb} />;

  return (
    <>
      {dados.map((verb, i) => (
        <div
          key={verb.orderid ?? i}
          className={`${styles.rowTable} ${i % 2 !== 0 ? styles.rowBg : ''}`}
          onClick={() => handleOpenModal(verb)}
          role="button"
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              handleOpenModal(verb);
            }
          }}>
          <p className={`textDefault ${styles.cell}`}>
            <b>{verb.store}</b>
          </p>
          <p className={`textDefault ${styles.cell}`}>{verb.orderid}</p>
          <p
            className={`textDefault ${styles.cell} ${
              verb.nps >= 9
                ? styles.ntProm
                : verb.nps <= 6
                  ? styles.ntDetr
                  : styles.ntNeut
            }`}>
            <b>{verb.nps}</b>
          </p>
          <p className={`textDefault ${styles.cell}`}>
            {normalizeDateVerb(verb.date)}
          </p>
          <p className={`textDefault ${styles.cell}`}>{verb.name}</p>
          <p className={`textDefault ${styles.cell}`}>{verb.delivery}</p>
          <p className={`textDefault ${styles.cell}`}>
            {verb.nps >= 7
              ? verb.neutPromo?.macro || verb.detrator?.macro
              : verb.detrator?.macro || verb.neutPromo?.macro}
          </p>
          <p className={`textDefault ${styles.cell}`}>
            {verb.detrator?.micro || '-'}
          </p>
          <p className={`textDefault ${styles.cell}`}>
            {verb.nps >= 7
              ? verb.neutPromo?.justif || verb.detrator?.justif
              : verb.detrator?.justif || verb.neutPromo?.justif}
          </p>
        </div>
      ))}

      <Modal
        isOpen={isOpen}
        onClose={handleCloseModal}
        content={modalContent}
      />
    </>
  );
};
