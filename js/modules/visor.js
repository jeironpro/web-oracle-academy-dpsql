/**
 * Lógica del visor. Funciones puras, testeables en Node.
 */

/**
 * Busca un archivo en el manifiesto por su ruta.
 * @param {object} manifesto Manifiesto completo del curso.
 * @param {string} rutaArchivo Ruta relativa del archivo (parámetro ?archivo=).
 * @returns {{ tema: object, archivo: object } | null}
 */
export function encontrarArchivo(manifesto, rutaArchivo) {
  for (const tema of manifesto.temas) {
    const archivo = tema.archivos.find((item) => item.ruta === rutaArchivo);
    if (archivo !== undefined) {
      return { tema, archivo };
    }
  }
  return null;
}

/**
 * Calcula la paginación (anterior/siguiente) entre los PDF visibles de un tema.
 * @param {object} tema Tema del manifiesto.
 * @param {object} archivoActual Archivo que se está visualizando.
 * @returns {{ anterior: object | null, siguiente: object | null, posicion: number | null, total: number }}
 */
export function construirPaginacion(tema, archivoActual) {
  const visibles = tema.archivos.filter(
    (archivo) => archivo.tipo === "pdf" && archivo.externo !== true,
  );
  const indice = visibles.findIndex((archivo) => archivo.ruta === archivoActual.ruta);
  return {
    anterior: indice > 0 ? visibles[indice - 1] : null,
    siguiente: indice >= 0 && indice < visibles.length - 1 ? visibles[indice + 1] : null,
    posicion: indice >= 0 ? indice + 1 : null,
    total: visibles.length,
  };
}
