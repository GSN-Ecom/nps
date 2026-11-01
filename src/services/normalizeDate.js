// // utilizada para padronizar as datas da base
export function normalizeDate(date) {
  if (!date) return null;

  const d = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(d.getTime())) return null;
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export function dateRange(inicio, fim) {
  const quantDias = Math.floor((fim - inicio) / (1000 * 60 * 60 * 24) + 1);

  const endBefore = new Date(inicio);
  endBefore.setDate(endBefore.getDate() - 1);

  const startBefore = new Date(inicio);
  startBefore.setDate(startBefore.getDate() - quantDias);

  return { startBefore, endBefore };
}

// Utilizada para padronizar as datas da base de respostas completas
export function normalizeDateVerb(date) {
  if (!date) return '';

  const d = date instanceof Date ? date : new Date(date);

  if (Number.isNaN(d.getTime())) return '';

  return new Date(
    d.getFullYear(),
    d.getMonth(),
    d.getDate(),
  ).toLocaleDateString('pt-BR');
}
