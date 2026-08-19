import { describe, expect, it } from "vitest";

import { jumpOptions } from "../js/modules/catalog.js";

describe("jumpOptions", () => {
  const files = [
    { title: "Lección 2.1", type: "pdf", external: false },
    { title: "Práctica 2.1", type: "pdf", external: false },
    { title: "Práctica 2.1 (DOCX)", type: "docx", external: false },
    { title: "Instalador de Data Modeler", type: "zip", external: true },
    { title: "Esquema SQL", type: "zip", external: false },
  ];

  it("incluye lecciones y prácticas (PDF y DOCX) con su índice en la grilla", () => {
    expect(jumpOptions(files)).toEqual([
      { file: files[0], index: 0 },
      { file: files[1], index: 1 },
      { file: files[2], index: 2 },
    ]);
  });

  it("excluye los ZIP aunque no sean externos", () => {
    const options = jumpOptions(files);
    expect(options.some((option) => option.file.type === "zip")).toBe(false);
  });

  it("conserva el índice real dentro de la grilla aunque haya ZIPs en medio", () => {
    const filesWithZip = [files[0], files[3], files[1]];
    expect(jumpOptions(filesWithZip)).toEqual([
      { file: files[0], index: 0 },
      { file: files[1], index: 2 },
    ]);
  });

  it("devuelve lista vacía sin archivos", () => {
    expect(jumpOptions([])).toEqual([]);
  });
});
