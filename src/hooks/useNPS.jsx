import calcNPS from "../components/TableNPS/calcNPS";
import dados from "../data/dados_AP_Ecom.json";
import storesEcom from "../data/stores_AP_Ecom.json";

const currentYear = new Date().getFullYear();

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

function months(ano) {
  return Array.from({ length: 12 }, (_, index) => {
    const mes = new Date(ano, index, 1)
      .toLocaleString("pt-BR", {
        month: "short",
      })
      .replace(".", "")
      .replace(/^./, (letra) => letra.toUpperCase());

    return {
      id: mes,
      detratores: 0,
      neutros: 0,
      promotores: 0,
      nps: 0,
    };
  });
}

// calcular corte x substituicao por loja (mes vigente)
function storeCutReplace(base) {
  let currMonth = new Date().getMonth() + 1;
  let dados = base.filter((e) => e.mes === currMonth && e.ano === currentYear);

  // validação mudança de mês e a base estiver sem dados, exibe o mês anterior
  if (
    dados.reduce((acc, val) => {
      return acc + val.pedidos;
    }, 0) === 0
  ) {
    dados = base.filter((e) => e.mes === currMonth - 1);
  }

  const dadosLojas = dados.map((e) => {
    return {
      store: e.loja,
      corte: e.corteEfetivo,
      substituicao: e.substituidos,
      pedidos: e.pedidos,
      month: currMonth,
    };
  });

  return dadosLojas;
}

function useY2Y() {
  // construção dos arrays com dados Y2Y
  let currYear = months(currentYear);
  let prevYear = months(currentYear - 1);

  // base ano atual - 1. montagem
  const base = dados.filter((resp) => {
    const dataResp = new Date(resp.data);
    return dataResp.getUTCFullYear() === currentYear;
  });

  // base ano atual - 2. contabilizar
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

  // base ano atual - 3. calcular nota / mes
  currYear.forEach((e) => {
    const total = e.promotores + e.neutros + e.detratores;

    if (total === 0) return (e.nps = 0);
    e.nps = calcNPS([], e.detratores, e.neutros, e.promotores);
  });

  // inicio base comparativa ano anterior
  // 1. montagem
  const baseComp = dados.filter((resp) => {
    const dataResp = new Date(resp.data);

    return dataResp.getUTCFullYear() === currentYear - 1;
  });

  // base comparativo ano anterior - 2. contabilizar
  baseComp.forEach((resp) => {
    const dataResp = new Date(resp.data);
    const month = dataResp.getUTCMonth();
    const review = resp.nota_NPS;

    if (review <= 6) {
      prevYear[month].detratores++;
    }
    if (review >= 7 && review <= 8) {
      prevYear[month].neutros++;
    }
    if (review >= 9 && review <= 10) {
      prevYear[month].promotores++;
    }
  });

  // base comparativo ano anterior - 3. calcular nota / mes
  prevYear.forEach((e) => {
    const total = e.promotores + e.neutros + e.detratores;

    if (total === 0) return (e.nps = 0);
    e.nps = calcNPS([], e.detratores, e.neutros, e.promotores);
  });

  return {
    currentYear,
    currYear,
    prevYear,
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

function useCorteSubst(baseCorteSubst, filterStore) {
  // construção dos arrays com dados Y2Y
  let baseCurYear = months(currentYear).map((e) => e.id);
  baseCurYear = {
    label: baseCurYear,
    pedidos: Array.from({ length: 12 }).fill(0),
    corte: Array.from({ length: 12 }).fill(0),
    substituicao: Array.from({ length: 12 }).fill(0),
    lojas: [],
  };

  baseCorteSubst
    .filter((e) => {
      if (filterStore.name !== "Todas as lojas") {
        return e.loja === filterStore.name;
      }
      return true;
    })
    .forEach((e) => {
      if (e.ano !== currentYear) return;

      const index = e.mes - 1;

      baseCurYear.pedidos[index] += e.pedidos ?? 0;
      baseCurYear.corte[index] += e.corteEfetivo ?? 0;
      baseCurYear.substituicao[index] += e.substituidos ?? 0;
    });

  // construção dos dados por loja (current Year)
  const storesCutReplace = storeCutReplace(baseCorteSubst);

  // console.log(baseCorteSubst);

  return { baseCurYear, storesCutReplace };
}

export { useCalcNps, useY2Y, useCorteSubst };
