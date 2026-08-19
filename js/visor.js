import { loadManifest, fileUrl, viewerUrl } from "./services/manifest.js";
import { buildPagination, findFile } from "./modules/viewer.js";
import { formatSize, readableType } from "./utils/format.js";

const VISIBLE_TYPE = "pdf";

const elements = {
    pdfFrame: document.querySelector("#pdf-frame"),
    fallback: document.querySelector("#viewer-fallback"),
    fileLabel: document.querySelector("#file-label"),
    fileTitle: document.querySelector("#file-title"),
    fileMeta: document.querySelector("#file-meta"),
    downloadLink: document.querySelector("#download-link"),
    crumbTopic: document.querySelector("#crumb-topic"),
    crumbFile: document.querySelector("#crumb-file"),
    prevLink: document.querySelector("#prev-link"),
    nextLink: document.querySelector("#next-link"),
    position: document.querySelector("#doc-position"),
};

async function init() {
    const params = new URLSearchParams(window.location.search);
    const filePath = params.get("file");
    const topicId = params.get("topic");

    if (filePath === null || topicId === null) {
        showNoDocument("Falta el parámetro del documento en la URL.");
        return;
    }

    let manifest;
    try {
        manifest = await loadManifest();
    } catch (error) {
        showNoDocument(error.message);
        return;
    }

    const found = findFile(manifest, filePath);
    if (found === null) {
        showNoDocument("El documento no existe en el curso.");
        return;
    }

    const { topic, file } = found;
    const isViewable = file.type === VISIBLE_TYPE && file.external !== true;

    document.title = `${file.title} · ${topic.title} · Oracle Academy`;
    if (elements.fileLabel !== null) {
        elements.fileLabel.textContent = `${topic.title} · ${readableType(file.type)}`;
    }
    if (elements.fileTitle !== null) {
        elements.fileTitle.textContent = file.title;
    }
    if (elements.fileMeta !== null) {
        elements.fileMeta.textContent = `${file.name} · ${readableType(file.type)} · ${formatSize(file.size)}`;
    }
    if (elements.crumbTopic !== null) {
        elements.crumbTopic.textContent = topic.title;
        elements.crumbTopic.setAttribute("href", `index.html#topic-${topic.id}`);
    }
    if (elements.crumbFile !== null) {
        elements.crumbFile.textContent = file.title;
    }
    if (elements.downloadLink !== null) {
        elements.downloadLink.setAttribute("href", fileUrl(file));
        elements.downloadLink.setAttribute("download", file.name);
    }

    if (isViewable && elements.pdfFrame !== null) {
        elements.pdfFrame.setAttribute("src", fileUrl(file));
    } else if (elements.fallback !== null) {
        elements.fallback.hidden = false;
    }

    mountPagination(topic, file);
}

function mountPagination(topic, currentFile) {
    const { prev, next, position, total } = buildPagination(topic, currentFile);

    if (elements.position !== null && position !== null) {
        elements.position.textContent = `${position} / ${total}`;
    }
    if (elements.prevLink !== null && prev !== null) {
        elements.prevLink.hidden = false;
        elements.prevLink.setAttribute("href", viewerUrl(prev, topic.id));
        elements.prevLink.setAttribute("aria-label", `Anterior: ${prev.title}`);
    }
    if (elements.nextLink !== null && next !== null) {
        elements.nextLink.hidden = false;
        elements.nextLink.setAttribute("href", viewerUrl(next, topic.id));
        elements.nextLink.setAttribute("aria-label", `Siguiente: ${next.title}`);
    }
}

function showNoDocument(message) {
    if (elements.fileTitle !== null) {
        elements.fileTitle.textContent = "Documento no disponible";
    }
    if (elements.fileMeta !== null) {
        elements.fileMeta.textContent = message;
    }
    if (elements.fallback !== null) {
        elements.fallback.hidden = false;
    }
    if (elements.downloadLink !== null) {
        elements.downloadLink.hidden = true;
    }
}

init();
