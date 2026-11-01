import { heatmapDetractor } from '../../services/detractors/heatmapDetractor';
import styles from './TableDetratores.module.css';

export const TableDetractorsYearRows = ({ base, minValue, maxValue }) => {
  return base.map((e) => {
    return Object.entries(e)
      .filter(([chave, valor]) => chave !== 'ano' && Array.isArray(valor))
      .map(([chave, count], index) => (
        <div
          key={`${e.ano}-${chave}`}
          className={`${styles.contentTable} ${
            index % 2 === 0 ? '' : styles.bgRow
          }`}>
          <div className={styles.slot}>
            <p className="textDefault">{chave}</p>
          </div>
          {count.map((value, i) => (
            <div
              key={i}
              className={styles.slot}
              style={{
                background: `${heatmapDetractor(value, minValue, maxValue)}`,
              }}>
              <p className="textDefault">{value}</p>
            </div>
          ))}
        </div>
      ));
  });
};
