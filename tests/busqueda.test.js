import { describe, expect, it } from "vitest";

import { filtrarManifesto } from "../js/modules/busqueda.js";

const manifestoDePrueba = {
  temas: [
    {
      id: "0_recursos",
      numero: 0,
      titulo: "Recursos",
      archivos: [
        {
          titulo: "Objetivos del curso",
          nombre: "dfo_course_objectives_esp.pdf",
          tipo: "pdf",
          leccion: null,
        },
      ],
    },
    {
      id: "2_select_where",
      numero: 2,
      titulo: "SELECT y WHERE",
      archivos: [
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
      ],
    },
  ],
};

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

  it("encuentra por título, nombre de archivo, tema y lección", () => {
    expect(filtrarManifesto(manifestoDePrueba, "objetivos", "todos").total).toBe(1);
    expect(filtrarManifesto(manifestoDePrueba, "dp_2_1", "todos").total).toBe(2);
    expect(filtrarManifesto(manifestoDePrueba, "where", "todos").total).toBe(2);
    expect(filtrarManifesto(manifestoDePrueba, "2.1", "todos").total).toBe(2);
  });

  it("es insensible a mayúsculas y espacios", () => {
    const resultado = filtrarManifesto(manifestoDePrueba, "  WHERE  ", "todos");
    expect(resultado.total).toBe(2);
  });

  it("no devuelve temas sin coincidencias", () => {
    const resultado = filtrarManifesto(manifestoDePrueba, "inexistente", "todos");
    expect(resultado.total).toBe(0);
    expect(resultado.temas).toHaveLength(0);
  });
});
