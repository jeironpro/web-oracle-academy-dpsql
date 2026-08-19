const ALL_TYPES = "all";

/**
 * Normaliza un texto para búsqueda: minúsculas y sin diacríticos
 * (permite buscar «practica» y encontrar «Práctica»).
 * @param {string} text
 * @returns {string}
 */
export function normalizeText(text) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("es");
}

/**
 * Filtra una lista de archivos por consulta de texto y tipo.
 * Función pura: no toca el DOM.
 * @param {object[]} files Archivos del tema o manifiesto.
 * @param {string} query Texto de búsqueda (sin normalizar).
 * @param {string} type Tipo de archivo: "all" | "pdf" | "docx" | "zip".
 * @param {string} context Texto adicional de contexto (p. ej. título del tema).
 * @returns {object[]}
 */
export function filterFiles(files, query, type, context = "") {
  const normalized = normalizeText(query.trim());
  return files.filter((file) => {
    const matchesType = type === ALL_TYPES || file.type === type;
    if (!matchesType) {
      return false;
    }
    if (normalized === "") {
      return true;
    }
    const text = normalizeText([file.title, file.name, file.lesson ?? "", context].join(" "));
    return text.includes(normalized);
  });
}

/**
 * Filtra el manifiesto completo y devuelve los temas con coincidencias.
 * @param {object} manifest Manifiesto del curso.
 * @param {string} query Texto de búsqueda.
 * @param {string} type Tipo de archivo.
 * @returns {{ topics: object[], total: number }}
 */
export function filterManifest(manifest, query, type) {
  const topics = manifest.topics
    .map((topic) => ({
      ...topic,
      files: filterFiles(topic.files, query, type, topic.title),
    }))
    .filter((topic) => topic.files.length > 0);
  const total = topics.reduce((sum, topic) => sum + topic.files.length, 0);
  return { topics, total };
}
