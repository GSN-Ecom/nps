// base public
import ecomRespostasDia from '../../../src/data/ecomRespostasDia.json';
import lojaRespostasDia from '../../../src/data/lojaFRespostasDia.json';
import stores from '../../../src/data/stores_SN_Ecom.json';
import { dateRange } from '../../services/normalizeDate';
import { filterDate } from '../filterDate';
import { storeReviews } from './storeReviews';

export async function npsStore(date, typeBusiness) {
  const base =
    typeBusiness === 'Ecom'
      ? ecomRespostasDia.rows[0].dados
      : lojaRespostasDia.rows[0].dados;
  const { startBefore, endBefore } = dateRange(date.inicio, date.fim);

  let range = await filterDate(base, date.inicio, date.fim);
  let before = await filterDate(base, startBefore, endBefore);

  range = storeReviews(range, stores).sort((a, b) => b.npsCalc - a.npsCalc);
  before = storeReviews(before, stores);

  // filtrado pela data definida no dashboard + comparativo periodo anterior
  const resultado = {
    range,
    before,
  };

  return resultado;
}
