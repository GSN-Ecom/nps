// import ecomFullAnswers from '../../../src/data/ecomListarRespostas.json';
// import lojaFullAnswers from '../../../src/data/lojaFListarRespostas.json';
// import { normalizeDate } from '../normalizeDate';

// export async function fullAnswers(date, typeBusiness) {
//   const answers =
//     typeBusiness === 'Ecom'
//       ? ecomFullAnswers.rows[0].dados
//       : lojaFullAnswers.rows[0].dados;

//   let range = await answers.filter(
//     (resp) =>
//       normalizeDate(resp.date) >= date.inicio &&
//       normalizeDate(resp.date) <= date.fim,
//   );

//   return range;
// }

import { normalizeDate } from '../normalizeDate.js';

const cacheRespostas = new Map();

async function carregarRespostas(typeBusiness) {
  const arquivo =
    typeBusiness === 'Ecom'
      ? 'ecomListarRespostas.json'
      : 'lojaFListarRespostas.json';

  // Reutiliza o carregamento se o arquivo já foi solicitado
  if (!cacheRespostas.has(arquivo)) {
    const carregamento = fetch(`${import.meta.env.BASE_URL}data/${arquivo}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `Erro ao carregar ${arquivo}: HTTP ${response.status}`,
          );
        }

        return response.json();
      })
      .then((json) => {
        const dados = json?.rows?.[0]?.dados;

        if (!Array.isArray(dados)) {
          throw new Error(
            `Formato inválido no arquivo ${arquivo}: esperado rows[0].dados como array.`,
          );
        }

        return dados;
      })
      .catch((error) => {
        // Permite tentar novamente se o carregamento falhar
        cacheRespostas.delete(arquivo);
        throw error;
      });

    cacheRespostas.set(arquivo, carregamento);
  }

  return cacheRespostas.get(arquivo);
}

export async function fullAnswers(date, typeBusiness) {
  const answers = await carregarRespostas(typeBusiness);

  return answers.filter((resp) => {
    const dataResposta = normalizeDate(resp.date);

    return dataResposta >= date.inicio && dataResposta <= date.fim;
  });
}
