export function months(ano) {
  return Array.from({ length: 12 }, (_, index) => {
    const meses = new Date(ano, index, 1)
      .toLocaleString("pt-BR", {
        month: "short",
      })
      .replace(".", "")
      .replace(/^./, (letra) => letra.toUpperCase());

    return meses;
  });
}
