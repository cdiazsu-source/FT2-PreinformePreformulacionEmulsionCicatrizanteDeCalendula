# Emulsión cicatrizante con caléndula · Preinforme (Farmacotecnia II, 2026-2)

Presentación web interactiva del avance del preinforme del **Grupo 1**: emulsión tópica O/W con 5 % de extracto hidroetanólico de *Calendula officinalis* para heridas agudas superficiales con pérdida de tejido que cicatrizan por segunda intención.

Cubre los **4 primeros puntos** de los lineamientos:

1. Título
2. Perfil objetivo del producto (TPP) y QTPP según QbD
3. Literatura científica de preformulación (integrada a la propuesta)
4. Selección y justificación de excipientes

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
- Tabla QTPP expandible con filtro de CQA
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
- `QTPP`, `FORMULA`, `REFS`: tabla QTPP, fórmula base y bibliografía.

Las notas del expositor y el nombre de quien presenta cada diapositiva están en los atributos `data-notes` y `data-presenter` de cada `<section>` en `index.html`.

## Estructura

```
index.html        diapositivas
css/styles.css    estilos (tema claro/oscuro, responsivo, impresión)
js/data.js        contenido editable
js/app.js         navegación e interactividad (Vanilla JS)
```

**Integrantes:** Diana Estefania Argüello Cajicá · Edward Santiago Benitez Martinez · Cesar Steven Diaz Suarez · Paula Valentina Melo Vega · Lina Valentina Ramirez Español · Juan Sebastián Roa Gamboa
