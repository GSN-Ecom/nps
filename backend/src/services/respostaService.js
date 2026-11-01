import { inserirRespostasEcomEmLote } from '../repositories/respostaRepositoryEcom.js';
import { inserirRespostasLojaEmLote } from '../repositories/respostaRepositoryLoja.js';
import { mapearRespostaEcom } from './mapearRespostaEcom.js';
import { mapearRespostaLoja } from './mapearRespostaLoja.js';

export async function importarRespostasEcom(arr) {
  const respostas = mapearRespostaEcom(arr);

  const validas = respostas.validas.length;
  const invalidas = respostas.invalidas.length;

  const resultadoLote = await inserirRespostasEcomEmLote(respostas.validas);

  return {
    validas,
    invalidas,
    inseridas: resultadoLote.inseridas,
    atualizadas: resultadoLote.atualizadas,
    detalhesInvalidos: respostas.invalidas,
  };
}

export async function importarRespostasLoja(arr) {
  const respostas = mapearRespostaLoja(arr);

  const validas = respostas.validas.length;
  const invalidas = respostas.invalidas.length;

  const resultadoLote = await inserirRespostasLojaEmLote(respostas.validas);

  return {
    validas,
    invalidas,
    inseridas: resultadoLote.inseridas,
    atualizadas: resultadoLote.atualizadas,
    detalhesInvalidos: respostas.invalidas,
  };
}
