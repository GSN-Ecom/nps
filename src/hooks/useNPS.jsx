import dados from "../data/dados_AP_Ecom.json";
import storesEcom from "../data/stores_AP_Ecom.json";

function normalizeDate(date) {
  if (!date) return null;
  if (date instanceof Date) {
    return date;
  }
  return new Date(date);
}

function toUTCDate(date) {
  return new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()),
  );
}

function isSameDate(date1, date2) {
  return (
    date1.getUTCFullYear() === date2.getUTCFullYear() &&
    date1.getUTCMonth() === date2.getUTCMonth() &&
    date1.getUTCDate() === date2.getUTCDate()
  );
}

function useY2Y(year) {
  const currentYear = year;

  let currYear = [
    { id: "Jan", detratores: 0, neutros: 0, promotores: 0, nps: 0 },
    { id: "Fev", detratores: 0, neutros: 0, promotores: 0, nps: 0 },
    { id: "Mar", detratores: 0, neutros: 0, promotores: 0, nps: 0 },
    { id: "Abr", detratores: 0, neutros: 0, promotores: 0, nps: 0 },
    { id: "Mai", detratores: 0, neutros: 0, promotores: 0, nps: 0 },
    { id: "Jun", detratores: 0, neutros: 0, promotores: 0, nps: 0 },
    { id: "Jul", detratores: 0, neutros: 0, promotores: 0, nps: 0 },
    { id: "Ago", detratores: 0, neutros: 0, promotores: 0, nps: 0 },
    { id: "Set", detratores: 0, neutros: 0, promotores: 0, nps: 0 },
    { id: "Out", detratores: 0, neutros: 0, promotores: 0, nps: 0 },
    { id: "Nov", detratores: 0, neutros: 0, promotores: 0, nps: 0 },
    { id: "Dez", detratores: 0, neutros: 0, promotores: 0, nps: 0 },
  ];

  let compYear = [
    { id: "Jan", detratores: 0, neutros: 0, promotores: 0 },
    { id: "Fev", detratores: 0, neutros: 0, promotores: 0 },
    { id: "Mar", detratores: 0, neutros: 0, promotores: 0 },
    { id: "Abr", detratores: 0, neutros: 0, promotores: 0 },
    { id: "Mai", detratores: 0, neutros: 0, promotores: 0 },
    { id: "Jun", detratores: 0, neutros: 0, promotores: 0 },
    { id: "Jul", detratores: 0, neutros: 0, promotores: 0 },
    { id: "Ago", detratores: 0, neutros: 0, promotores: 0 },
    { id: "Set", detratores: 0, neutros: 0, promotores: 0 },
    { id: "Out", detratores: 0, neutros: 0, promotores: 0 },
    { id: "Nov", detratores: 0, neutros: 0, promotores: 0 },
    { id: "Dez", detratores: 0, neutros: 0, promotores: 0 },
  ];

  // base ano atual
  const base = dados.filter((resp) => {
    const dataResp = new Date(resp.data);

    return dataResp.getUTCFullYear() === currentYear;
  });

  base.forEach((resp) => {
    const dataResp = new Date(resp.data);
    const month = dataResp.getUTCMonth();
    const review = resp.nota_NPS;

    if (review <= 6) {
      currYear[month].detratores++;
    }

    if (review >= 7 && review <= 8) {
      currYear[month].neutros++;
    }

    if (review >= 9 && review <= 10) {
      currYear[month].promotores++;
    }
  });

  // comparativo ano anterior
  const baseComp = dados.filter((resp) => {
    const dataResp = new Date(resp.data);

    return dataResp.getUTCFullYear() === currentYear - 1;
  });

  baseComp.forEach((resp) => {
    const dataResp = new Date(resp.data);
    const month = dataResp.getUTCMonth();
    const review = resp.nota_NPS;

    if (review <= 6) {
      compYear[month].detratores++;
    }

    if (review >= 7 && review <= 8) {
      compYear[month].neutros++;
    }

    if (review >= 9 && review <= 10) {
      compYear[month].promotores++;
    }
  });

  currYear.forEach((e) => {
    const total = e.promotores + e.neutros + e.detratores;

    if (total === 0) {
      e.nps = 0;
      return;
    }

    const calcNps = ((e.promotores - e.detratores) / total) * 100;

    e.nps = Math.round(calcNps);
  });

  compYear.forEach((e) => {
    const total = e.promotores + e.neutros + e.detratores;

    if (total === 0) {
      e.nps = 0;
      return;
    }

    const calcNps = ((e.promotores - e.detratores) / total) * 100;

    e.nps = Math.round(calcNps);
  });

  return {
    currentYear,
    currYear,
    compYear,
  };
}

function useCalcNps(inicio, fim) {
  const notasDefault = () => [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

  // construção da tabela de notas
  const storesTableNPS = storesEcom
    .filter((e) => e.numStore !== 0)
    .map((store) => ({
      ...store,
      notasCurr: notasDefault(),
      notasPrev: notasDefault(),
      notasDeliveryCurr: notasDefault(),
      notasDeliveryPrev: notasDefault(),
      notasClickCurr: notasDefault(),
      notasClickPrev: notasDefault(),
      notasSFastCurr: notasDefault(),
      notasSFastPrev: notasDefault(),
      detr_justif_macro: null,
      detr_justif_micro: null,
      neut_prom_macro: null,
    }));

  let notas = notasDefault();
  let notasComp = notasDefault();

  let summary = {
    nota: 0,
    varNota: 0,
    promotores: 0,
    neutros: 0,
    detratores: 0,
    comp_nota: 0,
    comp_promotores: 0,
    comp_neutros: 0,
    comp_detratores: 0,
  };

  let baseVerb = null;

  const dataInicioLocal = normalizeDate(inicio);
  const dataFimLocal = normalizeDate(fim);

  if (!dataInicioLocal || !dataFimLocal) {
    return {
      notas,
      notasComp,
      summary,
    };
  }

  const dataInicio = toUTCDate(dataInicioLocal);
  const dataFim = toUTCDate(dataFimLocal);

  if (isSameDate(dataInicio, dataFim)) {
    const base = dados.filter((resp) => {
      const dataResp = new Date(resp.data);

      return (
        dataResp.getUTCFullYear() === dataInicio.getUTCFullYear() &&
        dataResp.getUTCMonth() === dataInicio.getUTCMonth() &&
        dataResp.getUTCDate() === dataInicio.getUTCDate()
      );
    });

    // cria a base para popular tabela de verbalizações
    baseVerb = base;

    base.forEach((resp) => {
      let nota = resp.nota_NPS;
      notas[nota]++;

      // construção dados loja
      const store = storesTableNPS.find((e) => e.numStore === resp.nroempresa);

      if (store) {
        store.notasCurr[resp.nota_NPS]++;

        // notas nps por modalidade de entrega
        resp.delivery === "AGENDADA" ? store.notasDeliveryCurr[nota]++ : "";
        resp.delivery === "CLIQUE" ? store.notasClickCurr[nota]++ : "";
      }
    });

    // contabilizar detratores, neutros e promotores no período selecionado
    const NeutPromMacro = ["neut_prom_macro"];
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

    const calcVerb = (dados, arr) => {
      const campos = arr;
      const contador = {};

      dados.forEach((resp) => {
        campos.forEach((campo) => {
          const texto = resp[campo];

          if (!texto) return;

          const textos = texto
            .split(/[,;]/)
            .map((e) => e.trim().toLowerCase())
            .filter(Boolean);

          textos.forEach((t) => (contador[t] = (contador[t] || 0) + 1));
        });
      });

      return Object.entries(contador).map(([texto, quantidade]) => ({
        texto,
        quantidade,
      }));
    };

    // direcionando as respostas para a respectiva loja
    storesTableNPS.forEach((store) => {
      const dadosLoja = base.filter(
        (resp) => resp.nroempresa === store.numStore,
      );

      store.detr_justif_macro = calcVerb(dadosLoja, listDetrMacro);
      store.detr_justif_micro = calcVerb(dadosLoja, listDetrMicro);
      store.neut_prom_macro = calcVerb(dadosLoja, NeutPromMacro);
    });

    // calculo data período anterior
    const diaAnterior = new Date(dataInicio);

    diaAnterior.setUTCDate(diaAnterior.getUTCDate() - 1);

    const baseComp = dados.filter((resp) => {
      const dataResp = new Date(resp.data);

      return (
        dataResp.getUTCFullYear() === diaAnterior.getUTCFullYear() &&
        dataResp.getUTCMonth() === diaAnterior.getUTCMonth() &&
        dataResp.getUTCDate() === diaAnterior.getUTCDate()
      );
    });

    baseComp.forEach((resp) => {
      let nota = resp.nota_NPS;
      notasComp[nota]++;

      // construção dados loja
      const store = storesTableNPS.find((e) => e.numStore === resp.nroempresa);

      if (store) {
        // contabilizando as notas nps geral
        store.notasPrev[nota]++;

        // notas nps por modalidade de entrega
        resp.delivery === "AGENDADA" ? store.notasDeliveryPrev[nota]++ : "";
        resp.delivery === "CLIQUE" ? store.notasClickPrev[nota]++ : "";
      }
    });
  }

  if (!isSameDate(dataInicio, dataFim)) {
    const inicioPeriodo = new Date(dataInicio);
    const fimPeriodo = new Date(dataFim);

    fimPeriodo.setUTCDate(fimPeriodo.getUTCDate() + 1);

    const base = dados.filter((resp) => {
      const dataResp = new Date(resp.data);

      return dataResp >= inicioPeriodo && dataResp < fimPeriodo;
    });

    // cria a base para popular tabela de verbalizações
    baseVerb = base;

    base.forEach((resp) => {
      let nota = resp.nota_NPS;
      notas[nota]++;

      // construção dados loja
      const store = storesTableNPS.find((e) => e.numStore === resp.nroempresa);

      if (store) {
        store.notasCurr[resp.nota_NPS]++;

        // notas nps por modalidade de entrega
        resp.delivery === "AGENDADA" ? store.notasDeliveryCurr[nota]++ : "";
        resp.delivery === "CLIQUE" ? store.notasClickCurr[nota]++ : "";
      }
    });

    // contabilizar detratores, neutros e promotores no período selecionado
    const NeutPromMacro = ["neut_prom_macro"];
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

    const calcVerb = (dados, arr) => {
      const campos = arr;
      const contador = {};

      dados.forEach((resp) => {
        campos.forEach((campo) => {
          const texto = resp[campo];

          if (!texto) return;

          const textos = texto
            .split(/[,;]/)
            .map((e) => e.trim().toLowerCase())
            .filter(Boolean);

          textos.forEach((t) => (contador[t] = (contador[t] || 0) + 1));
        });
      });

      return Object.entries(contador).map(([texto, quantidade]) => ({
        texto,
        quantidade,
      }));
    };

    // direcionando as respostas para a respectiva loja
    storesTableNPS.forEach((store) => {
      const dadosLoja = base.filter(
        (resp) => resp.nroempresa === store.numStore,
      );

      store.detr_justif_macro = calcVerb(dadosLoja, listDetrMacro);
      store.detr_justif_micro = calcVerb(dadosLoja, listDetrMicro);
      store.neut_prom_macro = calcVerb(dadosLoja, NeutPromMacro);
    });

    // conversão de datas para quantiadade de dias
    const conv = 1000 * 60 * 60 * 24;
    const quantidadeDias = (fimPeriodo - inicioPeriodo) / conv;
    const dataInicioComp = new Date(inicioPeriodo);

    dataInicioComp.setUTCDate(dataInicioComp.getUTCDate() - quantidadeDias);

    const baseComp = dados.filter((resp) => {
      const dataResp = new Date(resp.data);

      return dataResp >= dataInicioComp && dataResp < inicioPeriodo;
    });

    baseComp.forEach((resp) => {
      let nota = resp.nota_NPS;
      notasComp[nota]++;

      // construção dados loja
      const store = storesTableNPS.find((e) => e.numStore === resp.nroempresa);

      if (store) {
        // contabilizando as notas nps geral
        store.notasPrev[nota]++;

        // notas nps por modalidade de entrega
        resp.delivery === "AGENDADA" ? store.notasDeliveryPrev[nota]++ : "";
        resp.delivery === "CLIQUE" ? store.notasClickPrev[nota]++ : "";
      }
    });
  }

  notas.forEach((nota, index) => {
    if (index <= 6) {
      summary.detratores += nota;
    }

    if (index >= 7 && index <= 8) {
      summary.neutros += nota;
    }

    if (index >= 9) {
      summary.promotores += nota;
    }
  });

  notasComp.forEach((nota, index) => {
    if (index <= 6) {
      summary.comp_detratores += nota;
    }

    if (index >= 7 && index <= 8) {
      summary.comp_neutros += nota;
    }

    if (index >= 9) {
      summary.comp_promotores += nota;
    }
  });

  const totalAtual = summary.promotores + summary.neutros + summary.detratores;

  if (totalAtual > 0) {
    summary.nota = Math.round(
      ((summary.promotores - summary.detratores) / totalAtual) * 100,
    );
  }

  const totalComp =
    summary.comp_promotores + summary.comp_neutros + summary.comp_detratores;

  if (totalComp > 0) {
    summary.comp_nota = Math.round(
      ((summary.comp_promotores - summary.comp_detratores) / totalComp) * 100,
    );
  }

  if (summary.comp_nota !== 0) {
    summary.varNota = Math.round(
      ((summary.nota - summary.comp_nota) / Math.abs(summary.comp_nota)) * 100,
    );
  } else {
    summary.varNota = 0;
  }

  return {
    notas,
    notasComp,
    summary,
    storesTableNPS,
    baseVerb,
  };
}

export { useCalcNps, useY2Y };
