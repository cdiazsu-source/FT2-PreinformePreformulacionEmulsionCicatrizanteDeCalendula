/* =========================================================
   Contenido de la presentación. Edita aquí para consolidar
   los aportes del grupo sin tocar el HTML ni la lógica.
   ========================================================= */

const CONFIG = {
  // Órgano vegetal del extracto. El documento del grupo dice "flores"
  // (Calendulae flos); el enunciado del producto dice "hojas".
  // Cambia este valor y se actualiza en toda la presentación.
  organo: "hojas"
};

const TEAM = [
  "Diana Estefania Argüello Cajicá",
  "Edward Santiago Benitez Martinez",
  "Cesar Steven Diaz Suarez",
  "Paula Valentina Melo Vega",
  "Lina Valentina Ramirez Español",
  "Juan Sebastián Roa Gamboa"
];

/* ---------- Comparación de formas farmacéuticas ---------- */
const FORMS = [
  { name: "Emulsión O/W", pick: true, pros: ["No oclusiva: no macera la herida", "Lavable y extensible", "Vehiculiza la fracción lipófila y la hidrófila del extracto"], cons: ["Necesita conservante y antioxidante"] },
  { name: "Emulsión W/O", pros: ["Emoliente, oclusiva"], cons: ["Grasosa y difícil de retirar del lecho", "Puede retener exudado y macerar"] },
  { name: "Gel acuoso", pros: ["Fresco y transparente"], cons: ["No disuelve el faradiol (log P > 5)", "Sin aporte emoliente"] },
  { name: "Ungüento", pros: ["Muy estable"], cons: ["Excluye los flavonoides polares", "Oclusivo, doloroso de retirar"] }
];

/* ---------- Fases de la cicatrización ---------- */
const PHASES = [
  { icon: "droplet", name: "Hemostasia", time: "minutos–horas", text: "Formación del coágulo de fibrina y liberación de factores de crecimiento plaquetarios.", actors: [], role: "La emulsión no interviene; se aplica sobre la herida limpia." },
  { icon: "flame", name: "Inflamación", time: "1–4 días", text: "Llegan neutrófilos y macrófagos, se liberan mediadores (prostaglandinas, leucotrienos) y especies reactivas de oxígeno.", actors: ["Ésteres de faradiol: ↓ COX-2/LOX", "Flavonoides: captura de ROS, ↓ edema", "Taninos y flavonoides: antisépticos"], role: "Fase principal de acción antiinflamatoria y antiséptica.", hot: true },
  { icon: "sprout", name: "Proliferación", time: "4–21 días", text: "Tejido de granulación, angiogénesis, depósito de colágeno y reepitelización desde los bordes: es la fase que define el cierre por segunda intención.", actors: ["Faradiol: proliferación y migración de fibroblastos", "Carotenoides y saponinas: reepitelización", "Polisacáridos: ambiente húmedo"], role: "Fase principal de acción cicatrizante.", hot: true },
  { icon: "refresh-cw", name: "Remodelación", time: "21 días – 1 año", text: "Maduración del colágeno de tipo III a tipo I y contracción de la cicatriz.", actors: ["Antioxidantes: limitan el daño oxidativo residual"], role: "Efecto secundario de soporte." }
];

/* ---------- Flujo QbD ---------- */
const QBD = [
  { icon: "target", k: "QTPP", t: "Perfil objetivo de calidad", d: "Resumen prospectivo de las características de calidad que el producto debe tener: emulsión O/W homogénea, pH 5,0–6,0, viscosidad 15 000–17 000 cP, gota 0,1–10 µm, adhesividad 20–60 N·mm, 5 % de extracto y límites microbianos farmacopeicos." },
  { icon: "list-checks", k: "CQA", t: "Atributos críticos de calidad", d: "Propiedades físicas, químicas o microbiológicas que deben estar en un intervalo para asegurar la calidad: viscosidad, pH, tamaño de gota, contenido de fitoactivos (marcadores: faradiol y rutina), carga microbiana y apariencia." },
  { icon: "package", k: "CMA", t: "Atributos de materiales", d: "Características de las materias primas que afectan los CQA: perfil fitoquímico y contenido de electrolitos del extracto, índice de peróxidos del Tween 80, pureza del agua (metales traza) y grado de la goma xantana." },
  { icon: "settings-2", k: "CPP", t: "Parámetros de proceso", d: "Variables del proceso que afectan los CQA: temperatura de las fases al emulsionar, velocidad y tiempo de homogenización, orden de adición del extracto y temperatura de incorporación (para proteger los termolábiles)." },
  { icon: "grid-3x3", k: "DS", t: "Espacio de diseño", d: "Combinación multidimensional de CMA y CPP en la que se asegura la calidad. Se explorará con las formulaciones propuestas (punto 5) variando el HLB y el % de emulsionante, el % de goma xantana y las condiciones de homogenización." },
  { icon: "shield-check", k: "CS", t: "Estrategia de control", d: "Controles en proceso y del producto terminado: pH, viscosidad, microscopía de gota, centrifugación, ciclos de temperatura y recuento microbiano." }
];

/* ---------- Metabolitos ---------- */
const PHYTO = [
  { name: "Triterpenoides", color: "amber", ex: "Ésteres de faradiol (3-O-palmitato, 3-O-miristato), arnidiol", act: "Antiinflamatorio principal (↓ COX-2/LOX) y estímulo de fibroblastos.", form: "Muy lipófilos (log P > 5): requieren una fase oleosa o un solvente con etanol. Sus ésteres son sensibles a la hidrólisis." },
  { name: "Flavonoides", color: "green", ex: "Rutina, hiperósido, quercetina (O-glicósidos)", act: "Antioxidante, captura de ROS, ↓ permeabilidad capilar, antiséptico.", form: "Polaridad intermedia-alta: solubles en mezclas hidroetanólicas, poco solubles en agua fría." },
  { name: "Carotenoides", color: "rose", ex: "Luteína, licopeno, β-caroteno", act: "Reepitelización y diferenciación de queratinocitos; dan el color.", form: "Dobles enlaces conjugados: foto y oxidolábiles. Determinan el color del QTPP y exigen antioxidante y envase opaco." },
  { name: "Saponinas", color: "violet", ex: "Glucósidos del ácido oleanólico", act: "Antiinflamatorio; favorecen la reepitelización.", form: "Tensoactivos naturales: pueden modificar la interfase y el HLB efectivo." },
  { name: "Polisacáridos", color: "blue", ex: "Mucílagos (ramnoarabinogalactanos)", act: "Inmunomodulación y ambiente húmedo en la herida.", form: "Aportan viscosidad y son sustrato para microorganismos: exigen un conservante." },
  { name: "Taninos", color: "brown", ex: "Polifenoles condensados", act: "Astringente y antiséptico.", form: "Pueden interactuar con proteínas y con iones metálicos; contribuyen al color." }
];

/* ---------- Cadena de oxidación ---------- */
const CHAIN = [
  { t: "Luz · O₂ · Cu/Fe", s: "Iniciadores" },
  { t: "Tween 80 (POE + oleato cis)", s: "Ataque radicalario" },
  { t: "Hidroperóxidos de éter", s: "ROOH" },
  { t: "Aldehídos y ácidos", s: "Fragmentación" },
  { t: "pH < 4,5 · ↑CMC · coalescencia", s: "Falla de la emulsión", bad: true },
  { t: "Carotenoides y faradiol oxidados", s: "Decoloración y pérdida de potencia", bad: true }
];
const CHAIN_CONTROLS = [
  { at: 0, t: "Envase opaco · agua USP · citrato (quelante)" },
  { at: 2, t: "α-Tocoferol 0,1 % cede H· al radical ROO·" }
];

/* ---------- Matriz de interacciones ---------- */
const MATRIX_ITEMS = ["Extracto", "Goma xantana", "Tween 80", "Fenoxietanol", "Glicerina", "α-Tocoferol", "MCT"];
const INTERACTIONS = [
  { a: "Extracto", b: "Goma xantana", type: "good", title: "Alta compatibilidad", text: "Los electrolitos y taninos del extracto apantallarían las cargas de un carbómero y lo harían colapsar; la goma xantana conserva su hélice rígida y la viscosidad objetivo." },
  { a: "Tween 80", b: "Fenoxietanol", type: "warn", title: "Inactivación parcial", text: "Las micelas de polisorbato solubilizan parte del conservante y bajan su fracción libre. La etilhexilglicerina compensa por sinergia en la membrana microbiana." },
  { a: "Glicerina", b: "Goma xantana", type: "good", title: "Sinergia por puentes de H", text: "La glicerina solvata la red del hidrocoloide, retiene agua en la película aplicada, mejora la plasticidad y evita la desecación." },
  { a: "α-Tocoferol", b: "MCT", type: "good", title: "Protección lipídica", text: "Se disuelve homogéneamente en los MCT y protege los dobles enlaces de los carotenoides y los ésteres de faradiol frente a las ROS." },
  { a: "α-Tocoferol", b: "Tween 80", type: "good", title: "Previene la autooxidación POE", text: "Interrumpe la propagación radicalaria en la interfase y evita la formación de peróxidos y la caída del pH." },
  { a: "Extracto", b: "Tween 80", type: "warn", title: "Oxidación cruzada", text: "Los hidroperóxidos del polisorbato oxidan carotenoides y flavonoides. Se controla con tocoferol, Tween 80 de bajo índice de peróxidos y envase opaco." },
  { a: "Extracto", b: "MCT", type: "good", title: "Solubilización lipófila", text: "Los MCT disuelven la fracción triterpénica (faradiol) y la mantienen en la fase interna." }
];

/* ---------- Excipientes (Tabla 2 ampliada) ----------
   status: "ok" = redactado en el documento · "draft" = borrador para validar */
const EXCIPIENTS = [
  {
    fn: "Principio activo", icon: "leaf", who: "Por asignar", status: "ok",
    sel: "Extracto hidroetanólico de Calendula officinalis 5 %", pct: "5,0 %",
    candidates: [
      { n: "Extracto acuoso", why: "No solubiliza los ésteres de faradiol ni los carotenoides: se pierden los principios antiinflamatorios y cicatrizantes." },
      { n: "Extracto oleoso", why: "Disuelve la fracción triterpénica pero excluye los flavonoides antioxidantes y añade una carga grasa no estandarizada que altera el HLB requerido." },
      { n: "Extracto hidroetanólico 60–70 % v/v", why: "Su constante dieléctrica intermedia extrae a la vez la fracción lipófila y la hidrófila. Maceración agitada o percolación en frío (20–25 °C).", pick: true }
    ],
    refs: [8, 10, 11, 12]
  },
  {
    fn: "Fase oleosa / emoliente", icon: "droplet", who: "Cesar Steven Diaz Suarez", status: "draft",
    sel: "Triglicéridos de cadena media (MCT) + alcohol cetílico", pct: "8,0 % + 3,0 %",
    candidates: [
      { n: "Aceite mineral", why: "Oclusivo y no polar: solubiliza mal los triterpenos oxigenados y forma una película que puede retener exudado en la herida." },
      { n: "Aceite de almendras dulces", why: "Rico en ácidos grasos insaturados (oleico, linoleico): se enrancia, varía entre lotes y es un posible alérgeno (frutos secos)." },
      { n: "MCT (triglicéridos caprílico/cáprico)", why: "Saturados, por lo que son resistentes a la oxidación; de baja viscosidad y buena extensibilidad; buenos solventes de la fracción triterpénica y del tocoferol; muy poco solubles en agua, lo que frena la maduración de Ostwald. HLB requerido ≈ 11.", pick: true },
      { n: "Alcohol cetílico (coemulsionante)", why: "Aporta consistencia y forma, con el emulsionante, una red de gel cristalino en la fase continua que refuerza la película interfacial. HLB requerido ≈ 15,5.", pick: true }
    ],
    refs: [13]
  },
  {
    fn: "Sistema emulsionante", icon: "blend", who: "Diana Estefania Argüello Cajicá", status: "ok",
    sel: "Tween 80 (polisorbato 80) + Span 80 (monooleato de sorbitán)", pct: "5,0 % total (ver HLB)",
    candidates: [
      { n: "Cera autoemulsionable (Polawax)", why: "HLB fijo que impide el ajuste fino de la interfase; consistencia excesivamente cerosa." },
      { n: "Lecitina de soya", why: "Fosfolípidos poliinsaturados muy autooxidables: enranciamiento, cambio de color y variabilidad entre lotes." },
      { n: "Tween 60 / Span 60", why: "Ésteres de ácido esteárico saturado: sólidos cerosos que exigen emulsionar a mayor temperatura y arriesgan los termolábiles del extracto." },
      { n: "Tween 80 / Span 80", why: "No iónicos, compatibles con extractos complejos, estables en un amplio intervalo de pH y con electrolitos. Al ser oleatos cis son líquidos y permiten procesar a temperatura moderada. El HLB se ajusta por aligación (4,3 ↔ 15,0).", pick: true }
    ],
    refs: [{ n: 13, p: "p. 678" }, 14],
    extra: {"t":"Compatibilidad con el fitocomplejo","d":"Al no tener carga eléctrica, el par Tween 80 / Span 80 no forma sales ni complejos electrostáticos insolubles con los flavonoides polares (rutina, quercetina, hiperósido), lo que evita su floculación o precipitación durante el almacenamiento. Además, sus micelas mixtas alojan los ésteres de faradiol en el núcleo de cadenas oleicas: distribuyen el activo cicatrizante de forma uniforme en la emulsión y lo protegen de la hidrólisis en la interfase acuosa.","refs":[14]}
  },
  {
    fn: "Modificador reológico", icon: "waves", who: "Lina Valentina Ramirez Español", status: "ok",
    sel: "Goma xantana", pct: "0,5 %",
    candidates: [
      { n: "Carbopol 940", why: "Colapsa y pierde viscosidad ante los iones del extracto; además exige neutralizar con una base." },
      { n: "Hidroxietilcelulosa (HEC)", why: "Menor pseudoplasticidad y menor rendimiento de viscosidad a igual concentración." },
      { n: "Goma xantana", why: "Heteropolisacárido aniónico que forma una red 3D en reposo (inmoviliza gotas según Stokes); es pseudoplástica y tixotrópica, por lo que se extiende sin trauma y luego recupera viscosidad. Tolera electrolitos y es estable a pH 5–6.", pick: true }
    ],
    refs: [{ n: 13, p: "pp. 782–784" }, 15]
  },
  {
    fn: "Humectante", icon: "droplets", who: "Cesar Steven Diaz Suarez", status: "draft",
    sel: "Glicerina", pct: "5,0 %",
    candidates: [
      { n: "Propilenglicol", why: "Mayor potencial de irritación y sensibilización en piel comprometida; además es un promotor de penetración no deseado para un efecto local." },
      { n: "Sorbitol", why: "Menos higroscópico; puede cristalizar en el envase y deja un residuo pegajoso." },
      { n: "Glicerina", why: "Muy higroscópica y bien tolerada en piel lesionada; mantiene el ambiente húmedo que favorece la reepitelización; forma puentes de H con la goma xantana (sinergia) y evita la desecación del producto.", pick: true }
    ],
    refs: [13]
  },
  {
    fn: "Antioxidante", icon: "shield", who: "Lina Valentina Ramirez Español", status: "ok",
    sel: "α-Tocoferol (vitamina E)", pct: "0,1 %",
    candidates: [
      { n: "BHT / BHA", why: "Sintéticos, con potencial de sensibilización e irritación en tejido expuesto." },
      { n: "Metabisulfito de sodio", why: "Hidrosoluble: no protege la fase oleosa ni la interfase, y es un alérgeno conocido." },
      { n: "α-Tocoferol", why: "Antioxidante lipófilo primario que rompe la cadena radicalaria: cede el H del cromanol al radical ROO· y forma un radical tocoferilo estable. Protege el Tween 80 (POE), los carotenoides y el faradiol; es biocompatible.", pick: true }
    ],
    refs: [{ n: 13, p: "pp. 31–32" }, 16]
  },
  {
    fn: "Conservante", icon: "shield-plus", who: "Juan Sebastián Roa Gamboa", status: "ok",
    sel: "Fenoxietanol + etilhexilglicerina", pct: "1,0 % (≈ 9:1)",
    candidates: [
      { n: "Mezcla de parabenos", why: "Riesgo de sensibilización en piel lesionada; parcialmente inactivados por polisorbatos." },
      { n: "Benzoato de sodio / sorbato de potasio", why: "Solo son eficaces en su forma ácida (pH < 5): poca eficacia en el intervalo 5,0–6,0." },
      { n: "Fenoxietanol + etilhexilglicerina", why: "Amplio espectro y eficacia en el intervalo de pH objetivo. La etilhexilglicerina reduce la tensión de la membrana microbiana y potencia el fenoxietanol, lo que compensa su solubilización micelar.", pick: true }
    ],
    refs: []
  },
  {
    fn: "Regulador de pH", icon: "scale", who: "Edward Santiago Benitez Martinez", status: "draft",
    sel: "Buffer ácido cítrico / citrato de sodio", pct: "c.s. pH 5,0–6,0",
    candidates: [
      { n: "Trietanolamina", why: "Base orgánica: sube el pH hacia valores alcalinos (solo es necesaria para neutralizar el carbómero, que no se usa); presenta riesgo de formar nitrosaminas y de irritar." },
      { n: "Ácido cítrico / citrato de sodio", why: "pKa 3,13 · 4,76 · 6,40: alta capacidad amortiguadora entre 5 y 6, que es la zona de mínima hidrólisis de ésteres y la compatible con el manto ácido. El citrato además quela Cu/Fe, que catalizan la oxidación del Tween 80.", pick: true }
    ],
    refs: []
  },
  {
    fn: "Fase vehicular", icon: "glass-water", who: "Edward Santiago Benitez Martinez", status: "draft",
    sel: "Agua purificada USP", pct: "c.s.p. 100 %",
    candidates: [
      { n: "Agua desionizada", why: "Retira iones, pero no garantiza especificaciones microbiológicas ni de carbono orgánico total." },
      { n: "Agua purificada USP", why: "Monografía con límites de conductividad, COT y carga microbiana; libre de metales traza que catalizan la oxidación de POE.", pick: true }
    ],
    refs: []
  }
];

/* ---------- Fórmula base tentativa ---------- */
const FORMULA = [
  { n: "Extracto hidroetanólico de caléndula", pct: 5.0, phase: "Acuosa (incorporar < 40 °C)", fn: "Activo", fixed: true, c: "#f39c12" },
  { n: "Triglicéridos de cadena media", pct: 8.0, phase: "Oleosa", fn: "Fase oleosa / emoliente", fixed: false, c: "#e6b34a" },
  { n: "Alcohol cetílico", pct: 3.0, phase: "Oleosa", fn: "Coemulsionante / consistencia", fixed: false, c: "#c99a3c" },
  { n: "Tween 80", pct: 3.7, phase: "Acuosa", fn: "Emulsionante O/W", fixed: false, c: "#5aa469" },
  { n: "Span 80", pct: 1.3, phase: "Oleosa", fn: "Emulsionante lipófilo", fixed: false, c: "#3e7f50" },
  { n: "Goma xantana", pct: 0.5, phase: "Acuosa", fn: "Viscosante", fixed: true, c: "#7a8cc2" },
  { n: "Glicerina", pct: 5.0, phase: "Acuosa", fn: "Humectante", fixed: true, c: "#8fb6d9" },
  { n: "α-Tocoferol", pct: 0.1, phase: "Oleosa", fn: "Antioxidante", fixed: true, c: "#d4664a" },
  { n: "Fenoxietanol + etilhexilglicerina", pct: 1.0, phase: "Enfriamiento", fn: "Conservante", fixed: false, c: "#b07cc6" },
  { n: "Ácido cítrico / citrato de sodio", pct: 0.2, phase: "Acuosa", fn: "Buffer pH 5,0–6,0", fixed: false, c: "#9a9a9a" },
  { n: "Agua purificada USP", pct: null, phase: "Acuosa", fn: "Vehículo (c.s.p. 100 g)", fixed: true, c: "#cfe3ec" }
];

/* ---------- Trazabilidad riesgo → excipiente ---------- */
const TRACE = [
  { r: "Polaridad dual del fitocomplejo", e: "Extracto hidroetanólico 60–70 % + emulsión O/W" },
  { r: "Cremado (Stokes)", e: "Goma xantana 0,5 % + gota 0,1–10 µm" },
  { r: "Coalescencia", e: "Película mixta Tween 80 / Span 80 + alcohol cetílico" },
  { r: "Maduración de Ostwald", e: "MCT, de baja solubilidad acuosa" },
  { r: "Autooxidación de POE y carotenoides", e: "α-Tocoferol + citrato quelante + envase opaco" },
  { r: "Hidrólisis de ésteres", e: "Buffer cítrico/citrato pH 5,0–6,0" },
  { r: "Contaminación microbiana", e: "Fenoxietanol + etilhexilglicerina" },
  { r: "Desecación y fricción en la herida", e: "Glicerina + reología pseudoplástica" }
];

/* ---------- Bibliografía (IEEE) ---------- */
const REFS = [
  'G. S. Giostri, E. M. Novak, M. Buzzi y L. C. Guarita-Souza, "Treatment of acute wounds in hand with Calendula officinalis L.: A randomized trial," <i>Tissue Barriers</i>, vol. 10, no. 3, art. 1994822, 2022, doi: <a href="https://doi.org/10.1080/21688370.2021.1994822" target="_blank" rel="noopener">10.1080/21688370.2021.1994822</a>.',
  'Gorain <i>et al.</i>, "Advanced drug delivery systems containing herbal components for wound healing," <i>Int. J. Pharm.</i>, vol. 617, art. 121617, mar. 2022, doi: <a href="https://doi.org/10.1016/j.ijpharm.2022.121617" target="_blank" rel="noopener">10.1016/j.ijpharm.2022.121617</a>.',
  'N. A. Lara Cáceres y A. S. López Valverde, "Evaluación teórica y experimental de un tónico dermocosmético a base de <i>Calendula officinalis</i> y <i>Hamamelis virginiana</i> como coadyuvante en el tratamiento del acné," Tesis de licenciatura, Fac. de Farmacia, Univ. de Iberoamérica, San José, Costa Rica, 2025.',
  'V. C. K. N. Deuschle, R. A. N. Deuschle, M. R. Bortoluzzi y M. L. Athayde, "Physical chemistry evaluation of stability, spreadability, in vitro antioxidant, and photo-protective capacities of topical formulations containing Calendula officinalis L. leaf extract," <i>Braz. J. Pharm. Sci.</i>, vol. 51, no. 1, pp. 63–75, 2015, doi: <a href="https://doi.org/10.1590/S1984-82502015000100007" target="_blank" rel="noopener">10.1590/S1984-82502015000100007</a>.',
  'N. S. Jadhav <i>et al.</i>, "Development of a Calendula officinalis-based emulgel as a topical herbal therapy for leg ulcer management: Formulation and in vivo assessment," <i>Int. J. Pharm. Sci.</i>, vol. 3, no. 6, pp. 2010–2027, 2025, doi: <a href="https://doi.org/10.5281/zenodo.15633223" target="_blank" rel="noopener">10.5281/zenodo.15633223</a>.',
  'K. Valandro, L. Johann, L. S. Ely, J. Herber y M. P. M. Rigo, "Evaluation of physicochemical, microbiological and cutaneous permeation properties of Calendula officinalis L. in different concentrations and dosage forms," en <i>Health and Medicine: Science, Care, and Discoveries</i>, cap. 49, 2023, doi: <a href="https://doi.org/10.56238/sevened2023.004-049" target="_blank" rel="noopener">10.56238/sevened2023.004-049</a>.',
  'M. S. Sánchez <i>et al.</i>, "El cultivo de la Caléndula (Calendula officinalis L.)," 2007. [En línea]. Disponible: <a href="https://repositorio.unal.edu.co/handle/unal/8696" target="_blank" rel="noopener">repositorio.unal.edu.co/handle/unal/8696</a>',
  'European Medicines Agency (EMA), "Calendulae flos – herbal medicinal product," 2009. [En línea]. Disponible: <a href="https://www.ema.europa.eu/es/medicines/herbal/calendulae-flos" target="_blank" rel="noopener">ema.europa.eu</a>',
  'K. Shahane <i>et al.</i>, "An updated review on the multifaceted therapeutic potential of Calendula officinalis L.," <i>Pharmaceuticals</i>, vol. 16, no. 4, art. 611, 2023, doi: <a href="https://doi.org/10.3390/ph16040611" target="_blank" rel="noopener">10.3390/ph16040611</a>.',
  'PubChem, "Faradiol," National Library of Medicine. [En línea]. Disponible: <a href="https://pubchem.ncbi.nlm.nih.gov/compound/Faradiol" target="_blank" rel="noopener">pubchem.ncbi.nlm.nih.gov</a>',
  'J. Zi, B. Peng y W. Yan, "Solubilities of rutin in eight solvents at T = 283.15, 298.15, 313.15, 323.15, and 333.15 K," <i>Fluid Phase Equilib.</i>, vol. 261, no. 1–2, pp. 111–114, 2007, doi: <a href="https://doi.org/10.1016/j.fluid.2007.07.030" target="_blank" rel="noopener">10.1016/j.fluid.2007.07.030</a>.',
  'M. E. Aulton y K. M. G. Taylor, Eds., <i>Aulton\'s Pharmaceutics: The Design and Manufacture of Medicines</i>, 5.ª ed. Elsevier, 2018, cap. 42, p. 763.',
  'R. C. Rowe, P. J. Sheskey y M. E. Quinn, Eds., <i>Handbook of Pharmaceutical Excipients</i>, 6.ª ed. London: Pharmaceutical Press, 2009.',
  'A. Taraba, K. Szymczyk, A. Zdziennicka y B. Jańczuk, "Mutual influence of some flavonoids and classical nonionic surfactants on their adsorption and volumetric properties at different temperatures," <i>Molecules</i>, vol. 27, no. 9, art. 2842, 2022, doi: <a href="https://doi.org/10.3390/molecules27092842" target="_blank" rel="noopener">10.3390/molecules27092842</a>.',
  'V. Krstonošić, L. Dokić y M. Milanović, "Influence of xanthan gum on oil-in-water emulsion characteristics stabilized by OSA starch," <i>Food Hydrocolloids</i>, vol. 45, pp. 9–17, 2015.',
  'A. F. Vega y C. T. Quirino, "Evaluación de la influencia de agentes antioxidantes en la estabilidad de las dispersiones líquido-cristalinas," Proyecto de servicio social, Universidad Autónoma Metropolitana, Unidad Xochimilco, Ciudad de México, México.'
];

/* ---------- Galería de la planta (Wikimedia Commons) ---------- */
const PLANT_IMAGES = [
  { src: "img/planta/flor.jpg", t: "Capítulo floral", d: "Flores liguladas amarillo-anaranjadas y flores tubulosas centrales.", credit: "Ermell · CC BY-SA 4.0", url: "https://commons.wikimedia.org/wiki/File:Ringelblume_(Calendula_officinalis)_Bl%C3%BCte_focus_stack-20220619-RM-165610.jpg" },
  { src: "img/planta/hojas.jpg", t: "Hojas", d: "Alternas, oblongo-lanceoladas, sésiles y pubescentes.", credit: "Magnus Manske · CC BY-SA 3.0", url: "https://commons.wikimedia.org/wiki/File:Calendula_officialis_%27Marigold%27_(Asteraceae)_leaves.JPG" },
  { src: "img/planta/planta.jpg", t: "Porte", d: "Hierba anual de 30–60 cm en floración.", credit: "Tournasol7 · CC BY 4.0", url: "https://commons.wikimedia.org/wiki/File:Calendula_officinalis_in_Catalonia_(2).jpg" },
  { src: "img/planta/kohler.jpg", t: "Lámina botánica", d: "Köhler's Medizinal-Pflanzen (1887).", credit: "F. E. Köhler · Dominio público", url: "https://commons.wikimedia.org/wiki/File:Calendula_officinalis_-_K%C3%B6hler%E2%80%93s_Medizinal-Pflanzen-024.jpg" },
  { src: "img/planta/droga.jpg", t: "Droga vegetal", d: "Calendulae flos: flores desecadas.", credit: "Rillke · CC BY-SA 3.0", url: "https://commons.wikimedia.org/wiki/File:Calendulae_flos_255043.jpg" },
  { src: "img/planta/semillas.jpg", t: "Frutos (aquenios)", d: "Aquenios curvados característicos del género.", credit: "Amada44 · CC BY 3.0", url: "https://commons.wikimedia.org/wiki/File:Calendula_seeds.jpg" }
];

/* ---------- Puntos 5–10: próxima entrega (se muestran difuminados) ---------- */
const UPCOMING = [
  { n: "05", t: "Formulaciones propuestas", icon: "git-branch", items: ["Fórmulas F1…Fn con variaciones lógicas a partir de la fórmula base", "Factores: HLB y % de emulsionante, % de goma xantana, relación MCT : alcohol cetílico", "Condiciones de elaboración: velocidad y tiempo de homogenización, temperatura de incorporación del extracto", "Criterio para escoger el mejor sistema"] },
  { n: "06", t: "Productos de referencia", icon: "scale", items: ["Productos comerciales con caléndula para heridas", "Pruebas de caracterización del producto de referencia", "Comparación con el QTPP"] },
  { n: "07", t: "Metodología de las variables respuesta", icon: "ruler", items: ["Viscosidad (viscosímetro rotacional)", "pH (potenciometría)", "Tamaño de gota (microscopía óptica)", "Adhesividad y extensibilidad", "Estabilidad acelerada: centrifugación y ciclos térmicos"] },
  { n: "08", t: "Método de elaboración", icon: "workflow", items: ["Diagrama de proceso con todas las condiciones operacionales", "Temperaturas de las fases, orden de adición, velocidades y tiempos", "Puntos de control en proceso"] },
  { n: "09", t: "Caracterización de la formulación final", icon: "microscope", items: ["Ensayos organolépticos y fisicoquímicos", "Ensayos microbiológicos (USP / Ph. Eur.)", "Contenido de marcadores del extracto"] },
  { n: "10", t: "Cronograma", icon: "calendar-clock", items: ["Actividades de las dos sesiones de laboratorio", "Estudio real de tiempos y movimientos"] }
];
