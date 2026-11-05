// Test für den Dorfkalender: Programm (apps-script/Mails.gs) + Prüfseite (entscheid.html) + Kalender (index.html)
// Läuft ohne Google: Tabelle, Mails und Google-Dienste werden nachgebildet.
// Starten (im Ordner der Ablage):  node tests/test.js
// Braucht Node.js und Playwright mit Chromium.
"use strict";
const fs = require("fs"), vm = require("vm"), crypto = require("crypto"), http = require("http"), path = require("path");
const { chromium } = require("playwright");

const ROOT = path.join(__dirname, "..");
const CODE = fs.readFileSync(path.join(ROOT, "apps-script", "Mails.gs"), "utf8");
let fehler = 0;
const pruefe = (bedingung, text) => { console.log((bedingung ? "  ✓ " : "  ✗ ") + text); if (!bedingung) fehler++; };

// ---------- Nachbildung von Google ----------
function google(heute = "20261105") {
  const daten = [["Zeitstempel", "Titel", "Datum", "Bis", "Zeit (Beginn)", "Zeit (Ende)", "Ort (z.B. Gemeindezentrum)",
    "Veranstalter (Name des Vereins/der Firma)", "Kategorie", "Beschreibung", "Link (Webseite mit mehr Infos)", "Status",
    "Name der Kontaktperson", "E-Mail", "Freigegeben"]];
  const blatt = {
    getName: () => "Formularantworten 1",
    getLastColumn: () => Math.max(...daten.map((r) => r.length)), getLastRow: () => daten.length,
    getRange: (r, c, nr = 1, nc = 1) => {
      if (c < 1 || r < 1) throw new Error("ungültige Zelle " + r + "," + c);
      return {
        getDisplayValues: () => Array.from({ length: nr }, (_, i) => Array.from({ length: nc }, (_, j) => String((daten[r - 1 + i] || [])[c - 1 + j] ?? ""))),
        getDisplayValue: () => String((daten[r - 1] || [])[c - 1] ?? ""),
        setValue: (v) => { while (daten[r - 1].length < c) daten[r - 1].push(""); daten[r - 1][c - 1] = v; },
        getRow: () => r, getLastRow: () => r + nr - 1, getColumn: () => c, getLastColumn: () => c + nc - 1, getSheet: () => blatt,
      };
    },
  };
  const mails = [], props = { PRUEF_MAILS_AUCH_AN: "privat@example.ch" };
  const ctx = {
    SpreadsheetApp: { getActive: () => ({ getSheetByName: () => blatt, toast: () => {} }) },
    ScriptApp: { getProjectTriggers: () => [], deleteTrigger: () => {}, getService: () => ({ getUrl: () => "" }),
      newTrigger: () => { const b = { forSpreadsheet: () => b, onFormSubmit: () => b, onEdit: () => b, create: () => {} }; return b; } },
    MailApp: { sendEmail: (m) => mails.push(m) },
    PropertiesService: { getScriptProperties: () => ({ getProperty: (k) => props[k] || null, setProperty: (k, v) => { props[k] = v; } }) },
    LockService: { getScriptLock: () => ({ waitLock: () => {}, releaseLock: () => {} }) },
    HtmlService: { createHtmlOutput: (h) => { const o = { html: h, setTitle: () => o, addMetaTag: () => o }; return o; } },
    ContentService: { MimeType: { JSON: "json" }, createTextOutput: (t) => { const o = { text: t, setMimeType: () => o }; return o; } },
    Utilities: {
      formatDate: (d, z, f) => (f === "yyyyMMdd" ? heute : "5.11.2026 15:00"), getUuid: () => crypto.randomUUID(),
      computeHmacSha256Signature: (v, k) => [...crypto.createHmac("sha256", k).update(v).digest()],
      base64EncodeWebSafe: (b) => Buffer.from(b).toString("base64").replace(/\+/g, "-").replace(/\//g, "_"),
    },
    console,
  };
  vm.createContext(ctx); vm.runInContext(CODE, ctx);
  const melde = (titel, datum, mail) => {
    daten.push(["05.11.2026 15:00:00", titel, datum, "", "19:00:00", "", "Dorf 5", "Testverein", "Vereine", "", "", "Ja", "Test", mail]);
    ctx.beiMeldung({ range: blatt.getRange(daten.length, 1, 1, 15) });
  };
  const spalte = (zeile, name) => daten[zeile][daten[0].findIndex((h) => h.toLowerCase().startsWith(name))];
  return { ctx, daten, mails, melde, spalte };
}

// ---------- Kleiner Webserver für die Webseite ----------
function server() {
  return http.createServer((q, r) => {
    let f = path.join(ROOT, decodeURIComponent(new URL(q.url, "http://x").pathname.replace("/Dorfkalender-Rehetobel", "")));
    if (f.endsWith(path.sep) || f.endsWith("/")) f += "index.html";
    fs.readFile(f, (e, d) => {
      if (e) { r.writeHead(404); return r.end(); }
      const typ = f.endsWith(".html") ? "text/html; charset=utf-8" : f.endsWith(".css") ? "text/css" : f.endsWith(".js") ? "text/javascript" : "application/octet-stream";
      r.writeHead(200, { "content-type": typ }); r.end(d);
    });
  }).listen(8765);
}

(async () => {
  console.log("1. Programm: Meldungen und Mails");
  const g = google();
  g.ctx.einrichten();
  g.melde("Konzert", "12.12.2026", "verein@example.ch");
  g.melde("Alter Termin", "03.11.2026", "verein2@example.ch");
  const pruef = g.mails.filter((m) => m.subject.startsWith("Dorfkalender: neue"));
  pruefe(pruef.length === 1, "nur für den zukünftigen Anlass ein Prüf-Mail");
  pruefe(pruef[0] && pruef[0].to === "verkehrsverein.rehetobel@gmail.com,privat@example.ch", "Prüf-Mail an Vereins-Gmail + Skripteigenschaft");
  pruefe(g.mails.some((m) => m.to === "verein@example.ch" && /Ihre Meldung/.test(m.subject)), "Eingangsbestätigung an den Verein");
  pruefe(g.spalte(2, "freigegeben") === "nein" && /Vergangenheit/.test(g.spalte(2, "begründung")), "vergangenes Datum automatisch abgelehnt");
  pruefe(g.mails.every((m) => !/privat@example\.ch/.test((m.to || "") + (m.replyTo || "")) || m.subject.startsWith("Dorfkalender: neue")),
    "private Adresse nur im Prüf-Mail, nie bei den Vereinen");
  pruefe(g.mails.filter((m) => !m.subject.startsWith("Dorfkalender")).every((m) => m.replyTo === "verkehrsverein.rehetobel@gmail.com"),
    "Antworten der Vereine gehen ans Vereins-Gmail");
  pruefe(!/Bei Fragen schreiben/.test(g.mails[0].body), "keine Zeile «Bei Fragen schreiben Sie an …»");
  const ja = pruef[0].body.match(/Annehmen: (\S+)/)[1], nein = pruef[0].body.match(/Ablehnen: (\S+)/)[1];
  pruefe(ja.startsWith("https://mercilessmarshmallow.github.io/Dorfkalender-Rehetobel/entscheid.html?a=ja"), "Knopf führt auf die Prüfseite");

  console.log("2. Prüfseite im Browser (mit angemeldetem Google-Konto wie in der Gmail-App)");
  const srv = server();
  const browser = await chromium.launch();
  const kontext = await browser.newContext({ viewport: { width: 390, height: 800 } });
  let cookies = 0;
  await kontext.route("https://script.google.com/**", (route) => {
    if (route.request().headers().cookie) cookies++;
    const out = g.ctx.doGet({ parameter: Object.fromEntries(new URL(route.request().url()).searchParams) });
    route.fulfill({ status: 200, contentType: "application/json", headers: { "access-control-allow-origin": "*" }, body: out.text ?? out.html });
  });
  await kontext.addCookies([{ name: "SID", value: "angemeldet", domain: ".google.com", path: "/" }]);
  const lokal = (u) => u.replace("https://mercilessmarshmallow.github.io", "http://localhost:8765");
  const seite = await kontext.newPage(); const jsFehler = []; seite.on("pageerror", (e) => jsFehler.push(e.message));
  await seite.goto(lokal(ja)); await seite.waitForSelector("#ergebnis .ok, .fehler", { timeout: 5000 });
  pruefe(/Angenommen/.test(await seite.innerText("main")), "ein Tipp auf «Annehmen» → «Angenommen»");
  pruefe(g.spalte(1, "freigegeben") === "ja", "in der Tabelle steht «ja»");
  pruefe(g.mails.some((m) => m.to === "verein@example.ch" && /ist im Dorfkalender/.test(m.subject)), "Mail «angenommen» an den Verein");
  const vorher = g.mails.length;
  await seite.goto(lokal(ja)); await seite.waitForSelector("#ergebnis .ok, .fehler");
  pruefe(g.mails.length === vorher, "zweiter Tipp verschickt kein zweites Mail");
  await seite.goto(lokal(nein)); await seite.waitForSelector("#ergebnis .ok, .fehler");
  pruefe(/Abgelehnt/.test(await seite.innerText("main")) && g.spalte(1, "freigegeben") === "nein", "ein Tipp auf «Ablehnen» → «Abgelehnt»");
  await seite.goto(lokal(ja.replace(/t=[^&]+/, "t=falsch"))); await seite.waitForSelector(".fehler");
  pruefe(/ungültig/.test(await seite.innerText("main")), "gefälschter Link wird abgewiesen");
  pruefe(cookies === 0, "Google-Anmeldung wird nicht mitgeschickt");
  pruefe(jsFehler.length === 0, "keine Fehler auf der Seite " + (jsFehler.join("; ") || ""));

  console.log("3. Kalender-Webseite lädt");
  const k = await kontext.newPage(); const kFehler = []; k.on("pageerror", (e) => kFehler.push(e.message));
  await k.route("https://docs.google.com/**", (r) => r.fulfill({ status: 200, contentType: "text/csv",
    body: "Titel,Datum,Bis,Zeit,Zeit bis,Ort,Veranstalter,Kategorie,Beschreibung,Link,Status\nKonzert,46368,,\"0,7916666667\",0,Dorf 5,Testverein,Vereine,,,Ja\n" }));
  await k.goto("http://localhost:8765/index.html"); await k.waitForTimeout(800);
  pruefe(/Konzert/.test(await k.innerText("#ansicht-liste")), "Anlass aus der Tabelle erscheint in der Liste");
  pruefe(kFehler.length === 0, "keine Fehler im Kalender " + (kFehler.join("; ") || ""));

  await browser.close(); srv.close();
  console.log(fehler ? `\n${fehler} Prüfung(en) fehlgeschlagen.` : "\nAlle Prüfungen bestanden.");
  process.exit(fehler ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
