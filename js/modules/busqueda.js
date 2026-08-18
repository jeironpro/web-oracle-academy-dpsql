/**
 * Filtra el manifiesto por consulta de texto y tipo de archivo.
 * Función pura: no toca el DOM, por lo que es testeable en Node.
 *
 * @param {object} manifesto Manifiesto completo del curso.
 * @param {string} consulta Texto de búsqueda (sin normalizar).
 * @param {string} tipo Tipo de archivo: "todos" | "pdf" | "docx" | "zip".
 * @returns {{ temas: object[], total: number }}
 */
export function filtrarManifesto(manifesto, consulta, tipo) {
  const normalizada = consulta.trim().toLocaleLowerCase("es");
  const temas = manifesto.temas
    .map((tema) => ({
      ...tema,
      archivos: tema.archivos.filter((archivo) => {
        const coincideTipo = tipo === "todos" || archivo.tipo === tipo;
        if (!coincideTipo) {
          return false;
        }
        if (normalizada === "") {
          return true;
        }
        const texto = [archivo.titulo, archivo.nombre, tema.titulo, archivo.leccion ?? ""]
          .join(" ")
          .toLocaleLowerCase("es");
        return texto.includes(normalizada);
      }),
    }))
    .filter((tema) => tema.archivos.length > 0);

  const total = temas.reduce((suma, tema) => suma + tema.archivos.length, 0);
  return { temas, total };
}
