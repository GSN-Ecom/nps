import { Link } from "react-router-dom";
import IconHome from "../../assets/icons/IconHome";
import styles from "./Breadcrumb.module.css";
import IconVerb from "../../assets/icons/IconVerb";
import IconArrow from "../../assets/icons/IconArrow";
import IconDetrator from "../../assets/icons/IconDetrator";
import IconChange from "../../assets/icons/IconChange";

const Breadcrumb = ({ pathname }) => {
  if (pathname === "/") return;

  let icon;

  if (pathname === "/detratores")
    icon = (
      <IconDetrator
        className="icon"
        width="16px"
        height="16px"
        color="var(--gray-06)"
      />
    );
  if (pathname === "/respostas")
    icon = (
      <IconVerb
        className="icon"
        width="16px"
        height="16px"
        color="var(--gray-06)"
      />
    );

  if (pathname === "/corte-substituicao")
    icon = (
      <IconChange
        className="icon"
        width="16px"
        height="16px"
        color="var(--gray-06)"
      />
    );

  return (
    <div className={styles.breadcrumbs}>
      <Link to="/" className={styles.link}>
        <IconHome
          className="icon"
          width="16px"
          height="16px"
          color="var(--gray-06)"
        />
        <p className="textSmall">home</p>
      </Link>
      <IconArrow
        className="icon"
        width="16px"
        height="16px"
        color="var(--gray-06)"
      />
      <Link to={pathname} className={styles.link}>
        {icon}
        <p className="textSmall">{pathname.replace("/", "")}</p>
      </Link>
    </div>
  );
};

export default Breadcrumb;
