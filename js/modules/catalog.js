import { createElement, clearNode } from "../utils/dom.js";
import { formatSize, readableType } from "../utils/format.js";
import { fileUrl, viewerUrl } from "../services/manifest.js";
import { filterFiles, filterManifest } from "./search.js";

const ALL_VIEW = "all";
const ICONS = { pdf: "description", docx: "description", zip: "folder_zip" };
const DEFAULT_ICON = "insert_drive_file";
const CARD_CLASSES = { pdf: "card--pdf", docx: "card--docx", zip: "card--zip" };
const CHIP_CLASSES = { pdf: "chip--pdf", docx: "chip--docx", zip: "chip--zip" };

/** Rellena un número de tema con ceros: 2 -> "02". */
function formatNumber(number) {
    return String(number).padStart(2, "0");
}

/** Renderiza el panel lateral de temas y devuelve el elemento. */
export function renderSidebar(nav, manifest, activeView, onSelect) {
    clearNode(nav);

    const allButton = createPanelItem(
        {
            id: ALL_VIEW,
            title: "Todos los temas",
            count: manifest.course.totalFiles,
        },
        activeView,
    );
    allButton.addEventListener("click", () => onSelect(ALL_VIEW));
    nav.append(allButton);

    for (const topic of manifest.topics) {
        const button = createPanelItem(
            {
                id: topic.id,
                number: formatNumber(topic.number),
                title: topic.title,
                count: topic.totalFiles,
            },
            activeView,
        );
        button.addEventListener("click", () => onSelect(topic.id));
        nav.append(button);
    }
}

function createPanelItem({ id, number = "", title, count }, activeView) {
    const button = createElement("button", {
        className: "side-panel__item",
        attributes: {
            type: "button",
            id: `topic-${id}`,
            "aria-pressed": String(activeView === id),
        },
    });
    if (number !== "") {
        button.append(
            createElement("span", { className: "side-panel__item-number", text: number }),
        );
    }
    button.append(
        createElement("span", { className: "side-panel__item-title", text: title }),
        createElement("span", { className: "side-panel__item-count", text: String(count) }),
    );
    return button;
}

/** Renderiza la vista actual (tema individual o todos) dentro del contenedor. */
export function renderView(container, manifest, state) {
    clearNode(container);
    const topic =
        state.view === ALL_VIEW
            ? null
            : (manifest.topics.find((item) => item.id === state.view) ?? null);
    if (topic === null) {
        container.append(renderAllTopics(manifest, state));
    } else {
        container.append(renderTopicView(topic, state));
    }
}

function renderTopicView(topic, state) {
    const files = filterFiles(topic.files, state.query, state.type, topic.title);
    const view = createElement("div");

    const header = createElement("header", { className: "topic-view__header" });
    const label = createElement("p", {
        className: "eyebrow",
        text: `Tema ${formatNumber(topic.number)}`,
    });
    const row = createElement("div", { className: "topic-view__row" });
    row.append(
        createElement("span", {
            className: "topic-view__number",
            text: formatNumber(topic.number),
            aria: { hidden: "true" },
        }),
        createElement("h1", { className: "topic-view__title", text: topic.title }),
    );
    const count = createElement("p", {
        className: "topic-view__count",
        text: `${topic.totalFiles} archivos en este tema`,
    });
    header.append(label, row, count);

    const tools = renderFilterBar(
        state.type,
        `${files.length} ${files.length === 1 ? "archivo" : "archivos"}`,
    );
    const jumpOptionsList = jumpOptions(files);
    if (jumpOptionsList.length > 0) {
        tools.prepend(renderJumpMenu(jumpOptionsList, topic.id));
    }

    view.append(header, tools);
    view.append(
        files.length > 0
            ? renderGrid(files, topic.id)
            : renderEmpty("Sin resultados", "Ningún archivo coincide con la búsqueda o el filtro."),
    );
    return view;
}

function renderAllTopics(manifest, state) {
    const { topics, total } = filterManifest(manifest, state.query, state.type);
    const view = createElement("div");

    const header = createElement("header", { className: "topic-view__header" });
    header.append(createElement("p", { className: "eyebrow", text: "Todos los temas" }));
    const row = createElement("div", { className: "topic-view__row" });
    row.append(createElement("h1", { className: "topic-view__title", text: "El curso, completo" }));
    header.append(row);
    header.append(
        createElement("p", {
            className: "topic-view__count",
            text: `${manifest.course.totalFiles} archivos · ${manifest.course.totalTopics} temas`,
        }),
    );
    view.append(header);

    view.append(
        renderFilterBar(
            state.type,
            `${total} ${total === 1 ? "archivo" : "archivos"} · ${topics.length} ${topics.length === 1 ? "tema" : "temas"}`,
        ),
    );

    if (topics.length === 0) {
        view.append(
            renderEmpty("Sin resultados", "Ningún archivo coincide con la búsqueda o el filtro."),
        );
        return view;
    }

    for (const topic of topics) {
        const section = createElement("section", { className: "all-topics__topic" });
        const sectionHeader = createElement("h2", { className: "all-topics__header" });
        sectionHeader.append(
            createElement("span", {
                className: "all-topics__number",
                text: formatNumber(topic.number),
            }),
            createElement("span", { className: "all-topics__title", text: topic.title }),
            createElement("span", {
                className: "all-topics__count",
                text: `${topic.files.length} ${topic.files.length === 1 ? "archivo" : "archivos"}`,
            }),
        );
        section.append(sectionHeader, renderGrid(topic.files, topic.id));
        view.append(section);
    }
    return view;
}

/** Barra de herramientas de una vista: filtros por tipo + contador de resultados. */
function renderFilterBar(type, counterText) {
    const tools = createElement("div", { className: "topic-view__tools" });
    tools.append(renderFilters(type));
    tools.append(
        createElement("p", {
            className: "topic-view__counter",
            text: counterText,
            attributes: { role: "status", "aria-live": "polite" },
        }),
    );
    return tools;
}

/** Chips de filtro por tipo (pill con punto de color). */
function renderFilters(activeType) {
    const container = createElement("div", { className: "filters", attributes: { role: "group" } });
    const options = [
        { type: "all", label: "Todos" },
        { type: "pdf", label: "PDF" },
        { type: "docx", label: "DOCX" },
        { type: "zip", label: "ZIP" },
    ];
    for (const option of options) {
        const chip = createElement("button", {
            className: `chip ${CHIP_CLASSES[option.type] ?? ""}`,
            attributes: {
                type: "button",
                "data-type": option.type,
                "aria-pressed": String(activeType === option.type),
            },
        });
        chip.append(
            createElement("span", { className: "chip__dot", aria: { hidden: "true" } }),
            createElement("span", { text: option.label }),
        );
        container.append(chip);
    }
    return container;
}

/** Grilla de tarjetas de archivo (con id por índice para el salto). */
function renderGrid(files, topicId) {
    const grid = createElement("div", { className: "grid" });
    files.forEach((file, index) => {
        grid.append(renderCard(file, topicId, index));
    });
    return grid;
}

function renderCard(file, topicId, index) {
    const card = createElement("article", {
        className: `card ${CARD_CLASSES[file.type] ?? "card--pdf"}`,
        attributes: { id: `file-${topicId}-${index}` },
    });
    const isExternal = file.external === true;
    const isViewable = file.type === "pdf" && !isExternal;
    const url = isExternal ? file.externalUrl : fileUrl(file);

    const chip = createElement("span", {
        className: "card__chip material-symbols-outlined",
        text: ICONS[file.type] ?? DEFAULT_ICON,
        aria: { hidden: "true" },
    });

    const link = createElement("a", { className: "card__link" });
    if (isViewable) {
        link.setAttribute("href", viewerUrl(file, topicId));
    } else {
        link.setAttribute("href", url);
        link.setAttribute("download", file.name);
        if (isExternal) {
            link.setAttribute("target", "_blank");
            link.setAttribute("rel", "noopener");
        }
    }
    const body = createElement("span", { className: "card__body" });
    const metaText = `${file.name} · ${readableType(file.type)} · ${formatSize(file.size)}`;
    body.append(
        createElement("h3", { className: "card__title", text: file.title }),
        createElement("p", { className: "card__meta", text: metaText }),
    );
    link.append(body);

    const action = createElement("a", { className: "btn btn--soft btn--sm card__action" });
    action.setAttribute("href", url);
    action.setAttribute("download", file.name);
    action.setAttribute("aria-label", `Descargar ${file.title}`);
    if (isExternal) {
        action.setAttribute("target", "_blank");
        action.setAttribute("rel", "noopener");
    }
    action.textContent = "Descargar";

    card.append(chip, link, action);
    return card;
}

/**
 * Opciones del menú de salto: lecciones y prácticas (PDF y DOCX, no externos)
 * con su índice en la grilla, para poder desplazarse hasta su tarjeta.
 * @param {object[]} files Archivos ya filtrados de la vista.
 * @returns {{ file: object, index: number }[]}
 */
export function jumpOptions(files) {
    const options = [];
    files.forEach((file, index) => {
        if ((file.type === "pdf" || file.type === "docx") && file.external !== true) {
            options.push({ file, index });
        }
    });
    return options;
}

/**
 * Menú desplegable para saltar a una lección o práctica del tema.
 * Listbox accesible: flechas, Inicio/Fin, Enter, Escape, clic fuera para cerrar.
 */
function renderJumpMenu(options, topicId) {
    const control = createElement("div", { className: "jump" });
    const button = createElement("button", {
        className: "jump__button",
        attributes: { type: "button", "aria-haspopup": "listbox", "aria-expanded": "false" },
    });
    button.append(
        createElement("span", {
            className: "material-symbols-outlined jump__icon",
            text: "menu_book",
            aria: { hidden: "true" },
        }),
        createElement("span", { text: "Ir a lección o práctica" }),
        createElement("span", {
            className: "material-symbols-outlined jump__chevron",
            text: "expand_more",
            aria: { hidden: "true" },
        }),
    );

    const menu = createElement("ul", {
        className: "jump__menu",
        attributes: { role: "listbox", "aria-label": "Lecciones y prácticas del tema", hidden: "" },
    });
    const optionElements = [];
    options.forEach(({ file }, index) => {
        const option = createElement("li", {
            className: "jump__option",
            attributes: {
                role: "option",
                id: `jump-option-${topicId}-${index}`,
                "data-index": String(index),
                "aria-selected": "false",
            },
        });
        option.append(
            createElement("span", { className: "jump__option-title", text: file.title }),
            createElement("span", {
                className: `jump__option-type jump__option-type--${file.type}`,
                text: file.type.toUpperCase(),
            }),
        );
        optionElements.push(option);
        menu.append(option);
    });
    control.append(button, menu);

    let isOpen = false;
    let active = 0;

    function mark(index) {
        active = (index + optionElements.length) % optionElements.length;
        optionElements.forEach((option, i) => {
            option.setAttribute("aria-selected", String(i === active));
        });
        menu.setAttribute("aria-activedescendant", optionElements[active].id);
        optionElements[active].scrollIntoView({ block: "nearest" });
    }

    function open() {
        isOpen = true;
        button.setAttribute("aria-expanded", "true");
        menu.hidden = false;
        mark(active);
    }

    function close(returnFocus = true) {
        if (!isOpen) {
            return;
        }
        isOpen = false;
        button.setAttribute("aria-expanded", "false");
        menu.hidden = true;
        menu.removeAttribute("aria-activedescendant");
        if (returnFocus) {
            button.focus();
        }
    }

    function select(index) {
        const target = document.getElementById(`file-${topicId}-${index}`);
        close();
        if (target === null) {
            return;
        }
        target.scrollIntoView({ behavior: "smooth", block: "center" });
        target.classList.add("card--highlighted");
        window.setTimeout(() => target.classList.remove("card--highlighted"), 1800);
    }

    button.addEventListener("click", () => {
        if (isOpen) {
            close();
        } else {
            open();
        }
    });

    button.addEventListener("keydown", (event) => {
        if (event.key === "ArrowDown") {
            event.preventDefault();
            open();
        } else if (event.key === "Escape") {
            close(false);
        }
    });

    menu.addEventListener("keydown", (event) => {
        switch (event.key) {
            case "ArrowDown":
                event.preventDefault();
                mark(active + 1);
                break;
            case "ArrowUp":
                event.preventDefault();
                mark(active - 1);
                break;
            case "Home":
                event.preventDefault();
                mark(0);
                break;
            case "End":
                event.preventDefault();
                mark(optionElements.length - 1);
                break;
            case "Enter":
                event.preventDefault();
                select(active);
                break;
            case "Escape":
                close();
                break;
            case "Tab":
                close(false);
                break;
            default:
                break;
        }
    });

    menu.addEventListener("click", (event) => {
        const option = event.target.closest(".jump__option");
        if (option !== null) {
            select(Number(option.dataset.index));
        }
    });

    document.addEventListener("click", (event) => {
        if (isOpen && !control.contains(event.target)) {
            close(false);
        }
    });

    return control;
}

function renderEmpty(title, text) {
    const empty = createElement("div", { className: "empty" });
    empty.append(
        createElement("h2", { className: "empty__title", text: title }),
        createElement("p", { className: "empty__text", text }),
    );
    return empty;
}
