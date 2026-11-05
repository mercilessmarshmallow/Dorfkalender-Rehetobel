// Dorfkalender Rehetobel – Meldungen prüfen und Mails an die Veranstalter
//
// Ablauf:
// 1. Ein Verein meldet einen Anlass über das Formular.
//    → Der Verein bekommt sofort ein Mail: «Danke, wir prüfen Ihren Anlass.»
//    → Der Vorstand bekommt ein Mail mit allen Angaben und zwei Knöpfen: «Annehmen» / «Ablehnen».
// 2. Klick auf «Annehmen» → in der Tabelle steht «ja», der Verein bekommt das Mail «angenommen».
//    Klick auf «Ablehnen» → Seite mit Feld für eine Begründung (freiwillig), dann Mail «abgelehnt».
// Liegt das Datum in der Vergangenheit, wird die Meldung automatisch abgelehnt (mit Link zum Neu-Melden).
// 3. Man kann weiterhin auch direkt in der Tabelle «ja» oder «nein» schreiben – das löst dieselben Mails aus.
//
// Einrichten: siehe kalender/ANLEITUNG_MAILS.md

// ---------- Einstellungen ----------
const VORSTAND = ["verkehrsverein.rehetobel@gmail.com"];   // wer die Meldungen zum Prüfen bekommt (mehrere: ["a@…", "b@…"])
const WEB_APP_URL = "";                          // nach dem Bereitstellen hier die Web-App-URL einfügen (Anleitung Teil D)
const ABSENDER_NAME = "Verkehrsverein Rehetobel";
const ANTWORT_AN = "info@rehetobel-tourismus.ch";
const KALENDER_LINK = "https://mercilessmarshmallow.github.io/Dorfkalender-Rehetobel/";
const FORMULAR_LINK = "https://docs.google.com/forms/d/e/1FAIpQLSeKT9Vj2d2BhPkuX7gYlE9mK_gae2x-f5uYJN-bJc8TcsTbYQ/viewform";
const BLATT_ANTWORTEN = "Formularantworten 1";

// Steht unter jedem Mail an die Veranstalter.
const FUSS = `
---
Dies ist eine automatisch verschickte Nachricht. Bitte nicht auf dieses Mail antworten.
Bei Fragen schreiben Sie an ${ANTWORT_AN}.`;

// Spalten, die das Programm selbst verwaltet (erscheinen nicht im Prüf-Mail)
const INTERN = ["freigegeben", "begründung", "mail-status", "id"];

// ---------- Einmal ausführen ----------
function einrichten() {
  const ss = SpreadsheetApp.getActive();
  ScriptApp.getProjectTriggers().forEach((t) => ScriptApp.deleteTrigger(t));
  ScriptApp.newTrigger("beiMeldung").forSpreadsheet(ss).onFormSubmit().create();
  ScriptApp.newTrigger("beiAenderung").forSpreadsheet(ss).onEdit().create();
  const blatt = ss.getSheetByName(BLATT_ANTWORTEN);
  ["Begründung", "Mail-Status", "ID"].forEach((n) => spalte_(blatt, n, true));
  geheim_();
  ss.toast(WEB_APP_URL ? "Fertig eingerichtet." : "Eingerichtet – aber WEB_APP_URL fehlt noch (Anleitung Teil D).",
    "Dorfkalender", 10);
}

// ---------- Auslöser: neue Meldung ----------
function beiMeldung(e) {
  const blatt = e.range.getSheet();
  if (blatt.getName() !== BLATT_ANTWORTEN) return;
  const zeile = e.range.getRow();
  const id = Utilities.getUuid();
  blatt.getRange(zeile, spalte_(blatt, "ID", true)).setValue(id);
  const a = anlass_(blatt, zeile);

  // Datum in der Vergangenheit (meist Tippfehler beim Jahr) → automatisch ablehnen, kein Prüf-Mail
  if (a.vergangen) {
    blatt.getRange(zeile, spalte_(blatt, "Begründung", true)).setValue(
      `Das angegebene Datum liegt in der Vergangenheit. Vielleicht hat sich beim Jahr ein Tippfehler eingeschlichen? ` +
      `Bitte melden Sie den Anlass mit dem richtigen Datum neu:\n${FORMULAR_LINK}`);
    blatt.getRange(zeile, spalte_(blatt, "Freigegeben", true)).setValue("nein");
    entscheidMail_(blatt, zeile, "nein");
    return;
  }

  // 1. Mail an den Vorstand mit Knöpfen
  mailAnVorstand_(blatt, zeile, a, id);

  // 2. Eingangsbestätigung an den Veranstalter
  if (!a.mail) { setzeStatus_(blatt, zeile, "keine E-Mail-Adresse – kein Mail an Veranstalter"); return; }
  sende_(a.mail, `Ihre Meldung «${a.titel}» – Dorfkalender Rehetobel`,
    `Guten Tag

Vielen Dank für Ihre Meldung für den Dorfkalender Rehetobel.

Der Verkehrsverein Rehetobel schaut sich Ihren Anlass an und prüft ihn. Sie hören wieder von uns, sobald er geprüft ist.

Ihre Angaben:
${angaben_(a)}

Freundliche Grüsse
Verkehrsverein Rehetobel
${FUSS}`);
  setzeStatus_(blatt, zeile, "Eingang bestätigt " + heute_());
}

// ---------- Auslöser: jemand schreibt in der Tabelle «ja» oder «nein» ----------
function beiAenderung(e) {
  const blatt = e.range.getSheet();
  if (blatt.getName() !== BLATT_ANTWORTEN) return;
  const spFrei = spalte_(blatt, "Freigegeben");
  if (spFrei < 1 || e.range.getColumn() > spFrei || e.range.getLastColumn() < spFrei) return;
  for (let zeile = Math.max(2, e.range.getRow()); zeile <= e.range.getLastRow(); zeile++) {
    const wert = String(blatt.getRange(zeile, spFrei).getDisplayValue()).trim().toLowerCase();
    if (wert === "ja" || wert === "nein") entscheidMail_(blatt, zeile, wert);
  }
}

// ---------- Knöpfe im Prüf-Mail: Web-App ----------
function doGet(e) {
  const p = e.parameter || {};
  const blatt = SpreadsheetApp.getActive().getSheetByName(BLATT_ANTWORTEN);
  if (!p.id || p.t !== token_(p.id)) return seite_("Link ungültig", "<p>Dieser Link ist ungültig oder unvollständig.</p>");
  const zeile = findeZeile_(blatt, p.id);
  if (!zeile) return seite_("Nicht gefunden", "<p>Dieser Anlass ist nicht mehr in der Tabelle (gelöscht?).</p>");
  const a = anlass_(blatt, zeile);
  const status = esc_(blatt.getRange(zeile, spalte_(blatt, "Mail-Status", true)).getDisplayValue());
  const andere = (wert, text) => `<p class="klein"><a href="${link_(p.id, wert)}" target="_top">${text}</a></p>`;
  const js = `<script>
    function los(wert) {
      var grund = document.getElementById('grund') ? document.getElementById('grund').value : '';
      document.getElementById('knopf') && (document.getElementById('knopf').disabled = true);
      document.getElementById('ergebnis').innerHTML = '<p>Einen Moment …</p>';
      google.script.run
        .withSuccessHandler(function (t) { document.getElementById('ergebnis').innerHTML = t; })
        .withFailureHandler(function (f) { document.getElementById('ergebnis').innerHTML = '<p class="fehler">Fehler: ' + f.message + '</p>'; })
        .entscheiden(${JSON.stringify(p.id)}, ${JSON.stringify(p.t)}, wert, grund);
    }
    ${p.a === "ja" ? "los('ja');" : ""}
  </script>`;

  if (p.a === "ja") {
    return seite_("Annehmen", `<h1>Anlass annehmen</h1>${karte_(a, status)}
      <div id="ergebnis"><p>Einen Moment …</p></div>${andere("nein", "Doch ablehnen")}${js}`);
  }
  return seite_("Ablehnen", `<h1>Anlass ablehnen</h1>${karte_(a, status)}
    <label for="grund">Begründung für den Veranstalter (freiwillig):</label>
    <textarea id="grund" rows="3" placeholder="z. B. Der Anlass findet nicht in Rehetobel statt."></textarea>
    <button id="knopf" class="nein" onclick="los('nein')">Ablehnen und Mail schicken</button>
    <div id="ergebnis"></div>${andere("ja", "Doch annehmen")}${js}`);
}

// Wird von der Seite aufgerufen (Knopf bzw. automatisch bei «Annehmen»)
function entscheiden(id, t, wert, grund) {
  if (t !== token_(id) || (wert !== "ja" && wert !== "nein")) throw new Error("Link ungültig");
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const blatt = SpreadsheetApp.getActive().getSheetByName(BLATT_ANTWORTEN);
    const zeile = findeZeile_(blatt, id);
    if (!zeile) return `<p class="fehler">Dieser Anlass ist nicht mehr in der Tabelle.</p>`;
    if (wert === "nein") blatt.getRange(zeile, spalte_(blatt, "Begründung", true)).setValue(String(grund || "").trim());
    blatt.getRange(zeile, spalte_(blatt, "Freigegeben", true)).setValue(wert);
    const r = entscheidMail_(blatt, zeile, wert);
    if (wert === "ja") {
      return `<p class="ok">✓ Angenommen.</p><p>${r}</p><p>Der Anlass erscheint in ein paar Minuten im <a href="${KALENDER_LINK}" target="_blank">Dorfkalender</a>.</p>`;
    }
    return `<p class="ok">✓ Abgelehnt.</p><p>${r}</p>`;
  } finally {
    lock.releaseLock();
  }
}

// ---------- Mails ----------

// Mail «angenommen» oder «abgelehnt» an den Veranstalter (nur einmal pro Entscheid). Gibt einen kurzen Text zurück.
function entscheidMail_(blatt, zeile, wert) {
  const status = String(blatt.getRange(zeile, spalte_(blatt, "Mail-Status", true)).getDisplayValue());
  if (wert === "ja" && status.startsWith("Angenommen")) return "Das Mail an den Veranstalter war schon verschickt.";
  if (wert === "nein" && status.startsWith("Abgelehnt")) return "Das Mail an den Veranstalter war schon verschickt.";
  const a = anlass_(blatt, zeile);
  if (!a.mail) {
    setzeStatus_(blatt, zeile, (wert === "ja" ? "Angenommen" : "Abgelehnt") + ", keine E-Mail-Adresse – kein Mail");
    return "Kein Mail verschickt: Der Veranstalter hat keine E-Mail-Adresse angegeben.";
  }
  if (wert === "ja") {
    sende_(a.mail, `Ihr Anlass «${a.titel}» ist im Dorfkalender`,
      `Guten Tag

Gute Nachricht: Der Verkehrsverein Rehetobel hat Ihren Anlass geprüft und angenommen.

${angaben_(a)}

Der Anlass erscheint im Dorfkalender Rehetobel. Es kann noch ein paar Minuten dauern, bis er aufgeschaltet ist:
${KALENDER_LINK}

Ändert sich etwas an Ihrem Anlass? Dann schreiben Sie bitte an ${ANTWORT_AN}.

Freundliche Grüsse
Verkehrsverein Rehetobel
${FUSS}`);
    setzeStatus_(blatt, zeile, "Angenommen, Mail verschickt " + heute_());
  } else {
    const grund = a.begruendung ? `\nBegründung: ${a.begruendung}\n` : "";
    sende_(a.mail, `Ihre Meldung «${a.titel}» – Dorfkalender Rehetobel`,
      `Guten Tag

Vielen Dank für Ihre Meldung. Leider können wir den folgenden Anlass nicht in den Dorfkalender Rehetobel aufnehmen:

${angaben_(a)}
${grund}
Freundliche Grüsse
Verkehrsverein Rehetobel
${FUSS}`);
    setzeStatus_(blatt, zeile, "Abgelehnt, Mail verschickt " + heute_());
  }
  return `Mail an ${esc_(a.mail)} verschickt.`;
}

// Mail an den Vorstand: alle Angaben + Knöpfe «Annehmen» / «Ablehnen»
function mailAnVorstand_(blatt, zeile, a, id) {
  if (!VORSTAND.length) return;
  const breite = blatt.getLastColumn();
  const kopf = blatt.getRange(1, 1, 1, breite).getDisplayValues()[0];
  const werte = blatt.getRange(zeile, 1, 1, breite).getDisplayValues()[0];
  const zeilen = kopf.map((h, i) => [h, String(werte[i]).replace(/\b(\d{1,2}:\d{2}):00\b/g, "$1")])
    .filter(([h, w]) => h && String(w).trim() && !INTERN.some((n) => h.trim().toLowerCase().startsWith(n)));
  const tabelle = zeilen.map(([h, w]) =>
    `<tr><td style="padding:4px 12px 4px 0;color:#666;vertical-align:top">${esc_(h)}</td><td style="padding:4px 0">${esc_(w).replace(/\n/g, "<br>")}</td></tr>`).join("");
  const knopf = (text, farbe, url) =>
    `<a href="${url}" style="display:inline-block;padding:12px 22px;margin:0 8px 8px 0;border-radius:6px;background:${farbe};color:#fff;text-decoration:none;font-weight:bold">${text}</a>`;
  const ja = link_(id, "ja"), nein = link_(id, "nein");
  const html = `<div style="font-family:Arial,sans-serif;font-size:15px;color:#222">
    <p>Neue Meldung für den Dorfkalender:</p>
    <table style="border-collapse:collapse;margin-bottom:16px">${tabelle}</table>
    ${WEB_APP_URL ? knopf("✓ Annehmen", "#2e7d32", ja) + knopf("✕ Ablehnen", "#c62828", nein)
      : "<p><b>Knöpfe fehlen:</b> WEB_APP_URL ist im Programm noch nicht eingetragen. Bitte in der Tabelle «ja» oder «nein» schreiben.</p>"}
    <p style="color:#666;font-size:13px">Annehmen: Der Veranstalter bekommt sofort ein Mail. Ablehnen: Sie können noch eine Begründung schreiben.</p>
  </div>`;
  const text = zeilen.map(([h, w]) => `${h}: ${w}`).join("\n") +
    (WEB_APP_URL ? `\n\nAnnehmen: ${ja}\nAblehnen: ${nein}` : "");
  MailApp.sendEmail({
    to: VORSTAND.join(","), subject: `Dorfkalender: neue Meldung «${a.titel}» (${a.datum})`,
    body: text, htmlBody: html, name: "Dorfkalender Rehetobel",
  });
}

// ---------- Hilfsfunktionen ----------

function spalte_(blatt, name, anlegen) {
  const breite = Math.max(1, blatt.getLastColumn());
  const kopf = blatt.getRange(1, 1, 1, breite).getDisplayValues()[0].map((h) => h.trim().toLowerCase());
  const i = kopf.findIndex((h) => h.startsWith(name.toLowerCase()));
  if (i >= 0) return i + 1;
  if (!anlegen) return -1;
  blatt.getRange(1, breite + 1).setValue(name);
  return breite + 1;
}

function findeZeile_(blatt, id) {
  const sp = spalte_(blatt, "ID");
  const n = blatt.getLastRow() - 1;
  if (sp < 1 || n < 1) return 0;
  const ids = blatt.getRange(2, sp, n, 1).getDisplayValues();
  const i = ids.findIndex((r) => r[0] === id);
  return i >= 0 ? i + 2 : 0;
}

function anlass_(blatt, zeile) {
  const breite = blatt.getLastColumn();
  const kopf = blatt.getRange(1, 1, 1, breite).getDisplayValues()[0].map((h) => h.trim().toLowerCase());
  const werte = blatt.getRange(zeile, 1, 1, breite).getDisplayValues()[0].map((w) => String(w).trim());
  const feld = (...namen) => {
    const i = kopf.findIndex((h) => namen.some((n) => h === n || h.startsWith(n + " (")));
    return i >= 0 ? werte[i] : "";
  };
  const zeit = (s) => s.replace(/^(\d{1,2}:\d{2}):\d{2}$/, "$1");
  const istMail = (s) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
  const findeMail = (s) => (String(s).match(/[^\s@,;<>()]+@[^\s@,;<>()]+\.[a-z]{2,}/i) || [""])[0];
  let mail = "";
  kopf.forEach((h, i) => { if (!mail && /^e-?mail/.test(h) && istMail(werte[i])) mail = werte[i]; });
  if (!mail) for (const w of werte) { mail = findeMail(w); if (mail) break; }
  return {
    titel: feld("titel") || "Ihr Anlass",
    datum: feld("datum"), bis: feld("bis"),
    zeit: zeit(feld("zeit")), zeitBis: zeit(feld("zeit bis")),
    ort: feld("ort"), begruendung: feld("begründung"), mail: mail,
    vergangen: istVergangen_(feld("bis") || feld("datum")),
  };
}

// true, wenn das Datum (z. B. «17.02.2006» oder «2006-02-17») vor heute liegt
function istVergangen_(s) {
  let m = String(s).match(/^(\d{1,2})\.(\d{1,2})\.(\d{2,4})/), j, mo, t;
  if (m) { t = +m[1]; mo = +m[2]; j = +m[3]; if (j < 100) j += 2000; }
  else if ((m = String(s).match(/^(\d{4})-(\d{1,2})-(\d{1,2})/))) { j = +m[1]; mo = +m[2]; t = +m[3]; }
  else return false;
  const datum = j * 10000 + mo * 100 + t;
  const heute = Number(Utilities.formatDate(new Date(), "Europe/Zurich", "yyyyMMdd"));
  return datum < heute;
}

function angaben_(a) {
  const datum = a.bis ? `${a.datum} bis ${a.bis}` : a.datum;
  const zeit = a.zeit ? (a.zeitBis ? `${a.zeit} – ${a.zeitBis} Uhr` : `${a.zeit} Uhr`) : "";
  return [`Anlass: ${a.titel}`, `Datum: ${datum}`, zeit ? `Zeit: ${zeit}` : "", a.ort ? `Ort: ${a.ort}` : ""]
    .filter(Boolean).join("\n");
}

function karte_(a, status) {
  return `<div class="karte"><pre>${esc_(angaben_(a))}</pre>${status ? `<p class="klein">Bisher: ${status}</p>` : ""}</div>`;
}

function seite_(titel, inhalt) {
  return HtmlService.createHtmlOutput(`<!doctype html><html><head><meta charset="utf-8"><style>
      body{font-family:Arial,sans-serif;max-width:560px;margin:24px auto;padding:0 16px;color:#222;font-size:16px}
      h1{font-size:22px} .karte{background:#f4f4f4;border-radius:8px;padding:12px 16px;margin:12px 0}
      pre{font-family:inherit;white-space:pre-wrap;margin:0} .klein{font-size:13px;color:#666}
      textarea{width:100%;box-sizing:border-box;font:inherit;padding:8px;margin:6px 0 12px}
      button{font:inherit;font-weight:bold;padding:12px 22px;border:0;border-radius:6px;color:#fff;cursor:pointer}
      .nein{background:#c62828} .ok{color:#2e7d32;font-weight:bold;font-size:18px} .fehler{color:#c62828}
    </style></head><body>${inhalt}</body></html>`)
    .setTitle("Dorfkalender – " + titel)
    .addMetaTag("viewport", "width=device-width, initial-scale=1");
}

function link_(id, wert) {
  const basis = WEB_APP_URL || ScriptApp.getService().getUrl();
  return `${basis}?a=${wert}&id=${encodeURIComponent(id)}&t=${token_(id)}`;
}

// Geheimer Schlüssel, damit niemand Links für fremde Anlässe basteln kann
function geheim_() {
  const props = PropertiesService.getScriptProperties();
  let g = props.getProperty("GEHEIM");
  if (!g) { g = Utilities.getUuid() + Utilities.getUuid(); props.setProperty("GEHEIM", g); }
  return g;
}
function token_(id) {
  return Utilities.base64EncodeWebSafe(Utilities.computeHmacSha256Signature(String(id), geheim_()))
    .replace(/=+$/, "").slice(0, 32);
}

function esc_(s) {
  return String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function sende_(an, betreff, text) {
  MailApp.sendEmail({ to: an, subject: betreff, body: text, name: ABSENDER_NAME, replyTo: ANTWORT_AN });
}

function setzeStatus_(blatt, zeile, text) {
  blatt.getRange(zeile, spalte_(blatt, "Mail-Status", true)).setValue(text);
}

function heute_() {
  return Utilities.formatDate(new Date(), "Europe/Zurich", "d.M.yyyy HH:mm");
}
