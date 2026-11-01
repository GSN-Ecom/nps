// validar data
export function isValidDate(value) {
  if (typeof value !== 'string') return false;

  const isoRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
  if (!isoRegex.test(value)) return false;

  const date = new Date(value);

  return !Number.isNaN(date.getTime()) && date.toISOString() === value;
}

// validar nota
export function isValidRating(nota) {
  if (
    typeof nota !== 'number' ||
    !Number.isInteger(nota) ||
    nota < 0 ||
    nota > 10
  ) {
    return false;
  }

  return true;
}

// validar numero empresa
export function isValidNroStore(value) {
  if (typeof value !== 'number' || !Number.isInteger(value) || value <= 0) {
    return false;
  }

  return true;
}

// validar identificador do pedido
export function isValidPedido(pedido) {
  return (
    (typeof pedido === 'string' || typeof pedido === 'number') &&
    String(pedido).trim() !== ''
  );
}
