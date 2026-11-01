export function sumByRespType(sliceStart, SliceEnd, arr) {
  // array passado diretamente sem o indice nps
  if (!arr.nps) {
    return arr
      .slice(sliceStart, SliceEnd)
      .reduce((acc, value) => acc + value, 0);
  }

  return arr.nps
    .slice(sliceStart, SliceEnd)
    .reduce((acc, value) => acc + value, 0);
}
