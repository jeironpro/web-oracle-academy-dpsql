/**
 * Lógica del visor. Funciones puras, testeables en Node.
 */

/**
 * Busca un archivo en el manifiesto por su ruta.
 * @param {object} manifest Manifiesto completo del curso.
 * @param {string} filePath Ruta relativa del archivo (parámetro ?file=).
 * @returns {{ topic: object, file: object } | null}
 */
export function findFile(manifest, filePath) {
  for (const topic of manifest.topics) {
    const file = topic.files.find((item) => item.path === filePath);
    if (file !== undefined) {
      return { topic, file };
    }
  }
  return null;
}

/**
 * Calcula la paginación (anterior/siguiente) entre los PDF visibles de un tema.
 * @param {object} topic Tema del manifiesto.
 * @param {object} currentFile Archivo que se está visualizando.
 * @returns {{ prev: object | null, next: object | null, position: number | null, total: number }}
 */
export function buildPagination(topic, currentFile) {
  const visible = topic.files.filter((file) => file.type === "pdf" && file.external !== true);
  const index = visible.findIndex((file) => file.path === currentFile.path);
  return {
    prev: index > 0 ? visible[index - 1] : null,
    next: index >= 0 && index < visible.length - 1 ? visible[index + 1] : null,
    position: index >= 0 ? index + 1 : null,
    total: visible.length,
  };
}
