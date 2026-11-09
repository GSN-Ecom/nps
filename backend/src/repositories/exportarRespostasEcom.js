import { pool } from '../db.js';

export async function exportarRespostasEcomPorPeriodo(dataInicial, dataFinal) {
  const sql = `
    SELECT
      (date AT TIME ZONE 'America/Sao_Paulo')::date AS data,
      CASE WHEN nps = 0 THEN 1 ELSE 0 END AS "0",
      CASE WHEN nps = 1 THEN 1 ELSE 0 END AS "1",
      CASE WHEN nps = 2 THEN 1 ELSE 0 END AS "2",
      CASE WHEN nps = 3 THEN 1 ELSE 0 END AS "3",
      CASE WHEN nps = 4 THEN 1 ELSE 0 END AS "4",
      CASE WHEN nps = 5 THEN 1 ELSE 0 END AS "5",
      CASE WHEN nps = 6 THEN 1 ELSE 0 END AS "6",
      CASE WHEN nps = 7 THEN 1 ELSE 0 END AS "7",
      CASE WHEN nps = 8 THEN 1 ELSE 0 END AS "8",
      CASE WHEN nps = 9 THEN 1 ELSE 0 END AS "9",
      CASE WHEN nps = 10 THEN 1 ELSE 0 END AS "10"
    FROM public.npsecom
    WHERE date >= ($1::date::timestamp AT TIME ZONE 'America/Sao_Paulo')
      AND date < (($2::date + 1)::timestamp AT TIME ZONE 'America/Sao_Paulo')
    ORDER BY date;
  `;

  const resultado = await pool.query(sql, [dataInicial, dataFinal]);

  return resultado.rows;
}
