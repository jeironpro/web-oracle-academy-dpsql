# oracle-academy-dpsql

## 📌 Descripción

Este proyecto forma parte de mi portafolio personal.

Contiene una **web estática** que muestra todo el contenido del curso
**Programación de Base de Datos SQL** (Oracle Academy, DPSQL 47–50):
106 PDF de lecciones y prácticas, 29 DOCX de prácticas, el esquema SQL del
curso y los recursos del proyecto Oracle Flix. La web organiza el temario
por temas (0–20), permite buscar y filtrar, ver los PDF en el navegador y
descargar cualquier archivo.

El objetivo es demostrar buenas prácticas de programación, organización,
documentación y diseño en GitHub: sitio estático sin dependencias de
runtime, sistema de diseño unificado, tests, CI/CD y despliegue en
GitHub Pages.

## 🧱 Stack

| Capa     | Tecnología                                                                                          |
| -------- | --------------------------------------------------------------------------------------------------- |
| Frontend | HTML5 semántico + CSS3 (custom properties, Grid/Flexbox, media queries) + JavaScript ES6+ (módulos) |
| Tooling  | npm (eslint + prettier + vitest)                                                                    |
| CI/CD    | GitHub Actions (lint + test en PR; despliegue en GitHub Pages en `main`)                            |
| Hosting  | GitHub Pages                                                                                        |

Decisión de stack según el agente de arquitectura de
[dicresoft](https://github.com/dicresoft): web informativa sin
interactividad de backend → **HTML + CSS + JS Vanilla**.

## 🎨 Diseño

Sistema de diseño unificado (libro de estilo en
[`docs/style-guide.md`](docs/style-guide.md)) a partir de las skills de
diseño instaladas globalmente:

- **hallmark** — sistema autoritativo (tokens, macroestructura, slop test).
- **frontend-design** — jerarquía primero, sistemas antes que detalles.
- **impeccable** — craft floor, modo _Read_.
- **dicresoft** — libro de estilo obligatorio, Material Symbols, sin emojis.

Macroestructura **Index-First** (la página es el índice del curso), género
editorial, tema custom: papel cálido + acento óxido. Tipografía:
Newsreader (display) + IBM Plex Sans (cuerpo) + IBM Plex Mono (outlier).

## 📁 Estructura

```text
.
├── index.html              # Catálogo del curso (índice + búsqueda + filtros)
├── visor.html              # Visor de PDF en el navegador
├── 404.html
├── css/
│   ├── tokens.css          # Design tokens (hallmark) — raíz del sistema
│   ├── base.css            # Reset y estilos base
│   ├── layout.css          # Masthead, navegación, footer
│   ├── components.css      # Botones, búsqueda, filas de archivo
│   └── pages/
│       ├── catalogo.css
│       └── visor.css
├── js/
│   ├── app.js              # Entrada del catálogo
│   ├── visor.js            # Entrada del visor
│   ├── modules/            # catalogo.js, busqueda.js, visor.js
│   ├── services/           # manifesto.js (carga y consulta del manifiesto)
│   └── utils/              # dom.js, format.js
├── data/manifesto.json     # Manifiesto generado del contenido (fuente de la UI)
├── tools/generar-manifesto.js  # Genera data/manifesto.json desde oracle_academy/
├── tests/                  # Tests (vitest)
├── docs/style-guide.md     # Libro de estilo
└── oracle_academy/         # Contenido del curso (PDF, DOCX, ZIP)
```

## 🚀 Uso

```bash
npm install        # dependencias de desarrollo (lint, test)
npm run generate   # regenera data/manifesto.json tras añadir contenido
npm run lint       # eslint
npm run format     # prettier (escritura)
npm test           # vitest
```

Para desarrollo local, servir la raíz del repositorio con cualquier
servidor estático:

```bash
npx serve .
```

## ☁️ Despliegue

El workflow `ci/pages` (GitHub Actions) ejecuta lint + tests en cada pull
request y despliega en **GitHub Pages** al hacer merge en `main`.

> Nota: el instalador `datamodeler_24_3_1_351_0831_x64.zip` (324 MB) supera
> el límite de 100 MB por archivo de GitHub y se gestiona con **Git LFS**
> (`.gitattributes`). Como GitHub Pages no sirve archivos LFS, el sitio enlaza
> su descarga a la URL `raw` de GitHub.

## 📜 Licencia

Este proyecto está bajo la licencia **MIT**.
Consulta el archivo [LICENSE](LICENSE) para más detalles.
