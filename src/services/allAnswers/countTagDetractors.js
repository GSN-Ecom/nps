export async function countTagDetractors(dados) {
  const reclamacoes = dados.flatMap((obj) =>
    (obj.detrator?.micro || '')
      .split(/[;,]/)
      .map((item) => item.trim().toLowerCase())
      .filter(Boolean),
  );

  const contagem = reclamacoes.reduce((acc, reclamacao) => {
    acc[reclamacao] = (acc[reclamacao] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(contagem)
    .map(([detractor, qtd]) => ({
      detractor,
      qtd,
    }))
    .sort((a, b) => b.qtd - a.qtd);
}
