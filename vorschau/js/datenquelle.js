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
    // Google liefert ein Datum manchmal als Zahl (Tage seit 30.12.1899), z. B. 46329
    if (/^\d{5}([.,]\d+)?$/.test(s)) {
      const d = new Date(Date.UTC(1899, 11, 30) + Math.floor(parseFloat(s.replace(",", "."))) * 86400000);
      return d.toISOString().slice(0, 10);
    }
    let m = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
    if (m) return `${m[1]}-${m[2].padStart(2, "0")}-${m[3].padStart(2, "0")}`;
    m = s.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})/);
    if (m) return `${m[3]}-${m[2].padStart(2, "0")}-${m[1].padStart(2, "0")}`;
    return "";
  }
  // "19:00", "19.00", "19:00:00" → "19:00"
  function zeit(s) {
    s = (s || "").trim();
    // Uhrzeit als Tagesbruchteil, z. B. 0,7916666667 = 19:00 (0 = keine Zeit)
    if (/^0?[.,]\d+$/.test(s) || /^0$/.test(s)) {
      const min = Math.round(parseFloat(s.replace(",", ".")) * 1440);
      if (!min) return "";
      return `${String(Math.floor(min / 60)).padStart(2, "0")}:${String(min % 60).padStart(2, "0")}`;
    }
    const m = s.match(/^(\d{1,2})[:.](\d{2})/);
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
    // «Für alle offen» / «Nur für Mitglieder» (Formularfrage, Entscheid 7.11.2026) – fehlt die Spalte, gilt «für alle offen»
    offen: ["für wen", "für wen ist der anlass?", "öffentlich", "ist der anlass öffentlich (für alle offen)?", "für alle offen"],
  };
  // «Nur für Mitglieder», «nein», «vereinsintern» → nur für Mitglieder
  const nurMitglieder = (s) => /mitglied|^nein|intern/i.test((s || "").trim());

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
        nurMitglieder: nurMitglieder(wert("offen")),
      };
      if (a.bis && a.bis <= a.datum) a.bis = "";
      return a;
    }).filter((a) => a.titel && a.datum);
  }

  // Planungskalender: ?planung=<Schlüssel> → vorgemerkte Anlässe des nächsten Jahres aus dem Google-Programm
  // (ohne Google-Anmeldung abgefragt; ohne gültigen Schlüssel gibt es nichts)
  async function ladePlanung(schluessel) {
    const cfg = window.KALENDER_CONFIG || {};
    const url = cfg.webAppUrl + "?" + new URLSearchParams({ api: "planung", k: schluessel });
    const antwort = await fetch(url, { credentials: "omit", cache: "no-store" });
    if (!antwort.ok) throw new Error("Planung nicht erreichbar: " + antwort.status);
    const d = await antwort.json();
    if (!d.ok) throw new Error(d.text || "Planungskalender nicht verfügbar");
    window.KALENDER_PLANUNG = { jahr: d.jahr };
    return d.anlaesse.map((x, n) => {
      const a = {
        id: "p" + n, titel: x.titel || "", datum: isoDatum(x.datum), bis: isoDatum(x.bis),
        zeit: zeit(x.zeit), zeitBis: zeit(x.zeitBis), ort: x.ort || "", gemeinde: "Rehetobel",
        veranstalter: x.veranstalter || "", kategorie: x.kategorie || "", beschreibung: x.beschreibung || "",
        link: /^https?:\/\//.test(x.link || "") ? x.link : "", status: "provisorisch",
        verschiebbar: String(x.verschiebbar || "").trim(),
        nurMitglieder: nurMitglieder(x.offen),
      };
      if (a.bis && a.bis <= a.datum) a.bis = "";
      return a;
    }).filter((a) => a.titel && a.datum);
  }

  window.ladeAnlaesse = async function () {
    const planung = new URLSearchParams(location.search).get("planung");
    if (planung) return ladePlanung(planung);
    const url = (window.KALENDER_CONFIG || {}).tabelleCsvUrl;
    if (!url) return window.ANLAESSE || [];
    const antwort = await fetch(url, { cache: "no-store" });
    if (!antwort.ok) throw new Error("Tabelle nicht erreichbar: " + antwort.status);
    return zuAnlaessen(leseCsv(await antwort.text()));
  };
  window._kalenderIntern = { leseCsv, zuAnlaessen, isoDatum };
})();
