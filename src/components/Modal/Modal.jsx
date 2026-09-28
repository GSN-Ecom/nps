import styles from "./Modal.module.css";
import { logo } from "../../assets/imgs/logo/logo";
import IconClosed from "../../assets/icons/IconClosed";
import { useGlobal } from "../../hooks/useGlobal";

const Modal = ({ isOpen, onClose, content }) => {
  const { typeBusiness } = useGlobal();
  if (!isOpen) return null;

  return (
    <>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <img
            className={styles.logo}
            src={
              typeBusiness !== "LojaF"
                ? logo.apoioEntrega.img
                : logo.apoioMineiro.img
            }
            alt={
              typeBusiness !== "LojaF"
                ? logo.apoioEntrega.alt
                : logo.apoioMineiro.alt
            }
            title={
              typeBusiness !== "LojaF"
                ? logo.apoioEntrega.title
                : logo.apoioMineiro.title
            }

            height="32px"
          />
          <a className={styles.closeModal} onClick={onClose}>
            <IconClosed
              className="icon"
              width="28px"
              height="28px"
              color="var(--aux-red)"
            />
          </a>
        </div>
        <div className={styles.contentModal}>{content}</div>
      </div>
      <div className={styles.modalOverlay} onClick={onClose}></div>
    </>
  );
};

export default Modal;
