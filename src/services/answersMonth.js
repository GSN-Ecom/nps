import { normalizeDate } from "./normalizeDate";

export function answersMonth(data, year) {
  const base = data.filter(
    (el) => normalizeDate(el.data).getFullYear() === year,
  );

  const result = Array.from({ length: 12 }, () => []);

  base.map((resp) => {
    let month = normalizeDate(resp.data).getMonth();
    if (month === undefined || month === null) return;

    result[month].push(resp);
  });

  return result;
}
