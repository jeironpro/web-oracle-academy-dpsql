import { loadManifest } from "./services/manifest.js";
import { renderSidebar, renderView } from "./modules/catalog.js";
import { clearNode } from "./utils/dom.js";

const ALL_VIEW = "all";
const SEARCH_DELAY = 150; // ms de debounce al escribir

const elements = {
  panelNav: document.querySelector("#panel-nav"),
  viewContainer: document.querySelector("#view-container"),
  searchInput: document.querySelector("#search-input"),
  searchKey: document.querySelector("#search-key"),
  menuButton: document.querySelector("#menu-button"),
  sidePanel: document.querySelector("#side-panel"),
  backdrop: document.querySelector("#panel-backdrop"),
};

let manifest = null;
let searchTimer = null;
const state = { view: ALL_VIEW, query: "", type: "all" };

async function init() {
  try {
    manifest = await loadManifest();
  } catch (error) {
    showError(error.message);
    return;
  }

  readViewFromHash();
  updateTitle();
  render();

  window.addEventListener("hashchange", () => {
    readViewFromHash();
    updateTitle();
    render();
  });

  // Atajo de teclado: Ctrl/⌘ + K enfoca la búsqueda desde cualquier lugar.
  window.addEventListener("keydown", (event) => {
    const isShortcut = (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k";
    if (isShortcut) {
      event.preventDefault();
      elements.searchInput?.focus();
      elements.searchInput?.select();
      return;
    }
    if (event.key === "Escape" && isPanelOpen()) {
      closePanel();
    }
  });

  // Escape: limpia la consulta si hay texto; si está vacía, suelta el foco.
  elements.searchInput?.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") {
      return;
    }
    if (event.target.value !== "") {
      event.target.value = "";
      state.query = "";
      render();
    } else {
      event.target.blur();
    }
  });

  elements.searchInput?.addEventListener("input", (event) => {
    state.query = event.target.value;
    if (searchTimer !== null) {
      window.clearTimeout(searchTimer);
    }
    searchTimer = window.setTimeout(render, SEARCH_DELAY);
  });

  // Menú hamburguesa: abrir/cerrar el cajón de temas en móvil.
  elements.menuButton?.addEventListener("click", togglePanel);
  elements.backdrop?.addEventListener("click", closePanel);
  window.addEventListener("resize", () => {
    if (!isMobile() && isPanelOpen()) {
      closePanel();
    }
  });
}

/** Lee la vista desde el hash (#all o #topic-<id>). */
function readViewFromHash() {
  const hash = window.location.hash.replace(/^#/, "");
  if (hash === ALL_VIEW || hash === "") {
    state.view = ALL_VIEW;
    return;
  }
  const topicId = hash.replace(/^topic-/, "");
  if (manifest?.topics.some((topic) => topic.id === topicId)) {
    state.view = topicId;
  }
}

/** Selecciona una vista, actualiza el hash (entrada de historial) y renderiza. */
function selectView(view) {
  state.view = view;
  const hash = view === ALL_VIEW ? ALL_VIEW : `topic-${view}`;
  window.location.hash = hash;
  updateTitle();
  render();
  if (isMobile() && isPanelOpen()) {
    closePanel();
  }
}

function render() {
  if (manifest === null) {
    return;
  }
  renderSidebar(elements.panelNav, manifest, state.view, selectView);
  renderView(elements.viewContainer, manifest, state);

  // Conexión de los chips de filtro renderizados en la vista.
  const chips = [...elements.viewContainer.querySelectorAll(".chip")];
  for (const chip of chips) {
    chip.addEventListener("click", () => {
      state.type = chip.dataset.type ?? "all";
      render();
    });
  }
}

function updateTitle() {
  if (manifest === null) {
    return;
  }
  const topic = manifest.topics.find((item) => item.id === state.view);
  document.title =
    topic === undefined
      ? `${manifest.course.title} · Oracle Academy`
      : `${topic.title} · ${manifest.course.title}`;
}

function showError(message) {
  clearNode(elements.viewContainer);
  const paragraph = document.createElement("p");
  paragraph.className = "error";
  paragraph.textContent = message;
  elements.viewContainer.append(paragraph);
}

/** true si la pantalla está en el rango móvil (cajón activo). */
function isMobile() {
  return window.matchMedia("(max-width: 768px)").matches;
}

function isPanelOpen() {
  return document.body.classList.contains("panel-open");
}

function togglePanel() {
  if (isPanelOpen()) {
    closePanel();
  } else {
    openPanel();
  }
}

function openPanel() {
  document.body.classList.add("panel-open");
  if (elements.backdrop !== null) {
    elements.backdrop.hidden = false;
  }
  elements.menuButton?.setAttribute("aria-expanded", "true");
  elements.menuButton?.setAttribute("aria-label", "Cerrar menú de temas");
}

function closePanel() {
  document.body.classList.remove("panel-open");
  if (elements.backdrop !== null) {
    elements.backdrop.hidden = true;
  }
  elements.menuButton?.setAttribute("aria-expanded", "false");
  elements.menuButton?.setAttribute("aria-label", "Abrir menú de temas");
  elements.menuButton?.focus();
}

/** Etiqueta del atajo según plataforma: ⌘ K en macOS, Ctrl K en el resto. */
function labelShortcut() {
  if (elements.searchKey === null) {
    return;
  }
  const isMac = /Mac|iPhone|iPad/.test(navigator.platform ?? navigator.userAgent);
  elements.searchKey.textContent = isMac ? "⌘ K" : "Ctrl K";
}

labelShortcut();
init();
