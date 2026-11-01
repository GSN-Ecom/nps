import { pool } from '../../db.js';

export async function contarRespostasPorDia(tableName, detMicro) {
  const sql = `
    WITH respostas AS (
    SELECT
        (date AT TIME ZONE 'America/Sao_Paulo')::date AS dia,
        store AS nroempresa,
        nps,
        detmacro,
        ${detMicro.tags}
    FROM ${tableName}
    ),

    -- Combinações de dia e empresa
    grupos AS (
        SELECT DISTINCT
            dia,
            nroempresa
        FROM respostas
    ),

    -- Conta as ocorrências de cada termo de detmacro
    macros_contagem AS (
        SELECT
            dia,
            nroempresa,
            TRIM(detmacro) AS termo,
            COUNT(*) AS quantidade
        FROM respostas
        WHERE NULLIF(TRIM(detmacro), '') IS NOT NULL
        GROUP BY
            dia,
            nroempresa,
            TRIM(detmacro)
    ),

    -- Concatena os termos de detmacro com suas quantidades
    macros AS (
        SELECT
            dia,
            nroempresa,
            STRING_AGG(
                termo || ' (' || quantidade || ')',
                ', ' ORDER BY termo
            ) AS detmacro
        FROM macros_contagem
        GROUP BY
            dia,
            nroempresa
    ),

    -- Separa os motivos dos campos micro das respostas detratoras
    micros_separados AS (
        SELECT
            r.dia,
            r.nroempresa,
            TRIM(split.motivo) AS motivo
        FROM respostas r

        CROSS JOIN LATERAL (
            VALUES
            ${detMicro.formatted}
                
        ) AS campos(texto)

        CROSS JOIN LATERAL
            REGEXP_SPLIT_TO_TABLE(
                COALESCE(campos.texto, ''),
                ','
            ) AS split(motivo)

        WHERE r.nps BETWEEN 0 AND 6
          AND TRIM(split.motivo) <> ''
    ),

    -- Conta as ocorrências de cada motivo micro
    micros_contagem AS (
        SELECT
            dia,
            nroempresa,
            motivo,
            COUNT(*) AS quantidade
        FROM micros_separados
        GROUP BY
            dia,
            nroempresa,
            motivo
    ),

    -- Concatena os motivos micro com suas quantidades
    micros_agrupados AS (
        SELECT
            dia,
            nroempresa,
            STRING_AGG(
                motivo || ' (' || quantidade || ')',
                ', ' ORDER BY motivo
            ) AS detmicro
        FROM micros_contagem
        GROUP BY
            dia,
            nroempresa
    ),

    -- Monta os dados de cada objeto
    resultado AS (
        SELECT
            g.dia,
            g.nroempresa,

            -- Array de 11 posições: notas de 0 a 10
            ARRAY(
                SELECT COUNT(r.nps)
                FROM GENERATE_SERIES(0, 10) AS notas(nota)
                LEFT JOIN respostas r
                    ON r.dia = g.dia
                  AND r.nroempresa = g.nroempresa
                  AND r.nps = notas.nota
                GROUP BY notas.nota
                ORDER BY notas.nota
            ) AS nps,

            ma.detmacro,
            mi.detmicro

        FROM grupos g

        LEFT JOIN macros ma
            ON ma.dia = g.dia
          AND ma.nroempresa = g.nroempresa

        LEFT JOIN micros_agrupados mi
            ON mi.dia = g.dia
          AND mi.nroempresa = g.nroempresa
    )

    -- Retorna um único array JSON de objetos
    SELECT COALESCE(
        JSONB_AGG(
            JSONB_BUILD_OBJECT(
                'dia', dia,
                'nroempresa', nroempresa,
                'nps', nps,
                'detmacro', detmacro,
                'detmicro', detmicro
            )
            ORDER BY dia, nroempresa
        ),
        '[]'::jsonb
    ) AS dados
    FROM resultado;
  `;

  const resultado = await pool.query(sql);

  return resultado;
}
