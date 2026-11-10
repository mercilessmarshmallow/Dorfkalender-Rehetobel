// Handy-Anschauer: öffnet die Webseite (so wie sie gerade in diesem Ordner liegt) wie auf einem iPhone,
// einem Android-Handy und einem Laptop, probiert die wichtigsten Knöpfe aus und macht Bildschirmfotos.
// Ändert nichts. Ersetzt nicht den Blick auf dem echten Handy, findet aber das meiste vorher.
//
// Starten:  node tests/anschauen.js <ordner-fuer-bilder> [--csv datei] [--datum JJJJ-MM-TT] [--titelbilder]
//   <ordner-fuer-bilder>  wohin die Bildschirmfotos kommen (nicht in die Ablage!)
//   --csv        echte Anlässe (CSV oder JSON mit «values» aus dem Blatt «Kalender»); sonst Beispieldaten aus data/anlaesse.js
//   --datum      so tun, als wäre heute dieser Tag (Standard: mit --csv heute, sonst 2.11.2026 – passend zu den Beispieldaten)
//   --titelbilder  zusätzlich alle Titelbilder (alle Jahreszeiten) auf iPhone und Laptop fotografieren
"use strict";
const fs = require("fs"), path = require("path"), http = require("http");
const { chromium, devices } = require("playwright");

const ROOT = path.join(__dirname, "..");
const PORT = 8766;
const args = process.argv.slice(2);
const wert = (name) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : ""; };
const ORDNER = args.find((x, i) => !x.startsWith("--") && !["--csv", "--datum"].includes(args[i - 1]));
if (!ORDNER) { console.error("Aufruf: node tests/anschauen.js <ordner-fuer-bilder> [--csv datei] [--datum JJJJ-MM-TT] [--titelbilder]"); process.exit(2); }
if (path.resolve(ORDNER) === ROOT || path.resolve(ORDNER).startsWith(ROOT + path.sep)) { console.error("Bilder nicht in die Ablage legen – anderen Ordner wählen."); process.exit(2); }
fs.mkdirSync(ORDNER, { recursive: true });

// Anlässe: echte (CSV/JSON) oder Beispieldaten
let csv = "";
if (wert("--csv")) {
  const text = fs.readFileSync(wert("--csv"), "utf8");
  if (/^\s*[[{]/.test(text)) {
    const d = JSON.parse(text), zeilen = Array.isArray(d) ? d : d.values;
    csv = zeilen.map((z) => z.map((f) => `"${String(f ?? "").replace(/"/g, '""')}"`).join(",")).join("\n") + "\n";
  } else csv = text;
}
const DATUM = wert("--datum") || (csv ? new Date().toISOString().slice(0, 10) : "2026-11-02");

let fehler = 0;
const pruefe = (ok, text) => { console.log((ok ? "  ✓ " : "  ✗ ") + text); if (!ok) fehler++; };
const bilder = [];
const foto = async (seite, name, ganz = false) => {
  const datei = path.join(ORDNER, name + ".png");
  await seite.screenshot({ path: datei, fullPage: ganz }); bilder.push(datei);
};

function server() {
  return http.createServer((q, r) => {
    let f = path.join(ROOT, decodeURIComponent(new URL(q.url, "http://x").pathname));
    if (!f.startsWith(ROOT)) { r.writeHead(403); return r.end(); }
    if (f.endsWith(path.sep)) f += "index.html";
    fs.readFile(f, (e, d) => {
      if (e) { r.writeHead(404); return r.end(); }
      const typ = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".png": "image/png",
        ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".svg": "image/svg+xml", ".webmanifest": "application/manifest+json" }[path.extname(f)] || "application/octet-stream";
      r.writeHead(200, { "content-type": typ }); r.end(d);
    });
  }).listen(PORT);
}

async function neuerKontext(browser, geraet) {
  const k = await browser.newContext({ ...geraet, acceptDownloads: true });
  if (csv) await k.route("https://docs.google.com/**", (r) => r.fulfill({ status: 200, contentType: "text/csv", body: csv }));
  else await k.route("**/js/config.js", async (r) => {   // ohne CSV-Link zeigt die Webseite die Beispieldaten
    const text = fs.readFileSync(path.join(ROOT, "js", "config.js"), "utf8").replace(/tabelleCsvUrl:\s*"[^"]*"/, 'tabelleCsvUrl: ""');
    r.fulfill({ status: 200, contentType: "text/javascript", body: text });
  });
  await k.route("https://script.google.com/**", (r) => r.abort());
  return k;
}

async function oeffne(kontext, url) {
  const seite = await kontext.newPage();
  const probleme = [];
  seite.on("pageerror", (e) => probleme.push("Programmfehler: " + e.message));
  seite.on("response", (a) => { if (a.url().startsWith(`http://localhost:${PORT}`) && a.status() >= 400) probleme.push(`fehlt (${a.status()}): ${a.url().replace(`http://localhost:${PORT}/`, "")}`); });
  seite.on("requestfailed", (a) => { if (a.url().startsWith(`http://localhost:${PORT}`)) probleme.push("lädt nicht: " + a.url().replace(`http://localhost:${PORT}/`, "")); });
  await seite.clock.setFixedTime(new Date(DATUM + "T10:00:00"));
  await seite.goto(`http://localhost:${PORT}/${url}`);
  return { seite, probleme };
}

// Lazy-Bilder laden lassen, dann kaputte Bilder suchen (nur sichtbare Teile, keine geschlossenen Fenster)
async function kaputteBilder(seite) {
  await seite.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 400) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); }
    window.scrollTo(0, 0);
  });
  await seite.waitForTimeout(500);
  return seite.evaluate(() => [...document.images]
    .filter((i) => !i.closest("dialog:not([open])") && i.offsetParent !== null)
    .filter((i) => !i.complete || i.naturalWidth === 0).map((i) => i.getAttribute("src")));
}

async function geraetPruefen(browser, name, geraet) {
  console.log(`\n${name}`);
  const kontext = await neuerKontext(browser, geraet);
  const { seite, probleme } = await oeffne(kontext, "index.html");
  const geladen = await seite.waitForSelector(".karte", { timeout: 8000 }).then(() => true, () => false);
  pruefe(geladen, `Anlässe erscheinen (${await seite.locator(".karte").count()} Karten)`);
  await foto(seite, `${name}-1-oben`);
  const kaputt = await kaputteBilder(seite);
  pruefe(kaputt.length === 0, "alle Bilder und Logos laden" + (kaputt.length ? ": " + kaputt.join(", ") : ""));
  const breite = await seite.evaluate(() => ({ seite: document.documentElement.scrollWidth, fenster: innerWidth }));
  pruefe(breite.seite <= breite.fenster + 1, `nichts ragt seitlich hinaus (Seite ${breite.seite}px, Bildschirm ${breite.fenster}px)`);
  await foto(seite, `${name}-2-ganze-seite`, true);

  // Anlass antippen → Fenster → «In meinen Kalender»
  if (geladen) {
    await seite.locator(".karte").first().click();
    const offen = await seite.waitForSelector("#detail[open]", { timeout: 3000 }).then(() => true, () => false);
    pruefe(offen, "Antippen eines Anlasses öffnet das Fenster");
    if (offen) {
      await foto(seite, `${name}-3-fenster`);
      const knopf = seite.locator("#detail [data-ics]");
      if (await knopf.count()) {
        const [dl] = await Promise.all([seite.waitForEvent("download", { timeout: 3000 }).catch(() => null), knopf.first().click()]);
        const inhalt = dl ? fs.readFileSync(await dl.path(), "utf8") : "";
        pruefe(/BEGIN:VCALENDAR/.test(inhalt) && /BEGIN:VEVENT/.test(inhalt), "«📅 In meinen Kalender» liefert eine Kalender-Datei");
      } else pruefe(false, "Knopf «📅 In meinen Kalender» fehlt im Fenster");
      await seite.locator("#detail [data-schliessen]").first().click().catch(() => {});
      pruefe(!(await seite.$("#detail[open]")), "Fenster lässt sich mit × schliessen");
    }
  }

  // Ansichten Monat und Terminplanung
  for (const ansicht of ["monat", "planung"]) {
    await seite.click(`[data-ansicht="${ansicht}"]`);
    const sichtbar = await seite.isVisible(`#ansicht-${ansicht}`);
    pruefe(sichtbar, `Reiter «${ansicht === "monat" ? "Monat" : "Terminplanung"}» zeigt seine Ansicht`);
    await foto(seite, `${name}-4-${ansicht}`);
  }
  await seite.click('[data-ansicht="liste"]');

  // «Dorfkalender aufs Handy»
  const hinweis = await seite.isVisible("#app-hinweis");
  if (name === "laptop") pruefe(!hinweis, "Laptop: kein Hinweis «aufs Handy»");
  else pruefe(hinweis, "Hinweis «Dorfkalender aufs Handy» ist da");
  if (name === "iphone") {
    const zeigen = await seite.isVisible("#app-zeigen");
    pruefe(zeigen, "iPhone: Knopf «Zeig mir, wie» ist da");
    if (zeigen) {
      await seite.click("#app-zeigen");
      const offen = await seite.waitForSelector("#iphone-dialog[open]", { timeout: 3000 }).then(() => true, () => false);
      pruefe(offen, "«Zeig mir, wie» öffnet die Bilder-Anleitung");
      if (offen) {
        await seite.evaluate(async () => { for (const i of document.querySelectorAll("#iphone-dialog img")) { i.scrollIntoView(); await new Promise((r) => setTimeout(r, 150)); } });
        await seite.waitForTimeout(400);
        const ok = await seite.evaluate(() => [...document.querySelectorAll("#iphone-dialog img")].filter((i) => i.complete && i.naturalWidth > 0).length);
        pruefe(ok === 4, `alle 4 Anleitungsbilder laden (${ok} von 4)`);
        await seite.evaluate(() => document.querySelector("#iphone-dialog").scrollTo(0, 0));
        await foto(seite, `${name}-5-anleitung`);
      }
    }
  }
  pruefe(probleme.length === 0, "keine Programmfehler und keine fehlenden Dateien" + (probleme.length ? ":\n      " + [...new Set(probleme)].join("\n      ") : ""));
  await kontext.close();
}

// Alle Titelbilder (?monat= und ?foto=, siehe js/titelbild.js) – zum Anschauen: Ist die Kirche/das Hauptmotiv frei? Schrift lesbar?
async function titelbilder(browser) {
  console.log("\nTitelbilder (zum Anschauen)");
  const alle = [["4", "fruehling1"], ["4", "fruehling2"], ["7", "baum"], ["10", ""], ["1", "winter1"], ["1", "winter2"], ["1", "winter3"]];
  for (const [name, geraet] of [["iphone", devices["iPhone 13"]], ["laptop", { viewport: { width: 1280, height: 800 } }]]) {
    const kontext = await neuerKontext(browser, geraet);
    for (const [monat, f] of alle) {
      const { seite, probleme } = await oeffne(kontext, `index.html?monat=${monat}${f ? "&foto=" + f : ""}`);
      await seite.waitForSelector(".karte", { timeout: 8000 }).catch(() => {});
      await seite.waitForTimeout(300);
      await foto(seite, `titel-${name}-${f || "herbst"}`);
      if (probleme.length) pruefe(false, `${name} ${f || "herbst"}: ` + probleme.join("; "));
      await seite.close();
    }
    await kontext.close();
  }
  console.log("  → Bilder «titel-…» anschauen: Kirche bzw. Hauptmotiv nicht verdeckt? Schrift gut lesbar?");
}

(async () => {
  const srv = server();
  const browser = await chromium.launch();
  console.log(`Handy-Anschauer – Webseite aus diesem Ordner, ${csv ? "echte Anlässe" : "Beispieldaten"}, «heute» = ${DATUM}`);
  try {
    await geraetPruefen(browser, "iphone", devices["iPhone 13"]);
    await geraetPruefen(browser, "android", devices["Pixel 7"]);
    await geraetPruefen(browser, "laptop", { viewport: { width: 1280, height: 800 } });
    if (args.includes("--titelbilder")) await titelbilder(browser);
  } finally { await browser.close(); srv.close(); }
  console.log(`\nBildschirmfotos (${bilder.length}) in ${ORDNER}:`);
  for (const b of bilder) console.log("  " + b);
  console.log(fehler ? `\n${fehler} Punkt(e) nicht in Ordnung.` : "\nAlles in Ordnung (Bilder trotzdem anschauen).");
  process.exit(fehler ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
