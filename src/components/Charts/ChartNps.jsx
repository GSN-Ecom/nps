import { useState, useEffect } from 'react';
import { Chart } from 'primereact/chart';
import styles from './Charts.module.css';

// legenda nos gráficos
import { Title } from 'chart.js';
import { Chart as ChartJS } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { calcNpsGeneral } from '../../services/chartsNps/calcNpsGeneral';
import { useNpsChart } from '../../hooks/useNpsChart';
import { sumByRespType } from '../../services/tableNpsStore/sumByRespType';
import { calcNps } from '../../services/calcNps';
import { growthNps } from '../TableNPS/growthNps';
import { useGlobal } from '../../hooks/useGlobal';
ChartJS.register(ChartDataLabels, Title);

export function ChartNps({ date, typeChart }) {
  const { typeBusiness } = useGlobal();
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [resultado, setResultado] = useState({
    current: Array(11).fill(0),
    before: Array(11).fill(0),
  });

  useEffect(() => {
    let ativo = true;

    const buscarDados = async () => {
      setLoading(true);
      setErro(null);

      try {
        const resposta = await calcNpsGeneral(date, typeBusiness);

        if (ativo) {
          setResultado({
            ...resposta,
            label: Array.from({ length: 11 }, (_, i) => i),
          });
        }
      } catch (error) {
        if (ativo) {
          setErro(error);
          console.error('Erro ao buscar NPS:', error);
        }
      } finally {
        if (ativo) {
          setLoading(false);
        }
      }
    };

    buscarDados();

    return () => {
      ativo = false;
    };
  }, [date.inicio, date.fim, date, typeBusiness]);

  const { chartData, chartOptions } = useNpsChart({
    base: resultado,
    typeChart,
  });

  if (loading) return <p>Carregando dados...</p>;
  if (erro) return <p>Erro ao carregar os dados.</p>;

  return (
    <>
      <div className={`${styles.chartCanva} ${'chartPrint'}`}>
        <Chart type="bar" data={chartData} options={chartOptions} />
      </div>
      <div className={styles.row}>
        <div className={styles.displayNotes}>
          <div className={styles.noteBlock}>
            <p className="textSmall">Avaliações</p>
            <p className="textLarger">
              <span>
                {resultado.current.reduce((acc, value) => acc + value, 0)}
              </span>
            </p>
          </div>
          <div className={styles.noteBlock}>
            <p className={`${'textSmall'} ${styles.detrator}`}>Detratores</p>
            <p className={`${'textLarger'} ${styles.detrator}`}>
              <span>{sumByRespType(0, 7, resultado.current)}</span>
            </p>
          </div>
          <div className={styles.noteBlock}>
            <p className={`${'textSmall'} ${styles.neutro}`}>Neutros</p>
            <p className={`${'textLarger'} ${styles.neutro}`}>
              <span>{sumByRespType(7, 9, resultado.current)}</span>
            </p>
          </div>
          <div className={styles.noteBlock}>
            <p className={`${'textSmall'} ${styles.promotor}`}>Promotores</p>
            <p className={`${'textLarger'} ${styles.promotor}`}>
              <span>{sumByRespType(9, 11, resultado.current)}</span>
            </p>
          </div>
        </div>
        <div className={styles.displayNotes}>
          {/* total de avaliações */}
          <div className={`${styles.noteBlock} ${styles.viewNPS}`}>
            <p className={`${'textSmall'} ${styles.textNPS}`}>
              <b>Nota NPS:</b>
            </p>
            <p className={`${'textLarger'} ${styles.textNPS}`}>
              <span className={styles.value}>{calcNps(resultado.current)}</span>
            </p>
            <div className={styles.growthValue}>
              {growthNps(calcNps(resultado.current), calcNps(resultado.before))}
            </div>
          </div>
        </div>
        <div className={`${styles.displayNotes} ${styles.textSupport}`}>
          <p className="textSmall">
            {' '}
            No período anterior a nota NPS foi {calcNps(resultado.before)}
          </p>
        </div>
      </div>
    </>
  );
}

export default ChartNps;
