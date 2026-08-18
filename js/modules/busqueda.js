const TIPO_TODOS = "todos";

/**
 * Normaliza un texto para búsqueda: minúsculas y sin diacríticos
 * (permite buscar «practica» y encontrar «Práctica»).
 * @param {string} texto
 * @returns {string}
 */
export function normalizarTexto(texto) {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("es");
}

/**
 * Filtra una lista de archivos por consulta de texto y tipo.
 * Función pura: no toca el DOM.
 * @param {object[]} archivos Archivos del tema o manifiesto.
 * @param {string} consulta Texto de búsqueda (sin normalizar).
 * @param {string} tipo Tipo de archivo: "todos" | "pdf" | "docx" | "zip".
 * @param {string} contexto Texto adicional de contexto (p. ej. título del tema).
 * @returns {object[]}
 */
export function filtrarArchivos(archivos, consulta, tipo, contexto = "") {
  const normalizada = normalizarTexto(consulta.trim());
  return archivos.filter((archivo) => {
    const coincideTipo = tipo === TIPO_TODOS || archivo.tipo === tipo;
    if (!coincideTipo) {
      return false;
    }
    if (normalizada === "") {
      return true;
    }
    const texto = normalizarTexto(
      [archivo.titulo, archivo.nombre, archivo.leccion ?? "", contexto].join(" "),
    );
    return texto.includes(normalizada);
  });
}

/**
 * Filtra el manifiesto completo y devuelve los temas con coincidencias.
 * @param {object} manifesto Manifiesto del curso.
 * @param {string} consulta Texto de búsqueda.
 * @param {string} tipo Tipo de archivo.
 * @returns {{ temas: object[], total: number }}
 */
export function filtrarManifesto(manifesto, consulta, tipo) {
  const temas = manifesto.temas
    .map((tema) => ({
      ...tema,
      archivos: filtrarArchivos(tema.archivos, consulta, tipo, tema.titulo),
    }))
    .filter((tema) => tema.archivos.length > 0);
  const total = temas.reduce((suma, tema) => suma + tema.archivos.length, 0);
  return { temas, total };
}
