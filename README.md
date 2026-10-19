# Emulsión cicatrizante con caléndula · Preinforme (Farmacotecnia II, 2026-2)

Presentación web interactiva del avance del preinforme del **Grupo 1**: emulsión tópica O/W con 5 % de extracto hidroetanólico de *Calendula officinalis* para heridas agudas superficiales con pérdida de tejido que cicatrizan por segunda intención.

Incluye una **introducción** (problema clínico, la planta y el objetivo) y desarrolla los **4 primeros puntos** de los lineamientos:

1. Título
2. Perfil objetivo del producto (TPP) y QTPP según QbD
3. Literatura científica de preformulación (integrada a la propuesta)
4. Selección y justificación de excipientes

Los puntos 5 a 10 (formulaciones, referencia, metodología, elaboración, caracterización y cronograma) aparecen **difuminados** como próxima entrega. Su contenido se edita en `UPCOMING`, dentro de `js/data.js`.

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
- Las diapositivas de TPP y QTPP son el diseño original de una compañera y se muestran tal cual desde `img/tpp/`; para cambiarlas, reemplaza esas imágenes.
- `PLANT_IMAGES`: galería de la planta (con autor y licencia de cada imagen).
- Iconos: nombres de [Lucide](https://lucide.dev/icons/) en los campos `icon` o en `<i data-lucide="...">`.

Las notas del expositor y el nombre de quien presenta cada diapositiva están en los atributos `data-notes` y `data-presenter` de cada `<section>` en `index.html`.

## Estructura

```
index.html        diapositivas
css/styles.css    estilos base (tema claro/oscuro, responsivo, impresión)
css/extras.css    banner institucional, introducción, galería, puntos difuminados
img/              escudo UNAL y fotografías de la planta
js/data.js        contenido editable
js/app.js         navegación e interactividad (Vanilla JS)
```

**Integrantes:** Diana Estefania Argüello Cajicá · Edward Santiago Benitez Martinez · Cesar Steven Diaz Suarez · Paula Valentina Melo Vega · Lina Valentina Ramirez Español · Juan Sebastián Roa Gamboa

## Créditos de imágenes

Tipografía: [Ancizar Sans](https://fonts.google.com/specimen/Ancizar+Sans) (Universidad Nacional de Colombia, SIL OFL). Escudo: Universidad Nacional de Colombia. Iconos: [Lucide](https://lucide.dev) (licencia ISC). Fotografías de *Calendula officinalis* tomadas de Wikimedia Commons:

| Archivo | Autor | Licencia |
| --- | --- | --- |
| [Capítulo floral](https://commons.wikimedia.org/wiki/File:Ringelblume_(Calendula_officinalis)_Bl%C3%BCte_focus_stack-20220619-RM-165610.jpg) | Ermell | CC BY-SA 4.0 |
| [Hojas](https://commons.wikimedia.org/wiki/File:Calendula_officialis_%27Marigold%27_(Asteraceae)_leaves.JPG) | Magnus Manske | CC BY-SA 3.0 |
| [Porte de la planta](https://commons.wikimedia.org/wiki/File:Calendula_officinalis_in_Catalonia_(2).jpg) | Tournasol7 | CC BY 4.0 |
| [Lámina de Köhler](https://commons.wikimedia.org/wiki/File:Calendula_officinalis_-_K%C3%B6hler%E2%80%93s_Medizinal-Pflanzen-024.jpg) | F. E. Köhler | Dominio público |
| [Droga vegetal](https://commons.wikimedia.org/wiki/File:Calendulae_flos_255043.jpg) | Rillke | CC BY-SA 3.0 |
| [Aquenios](https://commons.wikimedia.org/wiki/File:Calendula_seeds.jpg) | Amada44 | CC BY 3.0 |
