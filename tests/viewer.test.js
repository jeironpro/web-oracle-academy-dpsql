import { describe, expect, it } from "vitest";

import { buildPagination, findFile } from "../js/modules/viewer.js";

const testManifest = {
  topics: [
    {
      id: "2_select_where",
      number: 2,
      title: "SELECT y WHERE",
      files: [
        { title: "Lección 2.1", name: "dp_2_1_esp.pdf", type: "pdf", path: "a/dp_2_1_esp.pdf" },
        {
          title: "Práctica 2.1",
          name: "dp_2_1_practice_esp.pdf",
          type: "pdf",
          path: "a/dp_2_1_practice_esp.pdf",
        },
        {
          title: "Práctica 2.1",
          name: "dp_2_1_practice_esp.docx",
          type: "docx",
          path: "a/dp_2_1_practice_esp.docx",
        },
        {
          title: "Oracle Data Modeler",
          name: "datamodeler.zip",
          type: "zip",
          path: "a/datamodeler.zip",
          external: true,
        },
      ],
    },
  ],
};

describe("findFile", () => {
  it("encuentra un archivo por su ruta", () => {
    const result = findFile(testManifest, "a/dp_2_1_esp.pdf");
    expect(result).not.toBeNull();
    expect(result.file.title).toBe("Lección 2.1");
    expect(result.topic.id).toBe("2_select_where");
  });

  it("devuelve null si la ruta no existe", () => {
    expect(findFile(testManifest, "a/inexistente.pdf")).toBeNull();
  });
});

describe("buildPagination", () => {
  const topic = testManifest.topics[0];
  const first = topic.files[0];
  const last = topic.files[1];

  it("ignora docx y archivos externos en la paginación", () => {
    const { total } = buildPagination(topic, first);
    expect(total).toBe(2);
  });

  it("no tiene anterior en el primer documento", () => {
    const { prev, next, position } = buildPagination(topic, first);
    expect(prev).toBeNull();
    expect(next.title).toBe("Práctica 2.1");
    expect(position).toBe(1);
  });

  it("no tiene siguiente en el último documento", () => {
    const { prev, next, position } = buildPagination(topic, last);
    expect(prev.title).toBe("Lección 2.1");
    expect(next).toBeNull();
    expect(position).toBe(2);
  });
});
