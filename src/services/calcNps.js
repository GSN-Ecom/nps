export function calcNps(notas) {
  if (notas.length === 0 || notas.length < 11)
    return console.log('array inválido');

  let prom = 0;
  let neut = 0;
  let detr = 0;

  notas.forEach((e, i) => {
    if (i <= 6) detr += e;
    if (i >= 7 && i <= 8) neut += e;
    if (i >= 9) prom += e;
  });

  const calc = Math.round(((prom - detr) / (prom + neut + detr)) * 100);
  return !Number.isNaN(calc) ? calc : '-';
}

// if (!(notas.length !== 0) && detrator + neutro + promotor > 0) {
//   return Math.round(
//     ((promotor - detrator) / (detrator + neutro + promotor)) * 100,
//   );
// }
