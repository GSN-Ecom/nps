import { useMemo } from 'react';
import { Chart } from 'primereact/chart';
import styles from './Charts.module.css';

// legenda nos gráficos
import { Chart as ChartJS } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Title } from 'chart.js';
ChartJS.register(ChartDataLabels, Title);

export function Operation({ primaryData, typeChart, year }) {
  const chartData = useMemo(() => {
    // Y2Y montagem base corte x substituicao ano atual
    let corteY2Y = '';
    let substY2Y = '';
    let stores;

    if (typeChart === 'Y2Y') {
      corteY2Y = primaryData.corte.map((e, i) => {
        const pedidos = primaryData.pedidos[i];
        return pedidos ? Math.round((e / pedidos) * 100) : null;
      });
      substY2Y = primaryData.substituicao.map((e, i) => {
        const pedidos = primaryData.pedidos[i];
        return pedidos ? Math.round((e / pedidos) * 100) : null;
      });
    } else if (typeChart === 'stores') {
      // construção do array com os dados de loja
      stores = primaryData
        .map((e) => {
          return {
            corte: e.pedidos ? Math.round((e.corte / e.pedidos) * 100) : null,
            substituicao: e.pedidos
              ? Math.round((e.substituicao / e.pedidos) * 100)
              : null,
            loja: e.store,
            pedidos: e.pedidos,
          };
        })
        .sort((a, b) => a.corte - b.corte);
    }

    // importando estilos para o gráfico
    const docStyles = getComputedStyle(document.documentElement);

    // paleta de cores
    const cort = docStyles.getPropertyValue('--aux-red');
    const sub = docStyles.getPropertyValue('--gray-09');
    const line = docStyles.getPropertyValue('--aux-yellow');

    return {
      labels:
        typeChart === 'stores'
          ? stores.map((e) => e.loja.replace(/\D/g, '').slice(0, 3))
          : primaryData.label,

      datasets: [
        {
          type: 'line',
          label:
            typeChart === 'stores'
              ? 'Substituição'
              : 'Substituição (' + year + ')',
          borderColor: sub,
          borderWidth: 1.5,
          fill: false,
          tension: 0.4,
          data:
            typeChart === 'stores'
              ? stores.map((e) => e.substituicao)
              : substY2Y,
          pointStyle: 'line',
          pointRadius: 1,
          pointHoverRadius: 3,
          pointBackgroundColor: sub,

          datalabels: {
            display: true,
            formatter: (value) => {
              return value !== null ? `${value}%` : '';
            },
            anchor: 'end',
            align: 'bottom',
            color: sub,

            font: {
              size: 12,
              weight: 'bold',
            },
          },
        },
        {
          type: 'line',
          label: typeChart === 'stores' ? 'Meta de subst.' : 'Meta de subst.',
          borderColor: '#fad70e',
          borderWidth: 2,
          fill: false,
          tension: 0.4,
          data:
            typeChart === 'stores'
              ? stores.map((e) => Math.round(e.corte * 0.8))
              : corteY2Y.map((e) => Math.round(e * 0.8)),
          borderDash: [2, 2],
          pointStyle: 'line',
          pointRadius: 0,
          pointHoverRadius: 2,
          pointBackgroundColor: line,

          datalabels: {
            display: false,
          },
        },
        {
          type: 'bar',
          label: typeChart === 'stores' ? 'Corte' : 'Corte (' + year + ')',
          backgroundColor: cort,
          data: typeChart === 'stores' ? stores.map((e) => e.corte) : corteY2Y,
          borderColor: cort,
          borderWidth: 0,

          datalabels: {
            display: true,
            formatter: (value) => {
              return value !== null ? `${value}%` : '';
            },
            anchor: 'end',
            align: 'top',
            color: cort,

            font: {
              size: 13,
              weight: 'bold',
            },
          },
        },
      ],
    };
  }, [primaryData, typeChart, year]);

  // ref vertical dados do gráfico
  const verticalLinePlugin = {
    id: 'verticalLine',

    afterDraw: (chart) => {
      const activeElements = chart.getActiveElements();

      if (!activeElements.length) {
        return;
      }

      const { ctx, chartArea } = chart;
      const x = activeElements[0].element.x;

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(x, chartArea.top);
      ctx.lineTo(x, chartArea.bottom);
      ctx.lineWidth = 1;
      ctx.strokeStyle = '#999';
      ctx.setLineDash([3, 3]);
      ctx.stroke();
      ctx.restore();
    },
  };

  const chartOptions = useMemo(() => {
    // importando estilos para o gráfico
    const docStyles = getComputedStyle(document.documentElement);

    // textos
    const textColSec = docStyles.getPropertyValue('--text');
    const textColPri = docStyles.getPropertyValue('--text-h');

    // border e line
    const border = docStyles.getPropertyValue('--border');

    return {
      maintainAspectRatio: false,
      aspectRatio: 0.6,

      interaction: {
        mode: 'index',
        intersect: false,
      },

      plugins: {
        title: {
          display: true,
          text:
            typeChart === 'stores'
              ? `Corte x Subst. - ${new Date(year, primaryData[0].month - 1, 1).toLocaleString('pt-BR', { month: 'long' })} ${year}`
              : `Corte x Substituição ${year}`,
          color: textColPri,
          font: {
            size: 16,
            weight: 'bold',
          },
          padding: {
            top: 10,
            bottom: 20,
          },
          align: 'start',
        },

        legend: {
          position: 'bottom',
          labels: {
            usePointStyle: true,
            color: textColPri,
          },
        },

        tooltip: {
          enabled: false,
        },
      },

      scales: {
        x: {
          ticks: {
            color: textColSec,
          },

          grid: {
            color: border,
          },
        },

        y: {
          min: 0,
          max: 100,
          ticks: {
            color: textColSec,
            callback: (value) => `${value}%`,
          },

          grid: {
            color: border,
          },
        },
      },
    };
  }, [typeChart, year, primaryData]);

  return (
    <>
      <div className={`${'card'} ${styles.chartCanva}`}>
        <Chart
          type="line"
          data={chartData}
          options={chartOptions}
          plugins={[verticalLinePlugin]}
        />
      </div>
    </>
  );
}

export default { Operation };
