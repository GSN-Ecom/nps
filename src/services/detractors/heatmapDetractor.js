export function heatmapDetractor(valor, min, max) {
  if (min === max) return "var(--aux-white)";
  const colorCalc = Math.round((255 * (valor - min)) / (max - min));

  return `rgb(255, ${255 - colorCalc / 1.5}, ${255 - colorCalc / 1.5})`;
}
