import { describe, expect, it } from "vitest";

import { filtrarArchivos, filtrarManifesto, normalizarTexto } from "../js/modules/busqueda.js";

const archivosDePrueba = [
  {
    titulo: "Lección 2.1",
    nombre: "dp_2_1_esp.pdf",
    tipo: "pdf",
    leccion: "2.1",
  },
  {
    titulo: "Práctica 2.1",
    nombre: "dp_2_1_practice_esp.docx",
    tipo: "docx",
    leccion: "2.1",
  },
  {
    titulo: "Objetivos del curso",
    nombre: "dfo_course_objectives_esp.pdf",
    tipo: "pdf",
    leccion: null,
  },
];

const manifestoDePrueba = {
  temas: [
    {
      id: "0_recursos",
      numero: 0,
      titulo: "Recursos",
      archivos: [archivosDePrueba[2]],
    },
    {
      id: "2_select_where",
      numero: 2,
      titulo: "SELECT y WHERE",
      archivos: [archivosDePrueba[0], archivosDePrueba[1]],
    },
  ],
};

describe("filtrarArchivos", () => {
  it("devuelve todo con búsqueda vacía y tipo todos", () => {
    expect(filtrarArchivos(archivosDePrueba, "", "todos")).toHaveLength(3);
  });

  it("filtra por tipo de archivo", () => {
    const resultado = filtrarArchivos(archivosDePrueba, "", "docx");
    expect(resultado).toHaveLength(1);
    expect(resultado[0].titulo).toBe("Práctica 2.1");
  });

  it("busca por título, nombre y lección", () => {
    expect(filtrarArchivos(archivosDePrueba, "objetivos", "todos")).toHaveLength(1);
    expect(filtrarArchivos(archivosDePrueba, "dp_2_1", "todos")).toHaveLength(2);
    expect(filtrarArchivos(archivosDePrueba, "2.1", "todos")).toHaveLength(2);
  });

  it("incluye el contexto del tema en la búsqueda", () => {
    const resultado = filtrarArchivos(archivosDePrueba, "select", "todos", "SELECT y WHERE");
    expect(resultado).toHaveLength(3);
  });

  it("es insensible a mayúsculas, espacios y acentos", () => {
    expect(filtrarArchivos(archivosDePrueba, "  PRACTICA  ", "todos")).toHaveLength(1);
    expect(filtrarArchivos(archivosDePrueba, "PRACTICA", "todos", "SELECT y WHERE")).toHaveLength(
      1,
    );
  });
});

describe("normalizarTexto", () => {
  it("quita diacríticos y pasa a minúsculas", () => {
    expect(normalizarTexto("Práctica Ámbito")).toBe("practica ambito");
  });
});

describe("filtrarManifesto", () => {
  it("devuelve todo con búsqueda vacía y tipo todos", () => {
    const resultado = filtrarManifesto(manifestoDePrueba, "", "todos");
    expect(resultado.total).toBe(3);
    expect(resultado.temas).toHaveLength(2);
  });

  it("filtra por tipo de archivo", () => {
    const resultado = filtrarManifesto(manifestoDePrueba, "", "docx");
    expect(resultado.total).toBe(1);
    expect(resultado.temas[0].id).toBe("2_select_where");
  });

  it("no devuelve temas sin coincidencias", () => {
    const resultado = filtrarManifesto(manifestoDePrueba, "inexistente", "todos");
    expect(resultado.total).toBe(0);
    expect(resultado.temas).toHaveLength(0);
  });
});
