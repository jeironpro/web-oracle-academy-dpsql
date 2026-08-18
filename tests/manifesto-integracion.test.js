import { describe, expect, it } from "vitest";

import { generarManifesto } from "../tools/generar-manifesto.js";

describe("manifiesto de contenido (integración)", () => {
  it("enumera los 21 temas y los 137 archivos del curso (incluye el instalador externo)", async () => {
    const manifesto = await generarManifesto();
    expect(manifesto.curso.totalTemas).toBe(21);
    expect(manifesto.curso.totalArchivos).toBe(137);
  });

  it("ordena los temas por número y los archivos por lección", async () => {
    const manifesto = await generarManifesto();
    expect(manifesto.temas[0].id).toBe("0_recursos");
    expect(manifesto.temas.at(-1).id).toBe("20_garantia_consultas_calidad_parte_2");

    const temaSelect = manifesto.temas.find((tema) => tema.id === "2_select_where");
    expect(temaSelect.archivos[0].leccion).toBe("2.1");
    expect(temaSelect.archivos[0].esPractica).toBe(false);
  });

  it("marca el instalador de Data Modeler como descarga externa", async () => {
    const manifesto = await generarManifesto();
    const temaRecursos = manifesto.temas.find((tema) => tema.id === "0_recursos");
    const instalador = temaRecursos.archivos.find((archivo) =>
      archivo.nombre.startsWith("datamodeler_"),
    );
    expect(instalador.externo).toBe(true);
    expect(instalador.urlExterna).toContain("oracle.com");
  });

  it("no deja archivos del curso sin los campos mínimos", async () => {
    const manifesto = await generarManifesto();
    for (const tema of manifesto.temas) {
      for (const archivo of tema.archivos) {
        expect(archivo.nombre).toBeTruthy();
        expect(archivo.titulo).toBeTruthy();
        expect(archivo.ruta).toContain(archivo.nombre);
        expect(archivo.tipo).toMatch(/^(pdf|docx|zip)$/);
        expect(archivo.tamano).toBeGreaterThan(0);
      }
    }
  });
});
