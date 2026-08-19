import { describe, expect, it } from "vitest";

import {
  courseMetadata,
  fileTitle,
  folderTitle,
  githubRawUrl,
  humanizeName,
  parseFileName,
  sizeFromPointer,
} from "../tools/generate-manifest.js";

describe("parseFileName", () => {
  it("reconoce una lección en PDF", () => {
    expect(parseFileName("dp_1_1_esp.pdf")).toEqual({
      lesson: "1.1",
      isPractice: false,
      type: "pdf",
    });
  });

  it("reconoce una práctica en DOCX", () => {
    expect(parseFileName("dp_2_3_practice_esp.docx")).toEqual({
      lesson: "2.3",
      isPractice: true,
      type: "docx",
    });
  });

  it("devuelve null cuando el archivo no sigue el patrón de lección", () => {
    expect(parseFileName("dfo_course_objectives_esp.pdf")).toEqual({
      lesson: null,
      isPractice: false,
      type: "pdf",
    });
  });

  it("detecta el tipo de los ZIP", () => {
    expect(parseFileName("sql_schema.zip").type).toBe("zip");
  });
});

describe("folderTitle", () => {
  it("devuelve los títulos conocidos de los temas", () => {
    expect(folderTitle("0_recursos")).toBe("Recursos");
    expect(folderTitle("2_select_where")).toBe("SELECT y WHERE");
    expect(folderTitle("12_dml")).toBe("DML (manipulación de datos)");
  });
});

describe("fileTitle", () => {
  it("titula las lecciones y prácticas por su número", () => {
    expect(fileTitle("dp_2_1_esp.pdf")).toBe("Lección 2.1");
    expect(fileTitle("dp_2_1_practice_esp.pdf")).toBe("Práctica 2.1");
  });

  it("titula los recursos conocidos", () => {
    expect(fileTitle("dfo_course_objectives_esp.pdf")).toBe("Objetivos del curso");
    expect(fileTitle("sql_schema.zip")).toBe("Esquema SQL (ZIP)");
  });

  it("marca el instalador de Data Modeler con su título", () => {
    expect(fileTitle("datamodeler_24_3_1_351_0831_x64.zip")).toBe(
      "Oracle Data Modeler (instalador)",
    );
  });
});

describe("humanizeName", () => {
  it("convierte guiones bajos en espacios y capitaliza", () => {
    expect(humanizeName("sql_schema")).toBe("Sql Schema");
    expect(humanizeName("dp_1_1_esp")).toBe("Dp 1 1");
  });

  it("aplica acentos conocidos", () => {
    expect(humanizeName("garantia_consultas_calidad")).toBe("Garantía Consultas Calidad");
  });
});

describe("sizeFromPointer", () => {
  const pointer = [
    "version https://git-lfs.github.com/spec/v1",
    "oid sha256:0a7086b6103426d1cb731ebea49979051b23fd296f58cb69bc596525dcabd4a6",
    "size 339463447",
  ].join("\n");

  it("lee el tamaño declarado de un pointer LFS", () => {
    expect(sizeFromPointer(pointer)).toBe(339463447);
  });

  it("devuelve null si el contenido no es un pointer LFS", () => {
    expect(sizeFromPointer("PK\u0003\u0004 contenido binario")).toBeNull();
    expect(sizeFromPointer("version https://otra-cosa/v1\nsize 100\n")).toBeNull();
  });
});

describe("githubRawUrl", () => {
  it("construye la URL raw del archivo desde el remoto", () => {
    const url = githubRawUrl("oracle_academy/curso/0_recursos/archivo.zip");
    expect(url).toBe(
      "https://github.com/jeironpro/oracle-academy-dpsql/raw/main/oracle_academy/curso/0_recursos/archivo.zip",
    );
  });
});

describe("courseMetadata", () => {
  it("reconoce el curso del repositorio", () => {
    expect(courseMetadata("programacion_base_datos_sql_47_50")).toEqual({
      title: "Programación de Base de Datos SQL",
      code: "DPSQL 47–50",
    });
  });
});
