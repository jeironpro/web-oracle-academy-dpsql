import { describe, expect, it } from "vitest";
import { opcionesDeSalto } from "../js/modules/catalogo.js";

describe("opcionesDeSalto", () => {
  const archivos = [
    { titulo: "Lección 2.1", tipo: "pdf", externo: false },
    { titulo: "Práctica 2.1", tipo: "pdf", externo: false },
    { titulo: "Práctica 2.1 (DOCX)", tipo: "docx", externo: false },
    { titulo: "Instalador de Data Modeler", tipo: "zip", externo: true },
    { titulo: "Esquema SQL", tipo: "zip", externo: false },
  ];

  it("incluye lecciones y prácticas (PDF y DOCX) con su índice en la grilla", () => {
    expect(opcionesDeSalto(archivos)).toEqual([
      { archivo: archivos[0], indice: 0 },
      { archivo: archivos[1], indice: 1 },
      { archivo: archivos[2], indice: 2 },
    ]);
  });

  it("excluye los ZIP aunque no sean externos", () => {
    const opciones = opcionesDeSalto(archivos);
    expect(opciones.some((opcion) => opcion.archivo.tipo === "zip")).toBe(false);
  });

  it("conserva el índice real dentro de la grilla aunque haya ZIPs en medio", () => {
    const archivosConZip = [archivos[0], archivos[3], archivos[1]];
    expect(opcionesDeSalto(archivosConZip)).toEqual([
      { archivo: archivos[0], indice: 0 },
      { archivo: archivos[1], indice: 2 },
    ]);
  });

  it("devuelve lista vacía sin archivos", () => {
    expect(opcionesDeSalto([])).toEqual([]);
  });
});
