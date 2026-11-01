import { pool } from '../db.js';

const TAMANHO_LOTE = 500;

export async function inserirRespostasEcomEmLote(respostas) {
  if (!Array.isArray(respostas)) {
    throw new TypeError('As respostas devem ser um array.');
  }

  if (respostas.length === 0) {
    return {
      inseridas: 0,
      atualizadas: 0,
    };
  }

  let inseridas = 0;
  let atualizadas = 0;

  for (let inicio = 0; inicio < respostas.length; inicio += TAMANHO_LOTE) {
    const lote = respostas.slice(inicio, inicio + TAMANHO_LOTE);
    const valores = [];

    const placeholders = lote.map((resposta, indice) => {
      const offset = indice * 20;

      valores.push(
        resposta.orderid,
        resposta.name,
        resposta.email,
        resposta.date,
        resposta.store,
        resposta.delivery,
        resposta.coupon,
        resposta.nps,
        resposta.detmacro,
        resposta.det_atendimento,
        resposta.det_pagamento,
        resposta.det_siteapp,
        resposta.det_retirada,
        resposta.det_entrega,
        resposta.det_preco,
        resposta.det_produto,
        resposta.det_justif,
        resposta.tags,
        resposta.neut_prom_macro,
        resposta.neut_prom_justif,
      );

      return `(${Array.from(
        { length: 20 },
        (_, i) => `$${offset + i + 1}`,
      ).join(', ')})`;
    });

    const sql = `
      INSERT INTO public.npsecom (
        orderid,
        name,
        email,
        date,
        store,
        delivery,
        coupon,
        nps,
        detmacro,
        det_atendimento,
        det_pagamento,
        det_siteapp,
        det_retirada,
        det_entrega,
        det_preco,
        det_produto,
        det_justif,
        tags,
        neut_prom_macro,
        neut_prom_justif
      )
      VALUES ${placeholders.join(', ')}
      ON CONFLICT (orderid) DO UPDATE SET
        name = EXCLUDED.name,
        email = EXCLUDED.email,
        date = EXCLUDED.date,
        store = EXCLUDED.store,
        delivery = EXCLUDED.delivery,
        coupon = EXCLUDED.coupon,
        nps = EXCLUDED.nps,
        detmacro = EXCLUDED.detmacro,
        det_atendimento = EXCLUDED.det_atendimento,
        det_pagamento = EXCLUDED.det_pagamento,
        det_siteapp = EXCLUDED.det_siteapp,
        det_retirada = EXCLUDED.det_retirada,
        det_entrega = EXCLUDED.det_entrega,
        det_preco = EXCLUDED.det_preco,
        det_produto = EXCLUDED.det_produto,
        det_justif = EXCLUDED.det_justif,
        tags = EXCLUDED.tags,
        neut_prom_macro = EXCLUDED.neut_prom_macro,
        neut_prom_justif = EXCLUDED.neut_prom_justif
      RETURNING (xmax = 0) AS inserida;
    `;

    const resultado = await pool.query(sql, valores);

    for (const linha of resultado.rows) {
      if (linha.inserida) {
        inseridas++;
      } else {
        atualizadas++;
      }
    }
  }

  return {
    inseridas,
    atualizadas,
  };
}
