const UNIDADES = ["B", "KB", "MB", "GB"];

/**
 * Formatea un tamaño en bytes a una unidad legible, con separador español.
 * @param {number} bytes
 * @returns {string}
 */
export function formatearTamano(bytes) {
  if (!Number.isFinite(bytes) || bytes < 0) {
    return "—";
  }
  let valor = bytes;
  let indice = 0;
  while (valor >= 1024 && indice < UNIDADES.length - 1) {
    valor /= 1024;
    indice += 1;
  }
  const esEntero = Number.isInteger(valor);
  const decimales = indice === 0 || valor >= 100 || esEntero ? 0 : 1;
  const texto = valor.toLocaleString("es-ES", {
    minimumFractionDigits: decimales,
    maximumFractionDigits: decimales,
  });
  return `${texto} ${UNIDADES[indice]}`;
}

const TIPOS_LEGIBLES = { pdf: "PDF", docx: "DOCX", zip: "ZIP" };

/** Devuelve la etiqueta legible de un tipo de archivo. */
export function tipoLegible(tipo) {
  return TIPOS_LEGIBLES[tipo] ?? tipo.toUpperCase();
}
