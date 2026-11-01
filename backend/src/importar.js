/* eslint-disable preserve-caught-error */
/* eslint-disable no-undef */
import {
  importarRespostasEcom,
  importarRespostasLoja,
} from './services/respostaService.js';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

const TIPOS_ORIGEM = ['ecom', 'loja'];

async function lerArquivo(caminhoArquivo) {
  if (!caminhoArquivo) {
    throw new Error('Informe o caminho do arquivo JSON.');
  }
  const caminhoAbsoluto = path.resolve(caminhoArquivo);
  let conteudo;

  try {
    conteudo = await readFile(caminhoAbsoluto, 'utf8');
  } catch (erro) {
    if (erro.code === 'ENOENT') {
      throw new Error('Arquivo não encontrado.');
    }
    throw erro;
  }

  let dados;

  try {
    dados = JSON.parse(conteudo);
  } catch {
    throw new Error('O arquivo não contém um JSON válido.');
  }

  if (!Array.isArray(dados)) {
    throw new Error('O JSON deve conter um array de respostas.');
  }

  return dados;
}

function validarOrigem(origem) {
  if (!TIPOS_ORIGEM.includes(origem)) {
    throw new Error(`Origem inválida. Utilize: ${TIPOS_ORIGEM.join(' ou ')}.`);
  }

  return origem;
}

async function executarImportacao() {
  const [, , caminhoArquivo, origemInformada] = process.argv;

  try {
    const origem = validarOrigem(origemInformada);
    const dados = await lerArquivo(caminhoArquivo);

    console.log('Arquivo validado com sucesso.');
    console.log('Origem:', origem);
    console.log('Quantidade de registros:', dados.length);

    if (origem === 'ecom') {
      const resultado = await importarRespostasEcom(dados);

      console.log('Resultado da importação:', {
        validas: resultado.validas,
        invalidas: resultado.invalidas,
        inseridas: resultado.inseridas,
        atualizadas: resultado.atualizadas,
      });
    } else if (origem === 'loja') {
      const resultado = await importarRespostasLoja(dados);

      console.log('Resultado da importação:', {
        validas: resultado.validas,
        invalidas: resultado.invalidas,
        inseridas: resultado.inseridas,
        atualizadas: resultado.atualizadas,
      });
    } else {
      throw new Error(
        'A importação de loja física ainda não foi implementada.',
      );
    }
  } catch (erro) {
    console.error('Falha na preparação da importação:', erro.message);
    process.exitCode = 1;
  }
}

executarImportacao();
