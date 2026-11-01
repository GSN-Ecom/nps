/* eslint-disable no-unused-vars */
// ecom
import macroEcomDetr from '../../data/ecomcontarDetratoresMacro.json';
import microEcomDetr from '../../data/ecomContarDetratoresMicro.json';

// loja fisica
import macroLojaFDetr from '../../data/lojaFcontarDetratoresMacro.json';
import microLojaFDetr from '../../data/lojaFContarDetratoresMicro.json';
import { useGlobal } from '../../hooks/useGlobal';
import { months } from '../../services/months';
import { TableDetractorsYearRows } from './TableDetractorsYearRows';
import styles from './TableDetratores.module.css';

export const TableDetractorsYear = () => {
  const { typeBusiness } = useGlobal();
  const meses = months(new Date().getFullYear());

  let baseMacro =
    typeBusiness === 'Ecom'
      ? macroEcomDetr.rows[0].dados
      : macroLojaFDetr.rows[0].dados;

  let baseMicro =
    typeBusiness === 'Ecom'
      ? microEcomDetr.rows[0].dados
      : microLojaFDetr.rows[0].dados;

  baseMacro = baseMacro.filter((item) => item.ano === new Date().getFullYear());
  baseMicro = baseMicro.filter((item) => item.ano === new Date().getFullYear());

  function coutMaxMin(base) {
    return base.flatMap((ano) =>
      Object.entries(ano)
        .filter(([chave, valor]) => chave !== 'ano' && Array.isArray(valor))
        .flatMap(([chave, valores]) => valores),
    );
  }

  const valores = {
    maxMacro: Math.max(...coutMaxMin(baseMacro)),
    maxMicro: Math.max(...coutMaxMin(baseMicro)),
    minMicro: Math.min(...coutMaxMin(baseMicro)),
    minMacro: Math.min(...coutMaxMin(baseMacro)),
  };

  return (
    <>
      {baseMacro.map((e) => (
        <div key={`${e.ano}-${e.detmacro}`} className={styles.blockTableDetr}>
          <div className={styles.tableDetrYear}>
            <p className={`textDefault ${styles.titleTable}`}>
              <b>Detratores (macro)</b>
            </p>
          </div>
          <div className={styles.header}>
            <div className={styles.slot}>
              <p className="textDefault">Problema:</p>
            </div>
            {meses.map((mes) => (
              <div key={mes} className={styles.slot}>
                <p className="textDefault">{mes}</p>
              </div>
            ))}
          </div>
          <TableDetractorsYearRows
            base={[e]}
            minValue={valores.minMacro}
            maxValue={valores.maxMacro}
          />
        </div>
      ))}
      {baseMicro.map((e) => (
        <div key={`${e.ano}-${e.detmacro}`} className={styles.blockTableDetr}>
          <div className={styles.tableDetrYear}>
            <p className={`textDefault ${styles.titleTable}`}>
              <b>{e.detmacro}</b>
            </p>
          </div>
          <div className={styles.header}>
            <div className={styles.slot}>
              <p className="textDefault">Problema:</p>
            </div>
            {meses.map((mes) => (
              <div key={mes} className={styles.slot}>
                <p className="textDefault">{mes}</p>
              </div>
            ))}
          </div>
          <TableDetractorsYearRows
            base={[e]}
            minValue={valores.minMicro}
            maxValue={valores.maxMicro}
          />
        </div>
      ))}
    </>
  );
};
