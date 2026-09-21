import { Link } from "react-router-dom";
import IconHome from "../../assets/icons/IconHome";
import styles from "./Breadcrumb.module.css";
import IconVerb from "../../assets/icons/IconVerb";
import IconArrow from "../../assets/icons/IconArrow";

const Breadcrumb = ({ pathname }) => {
  console.log(pathname);

  if (pathname === "/") return;

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
        <IconVerb
          className="icon"
          width="16px"
          height="16px"
          color="var(--gray-06)"
        />
        <p className="textSmall">{pathname.replace("/", "")}</p>
      </Link>
    </div>
  );
};

export default Breadcrumb;
