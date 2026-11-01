import { pool } from '../../db.js';

export async function notasGeralPorMes(tableName) {
  const tabelasPermitidas = ['public.npsecom', 'public.npsloja'];

  if (!tabelasPermitidas.includes(tableName)) {
    throw new Error('Nome de tabela inválido.');
  }

  const sql = `
  WITH respostas_mensais AS (
    SELECT
        EXTRACT(MONTH FROM date AT TIME ZONE 'America/Sao_Paulo')::INTEGER AS mes,
        EXTRACT(YEAR FROM date AT TIME ZONE 'America/Sao_Paulo')::INTEGER AS ano,
        nps
    FROM ${tableName}
    WHERE nps BETWEEN 0 AND 10
    ),

    indicadores AS (
        SELECT
            mes,
            ano,
            COUNT(*) FILTER (WHERE nps >= 9) AS promotores,
            COUNT(*) FILTER (WHERE nps BETWEEN 7 AND 8) AS neutros,
            COUNT(*) FILTER (WHERE nps BETWEEN 0 AND 6) AS detratores,
            COUNT(*) AS total_respostas
        FROM respostas_mensais
        GROUP BY ano, mes
    ),

    resultado AS (
        SELECT
            mes,
            ano,
            ROUND(
                100.0 * (promotores - detratores) / NULLIF(total_respostas, 0),
                2
            ) AS nota,
            promotores,
            neutros,
            detratores
        FROM indicadores
    )

    SELECT COALESCE(
        JSONB_AGG(
            JSONB_BUILD_OBJECT(
                'mes', mes,
                'ano', ano,
                'nota', nota,
                'promotores', promotores,
                'neutros', neutros,
                'detratores', detratores
            )
            ORDER BY ano, mes
        ),
        '[]'::jsonb
    ) AS dados
    FROM resultado;
  `;

  const resultado = await pool.query(sql);

  return resultado;
}
