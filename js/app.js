/* =========================================================
   Presentación interactiva · Emulsión cicatrizante de caléndula
   Vanilla JS, sin dependencias.
   ========================================================= */
(() => {
  "use strict";

  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const fmt = (n, d = 1) => n.toLocaleString("es-CO", { minimumFractionDigits: d, maximumFractionDigits: d });
  const h = (tag, attrs = {}, html = "") => {
    const el = document.createElement(tag);
    Object.entries(attrs).forEach(([k, v]) => (k === "class" ? (el.className = v) : el.setAttribute(k, v)));
    if (html) el.innerHTML = html;
    return el;
  };
  const store = {
    get: (k) => { try { return localStorage.getItem(k); } catch { return null; } },
    set: (k, v) => { try { localStorage.setItem(k, v); } catch { /* sin almacenamiento */ } }
  };
  const pubchem = (name) => {
    const cid = { "polysorbate 80": 5281955 }[name];
    return `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/${cid ? `cid/${cid}` : `name/${encodeURIComponent(name)}`}/PNG?image_size=240x240`;
  };

  /* ---------------- Contenido configurable ---------------- */
  $$(".organo").forEach((el) => (el.textContent = CONFIG.organo));
  $$(".organo-cap").forEach((el) => (el.textContent = CONFIG.organo[0].toUpperCase() + CONFIG.organo.slice(1)));
  $("#team").innerHTML = TEAM.map((n) => `<li>${n}</li>`).join("");

  /* =========================================================
     NAVEGACIÓN DE DIAPOSITIVAS
     ========================================================= */
  const slides = $$(".slide");
  const total = slides.length;
  let idx = 0;
  $("#tot").textContent = total;

  // Navegación por secciones en la barra superior
  const sections = [];
  slides.forEach((s, i) => {
    const name = s.dataset.section;
    if (!sections.find((x) => x.name === name)) sections.push({ name, first: i });
  });
  const secNav = $("#sectionNav");
  sections.forEach((s) => {
    const a = h("a", { href: `#/${s.first + 1}`, "data-sec": s.name }, s.name);
    secNav.appendChild(a);
  });

  function go(n, push = true) {
    n = Math.max(0, Math.min(total - 1, n));
    slides.forEach((s, i) => {
      s.classList.toggle("active", i === n);
      s.classList.toggle("before", i < n);
      s.setAttribute("aria-hidden", i === n ? "false" : "true");
      if ("inert" in s) s.inert = i !== n;
    });
    idx = n;
    $("#cur").textContent = n + 1;
    $("#progressBar").style.width = `${((n + 1) / total) * 100}%`;
    $$("#sectionNav a").forEach((a) => a.classList.toggle("active", a.dataset.sec === slides[n].dataset.section));
    slides[n].scrollTop = 0;
    updateNotes();
    if (push && location.hash !== `#/${n + 1}`) history.replaceState(null, "", `#/${n + 1}`);
    document.dispatchEvent(new CustomEvent("slidechange", { detail: n }));
  }
  const fromHash = () => {
    const m = location.hash.match(/#\/(\d+)/);
    return m ? parseInt(m[1], 10) - 1 : 0;
  };
  window.addEventListener("hashchange", () => go(fromHash(), false));

  $("#prev").addEventListener("click", () => go(idx - 1));
  $("#next").addEventListener("click", () => go(idx + 1));

  document.addEventListener("keydown", (e) => {
    const tag = (e.target.tagName || "").toLowerCase();
    if (tag === "input" || tag === "textarea" || e.metaKey || e.ctrlKey || e.altKey) return;
    const k = e.key;
    if (["ArrowRight", "PageDown", " "].includes(k)) { e.preventDefault(); go(idx + 1); }
    else if (["ArrowLeft", "PageUp"].includes(k)) { e.preventDefault(); go(idx - 1); }
    else if (k === "Home") go(0);
    else if (k === "End") go(total - 1);
    else if (k === "o" || k === "O") toggleOverview();
    else if (k === "n" || k === "N") toggleNotes();
    else if (k === "t" || k === "T") toggleTheme();
    else if (k === "f" || k === "F") toggleFull();
    else if (k === "Escape") { closeOverview(); }
  });

  // Gestos táctiles
  let tx = 0, ty = 0;
  const deck = $("#deck");
  deck.addEventListener("touchstart", (e) => { tx = e.touches[0].clientX; ty = e.touches[0].clientY; }, { passive: true });
  deck.addEventListener("touchend", (e) => {
    const dx = e.changedTouches[0].clientX - tx, dy = e.changedTouches[0].clientY - ty;
    if (e.target.closest("input[type=range], canvas, .matrix-wrap, .excip-tabs")) return;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) go(idx + (dx < 0 ? 1 : -1));
  }, { passive: true });

  /* ---------------- Notas del expositor ---------------- */
  const notes = $("#notes");
  function updateNotes() {
    const s = slides[idx];
    $("#notesText").textContent = s.dataset.notes || "";
    $("#notesPresenter").textContent = s.dataset.presenter ? `Expone: ${s.dataset.presenter}` : "";
  }
  function toggleNotes() {
    notes.hidden = !notes.hidden;
    $("#btnNotes").classList.toggle("on", !notes.hidden);
    document.body.classList.toggle("with-notes", !notes.hidden);
  }
  $("#btnNotes").addEventListener("click", toggleNotes);
  $("#notesClose").addEventListener("click", toggleNotes);

  /* ---------------- Vista general ---------------- */
  const ov = $("#overview");
  const ovGrid = $("#overviewGrid");
  slides.forEach((s, i) => {
    const title = $("h1, h2", s)?.textContent.replace(/\s+/g, " ").trim() || `Diapositiva ${i + 1}`;
    const b = h("button", { class: "ov-card" }, `<span class="ov-num">${i + 1}</span><span class="ov-sec">${s.dataset.section}</span><span class="ov-title">${title}</span><span class="ov-who">${s.dataset.presenter || ""}</span>`);
    b.addEventListener("click", () => { go(i); closeOverview(); });
    ovGrid.appendChild(b);
  });
  function toggleOverview() {
    ov.hidden = !ov.hidden;
    if (!ov.hidden) {
      $$(".ov-card", ovGrid).forEach((c, i) => c.classList.toggle("current", i === idx));
      $$(".ov-card", ovGrid)[idx].focus();
    }
  }
  function closeOverview() { ov.hidden = true; }
  $("#btnOverview").addEventListener("click", toggleOverview);
  $("#overviewClose").addEventListener("click", closeOverview);

  /* ---------------- Tema y pantalla completa ---------------- */
  function applyTheme(t) {
    if (t) document.documentElement.setAttribute("data-theme", t);
    else document.documentElement.removeAttribute("data-theme");
  }
  applyTheme(store.get("theme"));
  function toggleTheme() {
    const cur = document.documentElement.getAttribute("data-theme") ||
      (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    const next = cur === "dark" ? "light" : "dark";
    applyTheme(next);
    store.set("theme", next);
    document.dispatchEvent(new Event("themechange"));
  }
  $("#btnTheme").addEventListener("click", toggleTheme);
  function toggleFull() {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen?.();
    else document.exitFullscreen?.();
  }
  $("#btnFull").addEventListener("click", toggleFull);

  /* ---------------- Citas emergentes ---------------- */
  const pop = $("#refPop");
  function showRef(el) {
    const n = +el.dataset.ref;
    pop.innerHTML = `<strong>[${n}]</strong> ${REFS[n - 1] || ""}`;
    pop.hidden = false;
    const r = el.getBoundingClientRect();
    const w = Math.min(380, innerWidth - 32);
    pop.style.width = `${w}px`;
    pop.style.left = `${Math.max(16, Math.min(innerWidth - w - 16, r.left - w / 2))}px`;
    const top = r.bottom + 8;
    pop.style.top = `${top + pop.offsetHeight > innerHeight ? r.top - pop.offsetHeight - 8 : top}px`;
  }
  document.addEventListener("mouseover", (e) => { const r = e.target.closest(".ref"); if (r) showRef(r); });
  document.addEventListener("mouseout", (e) => { if (e.target.closest(".ref") && !e.relatedTarget?.closest?.(".ref-pop")) pop.hidden = true; });
  document.addEventListener("click", (e) => {
    const r = e.target.closest(".ref");
    if (r) { showRef(r); e.stopPropagation(); }
    else if (!e.target.closest(".ref-pop")) pop.hidden = true;
  });
  pop.addEventListener("mouseleave", () => (pop.hidden = true));

  /* =========================================================
     DIAPOSITIVA: comparación de formas farmacéuticas
     ========================================================= */
  $("#compareForms").innerHTML = FORMS.map((f) => `
    <div class="form-card${f.pick ? " pick" : ""}">
      <h4>${f.pick ? "✓ " : ""}${f.name}</h4>
      <ul>${f.pros.map((p) => `<li class="pro">${p}</li>`).join("")}${f.cons.map((c) => `<li class="con">${c}</li>`).join("")}</ul>
    </div>`).join("");

  /* =========================================================
     DIAPOSITIVA: fases de cicatrización
     ========================================================= */
  const phasesEl = $("#phases");
  PHASES.forEach((p, i) => {
    const b = h("button", { class: `phase${p.hot ? " hot" : ""}`, role: "tab", "aria-selected": "false" },
      `<span class="phase-n">${i + 1}</span><span class="phase-name">${p.name}</span><span class="phase-time">${p.time}</span>`);
    b.addEventListener("click", () => selectPhase(i));
    phasesEl.appendChild(b);
  });
  function selectPhase(i) {
    const p = PHASES[i];
    $$(".phase", phasesEl).forEach((b, j) => { b.classList.toggle("active", i === j); b.setAttribute("aria-selected", i === j); });
    $("#phaseDetail").innerHTML = `
      <div><h3>${p.name} <small>${p.time}</small></h3><p>${p.text}</p><p class="role">${p.role}</p></div>
      <div>${p.actors.length ? `<h4>Metabolitos que actúan</h4><ul class="actors">${p.actors.map((a) => `<li>${a}</li>`).join("")}</ul>` : `<p class="muted">Sin acción directa del fitocomplejo.</p>`}</div>`;
  }
  selectPhase(1);

  /* =========================================================
     DIAPOSITIVA: flujo QbD
     ========================================================= */
  const qbd = $("#qbdFlow");
  QBD.forEach((q, i) => {
    const li = h("li", {}, `<button><span class="qk">${q.k}</span><span class="qt">${q.t}</span></button>`);
    $("button", li).addEventListener("click", () => selectQbd(i));
    qbd.appendChild(li);
  });
  function selectQbd(i) {
    $$("li", qbd).forEach((li, j) => li.classList.toggle("active", j === i));
    $("#qbdDetail").innerHTML = `<span class="qk big">${QBD[i].k}</span><div><h3>${QBD[i].t}</h3><p>${QBD[i].d}</p></div>`;
  }
  selectQbd(0);

  /* =========================================================
     DIAPOSITIVA: QTPP
     ========================================================= */
  const qtppEl = $("#qtpp");
  QTPP.forEach((q) => {
    const d = h("details", { class: `qtpp-row${q.cqa ? " cqa" : ""}` },
      `<summary><span class="q-el">${q.el}</span><span class="q-obj">${q.obj}</span>${q.cqa ? '<span class="badge">CQA</span>' : ""}</summary><p>${q.just}</p>`);
    qtppEl.appendChild(d);
  });
  $$("[data-filter]").forEach((b) => b.addEventListener("click", () => {
    $$("[data-filter]").forEach((x) => x.classList.toggle("active", x === b));
    qtppEl.classList.toggle("only-cqa", b.dataset.filter === "cqa");
  }));

  /* =========================================================
     DIAPOSITIVA: matriz fitoquímica
     ========================================================= */
  const wheel = $("#phytoWheel");
  PHYTO.forEach((p, i) => {
    const b = h("button", { class: `phyto-chip ${p.color}`, style: `--i:${i};--n:${PHYTO.length}` }, p.name);
    b.addEventListener("click", () => selectPhyto(i));
    wheel.appendChild(b);
  });
  wheel.appendChild(h("div", { class: "phyto-center", "aria-hidden": "true" }, `<svg viewBox="0 0 64 64"><g class="petal"><ellipse cx="32" cy="13" rx="6.5" ry="11"/><ellipse cx="32" cy="51" rx="6.5" ry="11"/><ellipse cx="13" cy="32" rx="11" ry="6.5"/><ellipse cx="51" cy="32" rx="11" ry="6.5"/><ellipse cx="18.5" cy="18.5" rx="6" ry="10" transform="rotate(-45 18.5 18.5)"/><ellipse cx="45.5" cy="45.5" rx="6" ry="10" transform="rotate(-45 45.5 45.5)"/><ellipse cx="45.5" cy="18.5" rx="6" ry="10" transform="rotate(45 45.5 18.5)"/><ellipse cx="18.5" cy="45.5" rx="6" ry="10" transform="rotate(45 18.5 45.5)"/></g><circle cx="32" cy="32" r="9" class="core"/></svg>`));
  function selectPhyto(i) {
    const p = PHYTO[i];
    $$(".phyto-chip", wheel).forEach((b, j) => b.classList.toggle("active", i === j));
    $("#phytoDetail").innerHTML = `
      <h3 class="${p.color}-text">${p.name}</h3>
      <p class="ex">${p.ex}</p>
      <div class="pd-block"><span class="pd-label">Papel terapéutico</span><p>${p.act}</p></div>
      <div class="pd-block warn"><span class="pd-label">Implicación para la formulación</span><p>${p.form}</p></div>`;
  }
  selectPhyto(0);

  /* =========================================================
     DIAPOSITIVA: selector de solvente de extracción
     ========================================================= */
  const eth = $("#ethanol");
  // Curvas cualitativas de eficiencia de extracción (0-1) según fracción de etanol
  const bell = (x, mu, s) => Math.exp(-((x - mu) ** 2) / (2 * s * s));
  const sig = (x, x0, k) => 1 / (1 + Math.exp(-k * (x - x0)));
  function updateSolvent() {
    const x = +eth.value;
    $("#ethanolOut").textContent = x;
    const tri = sig(x, 50, 0.09);
    const fla = bell(x, 62, 24);
    const car = sig(x, 60, 0.08);
    const pol = 1 - sig(x, 35, 0.12);
    [["#barTri", tri], ["#barFla", fla], ["#barCar", car], ["#barPol", pol]].forEach(([s, v]) => ($(s).style.width = `${Math.round(v * 100)}%`));
    let msg;
    if (x < 30) msg = "✕ Extracto casi acuoso: se pierden los ésteres de faradiol y los carotenoides, que son los principios antiinflamatorios y cicatrizantes.";
    else if (x >= 60 && x <= 70) msg = "✓ Zona seleccionada (60–70 % v/v): la constante dieléctrica intermedia coextrae triterpenos y flavonoides.";
    else if (x > 85) msg = "✕ Muy apolar: se excluyen los flavonoides glicosilados y los polisacáridos (similar a un extracto oleoso).";
    else msg = "△ Extracción parcial: una de las dos fracciones queda subrepresentada.";
    const v = $("#solventVerdict");
    v.textContent = msg;
    v.className = `verdict ${msg[0] === "✓" ? "ok" : msg[0] === "✕" ? "bad" : "mid"}`;
  }
  eth.addEventListener("input", updateSolvent);
  updateSolvent();

  /* =========================================================
     DIAPOSITIVA: simulador de Stokes
     ========================================================= */
  const dR = $("#dRange"), eR = $("#etaRange"), rR = $("#rhoRange");
  const dVal = () => 10 ** (-1 + (3 * dR.value) / 100);         // 0,1 – 100 µm
  const etaVal = () => 10 ** ((4.7 * eR.value) / 100);          // 1 – 50 000 cP
  const rhoVal = () => rR.value / 100;                          // 0,02 – 0,15 g/cm³
  let stokesV = 0; // mm/día
  function fmtSci(v) {
    if (v === 0) return "0";
    if (v >= 0.01 && v < 10000) return fmt(v, v < 1 ? 3 : 1);
    const e = Math.floor(Math.log10(v));
    return `${fmt(v / 10 ** e, 1)} × 10<sup>${e}</sup>`;
  }
  function updateStokes() {
    const d = dVal(), eta = etaVal(), rho = rhoVal();
    const r = (d / 2) * 1e-6, drho = rho * 1000, mu = eta * 1e-3;
    const v = (2 * r * r * drho * 9.81) / (9 * mu); // m/s
    stokesV = v * 1000 * 86400; // mm/día
    $("#dOut").textContent = fmt(d, d < 1 ? 2 : 1);
    $("#etaOut").textContent = Math.round(eta).toLocaleString("es-CO");
    $("#rhoOut").textContent = fmt(rho, 2);
    $("#vOut").innerHTML = `${fmtSci(stokesV)} mm/día`;
    const days = 50 / stokesV; // días para recorrer 50 mm (altura de un envase)
    $("#tOut").innerHTML = days < 1 ? `Separación visible en ~${fmt(days * 24, 1)} h` :
      days < 365 ? `≈ ${fmt(days, 0)} días para atravesar 5 cm de envase` :
      `≈ ${fmtSci(days / 365)} años para atravesar 5 cm de envase`;
    const frac = Math.min(1, (stokesV * 30) / 50);
    $("#creamBar").style.width = `${Math.max(1, frac * 100)}%`;
    $("#creamBar").classList.toggle("bad", frac > 0.2);
    $("#creamOut").textContent = frac >= 1 ? "Separación completa" : frac < 0.001 ? "< 0,1 %" : `${fmt(frac * 100, 1)} %`;
    const inTarget = eta >= 15000 && eta <= 17000 && d <= 10;
    $(".stokes .result").classList.toggle("ok", inTarget || frac < 0.01);
    $(".stokes .result").classList.toggle("bad", frac > 0.2);
  }
  [dR, eR, rR].forEach((el) => el.addEventListener("input", updateStokes));
  const presets = { water: [56, 0, 5], target: [56, 89.6, 5], coarse: [90, 89.6, 5] };
  $$("[data-preset]").forEach((b) => b.addEventListener("click", () => {
    const [d, e, r] = presets[b.dataset.preset];
    dR.value = d; eR.value = e; rR.value = r; updateStokes();
  }));
  dR.value = 56; eR.value = 89.6;
  updateStokes();

  // Animación de gotas en canvas
  const cv = $("#stokesCanvas");
  const ctx = cv.getContext("2d");
  const drops = Array.from({ length: 70 }, () => ({ x: Math.random(), y: Math.random(), j: Math.random() * 6.28 }));
  let cvColors = {};
  function readColors() {
    const cs = getComputedStyle(document.documentElement);
    cvColors = { bg: cs.getPropertyValue("--water").trim(), drop: cs.getPropertyValue("--oil").trim(), edge: cs.getPropertyValue("--oil-edge").trim(), cream: cs.getPropertyValue("--cream").trim() };
  }
  readColors();
  document.addEventListener("themechange", readColors);
  matchMedia("(prefers-color-scheme: dark)").addEventListener?.("change", readColors);
  let last = 0, running = false;
  function frame(t) {
    if (!running) return;
    const dt = Math.min(0.05, (t - last) / 1000 || 0);
    last = t;
    const W = cv.width, H = cv.height;
    // Velocidad visual en escala logarítmica para que sea perceptible
    const vis = Math.max(0, Math.min(1, (Math.log10(Math.max(stokesV, 1e-9)) + 4) / 7)); // 1e-4..1e3 mm/día
    const speed = vis * vis * 260; // px/s
    const rad = 2 + Math.min(10, Math.log10(dVal() * 10 + 1) * 3.4);
    const creamH = Math.min(H * 0.35, H * 0.35 * Math.min(1, (stokesV * 30) / 50));
    ctx.fillStyle = cvColors.bg; ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = cvColors.cream; ctx.fillRect(0, 0, W, creamH);
    drops.forEach((p) => {
      p.j += dt * 3;
      p.y -= (speed * dt) / H;
      p.x += Math.sin(p.j) * 0.0008;
      if (p.y * H < creamH + rad) { p.y = 1 + Math.random() * 0.1; p.x = Math.random(); }
      ctx.beginPath();
      ctx.arc(p.x * W, p.y * H, rad, 0, 6.283);
      ctx.fillStyle = cvColors.drop; ctx.fill();
      ctx.strokeStyle = cvColors.edge; ctx.lineWidth = 1; ctx.stroke();
    });
    requestAnimationFrame(frame);
  }
  const stokesSlide = cv.closest(".slide");
  document.addEventListener("slidechange", () => {
    const on = stokesSlide.classList.contains("active");
    if (on && !running) { running = true; last = performance.now(); requestAnimationFrame(frame); }
    else if (!on) running = false;
  });

  /* =========================================================
     DIAPOSITIVA: cadena de oxidación
     ========================================================= */
  $("#chain").innerHTML = CHAIN.map((c, i) => {
    const ctl = CHAIN_CONTROLS.find((x) => x.at === i);
    return `<div class="link${c.bad ? " bad" : ""}" style="--d:${i * 0.12}s"><strong>${c.t}</strong><span>${c.s}</span>${ctl ? `<em class="block">⛔ ${ctl.t}</em>` : ""}</div>`;
  }).join('<span class="chain-arrow" aria-hidden="true">→</span>');

  /* =========================================================
     DIAPOSITIVA: matriz de interacciones
     ========================================================= */
  const mx = $("#matrix");
  const findI = (a, b) => INTERACTIONS.find((x) => (x.a === a && x.b === b) || (x.a === b && x.b === a));
  let mh = `<thead><tr><th></th>${MATRIX_ITEMS.map((m) => `<th scope="col"><span>${m}</span></th>`).join("")}</tr></thead><tbody>`;
  MATRIX_ITEMS.forEach((r, i) => {
    mh += `<tr><th scope="row">${r}</th>`;
    MATRIX_ITEMS.forEach((c, j) => {
      if (j === i) mh += `<td class="diag"></td>`;
      else if (j < i) mh += `<td class="lower"></td>`;
      else {
        const it = findI(r, c);
        mh += it ? `<td><button class="cell ${it.type}" data-a="${r}" data-b="${c}" aria-label="${r} con ${c}: ${it.title}">${it.type === "good" ? "✓" : "!"}</button></td>` : `<td class="none"></td>`;
      }
    });
    mh += "</tr>";
  });
  mx.innerHTML = mh + "</tbody>";
  $$(".cell", mx).forEach((b) => b.addEventListener("click", () => {
    $$(".cell", mx).forEach((x) => x.classList.toggle("active", x === b));
    const it = findI(b.dataset.a, b.dataset.b);
    $("#matrixDetail").innerHTML = `<span class="tag ${it.type === "good" ? "green" : "amber"}">${it.type === "good" ? "Compatible / sinérgica" : "Precaución"}</span><h3>${it.a} × ${it.b}</h3><h4>${it.title}</h4><p>${it.text}</p>`;
  }));
  $(".cell", mx)?.click();

  /* =========================================================
     DIAPOSITIVA: excipientes
     ========================================================= */
  const STRUCT = {
    "Principio activo": ["faradiol", "rutin"],
    "Fase oleosa / emoliente": ["tricaprylin", "cetyl alcohol"],
    "Sistema emulsionante": ["sorbitan monooleate", "polysorbate 80"],
    "Humectante": ["glycerol"],
    "Antioxidante": ["alpha-tocopherol"],
    "Conservante": ["phenoxyethanol", "ethylhexylglycerin"],
    "Regulador de pH": ["citric acid"]
  };
  const tabs = $("#excipTabs");
  EXCIPIENTS.forEach((x, i) => {
    const b = h("button", { role: "tab", class: "excip-tab", "aria-selected": "false" }, `<span class="ico">${x.icon}</span><span>${x.fn}</span>${x.status === "draft" ? '<i class="dot" title="Borrador"></i>' : ""}`);
    b.addEventListener("click", () => selectExcip(i));
    tabs.appendChild(b);
  });
  function selectExcip(i) {
    const x = EXCIPIENTS[i];
    $$(".excip-tab", tabs).forEach((b, j) => { b.classList.toggle("active", i === j); b.setAttribute("aria-selected", i === j); });
    const structs = STRUCT[x.fn] || [];
    $("#excipPanel").innerHTML = `
      <div class="ep-head">
        <div>
          <span class="spec-label">${x.fn}</span>
          <h3>${x.sel}</h3>
          <div class="ep-meta"><span class="tag amber">${x.pct}</span><span class="tag">Expone: ${x.who}</span>${x.status === "draft" ? '<span class="tag draft">Borrador · validar con el grupo</span>' : ""}${x.refs.map((r) => `<sup class="ref" data-ref="${r}">[${r}]</sup>`).join("")}</div>
        </div>
        ${structs.length ? `<div class="ep-structs">${structs.map((s) => `<figure><img loading="lazy" src="${pubchem(s)}" alt="Estructura de ${s}" onerror="this.closest('figure').remove()"><figcaption>${s}</figcaption></figure>`).join("")}</div>` : ""}
      </div>
      <ul class="cands">${x.candidates.map((c) => `<li class="${c.pick ? "pick" : "discard"}"><span class="mark">${c.pick ? "✓" : "✕"}</span><div><strong>${c.n}</strong><p>${c.why}</p></div></li>`).join("")}</ul>`;
  }
  selectExcip(0);

  /* =========================================================
     DIAPOSITIVA: calculadora HLB
     ========================================================= */
  const mctR = $("#mctRange"), cetR = $("#cetRange"), emR = $("#emTotRange");
  const HLB_MCT = 11, HLB_CET = 15.5, HLB_TW = 15.0, HLB_SP = 4.3;
  const arcLen = Math.PI * 80;
  $("#gaugeFill").style.strokeDasharray = `${arcLen}`;
  function updateHLB() {
    const m = +mctR.value, c = +cetR.value, em = +emR.value;
    $("#mctOut").textContent = fmt(m); $("#cetOut").textContent = fmt(c); $("#emTotOut").textContent = fmt(em);
    const oil = m + c;
    if (oil === 0) {
      $("#hlbOut").textContent = "—";
      $("#tweenOut").textContent = $("#spanOut").textContent = "—";
      $("#hlbVerdict").textContent = "Añade fase oleosa para calcular.";
      return;
    }
    const req = (m * HLB_MCT + c * HLB_CET) / oil;
    let fT = (req - HLB_SP) / (HLB_TW - HLB_SP);
    fT = Math.max(0, Math.min(1, fT));
    $("#hlbOut").textContent = fmt(req, 1);
    $("#gaugeFill").style.strokeDashoffset = `${arcLen * (1 - req / 20)}`;
    const ang = -90 + (req / 20) * 180;
    $("#gaugeNeedle").setAttribute("transform", `rotate(${ang} 100 100)`);
    $("#tweenBar").style.width = `${fT * 100}%`;
    $("#spanBar").style.width = `${(1 - fT) * 100}%`;
    $("#tweenOut").textContent = `${fmt(fT * 100, 0)} % → ${fmt(fT * em, 2)} g`;
    $("#spanOut").textContent = `${fmt((1 - fT) * 100, 0)} % → ${fmt((1 - fT) * em, 2)} g`;
    const v = $("#hlbVerdict");
    if (req >= 8 && req <= 18) { v.textContent = `✓ HLB ${fmt(req)} está en el intervalo O/W (8–18). Por cada 100 g: Tween 80 ${fmt(fT * em, 2)} g + Span 80 ${fmt((1 - fT) * em, 2)} g.`; v.className = "verdict ok"; }
    else { v.textContent = "✕ Fuera del intervalo O/W."; v.className = "verdict bad"; }
  }
  [mctR, cetR, emR].forEach((el) => el.addEventListener("input", updateHLB));
  updateHLB();

  /* =========================================================
     DIAPOSITIVA: fórmula base
     ========================================================= */
  const sum = FORMULA.reduce((a, f) => a + (f.pct || 0), 0);
  const rows = FORMULA.map((f) => ({ ...f, val: f.pct ?? +(100 - sum).toFixed(1) }));
  $("#stack").innerHTML = rows.map((f) =>
    `<div class="seg${f.fixed ? "" : " tentative"}" style="flex:${Math.max(f.val, 0.6)};--c:${f.c}" title="${f.n}: ${fmt(f.val)} %"><span>${f.val >= 3 ? f.n.split(" ")[0] : ""}</span></div>`).join("");
  $("#ftable").innerHTML = `<thead><tr><th>Componente</th><th>Función</th><th>Fase</th><th class="num">% p/p</th></tr></thead><tbody>${
    rows.map((f) => `<tr class="${f.fixed ? "" : "tentative"}"><td><i class="sw" style="--c:${f.c}"></i>${f.n}</td><td>${f.fn}</td><td>${f.phase}</td><td class="num">${f.pct === null ? `c.s.p. (${fmt(f.val)})` : fmt(f.val)}</td></tr>`).join("")
  }<tr class="total"><td colspan="3">Total</td><td class="num">100,0</td></tr></tbody>`;

  /* =========================================================
     DIAPOSITIVA: trazabilidad y referencias
     ========================================================= */
  $("#trace").innerHTML = TRACE.map((t, i) => `<div class="tr-row" style="--d:${i * 0.06}s"><span class="tr-r">${t.r}</span><span class="tr-arrow">→</span><span class="tr-e">${t.e}</span></div>`).join("");
  $("#refs").innerHTML = REFS.map((r) => `<li>${r}</li>`).join("");

  /* ---------------- Inicio ---------------- */
  go(fromHash(), false);
})();
