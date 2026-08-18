/**
 * Utilidades de DOM.
 *
 * No se usa innerHTML (regla de JAVASCRIPT_RULES): todo el contenido
 * dinámico se construye con createElement + textContent.
 */

/**
 * Crea un elemento con clase, texto, atributos y atributos ARIA.
 * @param {string} tag Etiqueta del elemento.
 * @param {{clase?: string, texto?: string, atributos?: Record<string, string>, aria?: Record<string, string>}} opciones
 * @returns {HTMLElement}
 */
export function crearElemento(tag, { clase = "", texto = "", atributos = {}, aria = {} } = {}) {
  const elemento = document.createElement(tag);
  if (clase !== "") {
    elemento.className = clase;
  }
  if (texto !== "") {
    elemento.textContent = texto;
  }
  for (const [nombre, valor] of Object.entries(atributos)) {
    elemento.setAttribute(nombre, valor);
  }
  for (const [nombre, valor] of Object.entries(aria)) {
    elemento.setAttribute(`aria-${nombre}`, valor);
  }
  return elemento;
}

/** Elimina todos los hijos de un nodo. */
export function vaciar(nodo) {
  while (nodo.firstChild !== null) {
    nodo.removeChild(nodo.firstChild);
  }
}
