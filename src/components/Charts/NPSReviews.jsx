import { useMemo } from "react";
import { Chart } from "primereact/chart";
import styles from "./Charts.module.css";

// legenda nos gráficos
import { Chart as ChartJS } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Title } from "chart.js";
ChartJS.register(ChartDataLabels, Title);

function formatDate(date) {
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });
}

export function NPSReviews({
  primaryData,
  secondaryData,
  typeChart,
  summary,
  year,
  date,
}) {
  const chartData = useMemo(() => {
    // Y2Y montagem base
    let compY2Y = "";
    let baseY2Y = "";

    if (typeChart === "Y2Y") {
      compY2Y = secondaryData.map((e) => e.nps);
      baseY2Y = primaryData.map((e) => e.nps);
    }

    // importando estilos para o gráfico
    const docStyles = getComputedStyle(document.documentElement);

    // escala NPS
    const detr = docStyles.getPropertyValue("--aux-red");
    const neut = docStyles.getPropertyValue("--aux-yellow");
    const prom = docStyles.getPropertyValue("--aux-green");

    // border e line
    const border = docStyles.getPropertyValue("--border");
    const line = docStyles.getPropertyValue("--aux-blue");
    const apoioEnt = docStyles.getPropertyValue("--ap-primary");

    return {
      labels:
        typeChart === "scale-nps"
          ? primaryData.map((e, index) => index)
          : primaryData.map((e) => e.id),

      datasets: [
        {
          type: "line",
          label: typeChart === "scale-nps" ? "Período Anterior" : year - 1,
          borderColor: typeChart === "scale-nps" ? line : detr,
          borderWidth: 1.5,
          fill: false,
          tension: typeChart === "scale-nps" ? 0.4 : 0.1,
          data: typeChart === "scale-nps" ? secondaryData : compY2Y,
          pointStyle: "line",
          borderDash: [3, 3],
          pointRadius: 1,
          pointHoverRadius: 6,
          pointBackgroundColor: typeChart === "scale-nps" ? line : detr,

          datalabels: {
            display: false,
          },
        },
        {
          type: "bar",
          label: typeChart === "scale-nps" ? "Período Atual" : year,
          backgroundColor:
            typeChart === "scale-nps"
              ? [
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
                ]
              : apoioEnt,
          data: typeChart === "scale-nps" ? primaryData : baseY2Y,
          borderColor: border,
          borderWidth: 2,

          datalabels: {
            display: true,
            anchor: "end",
            align: "top",
            color:
              typeChart === "scale-nps"
                ? [
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
                  ]
                : apoioEnt,
            borderRadius: 999,
            padding: 5,

            backgroundColor: "#f8f8f8",
            font: {
              size: 15,
              weight: "bold",
            },
          },
        },

        ...(typeChart === "Y2Y"
          ? [
              {
                type: "line",
                label: "Meta",
                borderColor: line,
                borderWidth: 2,
                fill: false,
                tension: 0,
                data: primaryData.map(() => 60),
                pointStyle: "line",
                pointRadius: 0,
                pointHoverRadius: 6,
                pointBackgroundColor: line,

                datalabels: {
                  display: false,
                },
              },
            ]
          : []),
      ],
    };
  }, [primaryData, secondaryData, typeChart, year]);

  const chartOptions = useMemo(() => {
    // importando estilos para o gráfico
    const docStyles = getComputedStyle(document.documentElement);

    // textos
    const textColSec = docStyles.getPropertyValue("--text");
    const textColPri = docStyles.getPropertyValue("--text-h");

    // border e line
    const border = docStyles.getPropertyValue("--border");

    return {
      maintainAspectRatio: false,
      aspectRatio: 0.6,

      plugins: {
        legend: {
          position: "bottom",
          labels: {
            usePointStyle: true,
            color: textColPri,
          },
        },

        title: {
          display: true,
          text:
            typeChart === "scale-nps"
              ? `NPS Geral - ${formatDate(date.inicio)} até ${formatDate(date.fim)}`
              : `NPS Geral: ${year - 1} x ${year}`,
          color: textColPri,
          font: {
            size: 16,
            weight: "bold",
          },
          padding: {
            top: 10,
            bottom: 20,
          },
          align: "start",
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
  }, []);

  return (
    <>
      <div className={`${"card"} ${styles.chartCanva}`}>
        <Chart type="line" data={chartData} options={chartOptions} />
      </div>
      {typeChart === "scale-nps" && (
        <div className={styles.row}>
          <div className={styles.displayNotes}>
            {/* total de avaliações */}
            <div className={styles.noteBlock}>
              <p className="textSmall">Avaliações</p>
              <p className="textLarger">
                <span>
                  {summary.promotores + summary.neutros + summary.detratores}
                </span>
              </p>
            </div>
            {/* detratores */}
            <div className={styles.noteBlock}>
              <p className={`${"textSmall"} ${styles.detrator}`}>Detratores</p>
              <p className={`${"textLarger"} ${styles.detrator}`}>
                <span>{summary.detratores}</span>
              </p>
            </div>
            {/* neutros */}
            <div className={styles.noteBlock}>
              <p className={`${"textSmall"} ${styles.neutro}`}>Neutros</p>
              <p className={`${"textLarger"} ${styles.neutro}`}>
                <span>{summary.neutros}</span>
              </p>
            </div>
            {/* promotores */}
            <div className={styles.noteBlock}>
              <p className={`${"textSmall"} ${styles.promotor}`}>Promotores</p>
              <p className={`${"textLarger"} ${styles.promotor}`}>
                <span>{summary.promotores}</span>
              </p>
            </div>
          </div>
          <div className={styles.displayNotes}>
            {/* total de avaliações */}
            <div className={`${styles.noteBlock} ${styles.viewNPS}`}>
              <p className={`${"textSmall"} ${styles.textNPS}`}>
                <b>Nota NPS:</b>
              </p>
              <p className={`${"textLarger"} ${styles.textNPS}`}>
                <span className={styles.value}>{summary.nota}</span>
              </p>
              <p className={`${"textLarger"} ${styles.textNPS}`}>
                <span
                  className={`${summary.varNota > 0 ? `${summary.varNota === 0 ? styles.stable : styles.growth}` : styles.regression}`}>
                  {summary.varNota}%
                </span>
              </p>
            </div>
          </div>
          <div className={`${styles.displayNotes} ${styles.textSupport}`}>
            <p className="textSmall">
              {" "}
              No período anterior a nota NPS foi {summary.comp_nota}
            </p>
          </div>
        </div>
      )}
    </>
  );
}

export function Operation({ primaryData, typeChart, year }) {
  const chartData = useMemo(() => {
    // Y2Y montagem base corte x substituicao ano atual
    let corteY2Y = "";
    let substY2Y = "";
    let stores;

    if (typeChart === "Y2Y") {
      corteY2Y = primaryData.corte.map((e, i) => {
        const pedidos = primaryData.pedidos[i];
        return pedidos ? Math.round((e / pedidos) * 100) : null;
      });
      substY2Y = primaryData.substituicao.map((e, i) => {
        const pedidos = primaryData.pedidos[i];
        return pedidos ? Math.round((e / pedidos) * 100) : null;
      });
    } else if (typeChart === "stores") {
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
    const cort = docStyles.getPropertyValue("--aux-red");
    const sub = docStyles.getPropertyValue("--gray-09");
    const line = docStyles.getPropertyValue("--aux-yellow");

    return {
      labels:
        typeChart === "stores"
          ? stores.map((e) => e.loja.replace(/\D/g, "").slice(0, 3))
          : primaryData.label,

      datasets: [
        {
          type: "line",
          label:
            typeChart === "stores"
              ? "Substituição"
              : "Substituição (" + year + ")",
          borderColor: sub,
          borderWidth: 1.5,
          fill: false,
          tension: 0.4,
          data:
            typeChart === "stores"
              ? stores.map((e) => e.substituicao)
              : substY2Y,
          pointStyle: "line",
          pointRadius: 1,
          pointHoverRadius: 3,
          pointBackgroundColor: sub,

          datalabels: {
            display: true,
            formatter: (value) => {
              return value !== null ? `${value}%` : "";
            },
            anchor: "end",
            align: "bottom",
            color: sub,

            font: {
              size: 12,
              weight: "bold",
            },
          },
        },
        {
          type: "line",
          label: typeChart === "stores" ? "Meta de subst." : "Meta de subst.",
          borderColor: "#fad70e",
          borderWidth: 2,
          fill: false,
          tension: 0.4,
          data:
            typeChart === "stores"
              ? stores.map((e) => Math.round(e.corte * 0.8))
              : corteY2Y.map((e) => Math.round(e * 0.8)),
          borderDash: [2, 2],
          pointStyle: "line",
          pointRadius: 0,
          pointHoverRadius: 2,
          pointBackgroundColor: line,

          datalabels: {
            display: false,
          },
        },
        {
          type: "bar",
          label: typeChart === "stores" ? "Corte" : "Corte (" + year + ")",
          backgroundColor: cort,
          data: typeChart === "stores" ? stores.map((e) => e.corte) : corteY2Y,
          borderColor: cort,
          borderWidth: 0,

          datalabels: {
            display: true,
            formatter: (value) => {
              return value !== null ? `${value}%` : "";
            },
            anchor: "end",
            align: "top",
            color: cort,

            font: {
              size: 13,
              weight: "bold",
            },
          },
        },
      ],
    };
  }, [primaryData, typeChart, year]);

  // ref vertical dados do gráfico
  const verticalLinePlugin = {
    id: "verticalLine",

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
      ctx.strokeStyle = "#999";
      ctx.setLineDash([3, 3]);
      ctx.stroke();
      ctx.restore();
    },
  };

  const chartOptions = useMemo(() => {
    // importando estilos para o gráfico
    const docStyles = getComputedStyle(document.documentElement);

    // textos
    const textColSec = docStyles.getPropertyValue("--text");
    const textColPri = docStyles.getPropertyValue("--text-h");

    // border e line
    const border = docStyles.getPropertyValue("--border");

    return {
      maintainAspectRatio: false,
      aspectRatio: 0.6,

      interaction: {
        mode: "index",
        intersect: false,
      },

      plugins: {
        title: {
          display: true,
          text:
            typeChart === "stores"
              ? `Corte x Subst. - ${new Date(year, primaryData[0].month - 1, 1).toLocaleString("pt-BR", { month: "long" })} ${year}`
              : `Corte x Substituição ${year}`,
          color: textColPri,
          font: {
            size: 16,
            weight: "bold",
          },
          padding: {
            top: 10,
            bottom: 20,
          },
          align: "start",
        },

        legend: {
          position: "bottom",
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
      <div className={`${"card"} ${styles.chartCanva}`}>
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

export default { NPSReviews, Operation };
