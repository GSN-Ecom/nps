import { useGlobal } from "../../hooks/useGlobal";
import styles from "./TableDetratores.module.css";
import { months } from "../../services/months";
import { heatmapDetractor } from "../../services/detractors/heatmapDetractor";
import { microDetractors } from "../../services/detractors/microDetractors";
import { macroDetractors } from "../../services/detractors/macroDetractors";
import { countingMicroDetractors } from "../../services/detractors/countingMicro";
import { countingMacroDetractors } from "../../services/detractors/countingMacro";

export const TableDetratores = () => {
  const { data } = useGlobal();

  const dataDetr = data;
  const year = new Date().getFullYear();
  const meses = months(year);

  // detratores (macro) ano atual
  const tags = macroDetractors(dataDetr, year);
  const resultMacroDetr = countingMacroDetractors(tags, dataDetr, year);

  // detratores (micro) ano atual
  const tagsMicro = microDetractors(dataDetr, year);
  const resultMicroDetr = countingMicroDetractors(tagsMicro, dataDetr, year);

  // identificando os valores Max/Min para o heatmap a referencia é o valor max e min das repeticoes macro
  const menor = Math.min(...resultMacroDetr.flatMap((item) => item.count));
  const maior = Math.max(...resultMacroDetr.flatMap((item) => item.count));

  return (
    <>
      <div className={styles.blockTableDetr}>
        <div className={styles.tableDetrYear}>
          <p className={`${"textDefault"} ${styles.titleTable}`}>
            <b>Detratores</b>
          </p>
        </div>
        <div className={styles.header}>
          <div className={styles.slot}>
            <p className="textDefault">Problema:</p>
          </div>
          {meses &&
            meses.map((e) => {
              return (
                <div key={e} className={styles.slot}>
                  <p className="textDefault">{e}</p>
                </div>
              );
            })}
        </div>
        {resultMacroDetr.map((e, i) => {
          return (
            <div
              key={e.detrator}
              className={`${styles.contentTable} ${i % 2 === 0 ? "" : styles.bgRow}`}>
              <div className={styles.slot}>
                <p className="textDefault">{e.detrator}</p>
              </div>
              {e.count.map((value, i) => (
                <div
                  key={i}
                  className={styles.slot}
                  style={{
                    background: `${heatmapDetractor(value, menor, maior)}`,
                  }}>
                  <p className="textDefault">{value}</p>
                </div>
              ))}
            </div>
          );
        })}
      </div>
      {/* inicio tabelas micro */}
      {resultMicroDetr.map((row, i) => {
        return (
          <div key={i} className={styles.blockTableDetr}>
            <div className={styles.tableDetrYear}>
              <p className={`${"textDefault"} ${styles.titleTable}`}>
                <b>{row.macro.toUpperCase()} → Detratores</b>
              </p>
            </div>
            <div className={styles.header}>
              <div className={styles.slot}>
                <p className="textDefault">Descrição:</p>
              </div>
              {meses &&
                meses.map((e) => (
                  <div key={e} className={styles.slot}>
                    <p className="textDefault">{e}</p>
                  </div>
                ))}
            </div>
            {Object.entries(row)
              .filter(([key]) => key !== "macro")
              .map(([micro, values]) => {
                return (
                  <div
                    key={micro}
                    className={`${styles.contentTable} ${
                      i % 2 === 0 ? "" : styles.bgRow
                    }`}>
                    <div className={styles.slot}>
                      <p className="textDefault">{micro}</p>
                    </div>

                    {values.map((value, index) => (
                      <div
                        key={index}
                        className={styles.slot}
                        style={{
                          background: heatmapDetractor(value, menor, maior),
                        }}>
                        <p className="textDefault">{value}</p>
                      </div>
                    ))}
                  </div>
                );
              })}
          </div>
        );
      })}
    </>
  );
};

export default TableDetratores;
