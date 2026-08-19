import { describe, expect, it } from "vitest";

import { formatSize, readableType } from "../js/utils/format.js";

describe("formatSize", () => {
  it("formatea bytes, KB, MB y GB con separador español", () => {
    expect(formatSize(512)).toBe("512 B");
    expect(formatSize(1024)).toBe("1 KB");
    expect(formatSize(1536)).toBe("1,5 KB");
    expect(formatSize(1048576)).toBe("1 MB");
    expect(formatSize(1.5 * 1024 * 1024)).toBe("1,5 MB");
  });

  it("redondea a cero decimales a partir de 100 unidades", () => {
    expect(formatSize(100 * 1024)).toBe("100 KB");
  });

  it("devuelve un guion para valores inválidos", () => {
    expect(formatSize(-1)).toBe("—");
    expect(formatSize(Number.NaN)).toBe("—");
  });
});

describe("readableType", () => {
  it("traduce los tipos conocidos y pasa por alto los desconocidos", () => {
    expect(readableType("pdf")).toBe("PDF");
    expect(readableType("docx")).toBe("DOCX");
    expect(readableType("zip")).toBe("ZIP");
    expect(readableType("txt")).toBe("TXT");
  });
});
