// calculo NPS escala -100 a 100

function calcNPS(arr, detrator, neutro, promotor) {
  if (arr.length !== 0) {
    let prom = 0;
    let neut = 0;
    let detr = 0;

    arr.forEach((e, index) => {
      if (index <= 6) {
        detr += e;
      }

      if (index >= 7 && index <= 8) {
        neut += e;
      }

      if (index >= 9) {
        prom += e;
      }
    });

    const calc = Math.round(((prom - detr) / (prom + neut + detr)) * 100);
    return !Number.isNaN(calc) ? calc : "-";
  }

  if (!(arr.length !== 0) && detrator + neutro + promotor > 0) {
    return Math.round(
      ((promotor - detrator) / (detrator + neutro + promotor)) * 100,
    );
  }
}

export default calcNPS;
