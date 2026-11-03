// Dorfkalender Rehetobel – Prototyp
// Reines JavaScript ohne Abhängigkeiten. Daten kommen aus window.ANLAESSE.
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

  // ---------- Daten ----------
  let alle = [];
  const sortiere = (liste) => liste.slice().sort((x, y) =>
    (x.datum + (x.zeit || "")).localeCompare(y.datum + (y.zeit || "")));

  const zustand = {
    ansicht: "liste",
    suche: "",
    kategorie: "",
    gemeinde: "",
    monat: (() => { const d = new Date(); return new Date(d.getFullYear(), d.getMonth(), 1); })(),
    gewaehlterTag: null,
    planungsJahr: new Date().getFullYear() + (new Date().getMonth() >= 9 ? 1 : 0),
  };

  function gefiltert() {
    const q = zustand.suche.trim().toLowerCase();
    return alle.filter((a) =>
      (!zustand.kategorie || a.kategorie === zustand.kategorie) &&
      (!zustand.gemeinde || a.gemeinde === zustand.gemeinde) &&
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

  // ---------- Filter-Auswahl füllen ----------
  function fuelleSelect(id, werte) {
    const sel = document.getElementById(id);
    [...new Set(werte.filter(Boolean))].sort((a, b) => a.localeCompare(b, "de"))
      .forEach((w) => sel.insertAdjacentHTML("beforeend", `<option>${esc(w)}</option>`));
  }

  // ---------- Karten ----------
  function karte(a) {
    const d = parse(a.datum);
    const ort = ortText(a);
    return `<li><button class="karte" data-id="${esc(a.id)}">
      <div class="datum-block"><div class="wt">${WOCHENTAGE[d.getDay()]}</div><div class="tag">${d.getDate()}</div></div>
      <div>
        <h3>${esc(a.titel)}</h3>
        <p class="meta">${esc(zeitText(a))}${a.bis ? ` · bis ${parse(a.bis).getDate()}. ${MONATE[parse(a.bis).getMonth()]}` : ""}</p>
        <p class="meta">${esc(ort)}</p>
        ${a.kategorie ? `<span class="etikett">${esc(a.kategorie)}</span>` : ""}
        ${a.status === "provisorisch" ? `<span class="etikett provisorisch">provisorisch</span>` : ""}
      </div>
    </button></li>`;
  }

  // ---------- Ansicht: Liste ----------
  function zeigeListe() {
    const el = document.getElementById("ansicht-liste");
    const liste = gefiltert().filter((a) => (a.bis || a.datum) >= heute);
    if (!liste.length) { el.innerHTML = `<p class="leer">Keine bevorstehenden Anlässe gefunden.</p>`; return; }
    let html = "", aktMonat = "";
    for (const a of liste) {
      const d = parse(a.datum);
      const m = `${MONATE[d.getMonth()]} ${d.getFullYear()}`;
      if (m !== aktMonat) {
        if (aktMonat) html += "</ul>";
        html += `<h2 class="monat-titel">${m}</h2><ul class="karten">`;
        aktMonat = m;
      }
      html += karte(a);
    }
    el.innerHTML = html + "</ul>";
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

  // ---------- Detail ----------
  const detail = document.getElementById("detail");
  function zeigeDetail(id) {
    const a = alle.find((x) => x.id === id);
    if (!a) return;
    detail.innerHTML = `<div class="dialog-kopf">
        <h2 id="detail-titel">${esc(a.titel)}</h2>
        <button class="schliessen" data-schliessen aria-label="Schliessen">×</button>
      </div>
      ${a.status === "provisorisch" ? `<span class="etikett provisorisch">provisorisch – Datum noch nicht definitiv</span>` : ""}
      <dl class="detail-liste">
        <dt>Datum</dt><dd>${esc(datumText(a))}</dd>
        <dt>Zeit</dt><dd>${esc(zeitText(a))}</dd>
        <dt>Ort</dt><dd>${esc(ortText(a))}</dd>
        ${a.veranstalter ? `<dt>Veranstalter</dt><dd>${esc(a.veranstalter)}</dd>` : ""}
        ${a.kategorie ? `<dt>Kategorie</dt><dd>${esc(a.kategorie)}</dd>` : ""}
      </dl>
      ${a.beschreibung ? `<p>${esc(a.beschreibung)}</p>` : ""}
      <div class="knopf-reihe">
        <button class="knopf knopf-akzent" data-ics="${esc(a.id)}">In meinen Kalender</button>
        ${a.link ? `<a class="knopf knopf-rand" href="${esc(a.link)}" target="_blank" rel="noopener">Mehr Infos</a>` : ""}
      </div>`;
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

  // ---------- Steuerung ----------
  function zeichne() {
    for (const n of ["liste", "monat", "planung"]) {
      document.getElementById(`ansicht-${n}`).hidden = n !== zustand.ansicht;
      document.querySelector(`[data-ansicht="${n}"]`).setAttribute("aria-selected", n === zustand.ansicht);
    }
    ({ liste: zeigeListe, monat: zeigeMonat, planung: zeigePlanung })[zustand.ansicht]();
  }

  document.addEventListener("click", (e) => {
    const z = e.target.closest("[data-ansicht],[data-monat],[data-jahr],[data-tag],[data-id],[data-ics],[data-schliessen],a[href='#melden']");
    if (!z) return;
    if (z.dataset.ansicht) { zustand.ansicht = z.dataset.ansicht; zustand.gewaehlterTag = null; zeichne(); }
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

  document.getElementById("suche").addEventListener("input", (e) => { zustand.suche = e.target.value; zeichne(); });
  document.getElementById("filter-kategorie").addEventListener("change", (e) => { zustand.kategorie = e.target.value; zeichne(); });
  document.getElementById("filter-gemeinde").addEventListener("change", (e) => { zustand.gemeinde = e.target.value; zeichne(); });

  // Eingebettet (z. B. in ClubDesk): ?einbetten=1 blendet Kopf und Fuss aus
  if (new URLSearchParams(location.search).has("einbetten")) document.body.classList.add("eingebettet");

  // ---------- Start: Daten laden (Google-Tabelle oder Beispieldaten) ----------
  document.getElementById("ansicht-liste").innerHTML = `<p class="leer">Anlässe werden geladen …</p>`;
  window.ladeAnlaesse()
    .then((liste) => {
      alle = sortiere(liste);
      fuelleSelect("filter-kategorie", alle.map((a) => a.kategorie));
      fuelleSelect("filter-gemeinde", alle.map((a) => a.gemeinde));
      // Nur eine Gemeinde (Rehetobel)? Dann braucht es den Gemeinde-Filter nicht.
      if (new Set(alle.map((a) => a.gemeinde)).size < 2) {
        document.getElementById("filter-gemeinde").closest("label").hidden = true;
        document.querySelector(".filter").classList.add("ohne-gemeinde");
      }
      zeichne();
    })
    .catch((err) => {
      console.error(err);
      document.getElementById("ansicht-liste").innerHTML =
        `<p class="leer">Die Anlässe konnten nicht geladen werden. Bitte später nochmals versuchen.</p>`;
    });
})();
