import { Title } from "../Title/Title";
import { useLocation } from "react-router-dom";
import styles from "./Filters.module.css";
import { Calendar } from "primereact/calendar";
import { useGlobal } from "../../hooks/useGlobal.jsx";
import Breadcrumb from "../Breadcrumb/Breadcrumb.jsx";

const Filters = () => {
  const { date, setDate } = useGlobal();

  return (
    <>
      <div className="blockTitle">
        <Breadcrumb pathname={useLocation().pathname} />
        <div className={`${"contentRow"} ${styles.titleFilters}`}>
          <Title
            text="NPS AP Ecom"
            style={{ fontSize: "var(--title-default)", width: "100%" }}
          />
          <div
            className={`${styles.filters} ${styles.dateFilter}`}
            style={{ width: "auto" }}>
            <div className={styles.rowFilters}>
              <div className={styles.slot}>
                <label htmlFor="dataInicio" className="textDefault">
                  Data inicial:
                </label>
                <Calendar
                  id="dataInicio"
                  className={styles.calendar}
                  value={date.inicio}
                  onChange={(e) => {
                    setDate({ ...date, inicio: e.value });
                  }}
                  showIcon
                  dateFormat="dd/mm/yy"
                />
              </div>
              <div className={styles.slot}>
                <label htmlFor="dataFim" className="textDefault">
                  Data final:
                </label>
                <Calendar
                  id="dataFim"
                  className={styles.calendar}
                  value={date.fim}
                  onChange={(e) => {
                    setDate({ ...date, fim: e.value });
                  }}
                  showIcon
                  dateFormat="dd/mm/yy"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Filters;
