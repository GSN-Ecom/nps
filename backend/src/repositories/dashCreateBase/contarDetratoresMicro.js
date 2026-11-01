import { pool } from '../../db.js';

export async function contarDetratoresMicro(tableName, detMicro) {
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
        END AS detmacro,

        nps,
        ${detMicro.tags}

      FROM ${tableName}
      WHERE nps BETWEEN 0 AND 6
        AND NULLIF(TRIM(detmacro), '') IS NOT NULL
    ),

    
    micros_separados AS (
        SELECT
            r.ano,
            r.mes,
            r.detmacro,

            LOWER(
            REGEXP_REPLACE(
                REGEXP_REPLACE(
                    TRIM(micro.motivo),
                    '_',
                    ' ',
                    'g'
                ),
                '[[:space:]]+',
                ' ',
                'g'
            )
        ) AS detmicro

        FROM respostas r

        CROSS JOIN LATERAL (
            VALUES
                ${detMicro.formatted}
        ) AS campos(texto)

        CROSS JOIN LATERAL
            REGEXP_SPLIT_TO_TABLE(
                COALESCE(campos.texto, ''),
                '[,;]'
            ) AS micro(motivo)

        WHERE NULLIF(
            TRIM(micro.motivo),
            ''
        ) IS NOT NULL
    ),


    contagem AS (
      SELECT
        ano,
        mes,
        detmacro,
        detmicro,
        COUNT(*) AS total
      FROM micros_separados
      WHERE detmicro <> ''
      GROUP BY
        ano,
        mes,
        detmacro,
        detmicro
    ),

    anos_macros_micros AS (
      SELECT DISTINCT
        ano,
        detmacro,
        detmicro
      FROM contagem
    ),

    series_mensais AS (
      SELECT
        amm.ano,
        amm.detmacro,
        amm.detmicro,
        meses.mes,
        COALESCE(c.total, 0) AS total

      FROM anos_macros_micros amm

      CROSS JOIN GENERATE_SERIES(1, 12) AS meses(mes)

      LEFT JOIN contagem c
        ON c.ano = amm.ano
        AND c.detmacro = amm.detmacro
        AND c.detmicro = amm.detmicro
        AND c.mes = meses.mes
    ),

    arrays_micro AS (
      SELECT
        ano,
        detmacro,
        detmicro,
        ARRAY_AGG(total ORDER BY mes) AS valores
      FROM series_mensais
      GROUP BY
        ano,
        detmacro,
        detmicro
    ),

    objetos_micro AS (
      SELECT
        ano,
        detmacro,
        JSONB_OBJECT_AGG(
          detmicro,
          valores
        ) AS micros
      FROM arrays_micro
      GROUP BY
        ano,
        detmacro
    )

    SELECT COALESCE(
      JSONB_AGG(
        JSONB_BUILD_OBJECT(
          'ano', ano,
          'detmacro', detmacro
        ) || micros
        ORDER BY ano, detmacro
      ),
      '[]'::jsonb
    ) AS dados
    FROM objetos_micro;
  `;

  const resultado = await pool.query(sql);

  return resultado;
}
