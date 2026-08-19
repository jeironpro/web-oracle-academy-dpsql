const MANIFEST_PATH = "data/manifest.json";

/**
 * Carga el manifiesto del curso.
 * @returns {Promise<object>}
 */
export async function loadManifest() {
    let response;
    try {
        response = await fetch(MANIFEST_PATH, { headers: { Accept: "application/json" } });
    } catch {
        throw new Error("No se pudo conectar con el manifiesto del curso.");
    }
    if (!response.ok) {
        throw new Error(`No se pudo cargar el manifiesto (${response.status}).`);
    }
    return response.json();
}

/** Devuelve la URL relativa codificada de un archivo. */
export function fileUrl(file) {
    return encodeURI(file.path);
}

/** Devuelve la URL del visor para un archivo de un tema. */
export function viewerUrl(file, topicId) {
    const params = new URLSearchParams({ file: file.path, topic: topicId });
    return `visor.html?${params.toString()}`;
}
