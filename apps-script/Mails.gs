// Dorfkalender Rehetobel – Meldungen prüfen, Mails an die Vereine, Jahresplanung
//
// Ein Formular, das Programm sortiert jede Meldung nach dem Datum (siehe KONZEPT.md):
//   • dieses Jahr / bereits freigegebenes Jahr → Nachmeldung: «Annehmen» = sofort öffentlich
//   • nächstes, noch nicht freigegebenes Jahr  → Planungsmeldung: «Annehmen» = vorgemerkt (nur im Planungskalender)
//   • noch weiter weg                          → automatische Absage («noch zu früh»)
//   • Vergangenheit                            → automatische Absage
// Prüf-Mail mit allen Angaben, Überschneidungen am gleichen Tag und den Knöpfen «Annehmen» / «Ablehnen» (ein Tipp,
// über die Prüfseite entscheid.html). Nach der Koordinationssitzung: «Jahr freigeben» mit einem Befehl.
// Man kann weiterhin auch direkt in der Tabelle «ja», «vorgemerkt» oder «nein» schreiben.
//
// Einrichten: siehe anleitungen/programm-einrichten.md (Ablage Dorfkalender-Rehetobel)

// ---------- Einstellungen ----------
// Wer die Meldungen zum Prüfen bekommt. Weitere (private) Adressen NICHT hier eintragen, sondern in Apps Script unter
// Projekteinstellungen (Zahnrad) → Skripteigenschaften: Name PRUEF_MAILS_AUCH_AN, Wert z. B. "name@gmail.com"
// (mehrere mit Komma trennen). So steht keine private Adresse im öffentlichen Programmtext.
const VORSTAND = ["verkehrsverein.rehetobel@gmail.com"];
const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbzuNZ27F1NhpYGpJ4i1sGFxalk1lCvedJ943s-_EhoT6aOph1VdG5FNRp30H94sS6ykEQ/exec";
const ABSENDER_NAME = "Verkehrsverein Rehetobel";
const ANTWORT_AN = "verkehrsverein.rehetobel@gmail.com";
const KALENDER_LINK = "https://verkehrsvereinrehetobel-collab.github.io/Dorfkalender-Rehetobel/";
const LOGO = KALENDER_LINK + "bilder/logo.png";   // Logo oben in den Mails an die Vereine
const FARBE = "#bd1521";                          // Knöpfe in den Mails: Rot wie «+ Anlass melden» auf der Webseite
// Seite auf der Kalender-Webseite, zu der die Knöpfe im Prüf-Mail führen (funktioniert ohne Google-Anmeldung, auch in der Gmail-App)
const ENTSCHEID_SEITE = "https://verkehrsvereinrehetobel-collab.github.io/Dorfkalender-Rehetobel/entscheid.html";
const FORMULAR_LINK = "https://docs.google.com/forms/d/e/1FAIpQLSeKT9Vj2d2BhPkuX7gYlE9mK_gae2x-f5uYJN-bJc8TcsTbYQ/viewform";
const BLATT_ANTWORTEN = "Formularantworten 1";
// Bis zu welchem Jahr ist der Kalender freigegeben? Steht in der Skripteigenschaft FREIGEGEBEN_BIS (setzt «Jahr freigeben»).
// Fehlt sie, gilt: dieses Jahr, ab der Koordinationssitzung (erster Mittwoch im November) das nächste Jahr.

// Steht unter jedem Mail an die Veranstalter.
const FUSS = "Dies ist eine automatisch verschickte Nachricht. Bitte nicht auf dieses Mail antworten.";

// ---------- Themen (Kategorien) ----------
// Bei diesen Arten soll es möglichst nicht zwei Anlässe am gleichen Tag geben (Hinweis im Prüf-Mail und an den Verein).
const HAUPT_ARTEN = ["Musik & Kultur", "Feste & Märkte", "Sport & Natur"];
// Vorschlag, welches Thema ein Anlass hat (Stichwort im Titel → Thema). Wird ergänzt durch alle schon angenommenen
// Anlässe mit gleichem Titel. Weicht eine Meldung ab, steht im Prüf-Mail eine Warnung.
const ZUORDNUNG = [
  ["samariterübung", "Vereinsleben"], ["übung", "Vereinsleben"], ["probe", "Vereinsleben"], ["hauptversammlung", "Vereinsleben"],
  ["vereinshöck", "Vereinsleben"], ["höck", "Vereinsleben"], ["nistkasten", "Vereinsleben"],
  ["gottesdienst", "Kirche"], ["andacht", "Kirche"], ["saxophongebet", "Kirche"], ["besinnung", "Kirche"],
  ["abstimmung", "Gemeinde & Politik"], ["gemeindeversammlung", "Gemeinde & Politik"], ["voranschlag", "Gemeinde & Politik"],
  ["rechtsberatung", "Gemeinde & Politik"], ["podium", "Gemeinde & Politik"],
  ["seniorenzmittag", "Senioren"], ["mittagstisch", "Senioren"], ["kaffeekränzli", "Senioren"], ["unterhaltungsnachmittag", "Senioren"], ["senior", "Senioren"],
  ["jugendraum", "Kinder & Familie"], ["jugendtreff", "Kinder & Familie"], ["spielgruppe", "Kinder & Familie"], ["krippenspiel", "Kinder & Familie"],
  ["konzert", "Musik & Kultur"], ["ständli", "Musik & Kultur"], ["lesung", "Musik & Kultur"], ["theater", "Musik & Kultur"],
  ["adventsmarkt", "Feste & Märkte"], ["jahrmarkt", "Feste & Märkte"], ["vo bis", "Feste & Märkte"]   /* «Vo 11 bis 11» (Zahlen werden beim Vergleich weggelassen) */, ["dorffest", "Feste & Märkte"],
  ["grümpelturnier", "Sport & Natur"], ["august wanderung", "Sport & Natur"], ["wanderung", "Sport & Natur"],
  ["nothilfekurs", "Vorträge & Weiteres"], ["kurs", "Vorträge & Weiteres"], ["vortrag", "Vorträge & Weiteres"],
  ["stobe", "Begegnung"], ["frühstück", "Begegnung"],   /* zuletzt, damit «Vo 11 bis 11 of em Stobetebüel» bei Feste & Märkte bleibt */
];

// Spalten, die das Programm selbst verwaltet (erscheinen nicht im Prüf-Mail)
const INTERN = ["freigegeben", "begründung", "mail-status", "id"];

// ---------- Einmal ausführen ----------
function einrichten() {
  const ss = SpreadsheetApp.getActive();
  ScriptApp.getProjectTriggers().forEach((t) => ScriptApp.deleteTrigger(t));
  ScriptApp.newTrigger("beiMeldung").forSpreadsheet(ss).onFormSubmit().create();
  ScriptApp.newTrigger("beiAenderung").forSpreadsheet(ss).onEdit().create();
  ScriptApp.newTrigger("taeglich").timeBased().everyDays(1).atHour(7).create();
  const blatt = ss.getSheetByName(BLATT_ANTWORTEN);
  ["Begründung", "Mail-Status", "ID"].forEach((n) => spalte_(blatt, n, true));
  geheim_();
  ss.toast("Fertig eingerichtet. Freigegeben bis " + freigegebenBis_() + ".", "Dorfkalender", 10);
}

// ---------- Auslöser: neue Meldung ----------
function beiMeldung(e) {
  const blatt = e.range.getSheet();
  if (blatt.getName() !== BLATT_ANTWORTEN) return;
  const zeile = e.range.getRow();
  const id = Utilities.getUuid();
  blatt.getRange(zeile, spalte_(blatt, "ID", true)).setValue(id);
  const a = anlass_(blatt, zeile);
  const art = art_(a);

  // Automatische Absagen: kein Prüf-Mail
  if (art === "vergangen" || art === "zu_frueh") {
    const jahr = jahr_(a.datum);
    blatt.getRange(zeile, spalte_(blatt, "Begründung", true)).setValue(art === "vergangen"
      ? `Das angegebene Datum liegt in der Vergangenheit. Vielleicht hat sich beim Jahr ein Tippfehler eingeschlichen? ` +
        `Bitte melden Sie den Anlass mit dem richtigen Datum neu: ${FORMULAR_LINK}`
      : `Für das Jahr ${jahr} ist es noch zu früh. Die Anlässe für ${jahr} werden an der Koordinationssitzung ` +
        `im November ${jahr - 1} gemeinsam abgemacht. Sie können Ihren Anlass melden, sobald das Jahr ${jahr - 1} im ` +
        `Dorfkalender freigegeben ist (jeweils nach der Koordinationssitzung im November): ${FORMULAR_LINK}`);
    blatt.getRange(zeile, spalte_(blatt, "Freigegeben", true)).setValue("nein");
    entscheidMail_(blatt, zeile, "nein");
    return;
  }

  // 1. Prüf-Mail mit Knöpfen
  mailAnVorstand_(blatt, zeile, a, id, art);

  // 2. Eingangsbestätigung an den Verein
  if (!a.mail) { setzeStatus_(blatt, zeile, "keine E-Mail-Adresse – kein Mail an Veranstalter"); return; }
  const j = jahr_(a.datum);
  vereinsMail_(a.mail, `Ihre Meldung «${a.titel}» – Dorfkalender Rehetobel`, [
    "Vielen Dank für Ihre Meldung für den Dorfkalender Rehetobel.",
    "Der Verkehrsverein Rehetobel schaut sich Ihren Anlass an und prüft ihn. Sie hören wieder von uns, sobald er geprüft ist.",
    ...(art === "planung" ? [
      `Ihr Anlass ist für die Jahresplanung ${j} gemeldet. Nach der Prüfung wird er vorgemerkt und ist dann für die ` +
        `planenden Vereine im Planungskalender sichtbar. Das Datum wird an der Koordinationssitzung im November gemeinsam ` +
        `festgelegt. Öffentlich erscheint er erst danach.`,
      { link: planungsLink_(), text: `Planungskalender ${j} ansehen`,
        hinweis: `Hier sehen Sie, was andere Vereine für ${j} schon vorgemerkt haben (provisorisch, bitte nicht weitergeben).` },
    ] : []),
    ...gleicheArt_(blatt, zeile, a).slice(0, 3).map((b) =>
      `Hinweis: Am gleichen Tag findet bereits «${b.titel}» (${b.veranstalter || "ein anderer Verein"}) statt – ebenfalls ` +
      `«${a.kategorie}». Falls Ihr Datum noch flexibel ist, schauen Sie bitte im ${art === "planung" ? "Planungskalender" : "Dorfkalender"} nach einem freien Tag.`),
    { angaben: a, titel: "Ihre Angaben" },
  ]);
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
    if (wert === "ja" || wert === "nein" || wert === "vorgemerkt") entscheidMail_(blatt, zeile, wert);
  }
}

// ---------- Knöpfe im Prüf-Mail: Web-App ----------
function doGet(e) {
  const p = e.parameter || {};
  if (p.api) return api_(p);
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

// Wird von der alten Google-Seite aufgerufen (Knopf bzw. automatisch bei «Annehmen»)
function entscheiden(id, t, wert, grund) {
  const r = entscheidKern_(id, t, wert, grund);
  if (!r.ok) return `<p class="fehler">${esc_(r.text)}</p>`;
  if (r.art === "vorgemerkt") return `<p class="ok">✓ Vorgemerkt.</p><p>${esc_(r.text)}</p>`;
  if (r.art === "oeffentlich") {
    return `<p class="ok">✓ Angenommen.</p><p>${esc_(r.text)}</p><p>Der Anlass erscheint in ein paar Minuten im <a href="${KALENDER_LINK}" target="_blank">Dorfkalender</a>.</p>`;
  }
  return `<p class="ok">✓ Abgelehnt.</p><p>${esc_(r.text)}</p>`;
}

// Entscheid ausführen. «ja» heisst: Nachmeldung → öffentlich («ja»), Planungsmeldung → «vorgemerkt».
function entscheidKern_(id, t, wert, grund) {
  if (t !== token_(id) || (wert !== "ja" && wert !== "nein")) return { ok: false, text: "Dieser Link ist ungültig." };
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const blatt = SpreadsheetApp.getActive().getSheetByName(BLATT_ANTWORTEN);
    const zeile = findeZeile_(blatt, id);
    if (!zeile) return { ok: false, text: "Dieser Anlass ist nicht mehr in der Tabelle." };
    if (wert === "nein") blatt.getRange(zeile, spalte_(blatt, "Begründung", true)).setValue(String(grund || "").trim());
    const a = anlass_(blatt, zeile);
    const neu = wert === "nein" ? "nein" : (jahr_(a.datum) > offenBis_() ? "vorgemerkt" : "ja");
    blatt.getRange(zeile, spalte_(blatt, "Freigegeben", true)).setValue(neu);
    const art = neu === "ja" ? "oeffentlich" : neu === "vorgemerkt" ? "vorgemerkt" : "abgelehnt";
    return { ok: true, art, text: entscheidMail_(blatt, zeile, neu) };
  } finally {
    lock.releaseLock();
  }
}

// Schnittstelle für die Webseite (entscheid.html und Planungskalender) – läuft ohne Google-Anmeldung
//   ?api=info&id=…&t=…              → Angaben zum Anlass
//   ?api=ja&id=…&t=… / ?api=nein…    → annehmen / ablehnen
//   ?api=planung&k=…                 → vorgemerkte Anlässe für den Planungskalender (ohne Kontaktdaten)
//   ?api=freiinfo&jahr=…&t=…         → wie viele Anlässe würden freigegeben
//   ?api=freigeben&jahr=…&t=…        → Jahr freigeben
function api_(p) {
  const json = (o) => ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
  const blatt = SpreadsheetApp.getActive().getSheetByName(BLATT_ANTWORTEN);
  if (p.api === "planung") {
    if (p.k !== token_("planung")) return json({ ok: false, text: "Dieser Link zum Planungskalender ist ungültig." });
    return json({ ok: true, jahr: freigegebenBis_() + 1, anlaesse: vorgemerkte_(blatt) });
  }
  if (p.api === "freiinfo" || p.api === "freigeben") {
    const jahr = Number(p.jahr);
    if (!jahr || p.t !== token_("freigeben-" + jahr)) return json({ ok: false, text: "Dieser Link ist ungültig." });
    if (p.api === "freiinfo") {
      return json({ ok: true, jahr, schon: freigegebenBis_() >= jahr,
        anzahl: vorgemerkte_(blatt).filter((x) => jahr_(x.datum) && jahr_(x.datum) <= jahr).length });
    }
    return json(jahrFreigeben_(jahr));
  }
  if (!p.id || p.t !== token_(p.id)) return json({ ok: false, text: "Dieser Link ist ungültig oder unvollständig." });
  if (p.api === "info") {
    const zeile = findeZeile_(blatt, p.id);
    if (!zeile) return json({ ok: false, text: "Dieser Anlass ist nicht mehr in der Tabelle (gelöscht?)." });
    const a = anlass_(blatt, zeile);
    return json({ ok: true, titel: a.titel, angaben: angaben_(a), art: art_(a),
      status: String(blatt.getRange(zeile, spalte_(blatt, "Mail-Status", true)).getDisplayValue()) });
  }
  if (p.api === "ja" || p.api === "nein") return json(entscheidKern_(p.id, p.t, p.api, p.grund));
  return json({ ok: false, text: "Unbekannte Anfrage." });
}

// ---------- Jahresplanung ----------

// Alle vorgemerkten Anlässe (für Planungskalender und Planungsliste) – ohne Kontaktdaten
function vorgemerkte_(blatt) {
  const liste = [];
  for (let z = 2; z <= blatt.getLastRow(); z++) {
    const a = anlass_(blatt, z);
    if (a.freigegeben === "vorgemerkt" && a.datum) {
      liste.push({ titel: a.titel, datum: a.datum, bis: a.bis, zeit: a.zeit, zeitBis: a.zeitBis, ort: a.ort,
        veranstalter: a.veranstalter, kategorie: a.kategorie, beschreibung: a.beschreibung, link: a.link,
        verschiebbar: a.verschiebbar });
    }
  }
  return liste;
}

// Ein Jahr freigeben: alle vorgemerkten Anlässe bis und mit diesem Jahr werden öffentlich («ja»)
// (auch ältere, falls eine Freigabe vergessen wurde – es darf nie etwas unsichtbar liegen bleiben)
function jahrFreigeben_(jahr) {
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const blatt = SpreadsheetApp.getActive().getSheetByName(BLATT_ANTWORTEN);
    const spFrei = spalte_(blatt, "Freigegeben", true);
    let n = 0;
    for (let z = 2; z <= blatt.getLastRow(); z++) {
      const a = anlass_(blatt, z);
      if (a.freigegeben === "vorgemerkt" && jahr_(a.datum) && jahr_(a.datum) <= jahr) {
        blatt.getRange(z, spFrei).setValue("ja");
        setzeStatus_(blatt, z, "Öffentlich seit Freigabe " + heute_());
        n++;
      }
    }
    if (freigegebenBis_() < jahr) PropertiesService.getScriptProperties().setProperty("FREIGEGEBEN_BIS", String(jahr));
    return { ok: true, art: "freigegeben", anzahl: n,
      text: `${n} Anlässe für ${jahr} sind jetzt öffentlich. Meldungen für ${jahr} kommen ab jetzt direkt in den Dorfkalender.` };
  } finally {
    lock.releaseLock();
  }
}

// Läuft jeden Morgen: Erinnerungen rund um die Koordinationssitzung (erster Mittwoch im November)
function taeglich() {
  const heute = heuteNum_(), props = PropertiesService.getScriptProperties();
  const planjahr = freigegebenBis_() + 1;                 // das Jahr, das gerade geplant wird
  const sitzung = ersterMittwochNov_(planjahr - 1);       // Koordinationssitzung für dieses Jahr
  const an = pruefEmpfaenger_();
  // Eine Woche vorher: Planungsliste zum Ausdrucken (einmal)
  if (heute >= plusTage_(sitzung, -7) && heute < sitzung && !props.getProperty("MAIL_LISTE_" + planjahr)) {
    MailApp.sendEmail({ to: an.join(","), name: "Dorfkalender Rehetobel",
      subject: `Dorfkalender: Planungsliste ${planjahr} für die Koordinationssitzung`,
      body: `Die Koordinationssitzung ist am ${datumText_(sitzung)}.\n\nPlanungsliste ${planjahr} zum Ausdrucken ` +
        `(Überschneidungen markiert):\n${planungsLink_()}&ansicht=druck\n\nPlanungskalender:\n${planungsLink_()}`,
      htmlBody: `<div style="font-family:Arial,sans-serif;font-size:15px;line-height:1.5;color:#222"><p>Die Koordinationssitzung ist am ` +
        `<b>${datumText_(sitzung)}</b>.</p><p>Hier die Planungsliste ${planjahr} zum Ausdrucken – Überschneidungen sind rot markiert:</p>` +
        `<p><a href="${planungsLink_()}&ansicht=druck" style="display:inline-block;padding:12px 22px;border-radius:6px;background:#008c35;color:#fff;text-decoration:none;font-weight:bold">Planungsliste ${planjahr} öffnen</a></p>` +
        `<p style="color:#666;font-size:13px">Planungskalender: <a href="${planungsLink_()}">ansehen</a></p></div>` });
    props.setProperty("MAIL_LISTE_" + planjahr, "1");
  }
  // Ab dem Tag danach: Knopf zum Freigeben – wiederholt jede Woche, bis das Jahr freigegeben ist
  const zuletzt = Number(props.getProperty("MAIL_FREIGABE_" + planjahr) || 0);
  if (heute > sitzung && (!zuletzt || heute >= plusTage_(zuletzt, 7))) {
    const link = `${ENTSCHEID_SEITE}?aktion=freigeben&jahr=${planjahr}&t=${token_("freigeben-" + planjahr)}`;
    const erneut = zuletzt ? "Erinnerung: " : "";
    MailApp.sendEmail({ to: an.join(","), name: "Dorfkalender Rehetobel",
      subject: `Dorfkalender: ${erneut}${planjahr} freigeben`,
      body: `Ist die Jahresplanung ${planjahr} bereinigt? Dann hier ${planjahr} freigeben – danach sieht das ganze Dorf alle Anlässe:\n${link}`,
      htmlBody: `<div style="font-family:Arial,sans-serif;font-size:15px;color:#222"><p>${erneut}Ist die Jahresplanung ${planjahr} nach der ` +
        `Koordinationssitzung bereinigt (verschobene Daten angepasst)?</p><p>Dann hier freigeben – danach sieht das ganze Dorf alle Anlässe ${planjahr}:</p>` +
        `<a href="${link}" style="display:inline-block;padding:12px 22px;border-radius:6px;background:#2e7d32;color:#fff;text-decoration:none;font-weight:bold">${planjahr} freigeben</a></div>` });
    props.setProperty("MAIL_FREIGABE_" + planjahr, String(heute));
  }
}

// Menü in der Tabelle (erscheint beim Öffnen)
function onOpen() {
  SpreadsheetApp.getUi().createMenu("Dorfkalender")
    .addItem("Planungskalender-Link anzeigen", "menuPlanungslink")
    .addItem("Nächstes Jahr freigeben …", "menuFreigeben")
    .addToUi();
}
function menuPlanungslink() {
  SpreadsheetApp.getUi().alert("Planungskalender " + (freigegebenBis_() + 1),
    "Link für die planenden Vereine:\n" + planungsLink_() + "\n\nPlanungsliste zum Ausdrucken:\n" + planungsLink_() + "&ansicht=druck",
    SpreadsheetApp.getUi().ButtonSet.OK);
}
function menuFreigeben() {
  const ui = SpreadsheetApp.getUi(), jahr = freigegebenBis_() + 1;
  if (ui.alert(jahr + " freigeben?", "Alle vorgemerkten Anlässe " + jahr + " werden öffentlich.", ui.ButtonSet.YES_NO) !== ui.Button.YES) return;
  ui.alert(jahrFreigeben_(jahr).text);
}

// ---------- Mails ----------

// Mail «angenommen» oder «abgelehnt» an den Veranstalter (nur einmal pro Entscheid). Gibt einen kurzen Text zurück.
function entscheidMail_(blatt, zeile, wert) {
  const status = String(blatt.getRange(zeile, spalte_(blatt, "Mail-Status", true)).getDisplayValue());
  if (wert === "ja" && status.startsWith("Angenommen")) return "Das Mail an den Veranstalter war schon verschickt.";
  if (wert === "nein" && status.startsWith("Abgelehnt")) return "Das Mail an den Veranstalter war schon verschickt.";
  if (wert === "vorgemerkt" && status.startsWith("Vorgemerkt")) return "Das Mail an den Veranstalter war schon verschickt.";
  const a = anlass_(blatt, zeile);
  if (!a.mail) {
    setzeStatus_(blatt, zeile, ({ ja: "Angenommen", nein: "Abgelehnt", vorgemerkt: "Vorgemerkt" })[wert] + ", keine E-Mail-Adresse – kein Mail");
    return "Kein Mail verschickt: Der Veranstalter hat keine E-Mail-Adresse angegeben.";
  }
  if (wert === "ja") {
    vereinsMail_(a.mail, `Ihr Anlass «${a.titel}» ist im Dorfkalender`, [
      "Gute Nachricht: Der Verkehrsverein Rehetobel hat Ihren Anlass geprüft und angenommen.",
      { angaben: a },
      "Der Anlass erscheint im Dorfkalender Rehetobel. Es kann noch ein paar Minuten dauern, bis er aufgeschaltet ist.",
      { link: KALENDER_LINK, text: "Zum Dorfkalender" },
      `Ändert sich etwas an Ihrem Anlass? Dann schreiben Sie bitte an ${ANTWORT_AN}.`,
    ]);
    setzeStatus_(blatt, zeile, "Angenommen, Mail verschickt " + heute_());
  } else if (wert === "vorgemerkt") {
    const jahr = jahr_(a.datum);
    vereinsMail_(a.mail, `Ihr Anlass «${a.titel}» ist für ${jahr} vorgemerkt`, [
      `Der Verkehrsverein Rehetobel hat Ihren Anlass für die Jahresplanung ${jahr} vorgemerkt.`,
      { angaben: a },
      "Das Datum wird an der Koordinationssitzung im November gemeinsam mit allen Vereinen festgelegt. " +
        "Öffentlich im Dorfkalender erscheint der Anlass erst danach.",
      { link: planungsLink_(), text: `Planungskalender ${jahr} ansehen`,
        hinweis: `Hier sehen Sie, was andere Vereine für ${jahr} schon vorgemerkt haben (provisorisch, bitte nicht weitergeben).` },
    ]);
    setzeStatus_(blatt, zeile, "Vorgemerkt, Mail verschickt " + heute_());
  } else {
    vereinsMail_(a.mail, `Ihre Meldung «${a.titel}» – Dorfkalender Rehetobel`, [
      "Vielen Dank für Ihre Meldung. Leider können wir den folgenden Anlass nicht in den Dorfkalender Rehetobel aufnehmen:",
      { angaben: a },
      // Steht der Formular-Link in der Begründung (automatische Absagen), wird daraus ein Knopf
      ...(a.begruendung ? [{ grund: a.begruendung.replace(FORMULAR_LINK, "").replace(/[\s:]+$/, "").replace(/([^.!?])$/, "$1.") }] : []),
      ...(a.begruendung.includes(FORMULAR_LINK) ? [{ link: FORMULAR_LINK, text: "Anlass neu melden" }] : []),
    ]);
    setzeStatus_(blatt, zeile, "Abgelehnt, Mail verschickt " + heute_());
  }
  return `Mail an ${esc_(a.mail)} verschickt.`;
}

// Prüf-Mail: Art der Meldung, Überschneidungen, alle Angaben + Knöpfe «Annehmen» / «Ablehnen»
function mailAnVorstand_(blatt, zeile, a, id, art) {
  const an = pruefEmpfaenger_();
  if (!an.length) return;
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
  const jahr = jahr_(a.datum);
  const artText = art === "planung"
    ? `Planung ${jahr}: «Annehmen» = vormerken (nur im Planungskalender sichtbar, öffentlich erst nach der Freigabe).`
    : art === "unklar"
    ? `⚠ Das Datum «${a.datum}» konnte nicht gelesen werden. Bitte in der Tabelle prüfen, bevor Sie annehmen.`
    : `Nachmeldung: «Annehmen» = sofort öffentlich im Dorfkalender.`;
  const gleich = gleicherTag_(blatt, zeile, a);
  const gleichText = gleich.length
    ? "⚠ Am gleichen Tag schon eingetragen:\n" + gleich.map((x) => "– " + x).join("\n")
    : "✓ An diesem Tag ist noch nichts eingetragen.";
  const gleichHtml = gleich.length
    ? `<p style="background:#fff4e5;padding:10px 12px;border-radius:6px"><b>⚠ Am gleichen Tag schon eingetragen:</b><br>${gleich.map((x) => "– " + esc_(x)).join("<br>")}</p>`
    : `<p style="color:#2e7d32">✓ An diesem Tag ist noch nichts eingetragen.</p>`;
  const warnungen = hinweise_(blatt, zeile, a);
  const warnHtml = warnungen.map((w) =>
    `<p style="background:#fde8e8;border-left:4px solid #c62828;padding:10px 12px;border-radius:6px"><b>⚠ ${esc_(w)}</b></p>`).join("");
  const html = `<div style="font-family:Arial,sans-serif;font-size:15px;color:#222">
    <p><b>${esc_(artText)}</b></p>
    ${warnHtml}
    ${gleichHtml}
    <table style="border-collapse:collapse;margin-bottom:16px">${tabelle}</table>
    ${knopf("✓ Annehmen", "#2e7d32", ja) + knopf("✕ Ablehnen", "#c62828", nein)}
    <p style="color:#666;font-size:13px">Ein Tipp genügt: Der Verein bekommt sofort das passende Mail.</p>
    ${art === "planung" ? `<p style="color:#666;font-size:13px">Planungskalender ${jahr}: <a href="${planungsLink_()}">öffnen</a></p>` : ""}
  </div>`;
  const text = artText + "\n\n" + warnungen.map((w) => "⚠ " + w + "\n").join("") + gleichText + "\n\n" + zeilen.map(([h, w]) => `${h}: ${w}`).join("\n") +
    `\n\nAnnehmen: ${ja}\nAblehnen: ${nein}`;
  MailApp.sendEmail({
    to: an.join(","), subject: `Dorfkalender: ${art === "planung" ? "Planung " + jahr : "neue Meldung"} «${a.titel}» (${a.datum})`,
    body: text, htmlBody: html, name: "Dorfkalender Rehetobel",
  });
}

// Andere Anlässe (öffentlich oder vorgemerkt), die mindestens einen Tag mit diesem Anlass gemeinsam haben
function gleicherTag_(blatt, zeile, a) {
  const von = datumNum_(a.datum), bis = datumNum_(a.bis) || von;
  if (!von) return [];
  const treffer = [];
  for (const { zeile: z, a: b } of alleAnlaesse_(blatt)) {
    if (z === zeile) continue;
    if (b.freigegeben !== "ja" && b.freigegeben !== "vorgemerkt") continue;
    const bVon = datumNum_(b.datum), bBis = datumNum_(b.bis) || bVon;
    if (!bVon || bVon > bis || bBis < von) continue;
    treffer.push(`${b.titel} (${b.veranstalter || "?"}), ${b.datum}${b.zeit ? " " + b.zeit : ""}` +
      ` – ${b.freigegeben === "ja" ? "öffentlich" : "vorgemerkt"}` + (b.verschiebbar ? `, verschiebbar: ${b.verschiebbar}` : "") +
      (b.kategorie ? ` · ${b.kategorie}` : ""));
  }
  return treffer;
}

// Anlässe der gleichen Hauptart (Musik & Kultur, Feste & Märkte, Sport & Natur) an einem gemeinsamen Tag
function gleicheArt_(blatt, zeile, a) {
  const k = String(a.kategorie || "").trim();
  if (HAUPT_ARTEN.indexOf(k) < 0) return [];
  const von = datumNum_(a.datum), bis = datumNum_(a.bis) || von;
  if (!von) return [];
  const treffer = [];
  for (const { zeile: z, a: b } of alleAnlaesse_(blatt)) {
    if (z === zeile) continue;
    if (b.freigegeben !== "ja" && b.freigegeben !== "vorgemerkt") continue;
    if (String(b.kategorie || "").trim() !== k) continue;
    const bVon = datumNum_(b.datum), bBis = datumNum_(b.bis) || bVon;
    if (!bVon || bVon > bis || bBis < von) continue;
    treffer.push(b);
  }
  return treffer;
}

// Welches Thema hätte man erwartet? Zuerst gleiche Titel bei schon angenommenen Anlässen, sonst die Stichwort-Liste.
function themaVorschlag_(blatt, zeile, a) {
  const norm = (t) => String(t || "").toLowerCase().replace(/\d+\.?/g, "").replace(/[«»"',.:–-]/g, " ").replace(/\s+/g, " ").trim();
  const t = norm(a.titel), zaehler = {};
  for (const { zeile: z, a: b } of alleAnlaesse_(blatt)) {
    if (z === zeile) continue;
    if ((b.freigegeben === "ja" || b.freigegeben === "vorgemerkt") && b.kategorie && norm(b.titel) === t)
      zaehler[b.kategorie] = (zaehler[b.kategorie] || 0) + 1;
  }
  const bisher = Object.keys(zaehler).sort((x, y) => zaehler[y] - zaehler[x])[0];
  if (bisher) return { thema: bisher, grund: `«${a.titel}» war bisher immer «${bisher}»` };
  const treffer = ZUORDNUNG.find(([wort]) => t.indexOf(wort) >= 0);
  return treffer ? { thema: treffer[1], grund: `Anlässe mit «${treffer[0]}» im Titel sind normalerweise «${treffer[1]}»` } : null;
}

// Warnungen fürs Prüf-Mail
function hinweise_(blatt, zeile, a) {
  const w = [];
  const v = themaVorschlag_(blatt, zeile, a);
  if (v && a.kategorie && v.thema !== String(a.kategorie).trim())
    w.push(`Kategorie prüfen: gemeldet ist «${a.kategorie}». ${v.grund}.`);
  const gleich = gleicheArt_(blatt, zeile, a);
  if (gleich.length) w.push(`Gleiche Art am gleichen Tag (${a.kategorie}): ` +
    gleich.map((b) => `«${b.titel}» (${b.veranstalter || "?"})`).join(", ") + ".");
  return w;
}

// ---------- Hilfsfunktionen ----------

// Empfänger der Prüf-Mails: VORSTAND plus Adressen aus der Skripteigenschaft PRUEF_MAILS_AUCH_AN
function pruefEmpfaenger_() {
  const extra = String(PropertiesService.getScriptProperties().getProperty("PRUEF_MAILS_AUCH_AN") || "")
    .split(/[,;\s]+/).map((x) => x.trim()).filter((x) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(x));
  return [...new Set([...VORSTAND, ...extra])];
}

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
  const kopf = blatt.getRange(1, 1, 1, breite).getDisplayValues()[0];
  return anlassAus_(kopf, blatt.getRange(zeile, 1, 1, breite).getDisplayValues()[0]);
}

// Alle Zeilen auf einmal lesen (schnell, auch bei vielen hundert Meldungen): [{zeile, a}, …]
function alleAnlaesse_(blatt) {
  const breite = blatt.getLastColumn(), n = blatt.getLastRow();
  if (n < 2) return [];
  const werte = blatt.getRange(1, 1, n, breite).getDisplayValues();
  return werte.slice(1).map((w, i) => ({ zeile: i + 2, a: anlassAus_(werte[0], w) }));
}

function anlassAus_(kopfRoh, werteRoh) {
  const kopf = kopfRoh.map((h) => String(h).trim().toLowerCase());
  const werte = werteRoh.map((w) => String(w).trim());
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
  const beginnt = (...namen) => { const i = kopf.findIndex((h) => namen.some((n) => h.startsWith(n))); return i >= 0 ? werte[i] : ""; };
  const enthaelt = (wort) => { const i = kopf.findIndex((h) => h.includes(wort)); return i >= 0 ? werte[i] : ""; };
  return {
    titel: feld("titel") || "Ihr Anlass",
    datum: feld("datum"), bis: feld("bis"),
    zeit: zeit(feld("zeit") || feld("zeit (beginn)")), zeitBis: zeit(feld("zeit bis") || feld("zeit (ende)")),
    ort: feld("ort") || beginnt("ort ("), veranstalter: beginnt("veranstalter"), kategorie: beginnt("kategorie"),
    beschreibung: beginnt("beschreibung"), link: /^https?:\/\//.test(beginnt("link")) ? beginnt("link") : "",
    verschiebbar: enthaelt("verschoben") || enthaelt("verschiebbar"),
    freigegeben: beginnt("freigegeben").toLowerCase(),
    begruendung: feld("begründung"), mail: mail,
    vergangen: istVergangen_(feld("bis") || feld("datum")),
  };
}

// Art der Meldung nach dem Datum: vergangen / nachmeldung / planung / zu_frueh / unklar
function art_(a) {
  if (a.vergangen) return "vergangen";
  const j = jahr_(a.datum), offen = offenBis_();
  if (!j) return "unklar";
  if (j <= offen) return "nachmeldung";
  return j === offen + 1 ? "planung" : "zu_frueh";
}

// Bis zu welchem Jahr gehen Meldungen direkt in den öffentlichen Kalender? Das freigegebene Jahr, mindestens aber
// das laufende Kalenderjahr (falls die Freigabe über den Jahreswechsel vergessen wurde, bleibt das laufende Jahr offen).
function offenBis_() {
  return Math.max(freigegebenBis_(), Math.floor(heuteNum_() / 10000));
}

// Bis zu welchem Jahr ist der öffentliche Kalender freigegeben?
function freigegebenBis_() {
  const props = PropertiesService.getScriptProperties();
  const p = Number(props.getProperty("FREIGEGEBEN_BIS"));
  if (p) return p;
  // Erstes Mal: Startwert festlegen und speichern (danach ändert ihn nur noch «Jahr freigeben»)
  const heute = heuteNum_(), jahr = Math.floor(heute / 10000);
  const start = heute >= ersterMittwochNov_(jahr) ? jahr + 1 : jahr;
  props.setProperty("FREIGEGEBEN_BIS", String(start));
  return start;
}

// Datum als Zahl JJJJMMTT («12.06.2028» oder «2028-06-12» → 20280612), 0 wenn unlesbar
function datumNum_(s) {
  let m = String(s || "").match(/^(\d{1,2})\.(\d{1,2})\.(\d{2,4})/), j, mo, t;
  if (m) { t = +m[1]; mo = +m[2]; j = +m[3]; if (j < 100) j += 2000; }
  else if ((m = String(s || "").match(/^(\d{4})-(\d{1,2})-(\d{1,2})/))) { j = +m[1]; mo = +m[2]; t = +m[3]; }
  else return 0;
  return j * 10000 + mo * 100 + t;
}
function jahr_(s) { return Math.floor(datumNum_(s) / 10000); }
function heuteNum_() { return Number(Utilities.formatDate(new Date(), "Europe/Zurich", "yyyyMMdd")); }
function ersterMittwochNov_(jahr) {
  const wt = new Date(Date.UTC(jahr, 10, 1)).getUTCDay();   // 0 = Sonntag
  return jahr * 10000 + 1100 + 1 + ((3 - wt + 7) % 7);
}
function plusTage_(num, n) {
  const d = new Date(Date.UTC(Math.floor(num / 10000), Math.floor(num / 100) % 100 - 1, num % 100 + n));
  return d.getUTCFullYear() * 10000 + (d.getUTCMonth() + 1) * 100 + d.getUTCDate();
}
function datumText_(num) { return `${num % 100}.${Math.floor(num / 100) % 100}.${Math.floor(num / 10000)}`; }
function planungsLink_() { return `${KALENDER_LINK}?planung=${token_("planung")}`; }

// true, wenn das Datum (z. B. «17.02.2006» oder «2006-02-17») vor heute liegt
function istVergangen_(s) {
  const d = datumNum_(s);
  return d > 0 && d < heuteNum_();
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
  return `${ENTSCHEID_SEITE}?a=${wert}&id=${encodeURIComponent(id)}&t=${token_(id)}`;
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

// Mail an einen Verein – formatiert (fliesst sauber auf jeder Bildschirmbreite) und als einfacher Text.
// teile: Text (Absatz) | { angaben: anlass, titel } | { link, text, hinweis } | { grund }
function vereinsMail_(an, betreff, teile) {
  const stil = "font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.5;color:#222";
  const html = [], text = ["Guten Tag"];
  html.push(`<p style="margin:0 0 18px;padding-bottom:12px;border-bottom:3px solid #008c35">` +
    `<img src="${LOGO}" alt="Verkehrsverein Rehetobel" width="150" style="display:block;width:150px;height:auto;border:0"></p>`);
  html.push(`<p style="margin:0 0 14px">Guten Tag</p>`);
  for (const t of teile) {
    if (typeof t === "string") {
      html.push(`<p style="margin:0 0 14px">${verlinke_(esc_(t))}</p>`);
      text.push(t);
    } else if (t.angaben) {
      const zeilen = angaben_(t.angaben).split("\n").map((z) => {
        const [k, ...v] = z.split(": ");
        return `<tr><td style="padding:2px 14px 2px 0;color:#666;vertical-align:top">${esc_(k)}</td><td style="padding:2px 0"><b>${esc_(v.join(": "))}</b></td></tr>`;
      }).join("");
      html.push(`${t.titel ? `<p style="margin:0 0 6px;color:#666">${esc_(t.titel)}:</p>` : ""}` +
        `<table style="background:#f4f4f2;border-radius:8px;padding:10px 14px;margin:0 0 14px;border-collapse:separate">${zeilen}</table>`);
      text.push((t.titel ? t.titel + ":\n" : "") + angaben_(t.angaben));
    } else if (t.link) {
      html.push(`${t.hinweis ? `<p style="margin:0 0 8px">${esc_(t.hinweis)}</p>` : ""}` +
        `<p style="margin:0 0 14px"><a href="${t.link}" style="display:inline-block;padding:10px 18px;border-radius:6px;background:${FARBE};color:#fff;text-decoration:none;font-weight:bold">${esc_(t.text)}</a></p>`);
      text.push((t.hinweis ? t.hinweis + "\n" : "") + `${t.text}: ${t.link}`);
    } else if (t.grund) {
      html.push(`<p style="margin:0 0 14px;background:#fdf1f0;border-radius:8px;padding:10px 14px"><b>Begründung:</b> ${verlinke_(esc_(t.grund))}</p>`);
      text.push("Begründung: " + t.grund);
    }
  }
  html.push(`<p style="margin:18px 0 0">Freundliche Grüsse<br>Verkehrsverein Rehetobel</p>`);
  html.push(`<p style="margin:24px 0 0;padding-top:10px;border-top:1px solid #ddd;color:#888;font-size:12px">${esc_(FUSS)}</p>`);
  text.push("Freundliche Grüsse\nVerkehrsverein Rehetobel", "---\n" + FUSS);
  MailApp.sendEmail({ to: an, subject: betreff, name: ABSENDER_NAME, replyTo: ANTWORT_AN,
    body: text.join("\n\n"), htmlBody: `<div style="${stil};max-width:600px">${html.join("")}</div>` });
}

// Adressen und Links in (bereits geschütztem) Text anklickbar machen
function verlinke_(s) {
  return s.replace(/https?:\/\/[^\s<]+/g, (u) => `<a href="${u}" style="color:#0b5e2a;word-break:break-all">${u}</a>`)
    .replace(/\b([\w.+-]+@[\w-]+\.[\w.]+)\b/g, '<a href="mailto:$1" style="color:#0b5e2a">$1</a>');
}

function setzeStatus_(blatt, zeile, text) {
  blatt.getRange(zeile, spalte_(blatt, "Mail-Status", true)).setValue(text);
}

function heute_() {
  return Utilities.formatDate(new Date(), "Europe/Zurich", "d.M.yyyy HH:mm");
}
