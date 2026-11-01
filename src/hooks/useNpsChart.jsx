/* eslint-disable react-hooks/exhaustive-deps */
import { useMemo } from 'react';

export function useNpsChart({ base, typeChart }) {
  const chartData = useMemo(() => {
    const docStyles = getComputedStyle(document.documentElement);

    const detr = docStyles.getPropertyValue('--aux-red').trim();
    const neut = docStyles.getPropertyValue('--aux-yellow').trim();
    const prom = docStyles.getPropertyValue('--aux-green').trim();
    const border = docStyles.getPropertyValue('--border').trim();
    const line = docStyles.getPropertyValue('--aux-blue').trim();

    const scaleColors = [
      detr,
      detr,
      detr,
      detr,
      detr,
      detr,
      detr,
      neut,
      neut,
      prom,
      prom,
    ];

    return {
      labels: base.label,

      datasets: [
        {
          type: 'line',
          label: 'Período Anterior',
          borderColor: line,
          borderWidth: 1.5,
          fill: false,
          tension: 0.4,
          data: base.before,
          pointStyle: 'line',
          borderDash: [3, 3],
          pointRadius: 1,
          pointHoverRadius: 6,
          pointBackgroundColor: line,
          datalabels: {
            display: false,
          },
        },
        {
          type: 'bar',
          label: 'Período Atual',
          backgroundColor: scaleColors,
          data: base.current,
          borderColor: border,
          borderWidth: 2,
          datalabels: {
            display: true,
            anchor: 'end',
            align: 'top',
            color: scaleColors,
            borderRadius: 999,
            padding: 5,
            backgroundColor: '#f8f8f8',
            font: {
              size: 15,
              weight: 'bold',
            },
          },
        },
      ],
    };
  }, [base, typeChart]);

  const chartOptions = useMemo(() => {
    const docStyles = getComputedStyle(document.documentElement);

    const textColSec = docStyles.getPropertyValue('--text').trim();
    const textColPri = docStyles.getPropertyValue('--text-h').trim();
    const border = docStyles.getPropertyValue('--border').trim();

    return {
      maintainAspectRatio: false,
      aspectRatio: 0.6,

      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            usePointStyle: true,
            color: textColPri,
          },
        },

        title: {
          display: true,
          text: typeChart,
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
          ticks: {
            color: textColSec,
          },
          grid: {
            color: border,
          },
        },
      },
    };
  }, [typeChart]);

  return { chartData, chartOptions };
}
