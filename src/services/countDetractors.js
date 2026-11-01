export function countDetractors(dados, campo) {
  const contagem = new Map();

  dados.forEach((obj) => {
    if (!obj[campo]) return;

    obj[campo].split(/[;,]/).forEach((item) => {
      const texto = item.trim().toLowerCase();

      if (!texto) return;

      const match = texto.match(/^(.*?)\s*\((\d+)\)\s*$/);

      const termo = (match ? match[1] : texto).trim();
      const quantidade = match ? Number(match[2]) : 1;

      if (!termo) return;

      contagem.set(termo, (contagem.get(termo) || 0) + quantidade);
    });
  });

  return Array.from(contagem, ([termo, quantidade]) => ({
    termo,
    quantidade,
  }));
}

export function getTopDetractors(dados) {
  if (!dados?.length) return [];

  const maiorQuantidade = Math.max(...dados.map((item) => item.quantidade));

  return dados.filter((item) => item.quantidade === maiorQuantidade);
}
