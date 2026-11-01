import { useState, useEffect } from 'react';
import { Chart } from 'primereact/chart';
import styles from './Charts.module.css';

// legenda nos gráficos
import { Title } from 'chart.js';
import { Chart as ChartJS } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { calcNpsYear } from '../../services/chartsNps/calcNpsYear.js';
import { useGlobal } from '../../hooks/useGlobal';
import { useNpsY2YChart } from '../../hooks/useNpsY2YChart.jsx';
import { months } from '../../services/months.js';
ChartJS.register(ChartDataLabels, Title);

export function ChartYearNps({ typeChart, year }) {
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [resultado, setResultado] = useState({});

  const { typeBusiness } = useGlobal();

  useEffect(() => {
    let ativo = true;

    const buscarDados = async () => {
      setLoading(true);
      setErro(null);

      try {
        const resposta = await calcNpsYear(year, typeBusiness);

        if (ativo) {
          setResultado({
            ...resposta,
            meta: Array(12).fill(60),
            meses: months(new Date().getFullYear()),
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
  }, [year, typeBusiness]);

  const { chartData, chartOptions } = useNpsY2YChart({
    base: resultado,
    typeChart,
    year: year,
  });

  if (loading) return <p>Carregando dados...</p>;
  if (erro) return <p>Erro ao carregar os dados.</p>;

  return (
    <>
      <div className={`${'chartPrint'} ${styles.chartCanva}`}>
        <Chart type="bar" data={chartData} options={chartOptions} />
      </div>
    </>
  );
}

export default ChartYearNps;
