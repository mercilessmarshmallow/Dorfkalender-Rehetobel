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
function google(start = "20261105") {
  let heute = start;
  const daten = [["Zeitstempel", "Titel", "Datum", "Bis", "Zeit (Beginn)", "Zeit (Ende)", "Ort (z.B. Gemeindezentrum)",
    "Veranstalter (Name des Vereins/der Firma)", "Kategorie", "Beschreibung", "Link (Webseite mit mehr Infos)", "Kann das Datum verschoben werden?",
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
      newTrigger: () => { const b = { forSpreadsheet: () => b, onFormSubmit: () => b, onEdit: () => b, timeBased: () => b,
        everyDays: () => b, atHour: () => b, create: () => {} }; return b; } },
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
  const melde = (titel, datum, mail, verschiebbar = "Ja", veranstalter = "Testverein", kategorie = "Vereine") => {
    daten.push(["05.11.2026 15:00:00", titel, datum, "", "19:00:00", "", "Dorf 5", veranstalter, kategorie, "", "", verschiebbar, "Test", mail]);
    ctx.beiMeldung({ range: blatt.getRange(daten.length, 1, 1, 15) });
  };
  const spalte = (zeile, name) => daten[zeile][daten[0].findIndex((h) => h.toLowerCase().startsWith(name))];
  return { ctx, daten, mails, melde, spalte, props, setzeHeute: (h) => { heute = h; } };
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

const lokal = (u) => u.replace("https://mercilessmarshmallow.github.io", "http://localhost:8765");
const linkAus = (text, wort) => (text.match(new RegExp(wort + ": (\\S+)")) || [])[1];

(async () => {
  console.log("1. Nachmeldungen (dieses Jahr) und automatische Absagen – heute 5.11.2026, 2027 schon geplant");
  const g = google();
  g.ctx.einrichten();
  pruefe(g.props.FREIGEGEBEN_BIS === "2027", "Startwert: freigegeben bis 2027 (Sitzung 4.11.2026 vorbei) und gespeichert");
  g.melde("Konzert", "12.12.2026", "verein@example.ch");
  g.melde("Alter Termin", "03.11.2026", "verein2@example.ch");
  g.melde("Viel zu früh", "10.05.2029", "verein3@example.ch");
  const pruef = g.mails.filter((m) => m.subject.startsWith("Dorfkalender:"));
  pruefe(pruef.length === 1 && /neue Meldung «Konzert»/.test(pruef[0].subject), "nur für das Konzert ein Prüf-Mail");
  pruefe(pruef[0].to === "verkehrsverein.rehetobel@gmail.com,privat@example.ch", "Prüf-Mail an Vereins-Gmail + Skripteigenschaft (privates Gmail)");
  pruefe(/Nachmeldung/.test(pruef[0].body) && /noch nichts eingetragen/.test(pruef[0].body), "Prüf-Mail: Nachmeldung, Tag noch frei");
  pruefe(g.mails.some((m) => m.to === "verein@example.ch" && /Ihre Meldung/.test(m.subject)), "Eingangsbestätigung an den Verein");
  pruefe(g.spalte(2, "freigegeben") === "nein" && /Vergangenheit/.test(g.spalte(2, "begründung")), "vergangenes Datum automatisch abgelehnt");
  pruefe(g.spalte(3, "freigegeben") === "nein" && /noch zu früh/.test(g.spalte(3, "begründung")), "2029 automatisch abgelehnt («noch zu früh»)");
  pruefe(g.mails.filter((m) => !m.subject.startsWith("Dorfkalender:")).every((m) => m.replyTo === "verkehrsverein.rehetobel@gmail.com" && !/privat@/.test(m.to)),
    "Mails an Vereine: Antworten ans Vereins-Gmail, private Adresse nie dabei");
  pruefe(!g.mails.some((m) => /Bei Fragen schreiben/.test(m.body || "")), "keine Zeile «Bei Fragen schreiben Sie an …»");
  pruefe(g.mails.filter((m) => !m.subject.startsWith("Dorfkalender:")).every((m) => m.htmlBody && /automatisch verschickte Nachricht/.test(m.htmlBody)),
    "Mails an Vereine sind formatiert (sauberer Zeilenumbruch) mit Hinweis «automatisch»");
  pruefe(g.mails.filter((m) => !m.subject.startsWith("Dorfkalender:")).every((m) => !/[a-zäöü,]\n[a-zäöü]/.test(m.body)),
    "keine Zeilenumbrüche mitten im Satz");
  const absage = g.mails.find((m) => m.to === "verein2@example.ch");
  const begruendungsText = (absage.htmlBody.split("Begründung:</b>")[1] || "").split("</p>")[0];
  pruefe(/Anlass neu melden/.test(absage.htmlBody) && begruendungsText && !/docs\.google\.com/.test(begruendungsText),
    "automatische Absage: Knopf «Anlass neu melden» statt langem Link");
  const konzertJa = linkAus(pruef[0].body, "Annehmen");
  pruefe(/^https:\/\/mercilessmarshmallow\.github\.io\/Dorfkalender-Rehetobel\/entscheid\.html\?a=ja/.test(konzertJa), "Knopf führt auf die Prüfseite");

  console.log("2. Planung 2028");
  g.melde("Turnfest", "12.06.2028", "turnverein@example.ch", "Nein", "Turnverein");
  const p1 = g.mails.filter((m) => m.subject.startsWith("Dorfkalender:")).at(-1);
  pruefe(/Planung 2028 «Turnfest»/.test(p1.subject) && /vormerken/.test(p1.body), "Prüf-Mail: Planung 2028, «Annehmen» = vormerken");
  const bestaetigung = g.mails.filter((m) => m.to === "turnverein@example.ch").at(-1);
  const planLink = (bestaetigung.body.match(/https:\S+\?planung=\S+/) || [])[0];
  pruefe(/Jahresplanung 2028/.test(bestaetigung.body) && planLink, "Eingangsbestätigung erklärt die Planung und enthält den Planungskalender-Link");

  const srv = server();
  const browser = await chromium.launch();
  const kontext = await browser.newContext({ viewport: { width: 390, height: 800 } });
  let cookies = 0;
  await kontext.route("https://script.google.com/**", (route) => {
    if (route.request().headers().cookie) cookies++;
    const out = g.ctx.doGet({ parameter: Object.fromEntries(new URL(route.request().url()).searchParams) });
    route.fulfill({ status: 200, contentType: "application/json", headers: { "access-control-allow-origin": "*" }, body: out.text ?? out.html });
  });
  await kontext.route("https://docs.google.com/**", (r) => r.fulfill({ status: 200, contentType: "text/csv",
    body: "Titel,Datum,Bis,Zeit,Zeit bis,Ort,Veranstalter,Kategorie,Beschreibung,Link,Status\nKonzert,46368,,\"0,7916666667\",0,Dorf 5,Testverein,Vereine,,,Ja\n" }));
  await kontext.addCookies([{ name: "SID", value: "angemeldet", domain: ".google.com", path: "/" }]);
  const seite = await kontext.newPage(); const jsFehler = []; seite.on("pageerror", (e) => jsFehler.push(e.message));
  const tippe = async (url) => { await seite.goto(lokal(url)); await seite.waitForSelector("#ergebnis .ok, #ergebnis .fehler, main > .fehler", { timeout: 5000 }); return seite.innerText("main"); };

  pruefe(/Vormerken|vormerken/.test(await tippe(linkAus(p1.body, "Annehmen"))) && g.spalte(4, "freigegeben") === "vorgemerkt",
    "ein Tipp auf «Annehmen» → vorgemerkt (nicht öffentlich)");
  pruefe(g.mails.some((m) => m.to === "turnverein@example.ch" && /vorgemerkt/.test(m.subject)), "Mail «vorgemerkt» an den Verein");

  g.melde("Dorffest", "12.06.2028", "dorffest@example.ch", "Ja", "Dorfverein");
  const p2 = g.mails.filter((m) => m.subject.startsWith("Dorfkalender:")).at(-1);
  pruefe(/Am gleichen Tag schon eingetragen/.test(p2.body) && /Turnfest \(Turnverein\).*vorgemerkt, verschiebbar: Nein/.test(p2.body),
    "Prüf-Mail zeigt Überschneidung: Turnfest, vorgemerkt, nicht verschiebbar");
  await tippe(linkAus(p2.body, "Annehmen"));

  console.log("3. Planungskalender (eigener Link) und Planungsliste");
  const plan = await kontext.newPage(); const planFehler = []; plan.on("pageerror", (e) => planFehler.push(e.message));
  await plan.goto(lokal(planLink)); await plan.waitForSelector(".planung-hinweis", { timeout: 5000 }); await plan.waitForTimeout(300);
  pruefe(/Planungskalender 2028/.test(await plan.innerText("body")), "Planungskalender 2028 mit Hinweis «provisorisch»");
  await plan.click('[data-ansicht="liste"]');
  pruefe(!/Weitere Anlässe im Dorf|Diese Woche/.test(await plan.innerText("#ansicht-liste")) && /Juni 2028/.test(await plan.innerText("#ansicht-liste")),
    "Planungskalender: Liste zeigt alles nach Monat (ohne Auswahl und Strich)");
  await plan.click('[data-ansicht="liste"]');
  const planListe = await plan.innerText("#ansicht-liste");
  pruefe(/Turnfest/.test(planListe) && /Dorffest/.test(planListe) && /fest, nicht verschiebbar/.test(planListe), "zeigt vorgemerkte Anlässe mit «verschiebbar»");
  pruefe(!/Konzert/.test(planListe), "zeigt keine öffentlichen Anlässe von 2026");
  await plan.goto(lokal(planLink + "&ansicht=druck")); await plan.waitForSelector(".druck-tabelle", { timeout: 5000 });
  const druck = await plan.innerText("#ansicht-druck");
  pruefe(/Planungsliste 2028/.test(druck) && /Juni 2028/.test(druck) && (await plan.$$("tr.konflikt")).length === 2, "Planungsliste: Juni mit 2 markierten Überschneidungen");
  await plan.screenshot({ path: path.join(require("os").tmpdir(), "planungsliste.png"), fullPage: true });
  await plan.goto(lokal(planLink.replace(/planung=[^&]+/, "planung=falsch"))); await plan.waitForTimeout(800);
  pruefe(/konnten nicht geladen/.test(await plan.innerText("#ansicht-liste")), "falscher Planungs-Link zeigt nichts");
  pruefe(planFehler.length === 0, "keine Fehler im Planungskalender " + planFehler.join("; "));

  console.log("4. Öffentlicher Kalender");
  const k = await kontext.newPage(); const kFehler = []; k.on("pageerror", (e) => kFehler.push(e.message));
  await k.goto("http://localhost:8765/index.html"); await k.waitForTimeout(800);
  const oeff = await k.innerText("#ansicht-liste");
  pruefe(/Konzert/.test(oeff) && !/Turnfest/.test(oeff) && !(await k.$(".planung-hinweis")), "zeigt nur Freigegebenes, nichts aus der Planung");
  pruefe(kFehler.length === 0, "keine Fehler im Kalender " + kFehler.join("; "));

  console.log("4b. Neues Design, Themen und «Meine Auswahl» (7./8.11.2026)");
  const d = await browser.newContext({ viewport: { width: 390, height: 800 } });
  const csvZeilen = ["Titel,Datum,Bis,Zeit,Zeit bis,Ort,Veranstalter,Kategorie,Beschreibung,Link,Status,Für wen"];
  for (let i = 0; i < 25; i++) csvZeilen.push(`Anlass ${i + 1},${String(i + 10).padStart(2, "0")}.12.2026,,19:00,,Gemeindezentrum,Testverein,Musik & Kultur,,,`);
  csvZeilen.push("Probe Chor,09.12.2026,,20:00,,Schulhaus,Chor Rehetobel,Vereinsleben,,,,Nur für Mitglieder");
  csvZeilen.push("HV Verkehrsverein,08.12.2026,,19:30,,Krone,Verkehrsverein Rehetobel,Vereinsleben,,,");
  csvZeilen.push("Gemeindeversammlung,07.12.2026,,20:00,,Gemeindezentrum,Gemeinde Rehetobel,Gemeinde Rehetobel,,,");
  await d.route("https://docs.google.com/**", (r) => r.fulfill({ status: 200, contentType: "text/csv", body: csvZeilen.join("\n") + "\n" }));
  const n = await d.newPage(); const nFehler = []; n.on("pageerror", (e) => nFehler.push(e.message));
  await n.clock.setFixedTime(new Date("2026-12-07T10:00:00"));
  await n.goto("http://localhost:8765/index.html"); await n.waitForSelector(".karte", { timeout: 5000 });
  pruefe(await n.locator(".karte").count() === 20 && /Weitere Anlässe anzeigen \(8\)/.test(await n.innerText("#ansicht-liste")), "zuerst 20 Anlässe, dann «Weitere Anlässe anzeigen»");
  const liste1 = await n.innerText("#ansicht-liste");
  pruefe(/Gemeindeversammlung[\s\S]*Weitere Anlässe im Dorf[\s\S]*Probe Chor/.test(liste1) && /Gemeinde & Politik/.test(liste1),
    "Vereinsleben steht unter dem Strich «Weitere Anlässe im Dorf»; «Gemeinde Rehetobel» wird «Gemeinde & Politik»");
  await n.click("[data-mehr]");
  pruefe(await n.locator(".karte").count() === 28, "«Weitere» zeigt den Rest");
  const kats = await n.$$eval("#kategorien .kat-knopf", (b) => b.map((x) => x.dataset.kat));
  pruefe(kats.join(",") === "Musik & Kultur,Feste & Märkte,Sport & Natur,Kinder & Familie,Senioren & Treffpunkt,Kirche,Gemeinde & Politik,Vereinsleben,Kurse & Weiteres",
    "neun Themen in der richtigen Reihenfolge");
  pruefe(!(await n.isVisible("#kategorien")) && /Meine Auswahl: 8 von 9/.test(await n.innerText("#kat-auf")), "Handy: «Meine Auswahl» zugeklappt, Vereinsleben zu Beginn nicht gewählt");
  await n.click("#kat-auf"); await n.click('.kat-knopf[data-kat="Vereinsleben"]');
  pruefe(!/Weitere Anlässe im Dorf/.test(await n.innerText("#ansicht-liste")) && /9 von 9/.test(await n.innerText("#kat-auf")), "Vereinsleben gewählt → alles oben, kein Strich");
  await n.click('.kat-knopf[data-kat="Musik & Kultur"]');
  const liste2 = await n.innerText("#ansicht-liste");
  pruefe(/Probe Chor[\s\S]*Weitere Anlässe im Dorf[\s\S]*Anlass 1\b/.test(liste2), "Musik & Kultur abgewählt → rutscht unter den Strich, verschwindet nicht");
  await n.reload(); await n.waitForSelector(".karte");
  pruefe(/8 von 9/.test(await n.innerText("#kat-auf")), "Auswahl bleibt auf dem Handy gespeichert");
  pruefe(await n.locator('.karte:has-text("HV Verkehrsverein") .vlogo img[src="bilder/logos/verkehrsverein.png"]').count() === 1
    && await n.locator('.karte:has-text("Anlass 1") .vlogo').count() === 0, "Vereinslogo nur bei Vereinen mit Logo");
  await n.locator('.karte:has-text("Anlass 1")').first().click();
  pruefe(/In meinen Kalender/.test(await n.innerText("#detail")) && /Immer oben/.test(await n.innerText("#detail")), "Fenster: «In meinen Kalender» und «Immer oben»");
  await n.click("#detail [data-favorit]"); await n.click("#detail [data-schliessen]");
  pruefe(!/Weitere Anlässe im Dorf[\s\S]*Anlass 1\b/.test(await n.innerText("#ansicht-liste")) && /★ Testverein/.test(await n.innerText("#ansicht-liste")),
    "★ Immer oben: Anlässe des Vereins stehen wieder oben, mit Stern");
  pruefe(/Probe Chor[\s\S]*Nur für Mitglieder/.test(await n.innerText("#ansicht-liste")), "Etikett «Nur für Mitglieder», wenn die Spalte «Für wen» das sagt");
  await n.locator('.karte:has-text("Probe Chor")').click();
  pruefe(await n.locator("#detail .vlogo img").count() === 1, "Fenster zeigt das Vereinslogo");
  const [download] = await Promise.all([n.waitForEvent("download"), n.click("#detail [data-abo]")]);
  const icsText = fs.readFileSync(await download.path(), "utf8");
  pruefe(/Chor Rehetobel\.ics/.test(download.suggestedFilename()) && (icsText.match(/BEGIN:VEVENT/g) || []).length === 1 && /Probe Chor/.test(icsText),
    "«Alle in meinen Kalender»: Kalender-Datei mit allen kommenden Anlässen des Vereins");
  await n.click('#detail [data-verein]');
  pruefe((await n.locator(".karte").count()) === 1 && /Alle Anlässe von Chor Rehetobel/.test(await n.innerText("#aktiver-verein")), "«Alle anzeigen» filtert nach Verein");
  for (const [monat, klasse] of [[4, "fruehling"], [7, "sommer"], [10, "herbst"], [1, "winter"]]) {
    await n.goto(`http://localhost:8765/index.html?monat=${monat}`);
    pruefe(await n.evaluate((k) => document.documentElement.classList.contains(k), klasse), `Titelbild im Monat ${monat}: ${klasse}`);
  }
  const bilder = await n.evaluate(() => [...document.styleSheets[0].cssRules].map((r) => r.cssText).join(" ").match(/bilder\/titel\/[\w-]+\.jpg/g));
  pruefe(bilder.every((b) => fs.existsSync(path.join(ROOT, b))), "alle Titelbilder vorhanden");
  const logoDateien = fs.readFileSync(path.join(ROOT, "js/logos.js"), "utf8").match(/datei: "([^"]+)"/g).map((s) => s.slice(8, -1));
  pruefe(logoDateien.length >= 17 && logoDateien.every((f) => fs.existsSync(path.join(ROOT, "bilder/logos", f))), "alle Vereinslogos vorhanden");
  const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, "manifest.webmanifest"), "utf8"));
  pruefe(manifest.short_name === "Dorfkalender" && manifest.icons.every((i) => fs.existsSync(path.join(ROOT, i.src))), "App-Angaben (Name, Symbole) vorhanden");
  for (const [ua, wort, name] of [["Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Version/17.0 Mobile/15E148 Safari/604.1", /Home-Bildschirm/, "iPhone"],
    ["Mozilla/5.0 (Linux; Android 14; SM-S911B) AppleWebKit/537.36 Chrome/120.0 Mobile Safari/537.36", /Startbildschirm/, "Android"]]) {
    const c = await browser.newContext({ userAgent: ua, viewport: { width: 390, height: 800 } });
    await c.route("https://docs.google.com/**", (r) => r.fulfill({ status: 200, contentType: "text/csv", body: csvZeilen.join("\n") + "\n" }));
    const pg = await c.newPage(); await pg.goto("http://localhost:8765/index.html"); await pg.waitForSelector(".karte", { timeout: 5000 });
    pruefe(await pg.isVisible("#app-hinweis") && wort.test(await pg.innerText("#app-hinweis")), `«Aufs Handy»: Anleitung fürs ${name}`);
    await c.close();
  }
  pruefe(!(await n.isVisible("#app-hinweis")), "«Aufs Handy»: auf dem Computer ausgeblendet");
  pruefe(nFehler.length === 0, "keine Fehler im neuen Design " + nFehler.join("; "));
  await d.close();

  console.log("5. Nachmeldung annehmen / ablehnen (Gmail-App, angemeldetes Google-Konto)");
  pruefe(/Angenommen/.test(await tippe(konzertJa)) && g.spalte(1, "freigegeben") === "ja", "ein Tipp «Annehmen» → öffentlich («ja»)");
  pruefe(g.mails.some((m) => m.to === "verein@example.ch" && /ist im Dorfkalender/.test(m.subject)), "Mail «angenommen» an den Verein");
  const vorher = g.mails.length;
  await tippe(konzertJa);
  pruefe(g.mails.length === vorher, "zweiter Tipp verschickt kein zweites Mail");
  pruefe(/Abgelehnt/.test(await tippe(linkAus(pruef[0].body, "Ablehnen"))) && g.spalte(1, "freigegeben") === "nein", "ein Tipp «Ablehnen» → abgelehnt");
  pruefe(/ungültig/.test(await tippe(konzertJa.replace(/t=[^&]+/, "t=falsch"))), "gefälschter Link wird abgewiesen");

  console.log("6. Erinnerungen und «2028 freigeben»");
  const anzahlVorher = g.mails.length;
  g.setzeHeute("20271027"); g.ctx.taeglich(); g.ctx.taeglich();
  const liste = g.mails.slice(anzahlVorher).filter((m) => /Planungsliste 2028/.test(m.subject));
  pruefe(liste.length === 1 && /ansicht=druck/.test(liste[0].body), "eine Woche vor der Sitzung (3.11.2027): Mail mit Planungsliste, nur einmal");
  g.setzeHeute("20271104"); g.ctx.taeglich(); g.ctx.taeglich();
  const freiMail = g.mails.filter((m) => /2028 freigeben/.test(m.subject));
  pruefe(freiMail.length === 1, "Tag nach der Sitzung: Mail mit Knopf «2028 freigeben», nur einmal");
  const freiLink = (freiMail[0].body.match(/https:\S+aktion=freigeben\S+/) || [])[0];
  await seite.goto(lokal(freiLink)); await seite.waitForSelector("#freigeben", { timeout: 5000 });
  pruefe(/2 vorgemerkte Anlässe/.test(await seite.innerText("main")), "Freigabe-Seite: 2 vorgemerkte Anlässe");
  await seite.click("#freigeben"); await seite.waitForSelector("#ergebnis .ok, #ergebnis .fehler");
  pruefe(/2028 ist freigegeben/.test(await seite.innerText("#ergebnis")) && g.spalte(4, "freigegeben") === "ja" && g.spalte(5, "freigegeben") === "ja",
    "ein Tipp: 2028 freigegeben, beide Anlässe öffentlich");
  pruefe(g.props.FREIGEGEBEN_BIS === "2028", "freigegeben bis 2028");
  g.melde("Spontankonzert", "20.03.2028", "spontan@example.ch");
  pruefe(/neue Meldung «Spontankonzert»/.test(g.mails.filter((m) => m.subject.startsWith("Dorfkalender:")).at(-1).subject), "danach ist 2028 eine Nachmeldung");
  g.melde("Planung 2029", "01.05.2029", "plan29@example.ch");
  pruefe(/Planung 2029/.test(g.mails.filter((m) => m.subject.startsWith("Dorfkalender:")).at(-1).subject), "und 2029 ist jetzt das Planungsjahr");
  pruefe(/ungültig/.test(await (async () => { await seite.goto(lokal(freiLink.replace(/t=[^&]+/, "t=falsch"))); await seite.waitForSelector(".fehler"); return seite.innerText("main"); })()),
    "gefälschter Freigabe-Link wird abgewiesen");

  await seite.goto(lokal(freiLink)); await seite.waitForSelector("main .ok", { timeout: 5000 });
  pruefe(/bereits freigegeben/.test(await seite.innerText("main")), "Freigabe-Link nochmals geöffnet: «bereits freigegeben»");

  console.log("7. Sonderfälle");
  // von Hand «vorgemerkt» in der Tabelle
  g.melde("Handeintrag", "01.06.2029", "hand@example.ch");
  const zHand = g.daten.length - 1, spFrei = g.daten[0].findIndex((h) => h.toLowerCase() === "freigegeben") + 1;
  g.daten[zHand][spFrei - 1] = "vorgemerkt";
  g.ctx.beiAenderung({ range: { getSheet: () => ({ getName: () => "Formularantworten 1", getRange: (...x) => g.ctx.SpreadsheetApp.getActive().getSheetByName().getRange(...x),
    getLastColumn: () => g.daten[0].length, getLastRow: () => g.daten.length }), getRow: () => zHand + 1, getLastRow: () => zHand + 1, getColumn: () => spFrei, getLastColumn: () => spFrei } });
  pruefe(g.mails.some((m) => m.to === "hand@example.ch" && /vorgemerkt/.test(m.subject)), "von Hand «vorgemerkt» → Mail «vorgemerkt»");

  // vergessene Freigabe über den Jahreswechsel
  const h = google("20271020");
  h.ctx.einrichten();                                  // freigegeben bis 2027, Planung 2028
  h.melde("Frühlingsfest", "15.04.2028", "fest@example.ch");
  const hz = (name) => h.spalte(1, name);
  const hLink = linkAus(h.mails.find((m) => /Planung 2028/.test(m.subject)).body, "Annehmen");
  const hp = Object.fromEntries(new URL(hLink).searchParams);
  h.ctx.api_({ api: "ja", id: hp.id, t: hp.t });
  pruefe(hz("freigegeben") === "vorgemerkt", "Okt. 2027: Frühlingsfest 2028 vorgemerkt");
  h.setzeHeute("20280110");                            // Freigabe vergessen, schon Januar 2028
  h.melde("Januarkonzert", "25.01.2028", "jan@example.ch");
  pruefe(/neue Meldung «Januarkonzert»/.test(h.mails.filter((m) => m.subject.startsWith("Dorfkalender:")).at(-1).subject),
    "Januar 2028 ohne Freigabe: Meldung fürs laufende Jahr ist trotzdem eine Nachmeldung");
  h.ctx.taeglich(); h.setzeHeute("20280112"); h.ctx.taeglich(); h.setzeHeute("20280117"); h.ctx.taeglich();
  const erinnerungen = h.mails.filter((m) => /2028 freigeben/.test(m.subject));
  pruefe(erinnerungen.length === 2 && /Erinnerung/.test(erinnerungen[1].subject), "Freigabe-Erinnerung wird wöchentlich wiederholt");
  const hf = Object.fromEntries(new URL((erinnerungen[0].body.match(/https:\S+aktion=freigeben\S+/) || [])[0]).searchParams);
  h.ctx.api_({ api: "freigeben", jahr: hf.jahr, t: hf.t });
  pruefe(hz("freigegeben") === "ja", "verspätete Freigabe macht das Frühlingsfest öffentlich");
  h.setzeHeute("20281005"); h.melde("Herbstmarkt", "10.10.2029", "markt@example.ch");
  pruefe(/Planung 2029/.test(h.mails.filter((m) => m.subject.startsWith("Dorfkalender:")).at(-1).subject), "danach läuft die Planung 2029 normal");

  console.log("8. Hilfe beim Annehmen: Kategorie-Vorschlag und gleiche Art am gleichen Tag");
  const kk = google(); kk.ctx.einrichten();
  const nimmAn = (gg) => { const l = linkAus(gg.mails.filter((m) => m.subject.startsWith("Dorfkalender:")).at(-1).body, "Annehmen");
    const q = Object.fromEntries(new URL(l).searchParams); gg.ctx.api_({ api: "ja", id: q.id, t: q.t }); };
  kk.melde("Adventsmarkt", "28.11.2026", "markt@example.ch", "Nein", "Gewerbeverein", "Feste & Märkte"); nimmAn(kk);
  kk.melde("Samariterübung", "09.12.2026", "sam@example.ch", "Ja", "Samariterverein", "Vereinsleben"); nimmAn(kk);
  kk.melde("Samariterübung", "16.12.2026", "sam@example.ch", "Ja", "Samariterverein", "Feste & Märkte");
  let pm = kk.mails.filter((m) => m.subject.startsWith("Dorfkalender:")).at(-1);
  pruefe(/Kategorie prüfen: gemeldet ist «Feste &amp; Märkte»/.test(pm.htmlBody) && /bisher immer «Vereinsleben»/.test(pm.body),
    "Prüf-Mail warnt: Samariterübung war bisher «Vereinsleben»");
  kk.melde("Weihnachtsmarkt", "28.11.2026", "wm@example.ch", "Ja", "Frauenverein", "Feste & Märkte");
  pm = kk.mails.filter((m) => m.subject.startsWith("Dorfkalender:")).at(-1);
  pruefe(/Gleiche Art am gleichen Tag \(Feste &amp; Märkte\): «Adventsmarkt» \(Gewerbeverein\)/.test(pm.htmlBody), "Prüf-Mail warnt: gleiche Art am gleichen Tag");
  const best = kk.mails.filter((m) => m.to === "wm@example.ch").at(-1);
  pruefe(/Hinweis: Am gleichen Tag findet bereits «Adventsmarkt»/.test(best.body), "Verein bekommt Hinweis in der Eingangsbestätigung");
  kk.melde("Seniorenzmittag", "28.11.2026", "sz@example.ch", "Ja", "Pro Senectute", "Senioren & Treffpunkt");
  pm = kk.mails.filter((m) => m.subject.startsWith("Dorfkalender:")).at(-1);
  pruefe(!/Gleiche Art/.test(pm.body) && !/Kategorie prüfen/.test(pm.body) && /Am gleichen Tag schon eingetragen/.test(pm.body),
    "andere Art am gleichen Tag: keine Warnung, nur der normale Hinweis");
  kk.melde("Vo 11 bis 11", "20.06.2027", "vvr@example.ch", "Nein", "Verkehrsverein Rehetobel", "Sport & Natur");
  pm = kk.mails.filter((m) => m.subject.startsWith("Dorfkalender:")).at(-1);
  pruefe(/normalerweise «Feste &amp; Märkte»/.test(pm.htmlBody), "Stichwort-Liste: «Vo 11 bis 11» ist Feste & Märkte");

  const x = google(); x.ctx.einrichten();
  x.melde('<script>alert(1)</script>', "13.12.2026", "x@example.ch");
  const boese = x.mails.filter((m) => /alert/.test(m.subject));
  pruefe(boese.length === 2 && boese.every((m) => !/<script>/.test(m.htmlBody)), "Text aus dem Formular wird im Mail unschädlich angezeigt");

  pruefe(cookies === 0, "Google-Anmeldung wird nie mitgeschickt");
  pruefe(jsFehler.length === 0, "keine Fehler auf der Prüfseite " + jsFehler.join("; "));
  await browser.close(); srv.close();
  console.log(fehler ? `\n${fehler} Prüfung(en) fehlgeschlagen.` : "\nAlle Prüfungen bestanden.");
  process.exit(fehler ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
