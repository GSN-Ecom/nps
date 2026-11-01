import { normalizeDate } from './normalizeDate';

export function filterDate(base, inicio, fim) {
  const resultado = base.filter(
    (resp) =>
      normalizeDate(resp.dia) >= inicio && normalizeDate(resp.dia) <= fim,
  );

  return resultado;
}
