import { cargarManifesto } from "./services/manifesto.js";
import { renderizarIndice } from "./modules/catalogo.js";
import { filtrarManifesto } from "./modules/busqueda.js";
import { vaciar } from "./utils/dom.js";

const TIPO_TODOS = "todos";
const RETARDO_BUSQUEDA = 150; // ms de debounce al escribir

const contenedorIndice = document.querySelector("#indice");
const campoBusqueda = document.querySelector("#campo-busqueda");
const botonesFiltro = [...document.querySelectorAll(".chip")];
const contadorResultados = document.querySelector("#contador-resultados");
const estadoVacio = document.querySelector("#estado-vacio");
const resumenCurso = document.querySelector("#resumen-curso");

let manifesto = null;
let tipoSeleccionado = TIPO_TODOS;
let temporizadorBusqueda = null;

async function inicializar() {
  try {
    manifesto = await cargarManifesto();
  } catch (error) {
    mostrarError(error.message);
    return;
  }

  const curso = manifesto.curso;
  if (resumenCurso !== null) {
    resumenCurso.textContent = `${curso.totalTemas} temas · ${curso.totalArchivos} archivos`;
  }
  document.title = `${curso.titulo} · Oracle Academy`;
  aplicarFiltros();

  campoBusqueda?.addEventListener("input", () => {
    if (temporizadorBusqueda !== null) {
      window.clearTimeout(temporizadorBusqueda);
    }
    temporizadorBusqueda = window.setTimeout(aplicarFiltros, RETARDO_BUSQUEDA);
  });

  for (const boton of botonesFiltro) {
    boton.addEventListener("click", () => {
      tipoSeleccionado = boton.dataset.tipo ?? TIPO_TODOS;
      for (const otro of botonesFiltro) {
        otro.setAttribute("aria-pressed", String(otro === boton));
      }
      aplicarFiltros();
    });
  }
}

function aplicarFiltros() {
  const consulta = campoBusqueda?.value ?? "";
  const { temas, total } = filtrarManifesto(manifesto, consulta, tipoSeleccionado);
  renderizarIndice(contenedorIndice, temas);

  const hayResultados = temas.length > 0;
  if (estadoVacio !== null) {
    estadoVacio.hidden = hayResultados;
  }
  if (contadorResultados !== null) {
    contadorResultados.textContent = hayResultados
      ? `${total} ${total === 1 ? "archivo" : "archivos"} · ${temas.length} ${temas.length === 1 ? "tema" : "temas"}`
      : "";
  }
}

function mostrarError(mensaje) {
  vaciar(contenedorIndice);
  const parrafo = document.createElement("p");
  parrafo.className = "error";
  parrafo.textContent = mensaje;
  contenedorIndice.append(parrafo);
}

inicializar();
