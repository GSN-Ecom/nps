import { pool } from '../../db.js';

export async function contarDetratoresMacro(tableName) {
  const tabelasPermitidas = ['public.npsecom', 'public.npsloja'];

  if (!tabelasPermitidas.includes(tableName)) {
    throw new Error('Nome de tabela inválido.');
  }
  const sql = `
  WITH respostas AS (
    SELECT
        EXTRACT(
            YEAR FROM date AT TIME ZONE 'America/Sao_Paulo'
        )::INTEGER AS ano,

        EXTRACT(
            MONTH FROM date AT TIME ZONE 'America/Sao_Paulo'
        )::INTEGER AS mes,

        CASE
            WHEN LOWER(TRIM(detmacro)) IN ('entega', 'entrega')
                THEN 'entrega'
            ELSE LOWER(TRIM(detmacro))
        END AS detmacro

    FROM ${tableName}

    WHERE nps BETWEEN 0 AND 6
      AND NULLIF(TRIM(detmacro), '') IS NOT NULL
    ),

    -- Conta detratores por ano, mês e macro padronizada
    contagem AS (
        SELECT
            ano,
            mes,
            detmacro,
            COUNT(*) AS total
        FROM respostas
        GROUP BY
            ano,
            mes,
            detmacro
    ),

    -- Combinações de ano e macro existentes
    anos_macros AS (
        SELECT DISTINCT
            ano,
            detmacro
        FROM contagem
    ),

    -- Gera os 12 meses, preenchendo meses sem ocorrências com zero
    series_mensais AS (
        SELECT
            am.ano,
            am.detmacro,
            meses.mes,
            COALESCE(c.total, 0) AS total
        FROM anos_macros am

        CROSS JOIN GENERATE_SERIES(1, 12) AS meses(mes)

        LEFT JOIN contagem c
            ON c.ano = am.ano
        AND c.detmacro = am.detmacro
        AND c.mes = meses.mes
    ),

    -- Cria um array mensal para cada macro
    arrays_macro AS (
        SELECT
            ano,
            detmacro,
            ARRAY_AGG(total ORDER BY mes) AS valores
        FROM series_mensais
        GROUP BY
            ano,
            detmacro
    ),

    -- Agrupa as macros em um objeto JSON por ano
    objetos_macro AS (
        SELECT
            ano,
            JSONB_OBJECT_AGG(
                detmacro,
                valores
            ) AS macros
        FROM arrays_macro
        GROUP BY ano
    )

    -- Retorna um array JSON com um objeto por ano
    SELECT COALESCE(
        JSONB_AGG(
            JSONB_BUILD_OBJECT('ano', ano) || macros
            ORDER BY ano
        ),
        '[]'::jsonb
    ) AS dados
    FROM objetos_macro;
`;

  const resultado = await pool.query(sql);

  return resultado;
}
