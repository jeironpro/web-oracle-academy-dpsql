/**
 * Genera `data/manifesto.json` con la estructura del contenido de Oracle Academy.
 *
 * Recorre la carpeta `oracle_academy/`, extrae los temas del curso (carpetas
 * `N_nombre`), los archivos (lección, práctica, tipo y tamaño) y escribe el
 * manifiesto que consume la interfaz web.
 *
 * Uso:
 *   node tools/generar-manifesto.js            # escribe data/manifesto.json
 *   node tools/generar-manifesto.js --check    # verifica que el manifiesto está al día
 */

import { mkdir, readFile, readdir, stat, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

const RUTA_RAIZ_DEFECTO = "oracle_academy";
const RUTA_MANIFIESTO = "data/manifesto.json";

/** Límite de un archivo en GitHub (100 MB); por encima, la web usa descarga externa. */
const LIMITE_GITHUB_BYTES = 100 * 1024 * 1024;

/** Rama base para construir URLs raw de GitHub (archivos LFS). */
const RAMA_BASE = "main";

/** Títulos legibles de las carpetas de tema (derivados del nombre de carpeta del curso). */
const TITULOS_CARPETAS = {
  "0_recursos": "Recursos",
  "1_introduccion": "Introducción",
  "2_select_where": "SELECT y WHERE",
  "3_where_order_by_funciones": "WHERE, ORDER BY y funciones",
  "4_funciones_una_fila_parte_1": "Funciones de una fila (parte 1)",
  "5_funciones_una_fila_parte_2": "Funciones de una fila (parte 2)",
  "6_join_parte_1": "Joins (parte 1)",
  "7_join_parte_2": "Joins (parte 2)",
  "8_funciones_grupo_parte_1": "Funciones de grupo (parte 1)",
  "9_funciones_grupo_parte_2": "Funciones de grupo (parte 2)",
  "10_subconsultas": "Subconsultas",
  "11_garantia_consultas_calidad_parte_1": "Garantía de calidad de consultas (parte 1)",
  "12_dml": "DML (manipulación de datos)",
  "13_ddl": "DDL (definición de datos)",
  "14_restricciones": "Restricciones",
  "15_vistas": "Vistas",
  "16_secuencias_sinonimos": "Secuencias y sinónimos",
  "17_privilegios_expresiones_regulares": "Privilegios y expresiones regulares",
  "18_tcl": "TCL (control de transacciones)",
  "19_proyecto_final": "Proyecto final",
  "20_garantia_consultas_calidad_parte_2": "Garantía de calidad de consultas (parte 2)",
};

/** Títulos descriptivos de los archivos de recursos (no siguen el patrón dp_X_Y). */
const TITULOS_ARCHIVOS = {
  "dfo_course_objectives_esp.pdf": "Objetivos del curso",
  "dp_course_map_esp.pdf": "Mapa del curso",
  "oracle_flix_project_rubric_esp.pdf": "Rúbrica del proyecto Oracle Flix",
  "oracle_flix_sql_project_exercise_esp.pdf": "Ejercicio del proyecto Oracle Flix (SQL)",
  "oracle_flix_sql_project_tables_esp.pdf": "Tablas del proyecto Oracle Flix (SQL)",
  "oracle_flix_project_erd_esp.pdf": "ERD del proyecto Oracle Flix",
  "oracle_apex_learner_guide_esp.pdf": "Guía de aprendizaje de Oracle APEX",
  "sql_schema_erd_and_table_designs.pdf": "ERD y diseño de tablas (esquema SQL)",
  "sql_schema.zip": "Esquema SQL (ZIP)",
};

/** Metadatos del curso según el nombre de su carpeta raíz. */
const CURSOS_CONOCIDOS = {
  programacion_base_datos_sql_47_50: {
    titulo: "Programación de Base de Datos SQL",
    codigo: "DPSQL 47–50",
  },
};

/** Patrón de los archivos de lección/práctica del curso: dp_<tema>_<leccion>[_practice]_esp.<ext> */
const PATRON_LECCION = /^dp_(\d+)_(\d+)(?:_practice)?_esp\.(pdf|docx|zip)$/;

/** Sustituye una palabra sin acentos por su forma correcta (fallback de humanización). */
const ACENTOS = {
  garantia: "Garantía",
  introduccion: "Introducción",
  restricciones: "Restricciones",
  funciones: "Funciones",
  secuencias: "Secuencias",
  sinonimos: "Sinónimos",
  subconsultas: "Subconsultas",
  vistas: "Vistas",
  privilegios: "Privilegios",
  expresiones: "Expresiones",
  regulares: "Regulares",
  proyecto: "Proyecto",
  final: "Final",
};

/** Convierte un nombre con guiones bajos en texto legible con capitalización. */
export function humanizarNombre(nombre) {
  const sinExtension = nombre.replace(/\.[a-z0-9]+$/i, "");
  const sinSufijo = sinExtension.replace(/_esp$/, "");
  return sinSufijo
    .split("_")
    .filter(Boolean)
    .map((palabra) => ACENTOS[palabra] ?? palabra.charAt(0).toUpperCase() + palabra.slice(1))
    .join(" ");
}

/** Devuelve el título legible de una carpeta de tema a partir de su nombre. */
export function tituloDeCarpeta(nombre) {
  return TITULOS_CARPETAS[nombre] ?? humanizarNombre(nombre.replace(/^\d+_/, ""));
}

/**
 * Extrae la lección, si es práctica y el tipo de un archivo del curso.
 * @returns {{ leccion: string | null, esPractica: boolean, tipo: string }}
 */
export function parsearNombreArchivo(nombre) {
  const coincidencia = nombre.match(PATRON_LECCION);
  if (coincidencia === null) {
    const tipo = nombre.split(".").pop() ?? "desconocido";
    return { leccion: null, esPractica: false, tipo };
  }
  const [, tema, leccion, tipo] = coincidencia;
  return { leccion: `${tema}.${leccion}`, esPractica: nombre.includes("practice"), tipo };
}

/** Devuelve el título legible de un archivo. */
export function tituloDeArchivo(nombre, parsed = parsearNombreArchivo(nombre)) {
  if (TITULOS_ARCHIVOS[nombre] !== undefined) {
    return TITULOS_ARCHIVOS[nombre];
  }
  if (nombre.startsWith("datamodeler_")) {
    return "Oracle Data Modeler (instalador)";
  }
  if (parsed.leccion !== null) {
    return parsed.esPractica ? `Práctica ${parsed.leccion}` : `Lección ${parsed.leccion}`;
  }
  return humanizarNombre(nombre);
}

/** Devuelve los metadatos del curso a partir de la carpeta que lo contiene. */
export function metadatosDeCurso(nombreCarpeta) {
  return (
    CURSOS_CONOCIDOS[nombreCarpeta] ?? {
      titulo: humanizarNombre(nombreCarpeta),
      codigo: nombreCarpeta,
    }
  );
}

/** Ordena los archivos de un tema: por lección, lección antes que práctica, pdf antes que docx. */
function compararArchivos(a, b) {
  const leccionA = a.leccion ?? "999";
  const leccionB = b.leccion ?? "999";
  if (leccionA !== leccionB) {
    return leccionA.localeCompare(leccionB, "es", { numeric: true });
  }
  if (a.esPractica !== b.esPractica) {
    return a.esPractica ? 1 : -1;
  }
  const ORDEN_TIPOS = { pdf: 0, docx: 1, zip: 2 };
  return (ORDEN_TIPOS[a.tipo] ?? 3) - (ORDEN_TIPOS[b.tipo] ?? 3);
}

/** Recorre la carpeta raíz y construye la estructura completa del manifiesto. */
export async function generarManifesto(raiz = RUTA_RAIZ_DEFECTO) {
  const entradas = await readdir(raiz, { withFileTypes: true });
  const carpetaCurso = entradas
    .filter((entrada) => entrada.isDirectory())
    .sort((a, b) => a.name.localeCompare(b.name))[0];
  if (carpetaCurso === undefined) {
    throw new Error(`No se encontró ninguna carpeta de curso en "${raiz}".`);
  }

  const rutaCurso = join(raiz, carpetaCurso.name);
  const carpetasTema = (await readdir(rutaCurso, { withFileTypes: true }))
    .filter((entrada) => entrada.isDirectory() && /^\d+_/.test(entrada.name))
    .sort((a, b) => a.name.localeCompare(b.name, "es", { numeric: true }));

  const temas = [];
  let totalArchivos = 0;

  for (const carpeta of carpetasTema) {
    const rutaTema = join(rutaCurso, carpeta.name);
    const archivos = [];

    for (const archivo of await readdir(rutaTema)) {
      const rutaArchivo = join(rutaTema, archivo);
      const info = await stat(rutaArchivo);
      if (!info.isFile()) {
        continue;
      }
      const parsed = parsearNombreArchivo(archivo);
      const esExterno = info.size > LIMITE_GITHUB_BYTES;
      archivos.push({
        nombre: archivo,
        titulo: tituloDeArchivo(archivo, parsed),
        ruta: `${rutaCurso}/${carpeta.name}/${archivo}`,
        tipo: parsed.tipo,
        tamano: info.size,
        leccion: parsed.leccion,
        esPractica: parsed.esPractica,
        externo: esExterno,
        urlExterna: esExterno ? urlRawDeGitHub(`${rutaCurso}/${carpeta.name}/${archivo}`) : null,
        nota: esExterno ? "Archivo grande alojado con Git LFS; la descarga sale de GitHub." : null,
      });
      totalArchivos += 1;
    }

    archivos.sort(compararArchivos);
    temas.push({
      id: carpeta.name,
      numero: Number.parseInt(carpeta.name.split("_")[0], 10),
      titulo: tituloDeCarpeta(carpeta.name),
      ruta: rutaCurso + "/" + carpeta.name,
      totalArchivos: archivos.length,
      archivos,
    });
  }

  return {
    generadoEn: new Date().toISOString(),
    raiz: rutaCurso,
    curso: { ...metadatosDeCurso(carpetaCurso.name), totalArchivos, totalTemas: temas.length },
    temas,
  };
}

/**
 * Construye la URL raw de GitHub para un archivo LFS (GitHub Pages no sirve LFS).
 * @param {string} ruta Relativa al repositorio.
 * @returns {string}
 */
export function urlRawDeGitHub(ruta) {
  const remoto = process.env.GIT_REMOTE_ORIGIN ?? "git@github.com:jeironpro/oracle-academy-dpsql.git";
  const coincidencia = remoto.match(/(?:github\.com[:/])([^/]+)\/([^/]+?)(?:\.git)?$/);
  const propietario = coincidencia?.[1] ?? "jeironpro";
  const repositorio = coincidencia?.[2] ?? "oracle-academy-dpsql";
  return `https://github.com/${propietario}/${repositorio}/raw/${RAMA_BASE}/${ruta}`;
}

/** Escribe el manifiesto en disco (pretty-printed). */
export async function escribirManifesto(manifesto, ruta = RUTA_MANIFIESTO) {
  await mkdir("data", { recursive: true });
  await writeFile(ruta, `${JSON.stringify(manifesto, null, 2)}\n`, "utf8");
}

/** Punto de entrada CLI. */
async function principal() {
  const soloVerificar = process.argv.includes("--check");
  try {
    const manifesto = await generarManifesto();
    if (soloVerificar) {
      const actual = await readFileManifesto();
      const sinFecha = (m) => ({ ...m, generadoEn: "" });
      const coincide = JSON.stringify(sinFecha(actual)) === JSON.stringify(sinFecha(manifesto));
      console.log(coincide ? "Manifiesto al día." : "Manifiesto desactualizado.");
      process.exitCode = coincide ? 0 : 1;
      return;
    }
    await escribirManifesto(manifesto);
    const curso = manifesto.curso;
    console.log(
      `Manifiesto generado: ${curso.totalTemas} temas, ${curso.totalArchivos} archivos -> ${RUTA_MANIFIESTO}`,
    );
  } catch (error) {
    console.error(`Error al generar el manifiesto: ${error.message}`);
    process.exitCode = 1;
  }
}

async function readFileManifesto() {
  try {
    return JSON.parse(await readFile(RUTA_MANIFIESTO, "utf8"));
  } catch {
    return null;
  }
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  principal();
}
