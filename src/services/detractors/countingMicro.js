import { answersMonth } from "../answersMonth";
import { normalizeDate } from "../normalizeDate";

export function countingMicroDetractors(tagsGroup, data, year) {
  const base = answersMonth(data, year);

  const result = tagsGroup.map((tag) => ({
    macro: tag.macro,
    ...Object.fromEntries(tag.micro.map((text) => [text, Array(12).fill(0)])),
  }));

  base.forEach((monthData) => {
    monthData.forEach((resp) => {
      if (!resp.det_macro) return;

      const month = normalizeDate(resp.data).getMonth();

      const item = result.find(
        (el) => el.macro.toLowerCase() === resp.det_macro.toLowerCase(),
      );

      if (!item) return;

      Object.keys(item)
        .filter((key) => key !== "macro")
        .forEach((micro) => {
          const found = Object.entries(resp)
            .filter(
              ([key, value]) =>
                key.startsWith("det_") &&
                key !== "det_macro" &&
                key !== "det_justif" &&
                value,
            )
            .some(([, value]) =>
              value
                .split(/[;,]/)
                .map((text) => text.trim().toLowerCase())
                .includes(micro.toLowerCase()),
            );

          if (found) {
            item[micro][month]++;
          }
        });
    });
  });

  return result;
}
