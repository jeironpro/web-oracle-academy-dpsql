import { cargarManifesto, urlDeArchivo, urlDeVisor } from "./services/manifesto.js";
import { construirPaginacion, encontrarArchivo } from "./modules/visor.js";
import { formatearTamano, tipoLegible } from "./utils/format.js";

const TIPO_VISIBLE = "pdf";

const elementos = {
  visorPdf: document.querySelector("#visor-pdf"),
  visorFallo: document.querySelector("#visor-fallo"),
  etiqueta: document.querySelector("#etiqueta-archivo"),
  titulo: document.querySelector("#titulo-archivo"),
  meta: document.querySelector("#meta-archivo"),
  descarga: document.querySelector("#enlace-descarga"),
  migaTema: document.querySelector("#miga-tema"),
  migaArchivo: document.querySelector("#miga-archivo"),
  anterior: document.querySelector("#enlace-anterior"),
  siguiente: document.querySelector("#enlace-siguiente"),
  posicion: document.querySelector("#posicion-documento"),
};

async function inicializar() {
  const parametros = new URLSearchParams(window.location.search);
  const rutaArchivo = parametros.get("archivo");
  const idTema = parametros.get("tema");

  if (rutaArchivo === null || idTema === null) {
    mostrarSinDocumento("Falta el parámetro del documento en la URL.");
    return;
  }

  let manifesto;
  try {
    manifesto = await cargarManifesto();
  } catch (error) {
    mostrarSinDocumento(error.message);
    return;
  }

  const encontrado = encontrarArchivo(manifesto, rutaArchivo);
  if (encontrado === null) {
    mostrarSinDocumento("El documento no existe en el curso.");
    return;
  }

  const { tema, archivo } = encontrado;
  const esVisible = archivo.tipo === TIPO_VISIBLE && archivo.externo !== true;

  document.title = `${archivo.titulo} · ${tema.titulo} · Oracle Academy`;
  if (elementos.etiqueta !== null) {
    elementos.etiqueta.textContent = `${tema.titulo} · ${tipoLegible(archivo.tipo)}`;
  }
  if (elementos.titulo !== null) {
    elementos.titulo.textContent = archivo.titulo;
  }
  if (elementos.meta !== null) {
    elementos.meta.textContent = `${archivo.nombre} · ${tipoLegible(archivo.tipo)} · ${formatearTamano(archivo.tamano)}`;
  }
  if (elementos.migaTema !== null) {
    elementos.migaTema.textContent = tema.titulo;
    elementos.migaTema.setAttribute("href", `index.html#tema-${tema.id}`);
  }
  if (elementos.migaArchivo !== null) {
    elementos.migaArchivo.textContent = archivo.titulo;
  }
  if (elementos.descarga !== null) {
    elementos.descarga.setAttribute("href", urlDeArchivo(archivo));
    elementos.descarga.setAttribute("download", archivo.nombre);
  }

  if (esVisible && elementos.visorPdf !== null) {
    elementos.visorPdf.setAttribute("src", urlDeArchivo(archivo));
  } else if (elementos.visorFallo !== null) {
    elementos.visorFallo.hidden = false;
  }

  montarPaginacion(tema, archivo);
}

function montarPaginacion(tema, archivoActual) {
  const { anterior, siguiente, posicion, total } = construirPaginacion(tema, archivoActual);

  if (elementos.posicion !== null && posicion !== null) {
    elementos.posicion.textContent = `${posicion} / ${total}`;
  }
  if (elementos.anterior !== null && anterior !== null) {
    elementos.anterior.hidden = false;
    elementos.anterior.setAttribute("href", urlDeVisor(anterior, tema.id));
    elementos.anterior.setAttribute("aria-label", `Anterior: ${anterior.titulo}`);
  }
  if (elementos.siguiente !== null && siguiente !== null) {
    elementos.siguiente.hidden = false;
    elementos.siguiente.setAttribute("href", urlDeVisor(siguiente, tema.id));
    elementos.siguiente.setAttribute("aria-label", `Siguiente: ${siguiente.titulo}`);
  }
}

function mostrarSinDocumento(mensaje) {
  if (elementos.titulo !== null) {
    elementos.titulo.textContent = "Documento no disponible";
  }
  if (elementos.meta !== null) {
    elementos.meta.textContent = mensaje;
  }
  if (elementos.visorFallo !== null) {
    elementos.visorFallo.hidden = false;
  }
  if (elementos.descarga !== null) {
    elementos.descarga.hidden = true;
  }
}

inicializar();
