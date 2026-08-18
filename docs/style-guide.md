# Libro de estilo — Oracle Academy DPSQL

Sistema de diseño unificado del sitio web estático del curso
«Programación de Base de Datos SQL» (Oracle Academy, DPSQL 47–50).

Este documento es la **única fuente de verdad** de valores de diseño
(colores, tipografía, espaciados, componentes). La implementación técnica
vive en `tokens.css` (custom properties) y en los CSS de página, que siempre
referencian tokens por nombre, nunca valores sueltos.

## Skills de diseño aplicadas

El sistema unifica las skills de diseño instaladas globalmente:

| Skill | Aporte |
| --- | --- |
| **hallmark** | Sistema autoritativo: tokens OKLCH, macroestructura *Index-First*, disciplina de tipografía 2+1, slop test, estampado de CSS. |
| **frontend-design** | Jerarquía en escala de grises primero, sistemas antes que detalles, pulido al final, contexto de audiencia/uso/tono. |
| **impeccable** | Craft floor y modo *Read*: la estructura prioriza la comprensión; la marca vive en los detalles precisos. |
| **hyperframes / motion-graphics** | Movimiento contenido: entradas orquestadas, sin rebotes, `prefers-reduced-motion` respetado. |
| **dicresoft (DESIGN.md)** | Libro de estilo obligatorio antes de implementar, iconos Material Symbols, sin emojis en la UI. |

## Paleta

Tema custom dentro del cluster editorial: **papel cálido + acento óxido**.
Hue ancla ≈ 60 (ámbar). Todas las superficies y neutros llevan un rastro de
croma cálido; nada de gris plano ni negro puro.

| Token | Valor (OKLCH) | Uso |
| --- | --- | --- |
| `--color-paper` | `oklch(97% 0.008 60)` | Fondo base |
| `--color-paper-2` | `oklch(94% 0.010 60)` | Superficie elevada (masthead, filas alternas) |
| `--color-paper-3` | `oklch(90% 0.012 60)` | Superficies hover, inputs |
| `--color-rule` | `oklch(84% 0.010 60)` | Hairlines y bordes |
| `--color-neutral` | `oklch(58% 0.008 60)` | Texto secundario, iconos inactivos |
| `--color-muted` | `oklch(42% 0.010 55)` | Texto atenuado, captions |
| `--color-ink` | `oklch(20% 0.012 50)` | Texto principal |
| `--color-accent` | `oklch(52% 0.14 45)` | Enlaces, activo, foco, subrayados |
| `--color-focus` | `oklch(60% 0.18 45)` | Anillo de foco visible |
| `--color-success` | `oklch(55% 0.12 150)` | Estados de éxito |
| `--color-error` | `oklch(55% 0.16 25)` | Estados de error |
| `--color-warning` | `oklch(65% 0.13 75)` | Estados de aviso |

Reglas de uso del acento: ocupa **≤ 3 %** de cualquier viewport; se usa como
subrayador (enlaces, activo, foco), nunca como fondo de bloques grandes.
Contraste mínimo: cuerpo 4.5:1, texto grande 3:1, bordes de UI 3:1.

## Tipografía

Pareja 2+1 (máximo tres familias):

| Rol | Familia | Fuente |
| --- | --- | --- |
| Display | `--font-display` | **Newsreader** (Google Fonts, serif romana, ejes ópticos) |
| Cuerpo | `--font-body` | **IBM Plex Sans** (Google Fonts, sans técnica legible) |
| Outlier | `--font-mono` | **IBM Plex Mono** (Google Fonts) — solo rutas, metadatos, etiquetas técnicas y cifras tabulares |

Escala tipográfica 1.25 (tercera mayor), base 16 px. Display con
`letter-spacing: -0.02em` a `-0.04em`; etiquetas en mayúsculas con
`letter-spacing: 0.08em`. Body mínimo 16 px, line-height 1.5–1.65,
medida 45–75 caracteres (`max-width: 65ch`). Sin encabezados en itálica
(la itálica solo vive en énfasis del cuerpo).

## Espaciados y grilla

Escala de 4 pt con nombres semánticos:

`--space-2xs: 0.25rem` · `--space-xs: 0.5rem` · `--space-sm: 0.75rem` ·
`--space-md: 1rem` · `--space-lg: 1.5rem` · `--space-xl: 2rem` ·
`--space-2xl: 3rem` · `--space-3xl: 4rem` · `--space-4xl: 6rem`

- Mobile-first: estilos base para móvil, media queries `min-width` para ampliar.
- Breakpoints: 480 px · 768 px · 1024 px · 1280 px.
- Secciones principales separadas con `--space-3xl` mínimo.
- Radios pequeños (papel, no vidrio): `--radius-sm: 2px`, `--radius-md: 4px`.

## Componentes base

### Botón
Estados: default · hover · `:focus-visible` · `:active` · disabled ·
loading · error · success. Botón primario: fondo `--color-ink`, texto
`--color-paper`, hover `--color-muted`. Botón secundario: borde hairline
`--color-rule`, texto `--color-ink`, hover `--color-paper-3`.
Sin `!important` salvo terceros. Focus ring ≥ 3:1, instantáneo (nunca animado).

### Campo de búsqueda
`input` asociado a su `label` (`for`/`id`). Borde hairline, fondo
`--color-paper`, hover `--color-paper-3`, foco con anillo `--color-focus`.
Mensajes de estado siempre con `role="status"` o `aria-live`.

### Filas de archivo (índice)
Estructura en hairlines: fila completa clickeable con enlace real (nunca un
`div` con `role`), nombre en `--color-ink`, metadatos (tipo, tamaño, lección)
en `--font-mono` y `--color-muted`, hover con fondo `--color-paper-2` y
subrayado de acento en el nombre. Descarga siempre accesible aparte del visor.

## Iconografía

- **Material Symbols** (Google), estilo *Outlined*, como estándar
  (regla de dicresoft `DESIGN.md` / `GENERALS_RULES.md`).
- Sin emojis en la UI ni en el código.
- Iconos usados: `search`, `download`, `open_in_new`, `chevron_left`,
  `chevron_right`, `description`, `folder`, `link` (enlace externo).

## Accesibilidad

- HTML semántico (`header`, `nav`, `main`, `section`, `article`, `footer`).
- `<html lang="es">`, `meta charset`, `meta viewport`, `title` descriptivo.
- Imágenes con `alt`; decorativas con `alt=""`.
- Orden de tabulación lógico; foco visible en todos los interactivos.
- `prefers-reduced-motion: reduce` → las transiciones colapsan a ≤ 150 ms
  de opacidad.

## Movimiento

- Animar solo `transform` y `opacity`, nunca propiedades de layout.
- Easings nombrados: `--ease-out`, `--ease-in`, `--ease-in-out`.
- Máximo tres microinteracciones por página. Entrada orquestada única.
