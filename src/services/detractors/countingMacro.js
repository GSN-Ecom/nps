import { answersMonth } from "../answersMonth";
import { normalizeDate } from "../normalizeDate";

export function countingMacroDetractors(tags, data, year) {
  const base = answersMonth(data, year);

  const result = tags.map((tag) => ({
    detrator: tag,
    count: Array(12).fill(0),
  }));

  base.forEach((monthData) => {
    monthData.forEach((resp) => {
      if (!resp.det_macro) return;

      const month = normalizeDate(resp.data).getMonth();

      const item = result.find(
        (el) => el.detrator.toLowerCase() === resp.det_macro.toLowerCase(),
      );

      if (item) {
        item.count[month]++;
      }
    });
  });

  return result;
}
