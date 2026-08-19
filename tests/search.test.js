import { describe, expect, it } from "vitest";

import { filterFiles, filterManifest, normalizeText } from "../js/modules/search.js";

const testFiles = [
  {
    title: "Lección 2.1",
    name: "dp_2_1_esp.pdf",
    type: "pdf",
    lesson: "2.1",
  },
  {
    title: "Práctica 2.1",
    name: "dp_2_1_practice_esp.docx",
    type: "docx",
    lesson: "2.1",
  },
  {
    title: "Objetivos del curso",
    name: "dfo_course_objectives_esp.pdf",
    type: "pdf",
    lesson: null,
  },
];

const testManifest = {
  topics: [
    {
      id: "0_recursos",
      number: 0,
      title: "Recursos",
      files: [testFiles[2]],
    },
    {
      id: "2_select_where",
      number: 2,
      title: "SELECT y WHERE",
      files: [testFiles[0], testFiles[1]],
    },
  ],
};

describe("filterFiles", () => {
  it("devuelve todo con búsqueda vacía y tipo all", () => {
    expect(filterFiles(testFiles, "", "all")).toHaveLength(3);
  });

  it("filtra por tipo de archivo", () => {
    const result = filterFiles(testFiles, "", "docx");
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe("Práctica 2.1");
  });

  it("busca por título, nombre y lección", () => {
    expect(filterFiles(testFiles, "objetivos", "all")).toHaveLength(1);
    expect(filterFiles(testFiles, "dp_2_1", "all")).toHaveLength(2);
    expect(filterFiles(testFiles, "2.1", "all")).toHaveLength(2);
  });

  it("incluye el contexto del tema en la búsqueda", () => {
    const result = filterFiles(testFiles, "select", "all", "SELECT y WHERE");
    expect(result).toHaveLength(3);
  });

  it("es insensible a mayúsculas, espacios y acentos", () => {
    expect(filterFiles(testFiles, "  PRACTICA  ", "all")).toHaveLength(1);
    expect(filterFiles(testFiles, "PRACTICA", "all", "SELECT y WHERE")).toHaveLength(1);
  });
});

describe("normalizeText", () => {
  it("quita diacríticos y pasa a minúsculas", () => {
    expect(normalizeText("Práctica Ámbito")).toBe("practica ambito");
  });
});

describe("filterManifest", () => {
  it("devuelve todo con búsqueda vacía y tipo all", () => {
    const result = filterManifest(testManifest, "", "all");
    expect(result.total).toBe(3);
    expect(result.topics).toHaveLength(2);
  });

  it("filtra por tipo de archivo", () => {
    const result = filterManifest(testManifest, "", "docx");
    expect(result.total).toBe(1);
    expect(result.topics[0].id).toBe("2_select_where");
  });

  it("no devuelve temas sin coincidencias", () => {
    const result = filterManifest(testManifest, "inexistente", "all");
    expect(result.total).toBe(0);
    expect(result.topics).toHaveLength(0);
  });
});
