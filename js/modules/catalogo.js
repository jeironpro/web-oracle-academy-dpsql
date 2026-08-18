import { crearElemento, vaciar } from "../utils/dom.js";
import { formatearTamano, tipoLegible } from "../utils/format.js";
import { urlDeArchivo, urlDeVisor } from "../services/manifesto.js";

const ICONOS = { pdf: "description", docx: "description", zip: "folder_zip" };
const ICONO_DEFECTO = "insert_drive_file";

/**
 * Renderiza el índice del curso a partir de los temas filtrados.
 * @param {HTMLElement} contenedor
 * @param {object[]} temas
 */
export function renderizarIndice(contenedor, temas) {
  vaciar(contenedor);
  for (const tema of temas) {
    contenedor.append(renderizarTema(tema));
  }
}

function renderizarTema(tema) {
  const idTitulo = `titulo-${tema.id}`;
  const seccion = crearElemento("section", {
    clase: "tema",
    atributos: { id: `tema-${tema.id}`, "aria-labelledby": idTitulo },
  });

  const cabecera = crearElemento("h2", { clase: "tema__cabecera" });
  const numero = crearElemento("span", {
    clase: "tema__numero",
    texto: String(tema.numero).padStart(2, "0"),
  });
  const titulo = crearElemento("span", {
    clase: "tema__titulo",
    texto: tema.titulo,
    atributos: { id: idTitulo },
  });
  const conteo = crearElemento("span", {
    clase: "tema__conteo",
    texto: `${tema.archivos.length} ${tema.archivos.length === 1 ? "archivo" : "archivos"}`,
  });
  cabecera.append(numero, titulo, conteo);

  const lista = crearElemento("ul", { clase: "tema__lista" });
  for (const archivo of tema.archivos) {
    const item = crearElemento("li", { clase: "tema__item" });
    item.append(renderizarArchivo(archivo, tema.id));
    lista.append(item);
  }

  seccion.append(cabecera, lista);
  return seccion;
}

function renderizarArchivo(archivo, idTema) {
  const articulo = crearElemento("article", { clase: "archivo" });
  const esExterno = archivo.externo === true;
  const esVisible = archivo.tipo === "pdf" && !esExterno;

  const enlace = crearElemento("a", { clase: "archivo__enlace" });
  if (esExterno) {
    enlace.setAttribute("href", archivo.urlExterna);
    enlace.setAttribute("target", "_blank");
    enlace.setAttribute("rel", "noopener");
  } else if (esVisible) {
    enlace.setAttribute("href", urlDeVisor(archivo, idTema));
  } else {
    enlace.setAttribute("href", urlDeArchivo(archivo));
    enlace.setAttribute("download", archivo.nombre);
  }

  const icono = crearElemento("span", {
    clase: "archivo__icono material-symbols-outlined",
    texto: ICONOS[archivo.tipo] ?? ICONO_DEFECTO,
    aria: { hidden: "true" },
  });

  const cuerpo = crearElemento("span", { clase: "archivo__cuerpo" });
  const titulo = crearElemento("span", { clase: "archivo__titulo", texto: archivo.titulo });
  const meta = crearElemento("span", {
    clase: "archivo__meta",
    texto: `${archivo.nombre} · ${tipoLegible(archivo.tipo)} · ${formatearTamano(archivo.tamano)}`,
  });
  cuerpo.append(titulo, meta);

  const iconoEnlace = crearElemento("span", {
    clase: "archivo__icono-enlace material-symbols-outlined",
    texto: esExterno ? "open_in_new" : esVisible ? "chevron_right" : "download",
    aria: { hidden: "true" },
  });

  enlace.append(icono, cuerpo, iconoEnlace);
  articulo.append(enlace);
  return articulo;
}
