import { useMemo } from "react";
import { Chart } from "primereact/chart";
import styles from "./Charts.module.css";

// legenda nos gráficos
import { Chart as ChartJS } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
ChartJS.register(ChartDataLabels);

export default function NPSReviews({
  primaryData,
  secondaryData,
  typeChart,
  summary,
  year,
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

        {
          type: "line",
          label: typeChart === "scale-nps" ? "Período Anterior" : year - 1,
          borderColor: typeChart === "scale-nps" ? line : detr,
          borderWidth: 1.5,
          fill: false,
          tension: typeChart === "scale-nps" ? 0.4 : 0.1,
          data: typeChart === "scale-nps" ? secondaryData : compY2Y,
          borderDash: [3, 3],
          pointRadius: 1,
          pointHoverRadius: 6,
          pointBackgroundColor: typeChart === "scale-nps" ? line : detr,

          datalabels: {
            display: false,
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
            color: textColPri,
          },
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
