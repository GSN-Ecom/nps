import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";

// estilizacao
import styles from "./TableNPS.module.css";

// componentes
import Breadcrumb from "../Breadcrumb/Breadcrumb";
import { Title } from "../Title/Title";
import FiltersVerb from "../Filters/FiltersVerb";
import Modal from "../Modal/Modal";

// hooks
import useModal from "../../hooks/useModal";
import { useGlobal } from "../../hooks/useGlobal";

// funcoes utilitarias
import calcNPS from "./calcNPS";
import Pagination from "../Pagination/Pagination";

// construção do componente de tabela
const TableNPS = ({ dados }) => {
  const tags = ["Det", "Neu", "Pro"];
  const headerTable = ["Loja", "Nome", "Atual", "Dif.", "Antes", "Resp."];

  const table = useMemo(() => {
    return dados
      .map((e) => {
        const notaAtual = calcNPS(e.notasCurr);
        const notaAnter = calcNPS(e.notasPrev);

        const promCurr = e.notasCurr
          .slice(9)
          .reduce((acc, val) => acc + val, 0);
        const neutCurr = e.notasCurr
          .slice(7, 9)
          .reduce((acc, val) => acc + val, 0);
        const detrCurr = e.notasCurr
          .slice(0, 7)
          .reduce((acc, val) => acc + val, 0);

        const notaDif = Math.round(notaAtual - notaAnter);

        const totalResp = e.notasCurr.reduce((acc, val) => acc + val, 0);

        return {
          ...e,
          notaAtual,
          notaAnter,
          notaDif,
          totalResp,
          promCurr,
          neutCurr,
          detrCurr,
        };
      })
      .filter((e) => e.notaAtual !== "-")
      .sort((a, b) => b.notaAtual - a.notaAtual);
  }, [dados]);

  return (
    <div className={styles.rankingTable}>
      <div className={styles.HeaderTable}>
        {headerTable &&
          headerTable.map((e) => (
            <p key={e} className={`${"textDefault"} ${styles.cell}`}>
              {e}
            </p>
          ))}
        {Array.from({ length: 11 }, (_, i) => {
          return (
            <p
              key={i}
              className={`${"textDefault"} ${styles.deskView} ${styles.cell} ${i <= 6 ? `${styles.regression}` : ""}
                ${i <= 8 && i >= 7 ? `${styles.neutros}` : ""}
                ${i >= 9 ? `${styles.growth}` : ""}`}>
              {i}
            </p>
          );
        })}
        {tags.map((e, i) => {
          return (
            <p
              key={i}
              className={`${"textDefault"} ${styles.mobileView} ${styles.cell} ${i === 0 ? `${styles.regression}` : ""}
                ${i === 1 ? `${styles.neutros}` : ""}
                ${i === 2 ? `${styles.growth}` : ""}`}>
              {e}
            </p>
          );
        })}
        <p className={`${"textDefault"} ${styles.cell}`}>Justif. Detratores</p>
      </div>
      {table &&
        table.map((store, i) => {
          const growth = () => {
            if (store.notaAtual > store.notaAnter)
              return (
                <p
                  className={`${"textDefault"} ${styles.cell}`}
                  style={{ color: "var(--aux-green)" }}>
                  {store.notaDif} ▲
                </p>
              );
            if (store.notaAtual < store.notaAnter)
              return (
                <p
                  className={`${"textDefault"} ${styles.cell}`}
                  style={{ color: "var(--aux-red)" }}>
                  {store.notaDif} ▼
                </p>
              );
            if (
              store.notaAtual === store.notaAnter ||
              store.notaAtual === "-" ||
              store.notaAnter === "-"
            )
              return (
                <p
                  className={`${"textDefault"} ${styles.cell}`}
                  style={{ color: "var(--gray-05)" }}>
                  ■
                </p>
              );
          };

          const textFormat = (text) =>
            text.charAt(0).toUpperCase() + text.slice(1);

          const macro = store.detr_justif_macro?.reduce(
            (maior, atual) =>
              atual.quantidade > maior.quantidade ? atual : maior,
            { texto: "", quantidade: 0 },
          );

          const micro = store.detr_justif_micro?.reduce(
            (maior, atual) =>
              atual.quantidade > maior.quantidade ? atual : maior,
            { texto: "", quantidade: 0 },
          );

          return (
            <div
              key={store.numStore}
              className={`${styles.rowTable} ${styles.rowRnkStores} ${i % 2 !== 0 ? styles.rowBg : ""}`}>
              <p className={`${"textDefault"} ${styles.cell}`}>
                <b>{store.numStore}</b>
              </p>
              <p className={`${"textDefault"} ${styles.cell}`}>{store.name}</p>
              {/* notas: atual e comparativo */}
              <p className={`${"textDefault"} ${styles.cell}`}>
                <b>{store.notaAtual}</b>
              </p>
              {/* icon progresso e diferença entre notas */}
              {growth()}
              {/* nota anterior */}
              <p className={`${"textDefault"} ${styles.cell}`}>
                {store.notaAnter}
              </p>
              {/* total de respostas */}
              <p className={`${"textDefault"} ${styles.cell}`}>
                {store.totalResp}
              </p>
              {/* notas 0 a 10 */}
              {store.notasCurr.map((e, index) => {
                return (
                  <p
                    key={index}
                    className={`${"textDefault"} ${styles.deskView} ${styles.cell}`}>
                    {e}
                  </p>
                );
              })}
              <p
                className={`${"textDefault"} ${styles.mobileView} ${styles.cell}`}>
                {store.detrCurr}
              </p>
              <p
                className={`${"textDefault"} ${styles.mobileView} ${styles.cell}`}>
                {store.neutCurr}
              </p>
              <p
                className={`${"textDefault"} ${styles.mobileView} ${styles.cell}`}>
                {store.promCurr}
              </p>
              <p className={`${"textDefault"} ${styles.cell}`}>
                {macro?.texto && micro?.texto
                  ? `${textFormat(macro.texto)} > ${textFormat(
                      micro.texto,
                    )} (${micro.quantidade})`
                  : ""}
              </p>
            </div>
          );
        })}
    </div>
  );
};

// verbalizações tabela
const CustomerResp = ({ dados }) => {
  const {
    setFilter,
    selectedStore,
    selectedDelivery,
    selectedRating,
    detrList,
    setDetrList,
    selectedDetr,
    page,
    setPage,
  } = useGlobal();

  // modal pedido/cliente
  const { isOpen, openModal, closeModal } = useModal();

  // controle e criação dos dados do filtro a partir da base
  useEffect(() => {
    const lojas = [
      ...new Set(
        dados
          .map((loja) => loja.nroempresa)
          .filter((nro) => nro !== "" && !isNaN(Number(nro)))
          .map(Number),
      ),
    ];

    const entrega = [...new Set(dados.map((loja) => loja.delivery))];

    setFilter((prev) => {
      if (
        JSON.stringify(prev.lojas) === JSON.stringify(lojas) &&
        JSON.stringify(prev.entrega) === JSON.stringify(entrega)
      ) {
        return prev;
      }

      return {
        ...prev,
        lojas,
        entrega,
      };
    });
  }, [dados, setFilter]);

  // ordenação por data 9 - 0 + filtros
  const tableVerb = useMemo(() => {
    let ordenado = [...dados].sort((a, b) => {
      const dataA = a.data.slice(0, 10);
      const dataB = b.data.slice(0, 10);

      return dataB.localeCompare(dataA);
    });

    if (selectedStore && selectedStore.name !== "Todas as lojas") {
      ordenado = ordenado.filter(
        (loja) => loja.nroempresa === selectedStore.nroempresa,
      );
    }

    if (selectedDelivery && selectedDelivery.name !== "Todas") {
      ordenado = ordenado.filter(
        (deliveryType) => deliveryType.delivery === selectedDelivery.name,
      );
    }

    if (selectedRating && selectedRating.name !== "Todas") {
      ordenado = ordenado.filter((rating) => {
        if (selectedRating.name === "Promotor") return rating.nota_NPS >= 9;
        if (selectedRating.name === "Neutro")
          return rating.nota_NPS >= 7 && rating.nota_NPS <= 8;
        if (selectedRating.name === "Detrator") return rating.nota_NPS <= 6;
      });
    }

    if (selectedDetr !== "Todas") {
      ordenado = ordenado.filter((detrTag) =>
        detrTag.det_macro?.toLowerCase().includes(selectedDetr.toLowerCase()),
      );
    }
    return ordenado;
  }, [dados, selectedStore, selectedDelivery, selectedRating, selectedDetr]);

  // denfinindo tamanho do array para paginação
  useEffect(() => {
    setPage(() => ({
      inicio: 0,
      fim: 10,
      total: tableVerb.length,
    }));
  }, [tableVerb.length, setPage]);

  // reunir resultado detratores (micro)
  function detMicro(arr) {
    return Object.entries(arr)
      .filter(
        ([chave, valor]) =>
          chave.startsWith("det_") && chave !== "det_macro" && valor?.trim(),
      )
      .flatMap(([, valor]) =>
        valor
          .split(/[,;]/)
          .map((item) => item.trim())
          .filter(Boolean),
      )
      .join(" - ");
  }

  const det_Macro = useMemo(() => {
    const resultado = new Map();

    tableVerb.forEach((verb) => {
      if (verb.nota_NPS > 6) return;
      const macro = verb.det_macro?.trim().toLowerCase();

      if (macro) {
        resultado.set(macro, (resultado.get(macro) || 0) + 1);
      }
    });

    return Array.from(resultado, ([name, quantidade]) => ({
      key: name,
      name: `${name} (${quantidade})`,
      quantidade,
    }));
  }, [tableVerb]);

  useEffect(() => {
    const atual = JSON.stringify([...detrList]);
    const novo = JSON.stringify([...det_Macro]);

    if (atual !== novo) {
      setDetrList(det_Macro);
    }
  }, [det_Macro, detrList, setDetrList]);

  // formatar texto ocultando caracteres
  function ocultarTexto(nome, tipo) {
    if (typeof nome !== "string" || !nome.trim()) return "";
    if (tipo === "nome") {
      return nome.replace(/(\S{3})\S+/g, "$1*****");
    }
    if (tipo === "email")
      return nome.replace(
        /^(.{3}).+(.{1})@(.+)\.(.+)$/,
        "$1*****$2@*********.$4",
      );
  }

  let dataFormatada = (value) => {
    return value.split("T")[0].split("-").reverse().join("/");
  };

  const [pedido, setPedido] = useState(null);
  // conteudo detalhes da resposta, modal
  function answerContent(nroPedido) {
    const content = tableVerb.find((answer) => answer.pedido === nroPedido);

    if (!content) return null;

    const verbalizacao = [
      content.det_macro,
      content.det_atendimento,
      content.det_pagamento,
      content.det_siteApp,
      content.det_retirada,
      content.det_entrega,
      content.det_preco,
      content.det_produto,
      content.det_justif,
      content.neut_prom_macro,
      content.neut_prom_justif,
    ]
      .filter(Boolean)
      .join(", ");

    return (
      <div className={styles.answerModalContent}>
        <div className={styles.row}>
          <div className={styles.col}>
            <p className="textDefault">
              Nome: <b>{ocultarTexto(content?.nome, "nome")}</b>
            </p>
            <p className="textDefault">
              Email: <b>{content?.email}</b>
            </p>
            <p className="textDefault" style={{ marginTop: ".5rem" }}>
              Verbalização:
              <br />
              <span style={{ fontStyle: "italic", fontWeight: "400" }}>
                "{verbalizacao}"
              </span>
            </p>
          </div>
          <div className={styles.col}>
            <p className="textDefault">
              Nota NPS: <b>{content?.nota_NPS}</b>
            </p>
            <p className="textDefault">
              Pedido: <b>{content?.pedido}</b>
            </p>
            <p className="textDefault">
              Data: <b>{dataFormatada(content?.data)}</b>
            </p>
            <p className="textDefault">
              Nº loja: <b>{content?.nroempresa}</b>
            </p>
            <p className="textDefault">
              Entrega: <b>{content?.delivery}</b>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        content={answerContent(pedido)}
      />
      <div className={`${styles.customerTable} ${styles.verbCustomer}`}>
        <Breadcrumb pathname={useLocation().pathname} />
        <Title text="Respostas" />
        <FiltersVerb />
        <p className={`${"textDefault"} ${styles.respNumTotal}`}>
          {tableVerb.length} respostas
        </p>
        <div className={styles.HeaderTable}>
          <p className={`${"textDefault"} ${styles.cell}`}>Loja</p>
          <p className={`${"textDefault"} ${styles.cell}`}>Pedido</p>
          <p className={`${"textDefault"} ${styles.cell}`}>Nota</p>
          <p className={`${"textDefault"} ${styles.cell}`}>Data</p>
          <p className={`${"textDefault"} ${styles.cell}`}>Nome</p>
          <p className={`${"textDefault"} ${styles.cell}`}>Entrega</p>
          <p className={`${"textDefault"} ${styles.cell}`}>Justf.</p>
        </div>
        <div className={styles.blockTable}>
          {tableVerb &&
            tableVerb.slice(page.inicio, page.fim).map((verb, i) => {
              return (
                <div
                  key={i}
                  className={`${styles.rowTable} ${i % 2 !== 0 ? styles.rowBg : ""}`}>
                  <p className={`${"textDefault"} ${styles.cell}`}>
                    <b>{verb.nroempresa}</b>
                  </p>
                  <p
                    className={`${"textDefault"} ${styles.cell}`}
                    onClick={() => {
                      setPedido(verb.pedido);
                      openModal();
                    }}
                    style={{ cursor: "pointer" }}>
                    {verb.pedido}
                  </p>
                  <p
                    className={`${"textDefault"} ${styles.cell}
                ${
                  verb.nota_NPS >= 9
                    ? `${styles.ntProm}`
                    : `${verb.nota_NPS <= 6 ? `${styles.ntDetr}` : `${styles.ntNeut}`}`
                }`}>
                    <b>{verb.nota_NPS}</b>
                  </p>
                  <p className={`${"textDefault"} ${styles.cell}`}>
                    {dataFormatada(verb.data)}
                  </p>
                  <p className={`${"textDefault"} ${styles.cell}`}>
                    {ocultarTexto(verb.nome, "nome")}
                  </p>
                  <p className={`${"textDefault"} ${styles.cell}`}>
                    {verb.delivery}
                  </p>

                  <p className={`${"textDefault"} ${styles.cell}`}>
                    {verb.nota_NPS >= 7 ? verb.neut_prom_macro : verb.det_macro}
                  </p>
                  <p className={`${"textDefault"} ${styles.cell}`}>
                    {detMicro(verb) || null}
                  </p>
                  {(verb.neut_prom_justif || verb.det_justif) && (
                    <p className={`textDefault ${styles.cell}`}>
                      {`Cliente: "${
                        verb.nota_NPS >= 7
                          ? verb.neut_prom_justif || verb.det_justif
                          : verb.det_justif || verb.neut_prom_justif
                      }"`}
                    </p>
                  )}
                </div>
              );
            })}
        </div>
        <Pagination />
      </div>
    </>
  );
};

export { TableNPS, CustomerResp };
