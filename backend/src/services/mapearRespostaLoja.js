import { tableLojaFisica } from './convertTableStructure.js';
import {
  isValidDate,
  isValidRating,
  isValidNroStore,
  isValidPedido,
} from './isValidResposta.js';

export function mapearRespostaLoja(arr) {
  const respostas = {
    validas: [],
    invalidas: [],
  };

  arr.forEach((obj) => {
    const validation = [
      {
        campo: 'nota_NPS',
        valido: isValidRating(obj.nota_NPS),
        motivo: 'Nota inválida',
      },
      {
        campo: 'data',
        valido: isValidDate(obj.data),
        motivo: 'Data inválida',
      },
      {
        campo: 'nroempresa',
        valido: isValidNroStore(obj.nroempresa),
        motivo: 'Código de loja inválido',
      },
      {
        campo: 'pedido',
        valido: isValidPedido(obj.pedido),
        motivo: 'Pedido inválido',
      },
    ];

    const motivos = validation
      .filter((item) => !item.valido)
      .map((item) => item.motivo);

    if (motivos.length > 0) {
      respostas.invalidas.push({
        resposta: obj,
        motivos,
      });
    } else {
      respostas.validas.push(obj);
    }
  });

  respostas.validas = tableLojaFisica(respostas.validas);

  return respostas;
}
