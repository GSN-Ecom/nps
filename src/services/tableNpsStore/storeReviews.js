import { calcNps } from '../calcNps';
import { countDetractors, getTopDetractors } from '../countDetractors';

export function storeReviews(filteredPeriod, stores) {
  const resultado = [];

  const idStore = stores
    .map((id) => {
      if (id.numStore === 0) return;
      return id.numStore;
    })
    .filter(Boolean);

  idStore.forEach((id) => {
    // construção da base + validação array vazio
    let base = filteredPeriod.filter((resp) => resp.nroempresa === id);
    if (base.length === 0) return;

    let storeName = stores.find(
      (store) => store.numStore === base[0].nroempresa,
    )?.name;

    // Soma das notas e agrupamento em um array
    let notaNPS = Array(11).fill(0);

    base.forEach((resp) =>
      resp.nps.forEach((nota, index) => (notaNPS[index] += nota)),
    );

    let countDet = {
      macro: countDetractors(base, 'detmacro'),
      micro: countDetractors(base, 'detmicro'),
    };

    let detractorsResult = {
      macroResult: getTopDetractors(countDet.macro),
      microResult: getTopDetractors(countDet.micro),
    };

    // construçao do array por loja
    resultado.push({
      storeName,
      nroempresa: base[0].nroempresa,
      nps: notaNPS,
      npsCalc: calcNps(notaNPS),
      detractors: countDet,
      detractorsResult,
    });
  });

  return resultado;
}
