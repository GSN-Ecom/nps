import styles from "./Modal.module.css";
import { logo } from "../../assets/imgs/logo/logo";
import IconClosed from "../../assets/icons/IconClosed";

const Modal = ({ isOpen, onClose, content }) => {
  if (!isOpen) return null;

  return (
    <>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <img
            src={logo.apoioEntrega.img}
            alt={logo.apoioEntrega.alt}
            title={logo.apoioEntrega.title}
            width="144px"
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
