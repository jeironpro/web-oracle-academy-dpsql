import { describe, expect, it } from "vitest";

import {
  humanizarNombre,
  metadatosDeCurso,
  parsearNombreArchivo,
  tituloDeArchivo,
  tituloDeCarpeta,
  urlRawDeGitHub,
} from "../tools/generar-manifesto.js";

describe("parsearNombreArchivo", () => {
  it("reconoce una lección en PDF", () => {
    expect(parsearNombreArchivo("dp_1_1_esp.pdf")).toEqual({
      leccion: "1.1",
      esPractica: false,
      tipo: "pdf",
    });
  });

  it("reconoce una práctica en DOCX", () => {
    expect(parsearNombreArchivo("dp_2_3_practice_esp.docx")).toEqual({
      leccion: "2.3",
      esPractica: true,
      tipo: "docx",
    });
  });

  it("devuelve null cuando el archivo no sigue el patrón de lección", () => {
    expect(parsearNombreArchivo("dfo_course_objectives_esp.pdf")).toEqual({
      leccion: null,
      esPractica: false,
      tipo: "pdf",
    });
  });

  it("detecta el tipo de los ZIP", () => {
    expect(parsearNombreArchivo("sql_schema.zip").tipo).toBe("zip");
  });
});

describe("tituloDeCarpeta", () => {
  it("devuelve los títulos conocidos de los temas", () => {
    expect(tituloDeCarpeta("0_recursos")).toBe("Recursos");
    expect(tituloDeCarpeta("2_select_where")).toBe("SELECT y WHERE");
    expect(tituloDeCarpeta("12_dml")).toBe("DML (manipulación de datos)");
  });
});

describe("tituloDeArchivo", () => {
  it("titula las lecciones y prácticas por su número", () => {
    expect(tituloDeArchivo("dp_2_1_esp.pdf")).toBe("Lección 2.1");
    expect(tituloDeArchivo("dp_2_1_practice_esp.pdf")).toBe("Práctica 2.1");
  });

  it("titula los recursos conocidos", () => {
    expect(tituloDeArchivo("dfo_course_objectives_esp.pdf")).toBe("Objetivos del curso");
    expect(tituloDeArchivo("sql_schema.zip")).toBe("Esquema SQL (ZIP)");
  });

  it("marca el instalador de Data Modeler con su título", () => {
    expect(tituloDeArchivo("datamodeler_24_3_1_351_0831_x64.zip")).toBe(
      "Oracle Data Modeler (instalador)",
    );
  });
});

describe("humanizarNombre", () => {
  it("convierte guiones bajos en espacios y capitaliza", () => {
    expect(humanizarNombre("sql_schema")).toBe("Sql Schema");
    expect(humanizarNombre("dp_1_1_esp")).toBe("Dp 1 1");
  });

  it("aplica acentos conocidos", () => {
    expect(humanizarNombre("garantia_consultas_calidad")).toBe("Garantía Consultas Calidad");
  });
});

describe("urlRawDeGitHub", () => {
  it("construye la URL raw del archivo desde el remoto", () => {
    const url = urlRawDeGitHub("oracle_academy/curso/0_recursos/archivo.zip");
    expect(url).toBe(
      "https://github.com/jeironpro/oracle-academy-dpsql/raw/main/oracle_academy/curso/0_recursos/archivo.zip",
    );
  });
});

describe("metadatosDeCurso", () => {
  it("reconoce el curso del repositorio", () => {
    expect(metadatosDeCurso("programacion_base_datos_sql_47_50")).toEqual({
      titulo: "Programación de Base de Datos SQL",
      codigo: "DPSQL 47–50",
    });
  });
});
