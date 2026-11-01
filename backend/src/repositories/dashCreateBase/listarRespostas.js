import { pool } from '../../db.js';

export async function listarRespostas(tableName) {
  const tabelasPermitidas = ['public.npsecom', 'public.npsloja'];

  if (!tabelasPermitidas.includes(tableName)) {
    throw new Error('Nome de tabela inválido.');
  }

  const sql = `
        SELECT COALESCE(
            JSONB_AGG(
                JSONB_BUILD_OBJECT(
                    'orderid', t.orderid, 'name',
                    (
                        SELECT STRING_AGG(
                            CASE
                                WHEN LENGTH(palavra) <= 3 THEN palavra
                                ELSE LEFT(palavra, 3)
                                    || REPEAT('*', LENGTH(palavra) - 3)
                            END,
                            ' '
                            ORDER BY posicao
                        )
                        FROM REGEXP_SPLIT_TO_TABLE(
                            TRIM(t.name),
                            '\\s+'
                        ) WITH ORDINALITY AS partes(palavra, posicao)
                    ),

                    'email',
                    CASE
                        WHEN t.email IS NULL THEN NULL

                        WHEN POSITION('@' IN t.email) = 0 THEN
                            LEFT(t.email, 3)
                            || REPEAT(
                                '*',
                                GREATEST(LENGTH(t.email) - 3, 0)
                            )

                        ELSE
                            LEFT(SPLIT_PART(t.email, '@', 1), 3)
                            || REPEAT(
                                '*',
                                GREATEST(
                                    LENGTH(SPLIT_PART(t.email, '@', 1)) - 3,
                                    0
                                )
                            )
                            || SUBSTRING(
                                t.email FROM POSITION('@' IN t.email)
                            )
                    END,

                    'date', t.date,
                    'store', t.store,
                    'delivery', t.delivery,
                    'nps', t.nps,

                    'detrator',
                    CASE
                        WHEN t.nps BETWEEN 0 AND 6 THEN
                            JSONB_BUILD_OBJECT(
                                'macro', t.detmacro,
                                'micro', micros.micro,
                                'justif', t.det_justif
                            )
                        ELSE NULL
                    END,

                    'neutPromo',
                    CASE
                        WHEN t.nps BETWEEN 7 AND 10 THEN
                            JSONB_BUILD_OBJECT(
                                'macro', t.detmacro,
                                'justif', t.det_justif
                            )
                        ELSE NULL
                    END
                )
                ORDER BY t.date
            ),
            '[]'::jsonb
        ) AS dados

        FROM ${tableName} AS t

        LEFT JOIN LATERAL (
            SELECT
                STRING_AGG(
                    campo.valor,
                    ', ' ORDER BY campo.chave
                ) AS micro
            FROM (
                SELECT
                    j.key AS chave,
                    NULLIF(TRIM(j.value #>> '{}'), '') AS valor
                FROM JSONB_EACH(TO_JSONB(t)) AS j(key, value)
                WHERE j.key LIKE 'det\\_%' ESCAPE '\\'
                AND j.key <> 'det_justif'
                AND NULLIF(TRIM(j.value #>> '{}'), '') IS NOT NULL
            ) AS campo
        ) AS micros ON TRUE;

    `;

  const resultado = await pool.query(sql);

  return resultado;
}
