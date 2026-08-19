# Libro de estilo — Oracle Academy DPSQL

Sistema de diseño del sitio web del curso «Programación de Base de Datos SQL»
(Oracle Academy, DPSQL 47–50). Unifica las skills de diseño instaladas
globalmente siguiendo el **tema Hum** de hallmark, aplicado como aplicación
a pantalla completa con panel lateral (referencia: ejemplo Hum-07 de
usehallmark.com).

Este documento es la **única fuente de verdad** de valores de diseño. La
implementación vive en `tokens.css` y en los CSS de página, que siempre
referencian tokens por nombre.

## Skills de diseño aplicadas

| Skill                             | Aporte                                                                                                                                |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| **hallmark**                      | Sistema autoritativo: tema Hum (paleta multiacento, sans redondeada, sistema de botones push, siete movimientos de marca, slop test). |
| **frontend-design**               | Jerarquía primero, sistemas antes que detalles, pulido al final, contexto de audiencia/uso/tono.                                      |
| **impeccable**                    | Craft floor y modo _Operate_: shell de aplicación escaneable y consistente, con la marca en los detalles.                             |
| **hyperframes / motion-graphics** | Movimiento contenido: presión del botón, elevación de tarjetas, pulso del punto de carácter, `prefers-reduced-motion` respetado.      |
| **dicresoft (DESIGN.md)**         | Libro de estilo obligatorio, Material Symbols, sin emojis en la UI.                                                                   |

## Paleta

Tema **Hum**: papel crema con tinte de pera, tinta fría casi negra y tres
acentos que no compiten porque cada uno tiene su propia superficie.

| Token                      | Valor (OKLCH)          | Uso                                                           |
| -------------------------- | ---------------------- | ------------------------------------------------------------- |
| `--color-paper`            | `oklch(97% 0.012 95)`  | Fondo base (crema; nunca blanco puro)                         |
| `--color-paper-2`          | `oklch(94% 0.016 95)`  | Superficies elevadas (panel, chips, soft buttons)             |
| `--color-paper-3`          | `oklch(91% 0.02 95)`   | Hover de superficies                                          |
| `--color-ink`              | `oklch(20% 0.012 250)` | Texto (nunca negro puro)                                      |
| `--color-accent` (pera)    | `oklch(86% 0.18 95)`   | Acción principal: item activo del panel, carácter, highlights |
| `--color-accent-2` (cian)  | `oklch(66% 0.18 235)`  | Enlaces, tintes hover, chip de icono PDF                      |
| `--color-accent-3` (coral) | `oklch(68% 0.24 18)`   | El único momento de alta energía: número grande del tema      |
| `--color-mint`             | `oklch(80% 0.16 150)`  | Tipos ZIP, estados de éxito (ocasional)                       |
| `--color-lavender`         | `oklch(74% 0.16 305)`  | Insignias externas (ocasional)                                |

**Regla de los tres acentos:** pera = acción principal, cian = enlaces y
tintes, coral = un solo momento por página. Sin gradientes entre acentos.
Sin serif en ningún lugar. Sin blanco puro ni negro puro.

## Tipografía

Tres familias, todas redondeadas o técnicas; **no hay serif**:

| Rol              | Familia                         | Fuente       |
| ---------------- | ------------------------------- | ------------ |
| Display / cuerpo | **Plus Jakarta Sans** (400–700) | Google Fonts |
| Mono / etiquetas | **JetBrains Mono** (400, 500)   | Google Fonts |

- Display 600, tracking `-0.025em`; body 400 con 500 para énfasis.
- Mayúsculas reservadas para etiquetas mono (`eyebrow`, chips, metadatos).
- Números grandes (`--text-bignum`) con cifras tabulares.
- Sin itálicas en encabezados; el énfasis va por peso o color.

## Espaciados y grilla

- Escala de 4 pt con nombres semánticos (`--space-2xs` … `--space-4xl`).
- Shell de aplicación: barra superior (64 px) + panel izquierdo (280 px) +
  contenido; cada columna con scroll propio, `calc(100vh - barra)`.
- Móvil (< 768 px): el panel se convierte en un cajón deslizante (300 px) que
  se abre con el menú hamburguesa y se cierra con Escape, clic en el velo o al
  elegir un tema.
- Radios: tarjetas 20 px, píldoras 999 px, inputs 12 px (Hum es redondo).

## Componentes base

### Sistema de botones (movimiento #1 de Hum)

Base `.btn` (push) con `box-shadow: 0 4px 0 0 var(--btn-edge)` + sombra de
suelo. Hover: sube 2 px y el borde crece a 6 px. `:active`: se hunde 3 px y
el borde cae a 1 px (la presión es la respuesta). Variantes `--soft` y
`--outline`; colores `--pear/--cyan/--coral/--mint/--lav/--ink`; tamaños
`--sm/--lg`. Un solo botón push por momento principal.

### Tarjetas de archivo (color-shift #3)

Tarjeta con chip de icono coloreado por tipo (PDF cian, DOCX pera, ZIP
mint), tinte de fondo al 8–14 %, elevación al hover (`translateY(-4px)` +
sombra mayor + tinte que profundiza). Acción explícita «Descargar» en
cada tarjeta; los archivos grandes (Git LFS) se descargan desde la URL
`raw` de GitHub. En la vista de tema, el menú `jump` permite saltar a
cualquier lección o práctica y resalta su tarjeta.

### Chips de filtro

Píldoras con punto de color por tipo y `aria-pressed` para el estado activo
(fondo tinta + texto papel).

### Panel lateral

Items de tema: número mono, título truncado, conteo en píldora. Item activo:
fondo pera + borde inferior de color (`box-shadow: 0 3px 0`). Botones reales,
no enlaces simulados.

## Iconografía

- **Material Symbols** (Google), estilo _Outlined_, como estándar de
  dicresoft. Sin emojis en la UI ni en el código.
- Iconos usados: `search`, `download`, `description`, `folder_zip`,
  `insert_drive_file`, `chevron_left`, `chevron_right`, `menu`, `menu_book`,
  `expand_more`, `arrow_back`.

## Movimiento

- Botón push: 140 ms hover / 70 ms active, `cubic-bezier(0.2, 0.7, 0.3, 1)`.
- Tarjetas: elevación con `--ease-spring` (220 ms) al hover.
- Punto de carácter (marca): pulso de 4 s en escala 1 → 1.08 → 1.
- `prefers-reduced-motion: reduce`: todo colapsa a ≤ 150 ms de opacidad.

## Accesibilidad

- HTML semántico, `<html lang="es">`, foco visible en cian, salto al
  contenido, `aria-pressed` en selecciones, `role="status"` + `aria-live`
  en contadores, labels asociados (`for`/`id`) con clase `.sr-only` cuando
  el campo es autoevidente.
