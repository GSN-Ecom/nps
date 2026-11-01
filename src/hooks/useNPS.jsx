const currentYear = new Date().getFullYear();

function normalizeDate(date) {
  if (!date) return null;

  const normalizedDate = date instanceof Date ? date : new Date(date);

  return Number.isNaN(normalizedDate.getTime()) ? null : normalizedDate;
}

function months(ano) {
  return Array.from({ length: 12 }, (_, index) => {
    const mes = new Date(ano, index, 1)
      .toLocaleString('pt-BR', { month: 'short' })
      .replace('.', '')
      .replace(/^./, (letra) => letra.toUpperCase());

    return {
      id: mes,
      detratores: 0,
      neutros: 0,
      promotores: 0,
      nps: 0,
    };
  });
}

// Calcula corte x substituição por loja no mês vigente.
function storeCutReplace(base) {
  const dataAtual = new Date();
  const currMonth = dataAtual.getMonth() + 1;
  const anoAtual = dataAtual.getFullYear();

  let dados = base.filter((e) => e.mes === currMonth && e.ano === anoAtual);

  const totalPedidos = dados.reduce((acc, val) => acc + (val.pedidos ?? 0), 0);

  // Se não houver pedidos, utiliza o mês anterior.
  if (totalPedidos === 0) {
    const mesAnterior = currMonth === 1 ? 12 : currMonth - 1;
    const anoAnterior = currMonth === 1 ? anoAtual - 1 : anoAtual;

    dados = base.filter((e) => e.mes === mesAnterior && e.ano === anoAnterior);
  }

  return dados.map((e) => ({
    store: e.loja,
    corte: e.corteEfetivo ?? 0,
    substituicao: e.substituidos ?? 0,
    pedidos: e.pedidos ?? 0,
    month: dados[0]?.mes ?? currMonth,
  }));
}

function useCorteSubst(baseCorteSubst = [], filterStore) {
  const todasLojas = filterStore?.name === 'Todas as lojas';

  const dadosFiltrados = baseCorteSubst.filter(
    (e) => todasLojas || e.loja === filterStore?.name,
  );

  // Construção dos arrays com dados Y2Y.
  const baseCurYear = {
    label: months(currentYear).map((e) => e.id),
    pedidos: Array(12).fill(0),
    corte: Array(12).fill(0),
    substituicao: Array(12).fill(0),
    lojas: [],
  };

  dadosFiltrados.forEach((e) => {
    if (e.ano !== currentYear) return;

    const index = e.mes - 1;

    if (!Number.isInteger(index) || index < 0 || index > 11) {
      return;
    }

    baseCurYear.pedidos[index] += e.pedidos ?? 0;
    baseCurYear.corte[index] += e.corteEfetivo ?? 0;
    baseCurYear.substituicao[index] += e.substituidos ?? 0;
  });

  // Construção dos dados por loja.
  const storesCutReplace = storeCutReplace(dadosFiltrados);

  return { baseCurYear, storesCutReplace };
}

export { useCorteSubst, normalizeDate };
