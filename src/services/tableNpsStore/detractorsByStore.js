export const detractorsByStore = (arr) => {
  if (!arr.microResult.length) return;

  const count = (base) => {
    return base
      .map((e) => {
        return `${e.termo} (${e.quantidade})`;
      })
      .join(', ');
  };

  return `${count(arr.macroResult)} > ${count(arr.microResult)}`;
};
