import { crearElemento, vaciar } from "../utils/dom.js";
import { formatearTamano, tipoLegible } from "../utils/format.js";
import { urlDeArchivo, urlDeVisor } from "../services/manifesto.js";
import { filtrarArchivos, filtrarManifesto } from "./busqueda.js";

const VISTA_TODOS = "todos";
const ICONOS = { pdf: "description", docx: "description", zip: "folder_zip" };
const ICONO_DEFECTO = "insert_drive_file";
const CLASES_TARJETA = { pdf: "tarjeta--pdf", docx: "tarjeta--docx", zip: "tarjeta--zip" };
const CLASES_CHIP = { pdf: "chip--pdf", docx: "chip--docx", zip: "chip--zip" };

/** Rellena un número de tema con ceros: 2 -> "02". */
function formatearNumero(numero) {
  return String(numero).padStart(2, "0");
}

/** Renderiza el panel lateral de temas y devuelve el elemento. */
export function renderizarPanel(nav, manifesto, vistaActiva, alSeleccionar) {
  vaciar(nav);

  const botonTodos = crearItemPanel(
    { id: VISTA_TODOS, titulo: "Todos los temas", conteo: manifesto.curso.totalArchivos },
    vistaActiva,
  );
  botonTodos.addEventListener("click", () => alSeleccionar(VISTA_TODOS));
  nav.append(botonTodos);

  for (const tema of manifesto.temas) {
    const boton = crearItemPanel(
      {
        id: tema.id,
        numero: formatearNumero(tema.numero),
        titulo: tema.titulo,
        conteo: tema.totalArchivos,
      },
      vistaActiva,
    );
    boton.addEventListener("click", () => alSeleccionar(tema.id));
    nav.append(boton);
  }
}

function crearItemPanel({ id, numero = "", titulo, conteo }, vistaActiva) {
  const boton = crearElemento("button", {
    clase: "panel__item",
    atributos: { type: "button", id: `tema-${id}`, "aria-pressed": String(vistaActiva === id) },
  });
  if (numero !== "") {
    boton.append(crearElemento("span", { clase: "panel__item-numero", texto: numero }));
  }
  boton.append(
    crearElemento("span", { clase: "panel__item-titulo", texto: titulo }),
    crearElemento("span", { clase: "panel__item-conteo", texto: String(conteo) }),
  );
  return boton;
}

/** Renderiza la vista actual (tema individual o todos) dentro del contenedor. */
export function renderizarVista(contenedor, manifesto, estado) {
  vaciar(contenedor);
  const tema =
    estado.vista === VISTA_TODOS
      ? null
      : (manifesto.temas.find((item) => item.id === estado.vista) ?? null);
  if (tema === null) {
    contenedor.append(renderizarTodos(manifesto, estado));
  } else {
    contenedor.append(renderizarTema(tema, estado));
  }
}

function renderizarTema(tema, estado) {
  const archivos = filtrarArchivos(tema.archivos, estado.consulta, estado.tipo, tema.titulo);
  const vista = crearElemento("div");

  const cabecera = crearElemento("header", { clase: "vista-tema__cabecera" });
  const etiqueta = crearElemento("p", {
    clase: "eyebrow",
    texto: `Tema ${formatearNumero(tema.numero)}`,
  });
  const fila = crearElemento("div", { clase: "vista-tema__fila" });
  fila.append(
    crearElemento("span", {
      clase: "vista-tema__numero",
      texto: formatearNumero(tema.numero),
      aria: { hidden: "true" },
    }),
    crearElemento("h1", { clase: "vista-tema__titulo", texto: tema.titulo }),
  );
  const conteo = crearElemento("p", {
    clase: "vista-tema__conteo",
    texto: `${tema.totalArchivos} archivos en este tema`,
  });
  cabecera.append(etiqueta, fila, conteo);

  const herramientas = crearElemento("div", { clase: "vista-tema__herramientas" });
  herramientas.append(renderizarFiltros(estado.tipo));
  const contador = crearElemento("p", {
    clase: "vista-tema__contador",
    texto: `${archivos.length} ${archivos.length === 1 ? "archivo" : "archivos"}`,
    atributos: { role: "status", "aria-live": "polite" },
  });
  herramientas.append(contador);

  vista.append(cabecera, herramientas);
  vista.append(
    archivos.length > 0
      ? renderizarGrilla(archivos, tema.id)
      : renderizarVacio("Sin resultados", "Ningún archivo coincide con la búsqueda o el filtro."),
  );
  return vista;
}

function renderizarTodos(manifesto, estado) {
  const { temas, total } = filtrarManifesto(manifesto, estado.consulta, estado.tipo);
  const vista = crearElemento("div");

  const cabecera = crearElemento("header", { clase: "vista-tema__cabecera" });
  cabecera.append(crearElemento("p", { clase: "eyebrow", texto: "Todos los temas" }));
  const fila = crearElemento("div", { clase: "vista-tema__fila" });
  fila.append(crearElemento("h1", { clase: "vista-tema__titulo", texto: "El curso, completo" }));
  cabecera.append(fila);
  const conteo = crearElemento("p", {
    clase: "vista-tema__conteo",
    texto: `${manifesto.curso.totalArchivos} archivos · ${manifesto.curso.totalTemas} temas`,
  });
  cabecera.append(conteo);
  vista.append(cabecera);

  const herramientas = crearElemento("div", { clase: "vista-tema__herramientas" });
  herramientas.append(renderizarFiltros(estado.tipo));
  const contador = crearElemento("p", {
    clase: "vista-tema__contador",
    texto: `${total} ${total === 1 ? "archivo" : "archivos"} · ${temas.length} ${temas.length === 1 ? "tema" : "temas"}`,
    atributos: { role: "status", "aria-live": "polite" },
  });
  herramientas.append(contador);
  vista.append(herramientas);

  if (temas.length === 0) {
    vista.append(
      renderizarVacio("Sin resultados", "Ningún archivo coincide con la búsqueda o el filtro."),
    );
    return vista;
  }

  for (const tema of temas) {
    const seccion = crearElemento("section", { clase: "todos__tema" });
    const cabeceraTema = crearElemento("h2", { clase: "todos__cabecera" });
    cabeceraTema.append(
      crearElemento("span", { clase: "todos__numero", texto: formatearNumero(tema.numero) }),
      crearElemento("span", { clase: "todos__titulo", texto: tema.titulo }),
      crearElemento("span", {
        clase: "todos__conteo",
        texto: `${tema.archivos.length} ${tema.archivos.length === 1 ? "archivo" : "archivos"}`,
      }),
    );
    seccion.append(cabeceraTema, renderizarGrilla(tema.archivos, tema.id));
    vista.append(seccion);
  }
  return vista;
}

/** Chips de filtro por tipo (pill con punto de color). */
function renderizarFiltros(tipoActivo) {
  const contenedor = crearElemento("div", { clase: "filtros", atributos: { role: "group" } });
  const opciones = [
    { tipo: "todos", etiqueta: "Todos" },
    { tipo: "pdf", etiqueta: "PDF" },
    { tipo: "docx", etiqueta: "DOCX" },
    { tipo: "zip", etiqueta: "ZIP" },
  ];
  for (const opcion of opciones) {
    const chip = crearElemento("button", {
      clase: `chip ${CLASES_CHIP[opcion.tipo] ?? ""}`,
      atributos: {
        type: "button",
        "data-tipo": opcion.tipo,
        "aria-pressed": String(tipoActivo === opcion.tipo),
      },
    });
    chip.append(
      crearElemento("span", { clase: "chip__punto", aria: { hidden: "true" } }),
      crearElemento("span", { texto: opcion.etiqueta }),
    );
    contenedor.append(chip);
  }
  return contenedor;
}

/** Grilla de tarjetas de archivo. */
function renderizarGrilla(archivos, idTema) {
  const grilla = crearElemento("div", { clase: "grilla" });
  for (const archivo of archivos) {
    grilla.append(renderizarTarjeta(archivo, idTema));
  }
  return grilla;
}

function renderizarTarjeta(archivo, idTema) {
  const tarjeta = crearElemento("article", {
    clase: `tarjeta ${CLASES_TARJETA[archivo.tipo] ?? "tarjeta--pdf"}`,
  });
  const esExterno = archivo.externo === true;
  const esVisible = archivo.tipo === "pdf" && !esExterno;
  const url = esExterno ? archivo.urlExterna : urlDeArchivo(archivo);

  const chip = crearElemento("span", {
    clase: "tarjeta__chip material-symbols-outlined",
    texto: ICONOS[archivo.tipo] ?? ICONO_DEFECTO,
    aria: { hidden: "true" },
  });

  const enlace = crearElemento("a", { clase: "tarjeta__enlace" });
  if (esVisible) {
    enlace.setAttribute("href", urlDeVisor(archivo, idTema));
  } else {
    enlace.setAttribute("href", url);
    enlace.setAttribute("download", archivo.nombre);
    if (esExterno) {
      enlace.setAttribute("target", "_blank");
      enlace.setAttribute("rel", "noopener");
    }
  }
  const cuerpo = crearElemento("span", { clase: "tarjeta__cuerpo" });
  const metaTexto = `${archivo.nombre} · ${tipoLegible(archivo.tipo)} · ${formatearTamano(archivo.tamano)}`;
  cuerpo.append(
    crearElemento("h3", { clase: "tarjeta__titulo", texto: archivo.titulo }),
    crearElemento("p", { clase: "tarjeta__meta", texto: metaTexto }),
  );
  enlace.append(cuerpo);

  const accion = crearElemento("a", { clase: "btn btn--soft btn--sm tarjeta__accion" });
  accion.setAttribute("href", url);
  accion.setAttribute("download", archivo.nombre);
  accion.setAttribute("aria-label", `Descargar ${archivo.titulo}`);
  if (esExterno) {
    accion.setAttribute("target", "_blank");
    accion.setAttribute("rel", "noopener");
  }
  accion.textContent = "Descargar";

  tarjeta.append(chip, enlace, accion);
  return tarjeta;
}

function renderizarVacio(titulo, texto) {
  const vacio = crearElemento("div", { clase: "vacio" });
  vacio.append(
    crearElemento("h2", { clase: "vacio__titulo", texto: titulo }),
    crearElemento("p", { clase: "vacio__texto", texto }),
  );
  return vacio;
}
