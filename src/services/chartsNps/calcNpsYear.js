// base
import npsMonthEcom from '../../../src/data/ecomNotasGeralPorMes.json';
import npsMonthLojaF from '../../../src/data/lojaFNotasGeralPorMes.json';

export async function calcNpsYear(year, typeBusiness) {
  const base = typeBusiness === 'Ecom' ? npsMonthEcom : npsMonthLojaF;

  const current = base.rows[0].dados.filter((obj) => obj.ano === year);
  const before = base.rows[0].dados.filter((obj) => obj.ano === year - 1);

  const resultado = (current, before) => {
    const currentYear = Array(12).fill(0);
    const beforeYear = Array(12).fill(0);

    current.forEach((e) => {
      currentYear[e.mes - 1] = Math.round(e.nota);
    });

    before.forEach((e) => {
      beforeYear[e.mes - 1] = Math.round(e.nota);
    });

    return {
      current: currentYear,
      before: beforeYear,
    };
  };

  const dados = resultado(current, before);

  return dados;
}
