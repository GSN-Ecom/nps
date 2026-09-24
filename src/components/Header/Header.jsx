import styles from "./Header.module.css";
import { logo } from "../../assets/imgs/logo/logo";
import { NavLink } from "react-router-dom";
import ChangeBusiness from "../../assets/icons/IconChangeBusiness";
import { useGlobal } from "../../hooks/useGlobal";

export default function Header() {
  const { report } = useGlobal();

  return (
    <nav className={styles.navBar}>
      <div className="contentRow">
        <NavLink to="/" end>
          <img
            className={styles.logo}
            src={logo.apoioEntrega.img}
            alt={logo.apoioEntrega.alt}
            title={logo.apoioEntrega.title}
          />
        </NavLink>
        <div className={styles.selectStore}></div>
      </div>
      <div className={styles.listLinks}>
        <NavLink to="/respostas" className={styles.link}>
          <p className="textDefault">Respostas</p>
        </NavLink>
        <a href="#operation" className={styles.link}>
          <p className="textDefault">Corte x Substituição</p>
        </a>
        <a href="#duvidas" className={styles.link}>
          <p className="textDefault">Dúvidas</p>
        </a>
        <NavLink
          to=""
          className={`${styles.link} ${styles.changeReport}`}
          onClick={() => console.log("inserir clique aqui")}>
          <ChangeBusiness
            className="icon"
            width="16px"
            height="16px"
            color="#ce2b43"
          />
          <p className="textDefault">
            {report !== "lojaF" ? "Mudar > Loja Física" : "Mudar > Ecom"}
          </p>
        </NavLink>
      </div>
    </nav>
  );
}
