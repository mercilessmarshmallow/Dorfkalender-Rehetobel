# Dorfkalender Rehetobel – Regeln für Claude

Öffentlicher Veranstaltungskalender fürs ganze Dorf Rehetobel, betrieben vom Verkehrsverein Rehetobel (VVR).
Diese Ablage ist **öffentlich** (GitHub Pages) und der **einzige Ort** für alles rund um den Dorfkalender.
Die interne Vorstandsarbeit des VVR (Protokolle, HV-Vorbereitung usw.) liegt in einer anderen, privaten Ablage
und hat hier nichts zu suchen.

## Zuerst lesen (Tokens sparen, Wunsch Projektleitung 11.11.2026)
1. [STAND.md](STAND.md) – kurz: was offen ist, hier weitermachen. Immer lesen.
2. [KONZEPT.md](KONZEPT.md) (der Plan) und [ENTSCHEIDE.md](ENTSCHEIDE.md) (was entschieden ist – nicht neu aufrollen):
   **nicht ganz lesen**, sondern gezielt nach dem Thema suchen (z. B. `grep -n -i "titelbild" ENTSCHEIDE.md`), bevor etwas geändert wird.
3. [STAND-archiv.md](STAND-archiv.md) – Erledigtes, nur bei Bedarf gezielt suchen.

## Sprache und Umgang
- Immer **Deutsch (Schweiz)**: «ss» statt «ß».
- Die Projektleitung ist **kein Programmierer**: einfache Worte, kein Fachjargon.
- **Erst die ganze Lösung erklären** (was, warum, was die Projektleitung tun muss, was unsicher ist) –
  erst nach ihrem Okay Schritte geben.
- Schritte **einzeln** geben, die Projektleitung antwortet mit «ok». Nicht mehrere Blöcke auf einmal.
- **Nicht raten.** Bei einem Fehler zuerst die Ursache klären (z. B. Apps Script → «Ausführungen»), dann handeln.
  Nicht nacheinander verschiedene Vermutungen ausprobieren lassen.
- **Angaben von Anlässen nie aus Annahme ändern** (Veranstalter, Ort, Zeit, Kategorie), auch wenn es «wie 2027» aussieht.
  Erlaubt: nur Tippfehler und gleiche Orte gleich schreiben. Alles andere als Frage an die Projektleitung (Wunsch 10.11.2026).
- Ziel der Projektleitung: alles Wichtige **mit einem Tipp in der Gmail-App**, ohne Computer.
  Aufgaben am PC bündeln, damit sie möglichst selten nötig sind.

## Gesprächsverlauf aufräumen («/clear»)
- Lange Gespräche werden unübersichtlich. Wenn ein Thema abgeschlossen ist (gebaut, geprüft, veröffentlicht oder
  bewusst vertagt), **STAND.md nachführen** («Hier weitermachen …») und dann der Projektleitung vorschlagen:
  «Guter Moment für /clear – alles Wichtige steht in STAND.md.»
- Nicht mitten in einer offenen Frage oder Fehlersuche vorschlagen, und höchstens einmal pro Thema.
- Nach /clear zuerst STAND.md lesen (siehe «Zuerst lesen»). STAND.md kurz halten, Erledigtes ins Archiv.

## Ideen und Entscheide festhalten
- Neue Idee oder neuer Wunsch → in KONZEPT.md einordnen (mit 📋 geplant), Auswirkungen auf Bestehendes nennen.
- Entscheid → in ENTSCHEIDE.md mit Datum und Grund (neueste zuoberst).
- Am Ende jeder Arbeit STAND.md nachführen.

## Datenschutz (Ablage ist öffentlich!)
- **Keine** privaten Mailadressen, Telefonnummern oder Namen von Kontaktpersonen in irgendeiner Datei
  (auch nicht in Programm, Tests, Commit-Nachrichten). Erlaubt: verkehrsverein.rehetobel@gmail.com, Namen von Vereinen.
- Private Adressen für Prüf-Mails nur in der Apps-Script-Skripteigenschaft `PRUEF_MAILS_AUCH_AN`.
- Inhalte der Google-Tabelle (Meldungen mit Kontaktdaten) nie in die Ablage kopieren.

## Vor jeder Änderung veröffentlichen
1. `node tests/test.js` – muss «Alle Prüfungen bestanden» melden. Neue Funktionen → Test ergänzen.
2. **Grössere Änderungen** (neue Funktion, Programm `Mails.gs`, mehrere Dateien, Aufbau der Seite): Subagent **`kalender-pruefer`**
   einsetzen und sein Ergebnis berücksichtigen. Bei grösseren Änderungen an der Webseite zusätzlich **`handy-anschauer`**.
   **Kleine Änderungen** (ein Bild tauschen, Tippfehler, ein Satz): ohne Subagenten – selbst kurz prüfen (keine Personendaten,
   «ss», ggf. ein Bildschirmfoto). Spart viele Tokens (Wunsch Projektleitung 11.11.2026).
3. Was auf `main` landet, ist sofort live (Webseite). Auf `main` nur mit Okay der Projektleitung.
4. Änderungen am Programm (`apps-script/Mails.gs`) wirken erst, wenn die Projektleitung es in Apps Script
   erneuert (`anleitungen/programm-einrichten.md`, Teil A). Darum Programmänderungen sammeln.

## Technik in Kürze
- Webseite: `index.html`, `css/`, `js/` (liest die veröffentlichte CSV des Blatts «Kalender», Link in `js/config.js`),
  `data/anlaesse.js` (nur Beispieldaten, wenn kein CSV-Link), `entscheid.html` (Prüfseite).
- Google-Konto des Vereins: verkehrsverein.rehetobel@gmail.com (Formular, Tabelle, Apps Script). Unabhängig von info@.
- Tabelle: Blatt «Formularantworten 1» (alle Meldungen; Spalten Freigegeben, Begründung, Mail-Status, ID verwaltet das Programm),
  Blatt «Kalender» = `FILTER` der Formularantworten mit Freigegeben = «ja», ohne Kontaktspalten, als CSV veröffentlicht.
  Das Programm findet Spalten über ihre **Überschriften**, nicht über die Position.
- Web-App (Apps Script, Ausführen als «Ich», Zugriff «Jeder») – URL steht in `Mails.gs` (`WEB_APP_URL`) und `entscheid.html` (`API`).
  Die Prüfseite ruft sie mit `credentials: "omit"` auf (ohne Google-Anmeldung).

## Helfer (Subagenten, `.claude/agents/`)
- `kalender-pruefer` – vor jeder Veröffentlichung: Personendaten, Tests, Entscheide, Technik, Sprache.
- `handy-anschauer` – Aussehen auf iPhone, Android, Laptop; Titelbilder mit `--titelbilder`. Ersetzt nicht den Test auf dem echten Handy.
- `anlass-pruefer` – liest nur das Blatt «Kalender» und meldet Lücken (Zeit, Ort, Veranstalter, alte Kategorien, Doppelte, Logo-Schreibweisen).
  Vor dem PC-Termin und nach grösseren Nachträgen. Sein Bericht kommt nie in die Ablage.

## Bekannte Stolpersteine
- **Mehrere Google-Konten im Browser** → «Datei kann derzeit nicht geöffnet werden» (Apps Script und Web-App).
  Lösung: privates Fenster nur mit dem Vereinskonto; Prüf-Knöpfe laufen über `entscheid.html`.
- **Bereitstellungen:** immer «Bereitstellungen verwalten → Bearbeiten → Neue Version», nie «Neue Bereitstellung» (neue URL).
- **Neues Gmail-Konto:** Mails landen anfangs bei strengen Systemen im Spam; Weiterleitung liess sich nicht bestätigen.
- **Datum/Zeit aus Google** kommen im CSV teils als Zahlen (z. B. 46329 = 3.11.2026) – `js/datenquelle.js` rechnet um.
- **Google aktualisiert** die veröffentlichte CSV erst nach einigen Minuten.
