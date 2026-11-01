const detMicroEcom = [
  'det_atendimento',
  'det_pagamento',
  'det_siteapp',
  'det_retirada',
  'det_entrega',
  'det_preco',
  'det_produto',
];

const detMicroLoja = [
  'det_tempesperacaixa',
  'det_atendimento',
  'det_variedadequalidade',
  'det_appclube',
  'det_ambienteloja',
  'det_preco',
  'det_estacionamento',
];

export function tagsDetratoresMicro(table) {
  if (table === 'public.npsecom') {
    return {
      tags: detMicroEcom.join(', '),
      formatted: detMicroEcom
        .map((tagsformatted) => `(r.${tagsformatted})`)
        .join(', '),
    };
  }

  if (table === 'public.npsloja') {
    return {
      tags: detMicroLoja.join(', '),
      formatted: detMicroLoja
        .map((tagsformatted) => `(r.${tagsformatted})`)
        .join(', '),
    };
  }
}
