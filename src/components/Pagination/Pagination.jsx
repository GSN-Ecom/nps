import styles from "./Pagination.module.css";
import { Button } from "primereact/button";
import { useGlobal } from "../../hooks/useGlobal";

const Pagination = () => {
  const { page, setPage } = useGlobal();

  const totalPages = Math.ceil(page.total / 10);
  const currentPage = page.inicio / 10 + 1;

  function prevPage() {
    setPage({
      ...page,
      inicio: page.inicio - 10,
      fim: page.fim - 10,
    });
    window.scrollTo(0, 0);
  }

  function nextPage() {
    setPage({
      ...page,
      inicio: page.inicio + 10,
      fim: page.fim + 10,
    });
    window.scrollTo(0, 0);
  }

  return (
    <div className={styles.paginationBlock}>
      <div className={styles.rowBtn}>
        <Button
          className={styles.btn}
          label="Ant."
          severity="secondary"
          icon="pi pi-arrow-left"
          outlined
          disabled={currentPage === 1}
          onClick={prevPage}
        />

        <p className="textSmall">
          Página {currentPage} de {totalPages}
        </p>

        <Button
          className={styles.btn}
          label="Próx."
          icon="pi pi-arrow-right"
          severity="secondary"
          disabled={currentPage >= totalPages}
          outlined
          onClick={nextPage}
        />
      </div>
    </div>
  );
};
export default Pagination;
