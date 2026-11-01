import { normalizeDate } from "../normalizeDate";

export function microDetractors(data, year) {
  const base = data.filter(
    (el) => normalizeDate(el.data).getFullYear() === year,
  );

  return [
    ...new Map(
      base.flatMap((resp) =>
        Object.entries(resp)
          .filter(
            ([key, value]) =>
              key.startsWith("det_") &&
              key !== "det_macro" &&
              key !== "det_justif" &&
              value,
          )
          .flatMap(([, value]) =>
            value
              .split(/[;,]/)
              .map((micro) => micro.trim().toLowerCase())
              .filter(Boolean)
              .map((micro) => [
                `${resp.det_macro.toLowerCase()}|${micro}`,
                {
                  macro: resp.det_macro.toLowerCase(),
                  micro,
                },
              ]),
          ),
      ),
    ).values(),
  ].reduce((acc, { macro, micro }) => {
    const item = acc.find((el) => el.macro === macro);

    if (item) {
      item.micro.push(micro);
    } else {
      acc.push({
        macro,
        micro: [micro],
      });
    }

    return acc;
  }, []);
}
