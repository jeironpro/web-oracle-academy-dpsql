/**
 * Utilidades de DOM.
 *
 * No se usa innerHTML (regla de JAVASCRIPT_RULES): todo el contenido
 * dinámico se construye con createElement + textContent.
 */

/**
 * Crea un elemento con clase, texto, atributos y atributos ARIA.
 * @param {string} tag Etiqueta del elemento.
 * @param {{className?: string, text?: string, attributes?: Record<string, string>, aria?: Record<string, string>}} options
 * @returns {HTMLElement}
 */
export function createElement(tag, { className = "", text = "", attributes = {}, aria = {} } = {}) {
  const element = document.createElement(tag);
  if (className !== "") {
    element.className = className;
  }
  if (text !== "") {
    element.textContent = text;
  }
  for (const [name, value] of Object.entries(attributes)) {
    element.setAttribute(name, value);
  }
  for (const [name, value] of Object.entries(aria)) {
    element.setAttribute(`aria-${name}`, value);
  }
  return element;
}

/** Elimina todos los hijos de un nodo. */
export function clearNode(node) {
  while (node.firstChild !== null) {
    node.removeChild(node.firstChild);
  }
}
