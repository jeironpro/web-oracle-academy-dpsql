import { describe, expect, it } from "vitest";

import { formatearTamano, tipoLegible } from "../js/utils/format.js";

describe("formatearTamano", () => {
  it("formatea bytes, KB, MB y GB con separador español", () => {
    expect(formatearTamano(512)).toBe("512 B");
    expect(formatearTamano(1024)).toBe("1 KB");
    expect(formatearTamano(1536)).toBe("1,5 KB");
    expect(formatearTamano(1048576)).toBe("1 MB");
    expect(formatearTamano(1.5 * 1024 * 1024)).toBe("1,5 MB");
  });

  it("redondea a cero decimales a partir de 100 unidades", () => {
    expect(formatearTamano(100 * 1024)).toBe("100 KB");
  });

  it("devuelve un guion para valores inválidos", () => {
    expect(formatearTamano(-1)).toBe("—");
    expect(formatearTamano(Number.NaN)).toBe("—");
  });
});

describe("tipoLegible", () => {
  it("traduce los tipos conocidos y pasa por alto los desconocidos", () => {
    expect(tipoLegible("pdf")).toBe("PDF");
    expect(tipoLegible("docx")).toBe("DOCX");
    expect(tipoLegible("zip")).toBe("ZIP");
    expect(tipoLegible("txt")).toBe("TXT");
  });
});
