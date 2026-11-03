// Lädt die Anlässe: entweder aus der veröffentlichten Google-Tabelle (CSV)
// oder – solange noch kein Link eingetragen ist – aus den Beispieldaten.
(function () {
  "use strict";

  // Einfacher CSV-Leser (unterstützt Anführungszeichen, Kommas und Zeilenumbrüche in Feldern)
  function leseCsv(text) {
    const zeilen = []; let zeile = []; let feld = ""; let inQuote = false;
    for (let i = 0; i < text.length; i++) {
      const c = text[i];
      if (inQuote) {
        if (c === '"' && text[i + 1] === '"') { feld += '"'; i++; }
        else if (c === '"') inQuote = false;
        else feld += c;
      } else if (c === '"') inQuote = true;
      else if (c === ",") { zeile.push(feld); feld = ""; }
      else if (c === "\n" || c === "\r") {
        if (c === "\r" && text[i + 1] === "\n") i++;
        zeile.push(feld); zeilen.push(zeile); zeile = []; feld = "";
      } else feld += c;
    }
    if (feld !== "" || zeile.length) { zeile.push(feld); zeilen.push(zeile); }
    return zeilen.filter((z) => z.some((f) => f.trim() !== ""));
  }

  // "13.06.2026" oder "2026-06-13" oder "13.6.2026" → "2026-06-13"
  function isoDatum(s) {
    s = (s || "").trim();
    let m = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
    if (m) return `${m[1]}-${m[2].padStart(2, "0")}-${m[3].padStart(2, "0")}`;
    m = s.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})/);
    if (m) return `${m[3]}-${m[2].padStart(2, "0")}-${m[1].padStart(2, "0")}`;
    return "";
  }
  // "19:00", "19.00", "19:00:00" → "19:00"
  function zeit(s) {
    const m = (s || "").trim().match(/^(\d{1,2})[:.](\d{2})/);
    return m ? `${m[1].padStart(2, "0")}:${m[2]}` : "";
  }

  // Spaltennamen in der Tabelle «Kalender» (Kleinschreibung egal)
  const SPALTEN = {
    titel: ["titel", "anlass", "name des anlasses"],
    datum: ["datum", "datum von", "startdatum"],
    bis: ["bis", "datum bis", "enddatum"],
    zeit: ["zeit", "beginn", "zeit von"],
    zeitBis: ["zeit bis", "ende"],
    ort: ["ort", "lokalität"],
    gemeinde: ["gemeinde"],
    veranstalter: ["veranstalter", "verein", "organisator"],
    kategorie: ["kategorie", "veranstalter-gruppe"],
    beschreibung: ["beschreibung"],
    link: ["link", "webseite"],
    status: ["status"],
  };

  function zuAnlaessen(zeilen) {
    const kopf = zeilen[0].map((h) => h.trim().toLowerCase());
    const idx = {};
    for (const [feld, namen] of Object.entries(SPALTEN)) idx[feld] = kopf.findIndex((h) => namen.includes(h));
    return zeilen.slice(1).map((z, n) => {
      const wert = (feld) => (idx[feld] >= 0 ? (z[idx[feld]] || "").trim() : "");
      const a = {
        id: "t" + n,
        titel: wert("titel"),
        datum: isoDatum(wert("datum")),
        bis: isoDatum(wert("bis")),
        zeit: zeit(wert("zeit")),
        zeitBis: zeit(wert("zeitBis")),
        ort: wert("ort"),
        gemeinde: wert("gemeinde") || "Rehetobel",
        veranstalter: wert("veranstalter"),
        kategorie: wert("kategorie"),
        beschreibung: wert("beschreibung"),
        link: /^https?:\/\//.test(wert("link")) ? wert("link") : "",
        status: wert("status").toLowerCase().startsWith("prov") ? "provisorisch" : "fix",
      };
      if (a.bis && a.bis <= a.datum) a.bis = "";
      return a;
    }).filter((a) => a.titel && a.datum);
  }

  window.ladeAnlaesse = async function () {
    const url = (window.KALENDER_CONFIG || {}).tabelleCsvUrl;
    if (!url) return window.ANLAESSE || [];
    const antwort = await fetch(url, { cache: "no-store" });
    if (!antwort.ok) throw new Error("Tabelle nicht erreichbar: " + antwort.status);
    return zuAnlaessen(leseCsv(await antwort.text()));
  };
  window._kalenderIntern = { leseCsv, zuAnlaessen, isoDatum };
})();
