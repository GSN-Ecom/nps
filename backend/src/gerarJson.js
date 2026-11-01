/* eslint-disable no-undef */
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { tagsDetratoresMicro } from './services/tagsDetratoresMicro.js';
import { notasGeralPorMes } from './repositories/dashCreateBase/notasGeralPorMes.js';
import { contarRespostasPorDia } from './repositories/dashCreateBase/contarRespostasPorDia.js';
import { contarDetratoresMacro } from './repositories/dashCreateBase/contarDetratoresMacro.js';
import { contarDetratoresMicro } from './repositories/dashCreateBase/contarDetratoresMicro.js';
import { listarRespostas } from './repositories/dashCreateBase/listarRespostas.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pastaDestino = path.resolve(__dirname, '../../src/data');

const tbEcom = 'public.npsecom';
const tbLoja = 'public.npsloja';

const tarefas = [
  {
    arquivo: 'ecomRespostasDia.json',
    executar: async () => {
      return contarRespostasPorDia(tbEcom, tagsDetratoresMicro(tbEcom));
    },
  },
  {
    arquivo: 'ecomNotasGeralPorMes.json',
    executar: async () => {
      return notasGeralPorMes(tbEcom);
    },
  },
  {
    arquivo: 'ecomcontarDetratoresMacro.json',
    executar: async () => {
      return contarDetratoresMacro(tbEcom);
    },
  },
  {
    arquivo: 'ecomContarDetratoresMicro.json',
    executar: async () => {
      return contarDetratoresMicro(tbEcom, tagsDetratoresMicro(tbEcom));
    },
  },
  {
    arquivo: 'ecomListarRespostas.json',
    executar: async () => {
      return listarRespostas(tbEcom);
    },
  },
  {
    arquivo: 'lojaFRespostasDia.json',
    executar: async () => {
      return contarRespostasPorDia(tbLoja, tagsDetratoresMicro(tbLoja));
    },
  },
  {
    arquivo: 'lojaFNotasGeralPorMes.json',
    executar: async () => {
      return notasGeralPorMes(tbLoja);
    },
  },
  {
    arquivo: 'lojaFcontarDetratoresMacro.json',
    executar: async () => {
      return contarDetratoresMacro(tbLoja);
    },
  },
  {
    arquivo: 'lojaFContarDetratoresMicro.json',
    executar: async () => {
      return contarDetratoresMicro(tbLoja, tagsDetratoresMicro(tbLoja));
    },
  },
  {
    arquivo: 'lojaFListarRespostas.json',
    executar: async () => {
      return listarRespostas(tbLoja);
    },
  },
];

async function gerarArquivoJson({ arquivo, executar }) {
  console.log(`Gerando ${arquivo}...`);

  const dados = await executar();

  const caminhoArquivo = path.join(pastaDestino, arquivo);

  await writeFile(caminhoArquivo, JSON.stringify(dados, null, 2), 'utf8');

  console.log(`Arquivo gerado: ${arquivo}`);
}

async function gerarJson() {
  const { pool } = await import('./db.js');

  try {
    await mkdir(pastaDestino, { recursive: true });

    for (const tarefa of tarefas) {
      await gerarArquivoJson(tarefa);
    }

    console.log(`Processo concluído: ${tarefas.length} arquivos JSON gerados.`);
  } finally {
    await pool.end();
  }
}

gerarJson().catch((error) => {
  console.error('Erro ao gerar os JSONs:', error);
  process.exitCode = 1;
});
