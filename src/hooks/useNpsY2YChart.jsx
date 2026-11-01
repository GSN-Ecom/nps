/* eslint-disable react-hooks/exhaustive-deps */
import { useMemo } from 'react';

export function useNpsY2YChart({ base, typeChart, year }) {
  const chartData = useMemo(() => {
    const docStyles = getComputedStyle(document.documentElement);

    const detr = docStyles.getPropertyValue('--aux-red').trim();
    const border = docStyles.getPropertyValue('--border').trim();
    const line = docStyles.getPropertyValue('--aux-blue').trim();

    return {
      labels: base.meses,

      datasets: [
        {
          type: 'line',
          label: year - 1,
          borderColor: detr,
          borderWidth: 1.5,
          fill: false,
          tension: 0.4,
          data: base.before,
          pointStyle: 'line',
          borderDash: [3, 3],
          pointRadius: 1,
          pointHoverRadius: 6,
          pointBackgroundColor: detr,
          datalabels: {
            display: false,
          },
        },
        {
          type: 'bar',
          label: year,
          backgroundColor: '#0e2c71',
          data: base.current,
          borderColor: border,
          borderWidth: 2,
          datalabels: {
            display: true,
            anchor: 'end',
            align: 'top',
            color: '#0e2c71',
            borderRadius: 999,
            padding: 5,
            backgroundColor: '#f8f8f8',
            font: {
              size: 15,
              weight: 'bold',
            },
          },
        },
        {
          type: 'line',
          label: 'Meta',
          borderColor: line,
          borderWidth: 2,
          fill: false,
          tension: 0,
          data: base.meta,
          pointStyle: 'line',
          pointRadius: 0,
          pointHoverRadius: 6,
          pointBackgroundColor: line,

          datalabels: {
            display: false,
          },
        },
      ],
    };
  }, [base, typeChart, year]);

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
          text: `NPS ${year - 1} x ${year}`,
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
