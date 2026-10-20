# Emulsión cicatrizante con caléndula · Preinforme (Farmacotecnia II, 2026-2)

Presentación web interactiva del avance del preinforme del **Grupo 1**: emulsión tópica O/W con 5 % de extracto hidroetanólico de *Calendula officinalis* para heridas agudas superficiales con pérdida de tejido que cicatrizan por segunda intención.

La exposición sigue **diapositiva por diapositiva la presentación del grupo en Canva** (`Pre-Informe Tecnia 2 (Emulsión de Calendula).pdf`): la misma distribución y el mismo contenido, rehechos como tarjetas con el estilo del proyecto. Solo la portada, los integrantes y el índice son diseño propio.

| # | Contenido |
| --- | --- |
| 1–3 | Portada, integrantes e índice |
| 4–7 | TPP (2) y QTPP (tarjetas y tabla) |
| 8–24 | Tabla de excipientes y justificación de cada uno: principio activo, emulsionante y HLB, viscosante, antioxidante, regulador de pH, fase vehicular y conservante (con los candidatos descartados) |
| 25–26 | Inestabilidad física en la interfase O/W y puntos críticos de control |
| 27–30 | Bibliografía (3) y cierre |
| 31–46 | **Anexo**: material interactivo de apoyo para preguntas (no forma parte de la exposición) |
| 47–52 | Puntos 5 a 10 del preinforme, difuminados como próxima entrega (`UPCOMING` en `js/data.js`) |

Las imágenes del Canva se reinterpretaron como ilustraciones SVG propias (piel con herida, escudo, gota, flor, percolador, escala HLB, cera Polawax, goma xantana en notación de símbolos de monosacáridos, carbómero, HEC, bidón, membrana bacteriana, vasos de inestabilidad, termómetro, tubo y frasco). Las estructuras químicas son de PubChem y están guardadas en `img/struct/` para que funcionen sin conexión.

## Ver la presentación

- **En línea:** activa GitHub Pages (*Settings → Pages → Deploy from branch → `main` / root*) y abre `https://cdiazsu-source.github.io/FT2-PreinformePreformulacionEmulsionCicatrizanteDeCalendula/`.
- **Local:** abre `index.html` en el navegador. No necesita instalación ni conexión, salvo para las fuentes y las estructuras químicas, que se cargan desde PubChem.

### Controles

| Tecla | Acción |
| --- | --- |
| `←` `→` / espacio / deslizar | Diapositiva anterior / siguiente |
| `O` | Vista general (saltar a cualquier diapositiva) |
| `N` | Notas del expositor (guion y quién expone) |
| `T` | Tema claro / oscuro |
| `F` | Pantalla completa |
| `Ctrl + P` | Exportar a PDF (una diapositiva por página) |

Cada diapositiva tiene una URL propia (`#/7` = QTPP), útil para compartir.

## Elementos interactivos

- Fases de la cicatrización y dónde actúa cada metabolito
- Flujo QbD (QTPP → CQA → CMA/CPP → espacio de diseño → control)
- Rueda fitoquímica: papel terapéutico frente a la implicación en la formulación
- Selector de solvente de extracción (agua → hidroetanólico → apolar)
- Simulador de la Ley de Stokes (cremado frente a viscosidad y tamaño de gota)
- Matriz de interacciones entre excipientes
- Selector de excipientes: candidatos, seleccionado y motivo del descarte
- Calculadora HLB para Tween 80 / Span 80
- Fórmula base tentativa

## Cómo consolidar los aportes del grupo

Todo el contenido editable está en **`js/data.js`**, sin necesidad de tocar el HTML:

- `CONFIG.organo`: órgano vegetal del extracto (`"hojas"` o `"flores"`); se actualiza en toda la presentación.
- `EXCIPIENTS`: por cada función, `who` (quién expone), `status` (`"ok"` o `"draft"` = borrador) y la justificación de cada candidato.
- `FORMULA`, `REFS`: fórmula base y bibliografía.
- Las diapositivas de la exposición (TPP a cierre) reproducen el texto y la distribución del Canva del grupo; se editan directamente en `index.html`.
- `REFS`: bibliografía tal como aparece en el Canva (referencias 1 a 20).
- `PLANT_IMAGES`: galería de la planta (con autor y licencia de cada imagen).
- Iconos: nombres de [Lucide](https://lucide.dev/icons/) en los campos `icon` o en `<i data-lucide="...">`.

Las notas del expositor y el nombre de quien presenta cada diapositiva están en los atributos `data-notes` y `data-presenter` de cada `<section>` en `index.html`.

## Estructura

```
index.html        diapositivas
css/styles.css    estilos base (tema claro/oscuro, responsivo, impresión)
css/extras.css    banner institucional, introducción, galería, puntos difuminados
css/canva.css     diapositivas reconstruidas del Canva e ilustraciones
img/              escudo UNAL, fotografías de la planta y estructuras (img/struct)
js/data.js        contenido editable
js/app.js         navegación e interactividad (Vanilla JS)
```

**Integrantes:** Diana Estefania Argüello Cajicá · Edward Santiago Benitez Martinez · Cesar Steven Diaz Suarez · Paula Valentina Melo Vega · Lina Valentina Ramirez Español · Juan Sebastián Roa Gamboa

## Créditos de imágenes

Tipografía: [Ancizar Sans](https://fonts.google.com/specimen/Ancizar+Sans) (Universidad Nacional de Colombia, SIL OFL). Escudo: Universidad Nacional de Colombia. Iconos: [Lucide](https://lucide.dev) (licencia ISC). Estructuras químicas: [PubChem](https://pubchem.ncbi.nlm.nih.gov) (dominio público). Fotografías de *Calendula officinalis* tomadas de Wikimedia Commons:

| Archivo | Autor | Licencia |
| --- | --- | --- |
| [Capítulo floral](https://commons.wikimedia.org/wiki/File:Ringelblume_(Calendula_officinalis)_Bl%C3%BCte_focus_stack-20220619-RM-165610.jpg) | Ermell | CC BY-SA 4.0 |
| [Hojas](https://commons.wikimedia.org/wiki/File:Calendula_officialis_%27Marigold%27_(Asteraceae)_leaves.JPG) | Magnus Manske | CC BY-SA 3.0 |
| [Porte de la planta](https://commons.wikimedia.org/wiki/File:Calendula_officinalis_in_Catalonia_(2).jpg) | Tournasol7 | CC BY 4.0 |
| [Lámina de Köhler](https://commons.wikimedia.org/wiki/File:Calendula_officinalis_-_K%C3%B6hler%E2%80%93s_Medizinal-Pflanzen-024.jpg) | F. E. Köhler | Dominio público |
| [Droga vegetal](https://commons.wikimedia.org/wiki/File:Calendulae_flos_255043.jpg) | Rillke | CC BY-SA 3.0 |
| [Aquenios](https://commons.wikimedia.org/wiki/File:Calendula_seeds.jpg) | Amada44 | CC BY 3.0 |
