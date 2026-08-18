import { cargarManifesto } from "./services/manifesto.js";
import { renderizarPanel, renderizarVista } from "./modules/catalogo.js";
import { vaciar } from "./utils/dom.js";

const VISTA_TODOS = "todos";
const RETARDO_BUSQUEDA = 150; // ms de debounce al escribir

const elementos = {
  panel: document.querySelector("#panel-navegacion"),
  contenido: document.querySelector("#vista-contenido"),
  contadorGlobal: document.querySelector("#contador-global"),
  campoBusqueda: document.querySelector("#campo-busqueda"),
};

let manifesto = null;
let temporizadorBusqueda = null;
const estado = { vista: VISTA_TODOS, consulta: "", tipo: "todos" };

async function inicializar() {
  try {
    manifesto = await cargarManifesto();
  } catch (error) {
    mostrarError(error.message);
    return;
  }

  const curso = manifesto.curso;
  if (elementos.contadorGlobal !== null) {
    elementos.contadorGlobal.textContent = `${curso.totalArchivos} archivos · ${curso.totalTemas} temas`;
  }
  leerVistaDesdeHash();
  actualizarTitulo();
  renderizar();

  window.addEventListener("hashchange", () => {
    leerVistaDesdeHash();
    actualizarTitulo();
    renderizar();
  });

  elementos.campoBusqueda?.addEventListener("input", (evento) => {
    estado.consulta = evento.target.value;
    if (temporizadorBusqueda !== null) {
      window.clearTimeout(temporizadorBusqueda);
    }
    temporizadorBusqueda = window.setTimeout(renderizar, RETARDO_BUSQUEDA);
  });
}

/** Lee la vista desde el hash (#todos o #tema-<id>). */
function leerVistaDesdeHash() {
  const hash = window.location.hash.replace(/^#/, "");
  if (hash === VISTA_TODOS || hash === "") {
    estado.vista = VISTA_TODOS;
    return;
  }
  const idTema = hash.replace(/^tema-/, "");
  if (manifesto?.temas.some((tema) => tema.id === idTema)) {
    estado.vista = idTema;
  }
}

/** Selecciona una vista, actualiza el hash (entrada de historial) y renderiza. */
function seleccionarVista(vista) {
  estado.vista = vista;
  const hash = vista === VISTA_TODOS ? VISTA_TODOS : `tema-${vista}`;
  window.location.hash = hash;
  actualizarTitulo();
  renderizar();
}

function renderizar() {
  if (manifesto === null) {
    return;
  }
  renderizarPanel(elementos.panel, manifesto, estado.vista, seleccionarVista);
  renderizarVista(elementos.contenido, manifesto, estado);

  // Conexión de los chips de filtro renderizados en la vista.
  const chips = [...elementos.contenido.querySelectorAll(".chip")];
  for (const chip of chips) {
    chip.addEventListener("click", () => {
      estado.tipo = chip.dataset.tipo ?? "todos";
      renderizar();
    });
  }
}

function actualizarTitulo() {
  if (manifesto === null) {
    return;
  }
  const tema = manifesto.temas.find((item) => item.id === estado.vista);
  document.title =
    tema === undefined
      ? `${manifesto.curso.titulo} · Oracle Academy`
      : `${tema.titulo} · ${manifesto.curso.titulo}`;
}

function mostrarError(mensaje) {
  vaciar(elementos.contenido);
  const parrafo = document.createElement("p");
  parrafo.className = "error";
  parrafo.textContent = mensaje;
  elementos.contenido.append(parrafo);
}

inicializar();
