import { describe, expect, it } from "vitest";

import { construirPaginacion, encontrarArchivo } from "../js/modules/visor.js";

const manifestoDePrueba = {
  temas: [
    {
      id: "2_select_where",
      numero: 2,
      titulo: "SELECT y WHERE",
      archivos: [
        { titulo: "Lección 2.1", nombre: "dp_2_1_esp.pdf", tipo: "pdf", ruta: "a/dp_2_1_esp.pdf" },
        {
          titulo: "Práctica 2.1",
          nombre: "dp_2_1_practice_esp.pdf",
          tipo: "pdf",
          ruta: "a/dp_2_1_practice_esp.pdf",
        },
        {
          titulo: "Práctica 2.1",
          nombre: "dp_2_1_practice_esp.docx",
          tipo: "docx",
          ruta: "a/dp_2_1_practice_esp.docx",
        },
        {
          titulo: "Oracle Data Modeler",
          nombre: "datamodeler.zip",
          tipo: "zip",
          ruta: "a/datamodeler.zip",
          externo: true,
        },
      ],
    },
  ],
};

describe("encontrarArchivo", () => {
  it("encuentra un archivo por su ruta", () => {
    const resultado = encontrarArchivo(manifestoDePrueba, "a/dp_2_1_esp.pdf");
    expect(resultado).not.toBeNull();
    expect(resultado.archivo.titulo).toBe("Lección 2.1");
    expect(resultado.tema.id).toBe("2_select_where");
  });

  it("devuelve null si la ruta no existe", () => {
    expect(encontrarArchivo(manifestoDePrueba, "a/inexistente.pdf")).toBeNull();
  });
});

describe("construirPaginacion", () => {
  const tema = manifestoDePrueba.temas[0];
  const primera = tema.archivos[0];
  const ultima = tema.archivos[1];

  it("ignora docx y archivos externos en la paginación", () => {
    const { total } = construirPaginacion(tema, primera);
    expect(total).toBe(2);
  });

  it("no tiene anterior en el primer documento", () => {
    const { anterior, siguiente, posicion } = construirPaginacion(tema, primera);
    expect(anterior).toBeNull();
    expect(siguiente.titulo).toBe("Práctica 2.1");
    expect(posicion).toBe(1);
  });

  it("no tiene siguiente en el último documento", () => {
    const { anterior, siguiente, posicion } = construirPaginacion(tema, ultima);
    expect(anterior.titulo).toBe("Lección 2.1");
    expect(siguiente).toBeNull();
    expect(posicion).toBe(2);
  });
});
