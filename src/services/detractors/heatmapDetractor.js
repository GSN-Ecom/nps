export function heatmapDetractor(valor, min, max) {
  if (valor === 0) return 'var(--aux-white)';

  const verde = [231, 243, 227];
  const amarelo = [248, 196, 166];
  const vermelho = [253, 155, 155];

  const percentual = Math.max(0, Math.min(1, (valor - min) / (max - min)));

  const inicio = percentual <= 0.5 ? verde : amarelo;
  const fim = percentual <= 0.5 ? amarelo : vermelho;

  const t = percentual <= 0.5 ? percentual * 2 : (percentual - 0.5) * 2;

  const cor = inicio.map((canal, i) =>
    Math.round(canal + (fim[i] - canal) * t),
  );

  return `rgb(${cor[0]}, ${cor[1]}, ${cor[2]})`;
}
