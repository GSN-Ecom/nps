import { normalizeDate } from "../normalizeDate";

// recebe o parametro de ano para controlar as tags exibidas
export function macroDetractors(data, year) {
  const base = data.filter(
    (el) => normalizeDate(el.data).getFullYear() === year,
  );

  return [
    ...new Set(
      base.map((resp) => resp.det_macro.toLowerCase()).filter(Boolean),
    ),
  ].sort();
}
