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
  // Estructuras químicas desde PubChem: por nombre o "cid:NNN"
  const pubchem = (name, size = 240) => {
    const cid = name.startsWith("cid:") ? name.slice(4) : { "polysorbate 80": 5281955 }[name];
    return `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/${cid ? `cid/${cid}` : `name/${encodeURIComponent(name)}`}/PNG?image_size=${size}x${size}`;
  };

  /* ---------------- Contenido configurable ---------------- */
  $$(".organo").forEach((el) => (el.textContent = CONFIG.organo));
  $$(".organo-cap").forEach((el) => (el.textContent = CONFIG.organo[0].toUpperCase() + CONFIG.organo.slice(1)));
  $("#team").innerHTML = TEAM.map((n) => {
    const ini = n.split(" ").filter((w) => w.length > 2).slice(0, 2).map((w) => w[0]).join("");
    return `<li><span class="av">${ini}</span><span>${n}</span></li>`;
  }).join("");
  const icons = () => window.lucide?.createIcons({ attrs: { "aria-hidden": "true" } });

  /* ---------------- Puntos 5–10 (próxima entrega, difuminados) ---------------- */
  const UPCOMING_SEC = "5–10 · Próximamente";
  UPCOMING.forEach((u) => {
    const s = h("section", {
      class: "slide upcoming", "data-section": UPCOMING_SEC, "data-presenter": "Próxima entrega",
      "data-notes": `Punto ${+u.n} · ${u.t}. Se desarrollará en la siguiente entrega del preinforme.`
    }, `
      <p class="kicker">Punto ${+u.n} · Próxima entrega</p>
      <h2>${u.t}</h2>
      <div class="upcoming-body" aria-hidden="true">
        <div class="up-ico"><i data-lucide="${u.icon}"></i></div>
        <ul>${u.items.map((t) => `<li>${t}</li>`).join("")}</ul>
      </div>
      <div class="up-badge"><i data-lucide="hourglass"></i><span>En desarrollo · se presentará en la siguiente entrega</span></div>`);
    $("#deck").appendChild(s);
  });
  $("#agendaLater").innerHTML = UPCOMING.map((u) =>
    `<a class="agenda-card" data-goto-title="${u.t}"><span class="num"><i data-lucide="${u.icon}"></i>${u.n}</span><h3>${u.t}</h3></a>`).join("");

  /* =========================================================
     NAVEGACIÓN DE DIAPOSITIVAS
     ========================================================= */
  const slides = $$(".slide");
  const total = slides.length;
  // Estrella de ubicación: marca la diapositiva anterior a cada bloque de César
  slides.forEach((s, i) => { if (s.classList.contains("cz") && i > 0 && !slides[i - 1].classList.contains("cz")) slides[i - 1].classList.add("pre-cz"); });
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
    const a = h("a", { href: `#/${s.first + 1}`, "data-sec": s.name, class: s.name === UPCOMING_SEC ? "later" : "" }, s.name);
    secNav.appendChild(a);
  });
  // Tarjetas de la agenda: saltan a la primera diapositiva de su sección o título
  $$("[data-goto]").forEach((a) => { const sec = sections.find((s) => s.name === a.dataset.goto); if (sec) a.href = `#/${sec.first + 1}`; });
  $$("[data-goto-sub]").forEach((a) => { const i = slides.findIndex((s) => s.dataset.sub === a.dataset.gotoSub); if (i >= 0) a.href = `#/${i + 1}`; });
  $$("[data-goto-title]").forEach((a) => (a.href = `#/${slides.findIndex((s) => $("h2", s)?.textContent === a.dataset.gotoTitle) + 1}`));

  function go(n, push = true) {
    n = Math.max(0, Math.min(total - 1, n));
    setSteps(slides[n], n < idx ? Infinity : 0);
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
    $("#bannerSec").textContent = slides[n].dataset.section;
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

  /* ---------- Revelado progresivo: los elementos con data-step aparecen uno a uno ---------- */
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let stepsOn = store.get("steps") !== "off";
  const stepEls = (s) => (s ? [...s.querySelectorAll("[data-step]")] : []);
  function setSteps(s, shown) {
    stepEls(s).forEach((el, i) => el.classList.toggle("step-hidden", stepsOn && !reduced && i >= shown));
  }
  const shownSteps = (s) => stepEls(s).filter((el) => !el.classList.contains("step-hidden")).length;
  function forward() {
    const st = stepEls(slides[idx]), n = shownSteps(slides[idx]);
    if (n < st.length) st[n].classList.remove("step-hidden");
    else go(idx + 1);
  }
  function back() {
    const st = stepEls(slides[idx]), n = shownSteps(slides[idx]);
    if (stepsOn && !reduced && n > 0) st[n - 1].classList.add("step-hidden");
    else go(idx - 1);
  }
  function toggleSteps() {
    stepsOn = !stepsOn;
    store.set("steps", stepsOn ? "on" : "off");
    setSteps(slides[idx], stepsOn ? 0 : Infinity);
  }
  window.addEventListener("beforeprint", () => slides.forEach((s) => setSteps(s, Infinity)));

  $("#prev").addEventListener("click", back);
  $("#next").addEventListener("click", forward);

  document.addEventListener("keydown", (e) => {
    const tag = (e.target.tagName || "").toLowerCase();
    if (tag === "input" || tag === "textarea" || e.metaKey || e.ctrlKey || e.altKey) return;
    const k = e.key;
    if (["ArrowRight", "PageDown", " "].includes(k)) { e.preventDefault(); forward(); }
    else if (["ArrowLeft", "PageUp"].includes(k)) { e.preventDefault(); back(); }
    else if (k === "Home") go(0);
    else if (k === "End") go(total - 1);
    else if (k === "o" || k === "O") toggleOverview();
    else if (k === "n" || k === "N") toggleNotes();
    else if (k === "t" || k === "T") toggleTheme();
    else if (k === "f" || k === "F") toggleFull();
    else if (k === "r" || k === "R") toggleSteps();
    else if (k === "Escape") { closeOverview(); }
  });

  // Gestos táctiles
  let tx = 0, ty = 0;
  const deck = $("#deck");
  deck.addEventListener("touchstart", (e) => { tx = e.touches[0].clientX; ty = e.touches[0].clientY; }, { passive: true });
  deck.addEventListener("touchend", (e) => {
    const dx = e.changedTouches[0].clientX - tx, dy = e.changedTouches[0].clientY - ty;
    if (e.target.closest("input[type=range], canvas, .matrix-wrap, .excip-tabs")) return;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) (dx < 0 ? forward : back)();
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
    const b = h("button", { class: `ov-card${s.classList.contains("upcoming") ? " later" : ""}` }, `<span class="ov-num">${i + 1}</span><span class="ov-sec">${s.dataset.section}</span><span class="ov-title">${title}</span><span class="ov-who">${s.dataset.presenter || ""}</span>`);
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
      `<span class="phase-n"><i data-lucide="${p.icon}"></i>${i + 1}</span><span class="phase-name">${p.name}</span><span class="phase-time">${p.time}</span>`);
    b.addEventListener("click", () => selectPhase(i));
    phasesEl.appendChild(b);
  });
  function selectPhase(i) {
    const p = PHASES[i];
    $$(".phase", phasesEl).forEach((b, j) => { b.classList.toggle("active", i === j); b.setAttribute("aria-selected", i === j); });
    $("#phaseDetail").innerHTML = `
      <div><h3>${p.name} <small>${p.time}</small></h3><p>${p.text}</p><p class="role">${p.role}</p></div>
      <div>${p.actors.length ? `<h4><i data-lucide="leaf"></i>Metabolitos que actúan</h4><ul class="actors">${p.actors.map((a) => `<li>${a}</li>`).join("")}</ul>` : `<p class="muted">Sin acción directa del fitocomplejo.</p>`}</div>`;
    icons();
  }
  selectPhase(1);

  /* =========================================================
     DIAPOSITIVA: flujo QbD
     ========================================================= */
  const qbd = $("#qbdFlow");
  QBD.forEach((q, i) => {
    const li = h("li", {}, `<button><i data-lucide="${q.icon}" class="q-ico"></i><span class="qk">${q.k}</span><span class="qt">${q.t}</span></button>`);
    $("button", li).addEventListener("click", () => selectQbd(i));
    qbd.appendChild(li);
  });
  function selectQbd(i) {
    $$("li", qbd).forEach((li, j) => li.classList.toggle("active", j === i));
    $("#qbdDetail").innerHTML = `<span class="qk big"><i data-lucide="${QBD[i].icon}"></i>${QBD[i].k}</span><div><h3>${QBD[i].t}</h3><p>${QBD[i].d}</p></div>`;
    icons();
  }
  selectQbd(0);

  /* =========================================================
     DIAPOSITIVA: TPP (flor dibujada)
     ========================================================= */
  const petals = $("#tppxPetals");
  if (petals) petals.innerHTML = Array.from({ length: 18 }, (_, i) =>
    `<ellipse cx="100" cy="52" rx="9" ry="30" transform="rotate(${i * 20} 100 90)"/>`).join("");

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
  // Citas: número simple (13) o con páginas ({ n: 13, p: "pp. 782–784" })
  const cite = (refs = []) => refs.map((r) => {
    const n = r.n ?? r;
    return `<sup class="ref" data-ref="${n}">[${n}${r.p ? `, ${r.p}` : ""}]</sup>`;
  }).join("");
  const tabs = $("#excipTabs");
  EXCIPIENTS.forEach((x, i) => {
    const b = h("button", { role: "tab", class: "excip-tab", "aria-selected": "false" }, `<span class="ico"><i data-lucide="${x.icon}"></i></span><span>${x.fn}</span>${x.status === "draft" ? '<i class="dot" title="Borrador"></i>' : ""}`);
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
          <div class="ep-meta"><span class="tag amber">${x.pct}</span><span class="tag">Expone: ${x.who}</span>${x.status === "draft" ? '<span class="tag draft">Borrador · validar con el grupo</span>' : ""}${cite(x.refs)}</div>
        </div>
        ${structs.length ? `<div class="ep-structs">${structs.map((s) => `<figure><img loading="lazy" src="${pubchem(s)}" alt="Estructura de ${s}" onerror="this.closest('figure').remove()"><figcaption>${s}</figcaption></figure>`).join("")}</div>` : ""}
      </div>
      ${x.extra ? `<div class="pd-block ep-extra"><span class="pd-label"><i data-lucide="link"></i>${x.extra.t}</span><p>${x.extra.d} ${cite(x.extra.refs)}</p></div>` : ""}
      <ul class="cands">${x.candidates.map((c) => `<li class="${c.pick ? "pick" : "discard"}"><span class="mark"><i data-lucide="${c.pick ? "check" : "x"}"></i></span><div><strong>${c.n}</strong><p>${c.why}</p></div></li>`).join("")}</ul>`;
    icons();
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
  $("#trace").innerHTML = TRACE.map((t, i) => `<div class="tr-row" style="--d:${i * 0.06}s"><span class="tr-r"><i data-lucide="triangle-alert"></i>${t.r}</span><span class="tr-arrow"><i data-lucide="arrow-right"></i></span><span class="tr-e"><i data-lucide="shield-check"></i>${t.e}</span></div>`).join("");
  $$("ol.refs").forEach((ol) => {
    const from = +ol.dataset.from, to = +ol.dataset.to;
    ol.start = from;
    ol.innerHTML = REFS.slice(from - 1, to).map((r) => `<li>${r}</li>`).join("");
  });

  /* =========================================================
     DIAPOSITIVA: galería de la planta + visor
     ========================================================= */
  $("#gallery").innerHTML = PLANT_IMAGES.map((p, i) => `
    <figure class="g-item${i === 0 ? " big" : ""}">
      <button data-i="${i}" aria-label="Ampliar: ${p.t}"><img src="${p.src}" alt="Calendula officinalis: ${p.t.toLowerCase()}" loading="lazy"></button>
      <figcaption><strong>${p.t}</strong><span>${p.credit}</span></figcaption>
    </figure>`).join("");
  const lb = $("#lightbox");
  $$("#gallery button").forEach((b) => b.addEventListener("click", () => {
    const p = PLANT_IMAGES[+b.dataset.i];
    $("#lbImg").src = p.src; $("#lbImg").alt = b.querySelector("img").alt;
    $("#lbCap").innerHTML = `<strong>${p.t}.</strong> ${p.d} <a href="${p.url}" target="_blank" rel="noopener">${p.credit} · Wikimedia Commons</a>`;
    lb.hidden = false;
  }));
  const closeLb = () => (lb.hidden = true);
  $("#lbClose").addEventListener("click", closeLb);
  lb.addEventListener("click", (e) => { if (e.target === lb) closeLb(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeLb(); });

  /* =========================================================
     ILUSTRACIONES (interpretación de las imágenes del Canva)
     ========================================================= */
  // Estructuras químicas (PubChem, guardadas en img/struct para funcionar sin conexión)
  $$("img[data-pc]").forEach((img) => {
    const slug = img.dataset.pc.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    img.src = `img/struct/${slug}.png`;
    img.addEventListener("error", () => { img.src = pubchem(img.dataset.pc, 300); }, { once: true });
  });

  // Pseudoaleatorio reproducible: los dibujos no cambian entre recargas
  const rng = (seed) => () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  const svgNS = "http://www.w3.org/2000/svg";
  const el = (tag, attrs) => {
    const e = document.createElementNS(svgNS, tag);
    Object.entries(attrs).forEach(([k, v]) => e.setAttribute(k, v));
    return e;
  };

  // Percolador: material vegetal dentro del cono
  const plant = $("#percPlant");
  if (plant) {
    const r = rng(7);
    for (let i = 0; i < 70; i++) {
      const y = 124 + r() * 170, half = 44 - ((y - 98) / 220) * 26;
      const x = 74 + (r() * 2 - 1) * (half - 6);
      plant.appendChild(el("ellipse", {
        cx: x.toFixed(1), cy: y.toFixed(1), rx: (2 + r() * 3).toFixed(1), ry: (1.5 + r() * 2).toFixed(1),
        transform: `rotate(${Math.round(r() * 180)} ${x.toFixed(1)} ${y.toFixed(1)})`
      }));
    }
  }

  // Polawax: perlas de cera en el tazón
  const pel = $("#polawaxPellets");
  if (pel) {
    const r = rng(3);
    for (let i = 0; i < 46; i++) {
      const x = 180 + r() * 110, y = 106 + r() * 26 + Math.abs(x - 235) * 0.16;
      pel.appendChild(el("circle", { cx: x.toFixed(1), cy: y.toFixed(1), r: (4.5 + r() * 1.5).toFixed(1) }));
    }
  }

  // Escala HLB: regla de 0 a 18
  const ruler = $("#hlbRuler");
  if (ruler) {
    const y = (v) => 330 - v * (300 / 18);
    ruler.appendChild(el("path", { d: `M140 ${y(0)}V${y(18)}`, class: "hs-line" }));
    for (let v = 0; v <= 18; v++) {
      ruler.appendChild(el("path", { d: `M${v % 3 ? 140 : 134} ${y(v)}h${v % 3 ? 6 : 12}`, class: "hs-tick" }));
      if (v % 3 === 0) {
        const t = el("text", { x: 128, y: y(v) + 4, "text-anchor": "end", class: "hs-num" });
        t.textContent = v;
        ruler.appendChild(t);
      }
    }
  }

  // Bicapa lipídica (conservante)
  $$(".membrane").forEach((g) => {
    const [g0, g1] = g.dataset.gap.split(",").map(Number);
    const r = rng(g0);
    for (let x = 6; x < 320; x += 12) {
      if (x > g0 && x < g1) continue;
      const wob = (r() - 0.5) * 3;
      [[112, 1], [164, -1]].forEach(([yh, dir]) => {
        g.appendChild(el("path", { class: "tail", d: `M${x - 2} ${yh + 5 * dir}v${16 * dir}M${x + 2} ${yh + 5 * dir}v${16 * dir}` }));
        g.appendChild(el("circle", { class: "head", cx: x + wob, cy: yh, r: 5.5 }));
      });
    }
  });
  const ehg = $("#ehgChains");
  if (ehg) {
    [[96, 30, 35], [150, 22, 70], [190, 36, 110], [236, 26, 140]].forEach(([x, y, rot]) => {
      const gg = el("g", { transform: `translate(${x} ${y}) rotate(${rot})` });
      for (let i = 0; i < 4; i++) gg.appendChild(el("circle", { class: "ehg-b", cx: i * 11, cy: (i % 2) * 6, r: 5 }));
      ehg.appendChild(gg);
    });
    ehg.appendChild(el("path", { class: "m-arrow", d: "M150 64c4 14 6 26 6 36" }));
    ehg.appendChild(el("path", { class: "m-arrow", d: "M186 74c-6 10-10 18-12 28" }));
  }
  const phe = $("#pheBalls");
  if (phe) {
    [[60, 40], [104, 26], [146, 50], [196, 30], [246, 46], [282, 24], [160, 92], [150, 132], [168, 150], [120, 190], [190, 196], [222, 186], [96, 206]]
      .forEach(([x, y]) => phe.appendChild(el("circle", { class: "phe-b", cx: x, cy: y, r: 7 })));
    phe.appendChild(el("path", { class: "m-arrow", d: "M130 56c10 14 18 26 22 40" }));
    phe.appendChild(el("path", { class: "m-arrow", d: "M210 52c-10 14-20 30-28 46" }));
  }

  // Dibujos reutilizados (copia real para que conserven sus estilos)
  $$("svg[data-clone]").forEach((svg) => {
    const src = document.getElementById(svg.dataset.clone);
    if (src) { const c = src.cloneNode(true); c.removeAttribute("id"); svg.appendChild(c); }
  });

  // Vasos de inestabilidad física
  $$(".beaker").forEach((fig, k) => {
    const svg = $("svg", fig), mode = fig.dataset.mode, r = rng(11 + k);
    svg.appendChild(el("rect", { class: "bk-water", x: 22, y: 38, width: 96, height: 112, rx: 8 }));
    const drop = (x, y, rad) => svg.appendChild(el("circle", { class: "bk-drop", cx: x.toFixed(1), cy: y.toFixed(1), r: rad.toFixed(1) }));
    if (mode === "disp") for (let i = 0; i < 26; i++) drop(32 + r() * 76, 48 + r() * 94, 3 + r() * 3);
    if (mode === "floc") [[48, 62], [92, 72], [60, 112], [96, 126]].forEach(([cx, cy]) => {
      for (let i = 0; i < 6; i++) drop(cx + (r() - 0.5) * 16, cy + (r() - 0.5) * 14, 4 + r() * 1.5);
    });
    if (mode === "coal") {
      [[50, 70, 12], [92, 94, 10], [62, 124, 14], [98, 132, 7]].forEach(([x, y, rr]) => drop(x, y, rr));
      for (let i = 0; i < 6; i++) drop(32 + r() * 76, 50 + r() * 90, 2 + r() * 2);
    }
    if (mode === "cream") {
      for (let i = 0; i < 16; i++) drop(30 + (i % 8) * 11 + r() * 3, 46 + Math.floor(i / 8) * 10 + r() * 3, 6 + r() * 2);
      for (let i = 0; i < 8; i++) drop(32 + r() * 76, 80 + r() * 62, 1.6 + r() * 1.6);
    }
    svg.appendChild(el("path", { class: "bk-glass", d: "M18 22h104M22 22v124c0 8 6 14 14 14h68c8 0 14-6 14-14V22" }));
  });

  /* ---------------- Capturas del Canva (carga diferida) ---------------- */
  const loadShots = (list) => list.forEach((s) => s?.querySelectorAll("img[data-src]").forEach((img) => {
    img.src = img.dataset.src;
    img.removeAttribute("data-src");
  }));
  document.addEventListener("slidechange", (e) => loadShots([slides[e.detail - 1], slides[e.detail], slides[e.detail + 1]]));
  window.addEventListener("beforeprint", () => loadShots(slides));

  /* ---------------- Inicio ---------------- */
  icons();
  go(fromHash(), false);
})();
