// utilizada para padronizar as datas da base
export function normalizeDate(date) {
  if (!date) return null;
  if (date instanceof Date) {
    return date;
  }
  return new Date(date);
}
