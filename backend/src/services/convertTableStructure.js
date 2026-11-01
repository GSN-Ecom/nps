export function tableEcom(arr) {
  // validação array vazio
  if (!arr.length) return [];

  const baseFormatted = arr.map((obj) => {
    return {
      orderid: String(obj.pedido).trim(),
      name: obj.nome,
      email: obj.email,
      date: obj.data,
      store: obj.nroempresa,
      delivery: obj.delivery,
      coupon: obj.cupom,
      nps: obj.nota_NPS,
      detmacro: obj.det_macro,
      det_atendimento: obj.det_atendimento,
      det_pagamento: obj.det_pagamento,
      det_siteapp: obj.det_siteApp,
      det_retirada: obj.det_retirada,
      det_entrega: obj.det_entrega,
      det_preco: obj.det_preco,
      det_produto: obj.det_produto,
      det_justif: obj.det_justif,
      tags: obj.tags,
      neut_prom_macro: obj.neut_prom_macro,
      neut_prom_justif: obj.neut_prom_justif,
    };
  });

  return baseFormatted;
}

export function tableLojaFisica(arr) {
  // validação array vazio
  if (!arr.length) return [];

  const baseFormatted = arr.map((obj) => {
    return {
      orderid: String(obj.pedido).trim(),
      name: obj.nome,
      email: obj.email,
      date: obj.data,
      store: obj.nroempresa,
      delivery: obj.delivery,
      coupon: obj.cupom,
      nps: obj.nota_NPS,
      detmacro: obj.det_macro,
      det_tempesperacaixa: obj.det_tempoEsperaCaixa,
      det_atendimento: obj.det_atendimento,
      det_variedadequalidade: obj.det_variedadeQualidade,
      det_appclube: obj.det_appClube,
      det_ambienteloja: obj.det_ambienteLoja,
      det_preco: obj.det_preco,
      det_estacionamento: obj.det_estacionamento,
      det_justif: obj.det_justif,
      tags: obj.tags,
      neut_prom_macro: obj.neut_prom_macro,
      neut_prom_justif: obj.neut_prom_justif,
    };
  });

  return baseFormatted;
}
