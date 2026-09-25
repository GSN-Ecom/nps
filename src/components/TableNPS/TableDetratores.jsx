import styles from "./TableDetratores.module.css";
import dados from "../../data/dados_AP_Ecom.json";
import { normalizeDate } from "../../hooks/useNPS";
import calcVerb from "../../hooks/useDetratores";

// meses para suporte no array de dados
const meses = Array.from({ length: 12 }, (_, index) =>
  new Date(2026, index, 1)
    .toLocaleDateString("pt-BR", { month: "short" })
    .replace(".", "")
    .replace(/^./, (letra) => letra.toUpperCase()),
);

// heatmap detratores maior-menor
function getCor(valor, valores) {
  const menor = Math.min(...valores);
  const maior = Math.max(...valores);

  if (menor === maior) return "var(--aux-white)";
  const colorCalc = Math.round((255 * (valor - menor)) / (maior - menor));

  return `rgb(255, ${255 - colorCalc / 1.5}, ${255 - colorCalc / 1.5})`;
}

function detratoresYear(dados) {
  // Ecom - detratores ano vigente
  const listDetrMacro = ["det_macro"];
  const listDetrMicro = [
    "det_atendimento",
    "det_pagamento",
    "det_siteApp",
    "det_retirada",
    "det_entrega",
    "det_preco",
    "det_produto",
  ];
  const year = Array.from({ length: 12 }).fill({});

  // base filtrado pelo ano vigente
  const baseDetr = dados.filter(
    (e) => normalizeDate(e.data).getFullYear() === new Date().getFullYear(),
  );

  const result = year.map((_, i) => {
    // divisão dos detratores por mês
    let detrMonth = baseDetr.filter(
      (e) => normalizeDate(e.data).getMonth() === i,
    );

    return {
      mes: meses[i],
      micro: calcVerb(detrMonth, listDetrMicro),
      macro: calcVerb(detrMonth, listDetrMacro),
    };
  });

  return result;
}

function tableMonths(labels, base, colorValues, type) {
  return labels.map((label, i) => {
    // cria um array com texto, quantidade e macro relacionado ao detrator
    const resultado = base.map(
      (mes) =>
        mes[type].find((item) => item.texto === label) ?? {
          quantidade: 0,
        },
    );

    return (
      <div
        key={label}
        className={`${styles.contentTable} ${i % 2 === 0 ? "" : styles.bgRow}`}>
        <div key={label} className={styles.slot}>
          <p className="textDefault">{label}</p>
        </div>
        {resultado.map((e, i) => (
          <div
            key={i}
            className={styles.slot}
            style={{ background: `${getCor(e.quantidade, colorValues)}` }}>
            <p className="textDefault">{e.quantidade}</p>
          </div>
        ))}
      </div>
    );
  });
}

export const TableDetratores = () => {
  const table = detratoresYear(dados);
  console.log(table);

  // organizados tags detratores macro e repetições (maior-menor)
  const macroValues = table.map((e) => e.macro.map((e) => e.quantidade)).flat();
  const labelsMacro = [
    ...new Set(table.map((e) => e.macro.map((e) => e.texto)).flat()),
  ];

  const microValues = table.map((e) => e.macro.map((e) => e.quantidade)).flat();
  const labelsMicro = [
    ...new Set(table.map((e) => e.micro.map((e) => e.texto)).flat()),
  ];

  return (
    <>
      <div className={styles.blockTableDetr}>
        <div className={styles.tableDetrYear}>
          <p className={`${"textDefault"} ${styles.titleTable}`}>
            <b>Detratores / mês</b>
          </p>
        </div>
        <div className={styles.header}>
          <div className={styles.slot}>
            <p className="textDefault">Sinalização</p>
          </div>
          {table &&
            table.map((e) => {
              return (
                <div key={e.mes} className={styles.slot}>
                  <p className="textDefault">{e.mes}</p>
                </div>
              );
            })}
        </div>
        {tableMonths(labelsMacro, table, macroValues, "macro")}
      </div>
      <div className={styles.blockTableDetr}>
        <div className={styles.tableDetrYear}>
          <p className={`${"textDefault"} ${styles.titleTable}`}>
            <b>Princiapais problemas / mês</b>
          </p>
        </div>
        <div className={styles.header}>
          <div className={styles.slot}>
            <p className="textDefault">Sinalização</p>
          </div>
          {table &&
            table.map((e) => {
              return (
                <div key={e.mes} className={styles.slot}>
                  <p className="textDefault">{e.mes}</p>
                </div>
              );
            })}
        </div>
        {tableMonths(labelsMicro, table, microValues, "micro", labelsMacro)}
      </div>
    </>
  );
};

export default TableDetratores;
