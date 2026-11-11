// Anlass-Prüfer: liest die Anlässe aus dem Blatt «Kalender» (nur öffentliche Spalten, ohne Kontaktdaten)
// und meldet, was fehlt oder nicht zusammenpasst. Ändert nichts.
//
// Starten:  node tests/anlaesse-pruefen.js <datei> [--ab JJJJ-MM-TT]
//   <datei>  CSV des Blatts «Kalender» oder JSON mit den Werten (z. B. {"values": [[...], ...]} aus Google Sheets)
//   --ab     nur Anlässe ab diesem Tag prüfen (Standard: heute)
//
// Die Datei mit den Anlässen nie in die Ablage legen (nur in einen Ordner für Zwischendateien).
"use strict";
const fs = require("fs"), path = require("path"), vm = require("vm");

const ROOT = path.join(__dirname, "..");

// Die Webseite selbst liest die Tabelle mit js/datenquelle.js – der Prüfer nimmt genau denselben Leser,
// damit er das gleiche sieht wie die Webseite. Die Vereinslogos kommen aus js/logos.js.
function ladeWebseitenTeile() {
  const ctx = { window: {}, location: { search: "" }, URLSearchParams, console };
  vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(path.join(ROOT, "js", "datenquelle.js"), "utf8"), ctx);
  vm.runInContext(fs.readFileSync(path.join(ROOT, "js", "logos.js"), "utf8"), ctx);
  return { ...ctx.window._kalenderIntern, logos: ctx.window.KALENDER_LOGOS || [] };
}

const THEMEN = ["Musik & Kultur", "Feste & Märkte", "Sport & Natur", "Kinder & Familie", "Senioren & Treffpunkt",
  "Kirche", "Gemeinde & Politik", "Vereinsleben", "Kurse & Weiteres",
  "Senioren", "Begegnung", "Vorträge & Weiteres"];   // Namen der zehn Themen (10.11.2026) gelten schon in der Tabelle
// Gleiche Hauptart am gleichen Tag – wie die Warnung im Prüf-Mail (apps-script/Mails.gs)
const HAUPTARTEN = ["Musik & Kultur", "Feste & Märkte", "Sport & Natur"];

const normal = (s) => String(s || "").toLowerCase().replace(/\s+/g, " ").trim();
// Für «ähnliche Schreibweise»: ohne Ortsnamen, Satzzeichen und Leerschläge
const kern = (s) => normal(s).replace(/rehetobel|rechtobel|wald|und umgebung/g, "").replace(/[^a-zäöü0-9]/g, "");
const tag = (iso) => { const [j, m, t] = iso.split("-"); return `${Number(t)}.${Number(m)}.${j}`; };
const kurz = (a) => `${tag(a.datum)} «${a.titel}»${a.veranstalter ? ` (${a.veranstalter})` : ""}`;

function pruefeAnlaesse(zeilen, ab) {
  const teile = ladeWebseitenTeile();
  const kopf = (zeilen[0] || []).map((h) => normal(h));
  // Zeilen, die die Webseite gar nicht zeigt (kein Titel oder Datum nicht lesbar)
  const iTitel = kopf.findIndex((h) => ["titel", "anlass", "name des anlasses"].includes(h));
  const iDatum = kopf.findIndex((h) => ["datum", "datum von", "startdatum"].includes(h));
  const unsichtbar = [];
  zeilen.slice(1).forEach((z, n) => {
    const titel = String(z[iTitel] || "").trim(), datum = String(z[iDatum] || "").trim();
    if (!titel && !datum) return;   // ganz leere Zeile
    if (!titel || !teile.isoDatum(datum)) unsichtbar.push(`Zeile ${n + 2}: «${titel || "(ohne Titel)"}», Datum «${datum || "leer"}»`);
  });

  const alle = teile.zuAnlaessen(zeilen.map((z) => z.map((f) => String(f ?? ""))));
  const kommend = alle.filter((a) => (a.bis || a.datum) >= ab).sort((x, y) => (x.datum + x.zeit).localeCompare(y.datum + y.zeit));

  const logoNamen = new Map();
  for (const l of teile.logos) for (const n of l.namen) logoNamen.set(normal(n), l.datei);
  const logoKerne = new Map();
  for (const l of teile.logos) for (const n of l.namen) if (kern(n).length >= 3) logoKerne.set(kern(n), l.namen[0]);

  const r = {
    anzahl: alle.length, kommend: kommend.length, unsichtbar,
    ohneZeit: [], ohneOrt: [], ohneVeranstalter: [], alteKategorie: [], doppelt: [], gleicheArt: [],
    ohneLogo: [], aehnlich: [], schreibweisen: [],
  };

  for (const a of kommend) {
    if (!a.zeit && !a.zeitWort) r.ohneZeit.push(kurz(a));
    if (!a.ort) r.ohneOrt.push(kurz(a));
    if (!a.veranstalter) r.ohneVeranstalter.push(kurz(a));
    if (!THEMEN.some((t) => normal(t) === normal(a.kategorie))) r.alteKategorie.push(`${kurz(a)} – Kategorie «${a.kategorie || "leer"}»`);
  }

  // Doppelt: gleicher Tag und gleicher Titel
  const gesehen = new Map();
  for (const a of kommend) {
    const k = a.datum + "|" + normal(a.titel);
    if (gesehen.has(k)) r.doppelt.push(kurz(a)); else gesehen.set(k, a);
  }

  // Gleiche Hauptart am gleichen Tag (nur zur Info – manchmal gewollt)
  const proTag = new Map();
  for (const a of kommend) {
    const art = HAUPTARTEN.find((h) => normal(h) === normal(a.kategorie));
    if (!art) continue;
    const k = a.datum + "|" + art;
    if (!proTag.has(k)) proTag.set(k, []);
    if (!proTag.get(k).some((b) => normal(b.titel) === normal(a.titel))) proTag.get(k).push(a);
  }
  for (const [k, liste] of proTag) if (liste.length > 1)
    r.gleicheArt.push(`${tag(k.split("|")[0])} ${k.split("|")[1]}: ` + liste.map((a) => `«${a.titel}»${a.veranstalter ? ` (${a.veranstalter})` : ""}`).join(", "));

  // Veranstalter ohne Logo; ähnlich geschrieben wie ein Verein mit Logo → Schreibweise in js/logos.js ergänzen
  const zaehle = new Map();
  for (const a of kommend) if (a.veranstalter) zaehle.set(a.veranstalter, (zaehle.get(a.veranstalter) || 0) + 1);
  for (const [name, anzahl] of [...zaehle].sort((x, y) => y[1] - x[1])) {
    if (logoNamen.has(normal(name))) continue;
    const k = kern(name);
    // Ähnlich = gleich, oder nur ein kurzes Wort mehr (z. B. «Feuerwehrverein» ↔ «Feuerwehr»).
    // Ein langer Zusatz heisst meist ein anderer Verein (z. B. «Lesegesellschaft Lobenschwendi» ↔ «Lesegesellschaft»).
    const nah = (a, b) => b.length >= 4 && a.includes(b) && a.length - b.length <= 6;
    const passend = [...logoKerne].find(([lk]) => k && (k === lk || nah(k, lk) || nah(lk, k)));
    if (passend) r.aehnlich.push(`«${name}» (${anzahl}×) – ähnlich wie «${passend[1]}», bekommt aber kein Logo`);
    else r.ohneLogo.push(`«${name}» (${anzahl}×)`);
  }

  // Gleicher Verein, verschiedene Schreibweisen (nur Gross/Klein, Satzzeichen, «Rehetobel»)
  const gruppen = new Map();
  for (const name of zaehle.keys()) { const k = kern(name); if (!k) continue; if (!gruppen.has(k)) gruppen.set(k, []); gruppen.get(k).push(name); }
  for (const namen of gruppen.values()) if (namen.length > 1) r.schreibweisen.push(namen.map((n) => `«${n}»`).join(", "));

  return r;
}

function bericht(r, ab) {
  const teil = (titel, liste, leer) => [`\n## ${titel} (${liste.length})`, ...(liste.length ? liste.map((x) => "- " + x) : ["✓ " + leer])];
  return [
    `# Anlass-Prüfer – Anlässe ab ${tag(ab)}`,
    `${r.anzahl} Anlässe in der Tabelle, davon ${r.kommend} ab ${tag(ab)} geprüft.`,
    ...teil("Erscheinen NICHT auf der Webseite (Titel fehlt oder Datum unlesbar)", r.unsichtbar, "alle Zeilen werden angezeigt"),
    ...teil("Möglicherweise doppelt (gleicher Tag, gleicher Titel)", r.doppelt, "nichts doppelt"),
    ...teil("Kategorie ist keines der neun Themen", r.alteKategorie, "alle haben ein Thema"),
    ...teil("Ohne Zeit (Webseite zeigt «ganztägig»)", r.ohneZeit, "alle haben eine Zeit"),
    ...teil("Ohne Ort", r.ohneOrt, "alle haben einen Ort"),
    ...teil("Ohne Veranstalter", r.ohneVeranstalter, "alle haben einen Veranstalter"),
    ...teil("Veranstalter ähnlich wie ein Verein mit Logo – Logo fehlt wegen der Schreibweise", r.aehnlich, "keine"),
    ...teil("Gleicher Verein, verschiedene Schreibweisen", r.schreibweisen, "keine"),
    ...teil("Gleiche Art am gleichen Tag (nur zur Info, kann gewollt sein)", r.gleicheArt, "keine"),
    ...teil("Veranstalter ohne Logo (nur zur Info)", r.ohneLogo, "alle haben ein Logo"),
  ].join("\n");
}

function lies(datei) {
  const text = fs.readFileSync(datei, "utf8");
  if (/\.json$/i.test(datei) || /^\s*[[{]/.test(text)) {
    const d = JSON.parse(text);
    return Array.isArray(d) ? d : d.values;
  }
  return ladeWebseitenTeile().leseCsv(text);
}

if (require.main === module) {
  const args = process.argv.slice(2);
  const iAb = args.indexOf("--ab");
  const ab = iAb >= 0 ? args[iAb + 1] : new Date().toISOString().slice(0, 10);
  const datei = args.find((x, i) => !x.startsWith("--") && args[i - 1] !== "--ab");
  if (!datei || !/^\d{4}-\d{2}-\d{2}$/.test(ab)) {
    console.error("Aufruf: node tests/anlaesse-pruefen.js <datei.csv|datei.json> [--ab JJJJ-MM-TT]"); process.exit(2);
  }
  console.log(bericht(pruefeAnlaesse(lies(datei), ab), ab));
}

module.exports = { pruefeAnlaesse, bericht };
