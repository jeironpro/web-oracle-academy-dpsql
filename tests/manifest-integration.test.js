import { describe, expect, it } from "vitest";

import { generateManifest } from "../tools/generate-manifest.js";

describe("manifiesto de contenido (integración)", () => {
    it("enumera los 21 temas y los 137 archivos del curso (incluye el instalador externo)", async () => {
        const manifest = await generateManifest();
        expect(manifest.course.totalTopics).toBe(21);
        expect(manifest.course.totalFiles).toBe(137);
    });

    it("ordena los temas por número y los archivos por lección", async () => {
        const manifest = await generateManifest();
        expect(manifest.topics[0].id).toBe("0_recursos");
        expect(manifest.topics.at(-1).id).toBe("20_garantia_consultas_calidad_parte_2");

        const selectTopic = manifest.topics.find((topic) => topic.id === "2_select_where");
        expect(selectTopic.files[0].lesson).toBe("2.1");
        expect(selectTopic.files[0].isPractice).toBe(false);
    });

    it("marca el instalador de Data Modeler como descarga externa vía GitHub raw", async () => {
        const manifest = await generateManifest();
        const resourcesTopic = manifest.topics.find((topic) => topic.id === "0_recursos");
        const installer = resourcesTopic.files.find((file) => file.name.startsWith("datamodeler_"));
        expect(installer.external).toBe(true);
        expect(installer.externalUrl).toContain("github.com");
        expect(installer.externalUrl).toContain("/raw/main/");
        expect(installer.note).toBeTruthy();
    });

    it("no deja archivos del curso sin los campos mínimos", async () => {
        const manifest = await generateManifest();
        for (const topic of manifest.topics) {
            for (const file of topic.files) {
                expect(file.name).toBeTruthy();
                expect(file.title).toBeTruthy();
                expect(file.path).toContain(file.name);
                expect(file.type).toMatch(/^(pdf|docx|zip)$/);
                expect(file.size).toBeGreaterThan(0);
            }
        }
    });
});
