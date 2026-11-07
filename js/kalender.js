// Dorfkalender Rehetobel
// Reines JavaScript ohne Abhängigkeiten. Daten kommen aus js/datenquelle.js (Google-Tabelle oder Beispieldaten).
(function () {
  "use strict";

  const WOCHENTAGE = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];
  const WOCHENTAGE_LANG = ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"];
  const MONATE = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli",
    "August", "September", "Oktober", "November", "Dezember"];

  // ---------- Datum-Hilfen (immer lokale Daten, keine Zeitzonen-Fallen) ----------
  const parse = (s) => { const [j, m, t] = s.split("-").map(Number); return new Date(j, m - 1, t); };
  const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  const heute = iso(new Date());
  const plusTage = (d, n) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
  const mo0 = (d) => (d.getDay() + 6) % 7; // Montag = 0

  function datumText(a) {
    const s = parse(a.datum);
    let t = `${WOCHENTAGE_LANG[s.getDay()]}, ${s.getDate()}. ${MONATE[s.getMonth()]} ${s.getFullYear()}`;
    if (a.bis && a.bis !== a.datum) {
      const b = parse(a.bis);
      t += ` – ${WOCHENTAGE_LANG[b.getDay()]}, ${b.getDate()}. ${MONATE[b.getMonth()]} ${b.getFullYear()}`;
    }
    return t;
  }
  function zeitText(a) {
    if (!a.zeit) return "ganztägig";
    return a.zeitBis ? `${a.zeit} – ${a.zeitBis} Uhr` : `${a.zeit} Uhr`;
  }
  // Alle Tage, an denen ein Anlass stattfindet (für mehrtägige Anlässe)
  function tageVon(a) {
    const tage = [];
    let d = parse(a.datum);
    const ende = parse(a.bis || a.datum);
    while (d <= ende) { tage.push(iso(d)); d = plusTage(d, 1); }
    return tage;
  }

  // "Ort, Gemeinde" – ohne Doppelung, wenn beides gleich ist
  const ortText = (a) => [...new Set([a.ort, a.gemeinde].filter(Boolean))].join(", ");

  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  // ---------- Kategorien (Reihenfolge nach Wichtigkeit, Entscheid 7.11.2026) ----------
  // Der Verkehrsverein gehört zu den Vereinen; «Gemeinde Rehetobel» heisst kurz «Gemeinde».
  const FARBE = { "Gemeinde": "#1f5fa8", "Vereine": "#0b7a34", "Schule": "#d97a1f", "Kirche": "#7b4fa8", "Gewerbe": "#9a5a2e",
    "Parteien": "#0e7c86", "Kommissionen": "#5d6b7a", "Entsorgung": "#6e7f1c", "Andere": "#8a8a8a" };
  function kategorieVon(k) {
    const t = String(k || "").trim();
    if (/^gemeinde/i.test(t)) return "Gemeinde";
    if (/^verkehrsverein|^verein/i.test(t)) return "Vereine";
    if (/entsorgung|sammlung|abfall|recycling|grüngut/i.test(t)) return "Entsorgung";   // Grüngut, Papier, Altmetall (Entscheid 8.11.)
    const bekannt = Object.keys(FARBE).find((n) => n.toLowerCase() === t.toLowerCase());
    return bekannt || t;
  }
  const farbe = (a) => FARBE[a.kategorie] || "#8a8a8a";

  // ---------- Vereinslogos (js/logos.js) ----------
  const normal = (s) => String(s || "").toLowerCase().replace(/\s+/g, " ").trim();
  const LOGO = new Map();
  for (const l of window.KALENDER_LOGOS || []) for (const n of l.namen) LOGO.set(normal(n), "bilder/logos/" + l.datei);
  function vlogo(a, gross) {
    const datei = LOGO.get(normal(a.veranstalter));
    return datei ? `<div class="vlogo${gross ? " gross" : ""}"><img src="${esc(datei)}" alt="Logo ${esc(a.veranstalter)}" loading="lazy"></div>` : "";
  }

  // ---------- Daten ----------
  let alle = [];
  const PRO_SEITE = 20;   // 20 Anlässe, dann «Weitere Anlässe anzeigen» (Entscheid 7.11.2026)
  const sortiere = (liste) => liste.slice().sort((x, y) =>
    (x.datum + (x.zeit || "")).localeCompare(y.datum + (y.zeit || "")));

  const zustand = {
    ansicht: "liste",
    suche: "",
    kategorie: "",
    verein: "",
    anzahl: PRO_SEITE,
    monat: (() => { const d = new Date(); return new Date(d.getFullYear(), d.getMonth(), 1); })(),
    gewaehlterTag: null,
    planungsJahr: new Date().getFullYear() + (new Date().getMonth() >= 9 ? 1 : 0),
  };

  function gefiltert() {
    const q = zustand.suche.trim().toLowerCase();
    return alle.filter((a) =>
      (!zustand.kategorie || a.kategorie === zustand.kategorie) &&
      (!zustand.verein || a.veranstalter === zustand.verein) &&
      (!q || [a.titel, a.ort, a.gemeinde, a.veranstalter, a.beschreibung]
        .some((f) => f && f.toLowerCase().includes(q))));
  }
  function proTag(liste) {
    const map = new Map();
    for (const a of liste) for (const t of tageVon(a)) {
      if (!map.has(t)) map.set(t, []);
      map.get(t).push(a);
    }
    return map;
  }

  // ---------- Kategorie-Knöpfe ----------
  function fuelleKategorien() {
    const vorhanden = new Set(alle.map((a) => a.kategorie).filter(Boolean));
    const liste = [...Object.keys(FARBE), ...[...vorhanden].filter((k) => !(k in FARBE)).sort((x, y) => x.localeCompare(y, "de"))];
    document.getElementById("kategorien").innerHTML = ["", ...liste].map((k) =>
      `<button type="button" class="kat-knopf" data-kat="${esc(k)}" aria-pressed="${k === zustand.kategorie}">${k
        ? `<span class="punkt" style="background:${FARBE[k] || "#8a8a8a"}"></span>${esc(k)}` : "Alle"}</button>`).join("");
  }
  function zeigeAktivenVerein() {
    document.getElementById("aktiver-verein").innerHTML = zustand.verein
      ? `<button type="button" class="kat-knopf" aria-pressed="true" data-verein-weg>Alle Anlässe von ${esc(zustand.verein)} ✕</button>` : "";
  }

  // ---------- Karten ----------
  function karte(a) {
    const d = parse(a.datum);
    const n = Math.round((d - parse(heute)) / 864e5);
    const wt = n === 0 ? "Heute" : n === 1 ? "Morgen" : WOCHENTAGE[d.getDay()];
    const zt = a.zeit ? (a.zeitBis ? `${a.zeit}–${a.zeitBis} Uhr` : `${a.zeit} Uhr`) : "ganztägig";
    const bis = a.bis ? ` · bis ${parse(a.bis).getDate()}. ${MONATE[parse(a.bis).getMonth()]}` : "";
    return `<li><button class="karte" data-id="${esc(a.id)}" style="--kat:${farbe(a)}">
      <div class="datum-block${a.datum === heute ? " heute" : ""}"><div class="wt">${wt}</div><div class="tg">${d.getDate()}</div><div class="mo">${MONATE[d.getMonth()].slice(0, 3)}</div></div>
      <div>
        ${vlogo(a)}
        <h3>${esc(a.titel)}</h3>
        <div class="zeile"><span class="nowrap">${esc(zt)}${esc(bis)} ·</span> ${esc(a.gemeinde === "Rehetobel" ? a.ort || "Rehetobel" : ortText(a))}</div>
        ${a.veranstalter ? `<div class="verein-zeile">${esc(a.veranstalter)}</div>` : ""}
        ${a.kategorie ? `<span class="kat-etikett">${esc(a.kategorie)}</span>` : ""}
        ${a.nurMitglieder ? `<span class="etikett">Nur für Mitglieder</span>` : ""}
        ${a.status === "provisorisch" ? `<span class="etikett provisorisch">provisorisch</span>` : ""}
        ${a.verschiebbar ? `<span class="etikett">${verschiebbarText(a)}</span>` : ""}
      </div>
    </button></li>`;
  }

  // «Kann das Datum verschoben werden?» Ja/Nein → kurzer Text
  const verschiebbarText = (a) => /^j/i.test(a.verschiebbar) ? "verschiebbar" : /^n/i.test(a.verschiebbar) ? "fest, nicht verschiebbar" : esc(a.verschiebbar);

  // ---------- Ansicht: Liste ----------
  // «Diese Woche im Dorf», «Nächste Woche», danach nach Monat. Zuerst 20 Anlässe, beim Suchen alle.
  function zeigeListe() {
    const el = document.getElementById("ansicht-liste");
    const alleKommenden = gefiltert().filter((a) => (a.bis || a.datum) >= heute);
    if (!alleKommenden.length) { el.innerHTML = `<p class="leer">Keine bevorstehenden Anlässe gefunden.</p>`; return; }
    const alles = zustand.suche.trim() || zustand.verein || window.KALENDER_PLANUNG;
    const liste = alles ? alleKommenden : alleKommenden.slice(0, zustand.anzahl);
    const h = parse(heute), montag = plusTage(h, -mo0(h));
    const naechsterMontag = iso(plusTage(montag, 7)), uebernaechster = iso(plusTage(montag, 14));
    let html = "", abschnitt = "";
    for (const a of liste) {
      const d = parse(a.datum), beginn = a.datum < heute ? heute : a.datum;
      const ab = window.KALENDER_PLANUNG ? `${MONATE[d.getMonth()]} ${d.getFullYear()}`
        : beginn < naechsterMontag ? "Diese Woche im Dorf" : beginn < uebernaechster ? "Nächste Woche" : `${MONATE[d.getMonth()]} ${d.getFullYear()}`;
      if (ab !== abschnitt) { html += (abschnitt ? "</ul>" : "") + `<h2 class="abschnitt">${ab}</h2><ul class="karten">`; abschnitt = ab; }
      html += karte(a);
    }
    html += "</ul>";
    if (liste.length < alleKommenden.length)
      html += `<button class="mehr" data-mehr>Weitere Anlässe anzeigen (${alleKommenden.length - liste.length})</button>`;
    el.innerHTML = html;
  }

  // ---------- Ansicht: Monat ----------
  function zeigeMonat() {
    const el = document.getElementById("ansicht-monat");
    const erster = zustand.monat;
    const start = plusTage(erster, -mo0(erster));
    const tage = proTag(gefiltert());
    let html = `<div class="monat-nav">
      <button class="knopf knopf-rand" data-monat="-1" aria-label="Vorheriger Monat">‹</button>
      <h2>${MONATE[erster.getMonth()]} ${erster.getFullYear()}</h2>
      <button class="knopf knopf-rand" data-monat="1" aria-label="Nächster Monat">›</button>
    </div><div class="raster">`;
    for (const w of ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"]) html += `<div class="wt-kopf">${w}</div>`;
    for (let i = 0; i < 42; i++) {
      const d = plusTage(start, i);
      const t = iso(d);
      const liste = tage.get(t) || [];
      const klassen = ["zelle", d.getMonth() !== erster.getMonth() ? "fremd" : "",
        t === heute ? "heute" : "", t === zustand.gewaehlterTag ? "gewaehlt" : ""].join(" ");
      html += `<button class="${klassen}" data-tag="${t}" aria-label="${d.getDate()}. ${MONATE[d.getMonth()]}, ${liste.length} Anlässe">
        <span class="nr">${d.getDate()}</span>
        ${liste.slice(0, 3).map((a) => `<span class="chip ${a.status === "provisorisch" ? "provisorisch" : ""}">${esc(a.zeit || "")} ${esc(a.titel)}</span>`).join("")}
        ${liste.length > 3 ? `<span class="chip">+${liste.length - 3} weitere</span>` : ""}
        <span class="punkte">${liste.map(() => "<i></i>").join("")}</span>
      </button>`;
      if (i === 34 && plusTage(start, 35).getMonth() !== erster.getMonth()) break; // 5 Wochen reichen
    }
    html += `</div>${tagesListe(tage)}`;
    el.innerHTML = html;
  }

  function tagesListe(tage) {
    if (!zustand.gewaehlterTag) return "";
    const d = parse(zustand.gewaehlterTag);
    const liste = tage.get(zustand.gewaehlterTag) || [];
    return `<div class="tag-liste"><h2 class="monat-titel">${WOCHENTAGE_LANG[d.getDay()]}, ${d.getDate()}. ${MONATE[d.getMonth()]} ${d.getFullYear()}</h2>
      ${liste.length ? `<ul class="karten">${liste.map(karte).join("")}</ul>` : `<p class="leer">An diesem Tag ist noch nichts eingetragen.</p>`}</div>`;
  }

  // ---------- Ansicht: Terminplanung ----------
  function zeigePlanung() {
    const el = document.getElementById("ansicht-planung");
    const j = zustand.planungsJahr;
    const tage = proTag(gefiltert());
    let html = `<div class="planung-intro">
      <p><strong>Datum für einen Anlass suchen?</strong> Hier sehen Sie auf einen Blick, an welchen Tagen
      im Dorf schon etwas los ist. Tag antippen für Details.</p>
      <div class="legende">
        <span><i style="background:var(--flaeche)"></i>frei</span>
        <span><i style="background:var(--belegt-1)"></i>1 Anlass</span>
        <span><i style="background:var(--belegt-2)"></i>2 Anlässe</span>
        <span><i style="background:var(--belegt-3)"></i>3 und mehr</span>
        <span><i style="box-shadow: inset 0 0 0 2px var(--akzent)"></i>provisorisch reserviert</span>
      </div>
    </div>
    <div class="monat-nav">
      <button class="knopf knopf-rand" data-jahr="-1" aria-label="Vorheriges Jahr">‹</button>
      <h2>Jahresübersicht ${j}</h2>
      <button class="knopf knopf-rand" data-jahr="1" aria-label="Nächstes Jahr">›</button>
    </div>
    <div class="jahr">`;
    for (let m = 0; m < 12; m++) {
      const erster = new Date(j, m, 1);
      const anzahl = new Date(j, m + 1, 0).getDate();
      html += `<div class="mini"><h3>${MONATE[m]}</h3><div class="raster">`;
      for (const w of ["M", "D", "M", "D", "F", "S", "S"]) html += `<div class="wt-kopf">${w}</div>`;
      for (let i = 0; i < mo0(erster); i++) html += `<span class="mini-tag leer-tag"></span>`;
      for (let t = 1; t <= anzahl; t++) {
        const d = new Date(j, m, t);
        const key = iso(d);
        const liste = tage.get(key) || [];
        const n = liste.length;
        const kl = ["mini-tag", n >= 3 ? "b3" : n === 2 ? "b2" : n === 1 ? "b1" : "",
          liste.some((a) => a.status === "provisorisch") ? "prov" : "",
          d.getDay() === 0 || d.getDay() === 6 ? "wochenende" : "",
          key === zustand.gewaehlterTag ? "gewaehlt" : ""].join(" ");
        html += `<button class="${kl}" data-tag="${key}" aria-label="${t}. ${MONATE[m]}: ${n ? n + " Anlass/Anlässe" : "frei"}">${t}</button>`;
      }
      html += `</div></div>`;
    }
    html += `</div>${tagesListe(tage)}`;
    el.innerHTML = html;
  }

  // ---------- Detail (Fenster beim Antippen) ----------
  const detail = document.getElementById("detail");
  function zeigeDetail(id) {
    const a = alle.find((x) => x.id === id);
    if (!a) return;
    detail.innerHTML = `<div class="detail-innen">
      <div class="detail-kopf">${vlogo(a, true)}<h2 id="detail-titel">${esc(a.titel)}</h2>
        <button class="zu" data-schliessen aria-label="Schliessen">×</button></div>
      ${a.nurMitglieder ? `<p><span class="etikett">Nur für Mitglieder</span></p>` : ""}
      ${a.status === "provisorisch" ? `<p><span class="etikett provisorisch">provisorisch – Datum noch nicht definitiv</span></p>` : ""}
      <dl>
        <dt>Datum</dt><dd>${esc(datumText(a))}</dd>
        <dt>Zeit</dt><dd>${esc(zeitText(a))}</dd>
        <dt>Ort</dt><dd>${esc(ortText(a))}</dd>
        ${a.veranstalter ? `<dt>Veranstalter</dt><dd>${esc(a.veranstalter)}</dd>` : ""}
        ${a.kategorie ? `<dt>Kategorie</dt><dd><span class="kat-etikett" style="--kat:${farbe(a)};margin:0">${esc(a.kategorie)}</span></dd>` : ""}
        ${a.verschiebbar ? `<dt>Verschiebbar</dt><dd>${verschiebbarText(a)}</dd>` : ""}
      </dl>
      ${a.beschreibung ? `<p>${esc(a.beschreibung)}</p>` : ""}
      <div class="knoepfe">
        <button class="knopf knopf-rot" data-ics="${esc(a.id)}">📅 In meinen Kalender</button>
        ${a.link ? `<a class="knopf knopf-rand" href="${esc(a.link)}" target="_blank" rel="noopener">Mehr Infos</a>` : ""}
        ${a.veranstalter ? `<button class="knopf knopf-rand" data-verein="${esc(a.veranstalter)}">Alle Anlässe von ${esc(a.veranstalter)}</button>` : ""}
      </div></div>`;
    detail.showModal();
  }

  // ---------- iCal-Export ----------
  function ics(a) {
    const kompakt = (s) => s.replace(/-/g, "");
    const zt = (z) => z.replace(":", "") + "00";
    const text = (s) => String(s || "").replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/[,;]/g, (c) => "\\" + c);
    let start, ende;
    if (a.zeit) {
      start = `DTSTART;TZID=Europe/Zurich:${kompakt(a.datum)}T${zt(a.zeit)}`;
      const endZeit = a.zeitBis || (() => { const [h, m] = a.zeit.split(":").map(Number);
        return `${String(Math.min(h + 2, 23)).padStart(2, "0")}:${String(m).padStart(2, "0")}`; })();
      ende = `DTEND;TZID=Europe/Zurich:${kompakt(a.bis || a.datum)}T${zt(endZeit)}`;
    } else {
      start = `DTSTART;VALUE=DATE:${kompakt(a.datum)}`;
      ende = `DTEND;VALUE=DATE:${kompakt(iso(plusTage(parse(a.bis || a.datum), 1)))}`;
    }
    const jetzt = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d+/, "");
    const inhalt = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Verkehrsverein Rehetobel//Dorfkalender//DE",
      "BEGIN:VEVENT", `UID:${a.id}@dorfkalender-rehetobel`, `DTSTAMP:${jetzt}`, start, ende,
      `SUMMARY:${text(a.titel)}`, `LOCATION:${text(ortText(a))}`,
      a.beschreibung ? `DESCRIPTION:${text(a.beschreibung)}` : null,
      "END:VEVENT", "END:VCALENDAR"].filter(Boolean).join("\r\n");
    const url = URL.createObjectURL(new Blob([inhalt], { type: "text/calendar" }));
    const link = Object.assign(document.createElement("a"), { href: url, download: `${a.titel.replace(/[^\wäöüÄÖÜ -]/g, "")}.ics` });
    document.body.appendChild(link); link.click(); link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  // ---------- Ansicht: Planungsliste zum Ausdrucken (nur Planungskalender) ----------
  function zeigeDruck() {
    const el = document.getElementById("ansicht-druck");
    const j = zustand.planungsJahr;
    const tage = proTag(alle);
    let html = `<div class="druck-kopf"><h2>Planungsliste ${j} – Koordinationssitzung</h2>
      <p>Provisorisch, nur für die Vereine. ⚠ = mehrere Anlässe am gleichen Tag.
      <button class="knopf knopf-akzent nicht-drucken" onclick="window.print()">Drucken</button></p></div>`;
    for (let m = 0; m < 12; m++) {
      const imMonat = alle.filter((a) => parse(a.datum).getFullYear() === j && parse(a.datum).getMonth() === m);
      html += `<h3 class="druck-monat">${MONATE[m]} ${j}</h3>`;
      if (!imMonat.length) { html += `<p class="leer druck-leer">– noch nichts gemeldet –</p>`; continue; }
      html += `<table class="druck-tabelle"><thead><tr><th></th><th>Datum</th><th>Zeit</th><th>Anlass</th><th>Veranstalter</th><th>Ort</th><th>Verschiebbar</th></tr></thead><tbody>`;
      for (const a of imMonat) {
        const d = parse(a.datum);
        const doppelt = tageVon(a).some((t) => (tage.get(t) || []).length > 1);
        html += `<tr class="${doppelt ? "konflikt" : ""}"><td>${doppelt ? "⚠" : ""}</td>
          <td>${WOCHENTAGE[d.getDay()]} ${d.getDate()}.${d.getMonth() + 1}.${a.bis ? ` – ${parse(a.bis).getDate()}.${parse(a.bis).getMonth() + 1}.` : ""}</td>
          <td>${esc(a.zeit || "")}</td><td>${esc(a.titel)}</td><td>${esc(a.veranstalter)}</td><td>${esc(a.ort)}</td>
          <td>${a.verschiebbar ? verschiebbarText(a) : ""}</td></tr>`;
      }
      html += `</tbody></table>`;
    }
    el.innerHTML = html;
  }

  // ---------- Steuerung ----------
  function zeichne() {
    for (const n of ["liste", "monat", "planung", "druck"]) {
      const sek = document.getElementById(`ansicht-${n}`), tab = document.querySelector(`[data-ansicht="${n}"]`);
      if (!sek || !tab) continue;
      sek.hidden = n !== zustand.ansicht;
      tab.setAttribute("aria-selected", n === zustand.ansicht);
    }
    ({ liste: zeigeListe, monat: zeigeMonat, planung: zeigePlanung, druck: zeigeDruck })[zustand.ansicht]();
  }

  // Planungskalender (?planung=…): Hinweis, eigenes Jahr, zusätzliche Ansicht «Liste zum Drucken»
  function richtePlanungEin() {
    const jahr = window.KALENDER_PLANUNG.jahr;
    document.body.classList.add("planung-modus");
    // Planungskalender nicht in Suchmaschinen aufnehmen
    document.head.insertAdjacentHTML("beforeend", `<meta name="robots" content="noindex, nofollow">`);
    document.title = `Planungskalender ${jahr} – Dorfkalender Rehetobel`;
    const untertitel = document.querySelector(".untertitel");
    if (untertitel) untertitel.textContent = `Planungskalender ${jahr}`;
    document.querySelector(".seite").insertAdjacentHTML("afterbegin",
      `<p class="planung-hinweis"><strong>Planungskalender ${jahr} – provisorisch.</strong> Nur für die Vereine, die ihre Anlässe planen.
       Bitte nicht weitergeben. Die Daten werden an der Koordinationssitzung im November gemeinsam festgelegt;
       erst danach erscheinen sie im öffentlichen Dorfkalender.</p>`);
    document.querySelector(".tabs").insertAdjacentHTML("beforeend",
      `<button role="tab" data-ansicht="druck" aria-selected="false">Liste zum Drucken</button>`);
    document.getElementById("ansicht-planung").insertAdjacentHTML("afterend", `<section id="ansicht-druck" class="ansicht" hidden></section>`);
    zustand.planungsJahr = jahr;
    zustand.monat = new Date(jahr, 0, 1);
    zustand.ansicht = new URLSearchParams(location.search).get("ansicht") === "druck" ? "druck" : "planung";
  }

  document.addEventListener("click", (e) => {
    const z = e.target.closest("[data-ansicht],[data-monat],[data-jahr],[data-tag],[data-id],[data-ics],[data-schliessen],[data-kat],[data-verein],[data-verein-weg],[data-mehr],#kat-auf,a[href='#melden']");
    if (!z) return;
    if (z.id === "kat-auf") {
      const auf = z.getAttribute("aria-expanded") !== "true";
      z.setAttribute("aria-expanded", auf); document.getElementById("kategorien").classList.toggle("offen", auf);
    }
    else if (z.dataset.kat !== undefined) {
      zustand.kategorie = z.dataset.kat; zustand.anzahl = PRO_SEITE;
      document.querySelectorAll("#kategorien .kat-knopf").forEach((b) => b.setAttribute("aria-pressed", b === z));
      // Handy: wieder zuklappen und die Wahl auf dem Knopf zeigen
      document.getElementById("kat-auf").setAttribute("aria-expanded", "false");
      document.getElementById("kategorien").classList.remove("offen");
      document.getElementById("kat-auf-text").textContent = zustand.kategorie ? `Kategorie: ${zustand.kategorie}` : "Nach Kategorie filtern";
      zeichne();
    }
    else if (z.dataset.verein !== undefined) {
      detail.close(); zustand.verein = z.dataset.verein; zustand.ansicht = "liste"; zeigeAktivenVerein(); zeichne();
      document.querySelector(".such").scrollIntoView({ behavior: "smooth", block: "start" });
    }
    else if ("vereinWeg" in z.dataset) { zustand.verein = ""; zeigeAktivenVerein(); zeichne(); }
    else if ("mehr" in z.dataset) { zustand.anzahl += PRO_SEITE; zeichne(); }
    else if (z.dataset.ansicht) { zustand.ansicht = z.dataset.ansicht; zustand.gewaehlterTag = null; zeichne(); }
    else if (z.dataset.monat) {
      const m = zustand.monat; zustand.monat = new Date(m.getFullYear(), m.getMonth() + Number(z.dataset.monat), 1);
      zustand.gewaehlterTag = null; zeichne();
    }
    else if (z.dataset.jahr) { zustand.planungsJahr += Number(z.dataset.jahr); zustand.gewaehlterTag = null; zeichne(); }
    else if (z.dataset.tag) {
      zustand.gewaehlterTag = zustand.gewaehlterTag === z.dataset.tag ? null : z.dataset.tag; zeichne();
      if (zustand.gewaehlterTag) document.querySelector(".tag-liste")?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
    else if (z.dataset.id) zeigeDetail(z.dataset.id);
    else if (z.dataset.ics) ics(alle.find((a) => a.id === z.dataset.ics));
    else if ("schliessen" in z.dataset) z.closest("dialog").close();
    else if (z.matches("a[href='#melden']")) {
      e.preventDefault();
      const url = (window.KALENDER_CONFIG || {}).formularUrl;
      if (url) window.open(url, "_blank", "noopener");
      else document.getElementById("melden-dialog").showModal();
    }
  });
  // Klick auf den abgedunkelten Hintergrund schliesst Dialoge
  document.querySelectorAll("dialog").forEach((d) =>
    d.addEventListener("click", (e) => { if (e.target === d) d.close(); }));

  document.getElementById("suche").addEventListener("input", (e) => { zustand.suche = e.target.value; zustand.anzahl = PRO_SEITE; zeichne(); });

  // ---------- «Dorfkalender aufs Handy» (Anleitung je nach Handy) ----------
  (function appHinweis() {
    const ua = navigator.userAgent;
    const alsApp = matchMedia("(display-mode: standalone)").matches || navigator.standalone === true;
    const iphone = /iPhone|iPad|iPod/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1);
    const android = /Android/.test(ua);
    if (alsApp || (!iphone && !android)) return;   // schon als App geöffnet oder Computer: kein Hinweis
    document.getElementById("app-anleitung").innerHTML = iphone
      ? "Unten auf den Teilen-Knopf <b>□↑</b> tippen, dann «Zum Home-Bildschirm». So ist der Kalender wie eine App immer dabei."
      : "Oben rechts auf <b>⋮</b> tippen, dann «Zum Startbildschirm hinzufügen» (oder «App installieren»). So ist der Kalender wie eine App immer dabei.";
    document.getElementById("app-hinweis").hidden = false;
    // Android/Chrome bietet manchmal direkt «Installieren» an → eigener Knopf
    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      const knopf = document.getElementById("app-installieren");
      knopf.hidden = false;
      knopf.onclick = async () => { e.prompt(); await e.userChoice; knopf.hidden = true; };
    });
  })();

  // Eingebettet (z. B. in ClubDesk): ?einbetten=1 blendet Kopf und Fuss aus
  if (new URLSearchParams(location.search).has("einbetten")) document.body.classList.add("eingebettet");

  // ---------- Start: Daten laden (Google-Tabelle oder Beispieldaten) ----------
  document.getElementById("ansicht-liste").innerHTML = `<p class="leer">Anlässe werden geladen …</p>`;
  window.ladeAnlaesse()
    .then((liste) => {
      alle = sortiere(liste).map((a) => ({ ...a, kategorie: kategorieVon(a.kategorie) }));
      if (window.KALENDER_PLANUNG) richtePlanungEin();
      fuelleKategorien();
      zeichne();
    })
    .catch((err) => {
      console.error(err);
      document.getElementById("ansicht-liste").innerHTML =
        `<p class="leer">Die Anlässe konnten nicht geladen werden. Bitte später nochmals versuchen.</p>`;
    });
})();
