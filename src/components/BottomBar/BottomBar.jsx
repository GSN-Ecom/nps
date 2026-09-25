import styles from "./BottomBar.module.css";
import { NavLink } from "react-router-dom";
import IconHome from "../../assets/icons/IconHome";
import IconChange from "../../assets/icons/IconChange";
import IconVerb from "../../assets/icons/IconVerb";
import IconMenu from "../../assets/icons/IconMenu";
import useModal from "../../hooks/useModal";
import IconDetrator from "../../assets/icons/IconDetrator";
import Modal from "../Modal/Modal";

// PENDENCIAS
// criar menu mobile
// criar modal e useState para controlar abertura
// ${styles.active}

export default function BottomBar() {
  const { isOpen, openModal, closeModal } = useModal();

  return (
    <>
      <Modal isOpen={isOpen} onClose={closeModal} content="..." />
      <nav className={styles.bottomBar}>
        <NavLink to="/" className={`${styles.slot}`}>
          <IconHome className="icon" width="28px" height="28px" />
          <p className="textLabel">Home</p>
        </NavLink>
        <NavLink to="/respostas" className={`${styles.slot}`}>
          <IconVerb className="icon" width="24px" height="24px" />
          <p className="textLabel">Respostas</p>
        </NavLink>
        <NavLink to="/detratores" className={`${styles.slot}`}>
          <IconDetrator
            className="icon"
            width="24px"
            height="24px"
            color="var(--gray-08)"
          />
          <p className="textLabel">Detratores</p>
        </NavLink>
        <NavLink to="/corte-substituicao" className={`${styles.slot}`}>
          <IconChange
            className="icon"
            width="24px"
            height="24px"
            color="var(--gray-08)"
          />
          <p className="textLabel">Cort/Subst.</p>
        </NavLink>
        <NavLink to="" className={`${styles.slot}`} onClick={() => openModal()}>
          <IconMenu className="icon" width="28px" height="28px" />
          <p className="textLabel">Menu</p>
        </NavLink>
      </nav>
    </>
  );
}
