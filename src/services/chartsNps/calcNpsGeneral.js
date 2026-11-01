import ecomRespostasDia from '../../../src/data/ecomRespostasDia.json';
import lojaRespostasDia from '../../../src/data/lojaFRespostasDia.json';
import { dateRange } from '../../services/normalizeDate';
import { filterDate } from '../filterDate';

export async function calcNpsGeneral(date, typeBusiness) {
  const base =
    typeBusiness === 'Ecom'
      ? ecomRespostasDia.rows[0].dados
      : lojaRespostasDia.rows[0].dados;

  const { startBefore, endBefore } = dateRange(date.inicio, date.fim);

  const range = await filterDate(base, date.inicio, date.fim);
  const before = await filterDate(base, startBefore, endBefore);

  const npsResultado = {
    current: Array(11).fill(0),
    before: Array(11).fill(0),
  };

  const sumAnswers = (arr, periodo) => {
    arr.forEach((resp) => {
      resp.nps.forEach((nota, index) => {
        npsResultado[periodo][index] += nota;
      });
    });
  };

  sumAnswers(range, 'current');
  sumAnswers(before, 'before');

  return npsResultado;
}
