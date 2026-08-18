const RUTA_MANIFIESTO = "data/manifesto.json";

/**
 * Carga el manifiesto del curso.
 * @returns {Promise<object>}
 */
export async function cargarManifesto() {
  let respuesta;
  try {
    respuesta = await fetch(RUTA_MANIFIESTO, { headers: { Accept: "application/json" } });
  } catch {
    throw new Error("No se pudo conectar con el manifiesto del curso.");
  }
  if (!respuesta.ok) {
    throw new Error(`No se pudo cargar el manifiesto (${respuesta.status}).`);
  }
  return respuesta.json();
}

/** Devuelve la URL relativa codificada de un archivo. */
export function urlDeArchivo(archivo) {
  return encodeURI(archivo.ruta);
}

/** Devuelve la URL del visor para un archivo de un tema. */
export function urlDeVisor(archivo, idTema) {
  const parametros = new URLSearchParams({ archivo: archivo.ruta, tema: idTema });
  return `visor.html?${parametros.toString()}`;
}
