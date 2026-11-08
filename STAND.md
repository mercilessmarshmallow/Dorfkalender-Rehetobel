# Stand Dorfkalender

Stand: 8.11.2026. Bei jedem Arbeitsbeginn lesen, am Ende nachführen.

## Läuft (eingerichtet am 6.11.2026, mit dem Handy getestet)
- Webseite mit Liste, Monat und Terminplanung (seit 7.11. im neuen Design, siehe unten); Planungskalender über `?planung=…`.
- Formular mit «Kann das Datum verschoben werden? (Ja/Nein)», Name der Kontaktperson und E-Mail.
- Programm (neue Fassung, 595 Zeilen), Skripteigenschaft `PRUEF_MAILS_AUCH_AN` gesetzt, neue Version bereitgestellt, «einrichten» ausgeführt.
- Getestet am 6.11.2026:
  - Prüf-Mail kommt ins private Gmail der Projektleitung ✓
  - Ein Tipp auf «Annehmen» in der Gmail-App ✓
  - Nachmeldung (Dez. 2026) → angenommen, Mail an den Verein ✓
  - Planungsmeldung (Jan. 2028) → als «Planung 2028» erkannt, Überschneidungsprüfung, «vorgemerkt», Mail mit Planungskalender-Link ✓
  - Eingangsbestätigungen ohne «Bei Fragen …» ✓
- Noch nicht von Hand angeschaut: Planungskalender-Seite (Link aus dem Mail).

## Eingerichtet am 6.11.2026 (Nachtrag)
- **Schönere Mails an die Vereine:** formatiert, Logo oben mit grüner Linie, Angaben im Kasten, rote Knöpfe,
  keine Umbrüche mitten im Satz. Programm erneuert (609 Zeilen, neue Version), mit echtem Mail geprüft ✓

## Neues Design (gebaut und auf main veröffentlicht am 7.11.2026, Okay der Projektleitung – auch für Schwimmbad-Symbol und gedrehtes Lesegesellschaft-Logo)
- **Noch von Hand anschauen:** Seite auf dem Handy öffnen (GitHub braucht ein paar Minuten).
Vorschau dazu in der Vorstandsablage (`ideen/originale/dorfkalender-vorschau/`), Entscheide siehe ENTSCHEIDE.md (7.11., Design).
- **Titelbild je nach Jahreszeit** (`js/titelbild.js`, Bilder in `bilder/titel/`, Handy quadratisch): Frühling (2), Sommer (2), Herbst (1),
  Winter (3), täglich abwechselnd. Schrift immer auf der Seite ohne Kirche/Hauptmotiv. Kein Logo und kein Bildnachweis im Bild,
  Nachweis in der Fusszeile «Fotos: Appenzellerland Tourismus, Verkehrsverein Rehetobel» (ohne Namen).
- **Liste:** «Diese Woche im Dorf», «Nächste Woche», dann Monate; 20 Anlässe, dann «Weitere anzeigen» (beim Suchen alle).
  Karten: Datum links («Heute» grün), Farbstreifen + Etikett je Kategorie, Vereinslogo oben rechts (nur wenn vorhanden),
  (Etikett «Nur für Mitglieder» vorbereitet, aber vorerst nicht im Einsatz). Antippen → Fenster mit «📅 In meinen Kalender» und «Alle Anlässe von …».
- **Themen** statt Kategorien (seit 8.11. live): neun Themen-Knöpfe als «Meine Auswahl», auf dem Handy zugeklappt.
  Alte Gruppen aus der Tabelle werden übersetzt (z. B. «Gemeinde Rehetobel» → «Gemeinde & Politik»; «Vereine»/«Gewerbe» nach Stichwort im Titel).
- Monat und Terminplanung bleiben als Ansichten (Reiter unter der Suche). Planungskalender und `?einbetten=1` funktionieren weiter.
- **«Dorfkalender aufs Handy»** (7.11.): eigenes quadratisches Symbol (Kalenderblatt in VVR-Farben, Wahl B, `bilder/app/`), Name «Dorfkalender» (`manifest.webmanifest`),
  öffnet sich vom Startbildschirm ohne Adressleiste. Hinweis-Kasten mit Anleitung fürs iPhone bzw. Android; auf dem Computer und
  in der «App» selbst ausgeblendet. **Android: getestet ✓** (Symbol, Name, Design, «In meinen Kalender» aus der App, 7.11.). **iPhone hinzufügen ✓ (8.11.).** **Noch testen:** in der iPhone-«App» prüfen, ob
  «📅 In meinen Kalender» funktioniert (iPhone-Apps vom Startbildschirm laden Dateien manchmal nicht).
- Unten: «Dorfkalender aufs Handy» und «Den Verkehrsverein unterstützen und Mitglied werden» (Mail an info@rehetobel-tourismus.ch).
- **Logos (17, `js/logos.js` + `bilder/logos/`):** Verkehrsverein, Gemeinde, Kirche, Jugendmusik, MG Brass Band, Chor, Sportverein,
  Gewerbeverein, Samariter, Feuerwehr, Spielgruppe, Sonjolino, Ornithologen, Schwimmbad (selbst gezeichnetes Symbol), Solardorf,
  Lesegesellschaft (quer gedreht), FDP. Zuordnung über den Veranstalter-Namen (mehrere Schreibweisen pro Verein).
  - Logos bleiben so. Lesegesellschaft (gedreht): laut Projektleitung sicher okay. Schwimmbad (eigenes Symbol): fragt die Projektleitung vor dem offiziellen Start.
  - **Neu 8.11.: Restaurant Dorf 5** (`dorf5.png`, weiss auf schwarz, von der Projektleitung) – 18 Logos.
  - **Bessere Datei wäre gut:** Spielgruppe (Scan), Solardorf (sehr klein), Feuerwehr (klein), MG Brass Band und Kirche (Bildschirmfoto; Kirche hat SVG).
- **«Nur für Mitglieder» vorerst nicht** (Entscheid 7.11.): keine Formularfrage, kein Etikett sichtbar. Falls später doch:
  Spalte «Für wen» im Blatt «Kalender» einzeln anhängen (z. B. `FILTER({B:L\X:X}; …)`), **nie** B:P o. ä. (sonst Kontaktdaten öffentlich).
- **PC-Aufgabe:** siehe «PC-Termin» unten (Themen im Formular). Ideenspeicher: Veranstalter als Auswahlliste (für die Logos).
- **Später besprechen:** Was gehört überhaupt in den Dorfkalender (z. B. Proben, Übungen, Sitzungen)?

## Helfer für Claude (8.11.2026, gebaut)
- Neu: **`handy-anschauer`** (`tests/anschauen.js`) und **`anlass-pruefer`** (`tests/anlaesse-pruefen.js`, liest nur Blatt «Kalender»
  über das geteilte private Google-Konto); **`kalender-pruefer`** prüft neu auch die Sprache. Siehe CLAUDE.md «Helfer».
  Ändert nichts an der Webseite. Erster Probelauf Handy-Anschauer: alles in Ordnung. Auf main (8.11., Okay Projektleitung).
  **Erster Einsatz Anlass-Prüfer (8.11.):** 212 Anlässe 2027 – alle erscheinen, alle haben ein Thema und einen Ort.
  Nachgetragen (Okay Projektleitung): Veranstalter bei 28 Anlässen (Samariterübungen, Abstimmungssonntage, Schwimmbad,
  Hauptübung Feuerwehr, Kirchgemeindeversammlung, Konfirmation, Besuchstag Schule) und Titel «Kammerorchester St. Gallen».
  Danach (Antworten Projektleitung): «Stobe + Bar offen» (9×) → Veranstalter «Haus zur Stickerei» eingetragen;
  «Feuerwehrverein Rehetobel» bekommt das Feuerwehr-Logo (`js/logos.js`, im Suchfeld «Feuerwehrverein» prüfen). **Seniorenzmittag (12×): trägt die Projektleitung nach.**
  Feuerwehr-Logo live (8.11., Okay Projektleitung). **Noch offen – nachfragen** (Projektleitung weiss es nicht): Veranstalter Saxophongebet (12×) und Naturfreundehaus Kaien (5×).
  **Offen – bei Vereinen nachfragen:** Sternsingen 9.1. (zweimal: Rundgang + Kirche → Titel unterscheiden?),
  Verbandswettschiessen (5./6.3. oder 12.3.?), rund 25 fehlende Uhrzeiten, Anfangszeit Vollmondschwimmen.
  Liste zum Nachfragen soll in die private Vorstandsablage (`kalender/anlaesse-2027/`) – noch nicht gemacht.

## Hier weitermachen (8.11.2026)
- **iPhone «aufs Handy» (8.11.): funktioniert** über Safari unten rechts **•••** → «Teilen» → «Zum Home-Bildschirm» ✓
  (Symbol wie bei Android). Ursache des Problems: Der Hinweis-Kasten ist auf dem iPhone nur Text (Apple erlaubt keinen
  Installieren-Knopf), sieht aber antippbar aus; und neuere iOS-Safari (iOS 26) hat unten keinen Teilen-Knopf mehr.
  **Bilder-Anleitung live (8.11., Okay Projektleitung):** Kasten-Text korrigiert (••• → Teilen → Zum Home-Bildschirm)
  und Knopf «Zeig mir, wie» (nur iPhone) mit 4 Bildern (`bilder/anleitung/`, Kontakte unkenntlich). Nur diese Stellen auf main
  gebracht (eigener Arbeitsordner), Tests auf dem main-Stand bestanden. **Noch anschauen:** auf dem iPhone den Knopf ausprobieren.
  App-Store-App verworfen (Kosten, Aufwand). **Noch testen:** «📅 In meinen Kalender» in der iPhone-«App».
- **Themen + «Meine Auswahl» live (8.11., Entscheid Projektleitung, ohne auf den Vorstand zu warten).** Webseite auf main. Alte Gruppen «Vereine»/«Gewerbe» bekommen auf der Webseite vorläufig ein Thema
  aus dem Titel (sonst «Kurse & Weiteres»). Zweig und main sind jetzt wieder gleich.
  **Notfall zurück zu den alten Kategorien:** `anleitungen/notfall-alte-kategorien.md` (alt/neu, alter Stand `8b595f2`).
- **Vorschau für den Vorstand (8.11.):** https://mercilessmarshmallow.github.io/Dorfkalender-Rehetobel/vorschau/ – Kalender mit
  Beispiel-Anlässen (aus dem alten Kalender, Nov. 2026–Jan. 2027) und **Probe-Formular** (`vorschau/melden.html`) mit den neuen
  Themen; verschickt nichts, Probe-Anlass erscheint nur im eigenen Browser. Projektleitung schickt Link + Bilder weiter,
  Vorstand gibt Rückmeldung. Excel 2027 und Vereinswebseite (ClubDesk) kommen erst danach.
  Text zum Weiterschicken (8.11.) mit Vergleich zum alten Kalender (rehetobel-tourismus.ch/wp/veranstaltungen/). **Wartet auf Rückmeldungen des Vorstands.**
- **PC-Termin der Projektleitung (Schritte einzeln geben, zuerst Termin abmachen):**
  1. Formular: Auswahl «Kategorie» → die neun Themen (Frage muss weiterhin **«Kategorie»** heissen – das Programm findet die Spalte über die Überschrift) (Musik & Kultur, Feste & Märkte, Sport & Natur, Kinder & Familie,
     Senioren & Treffpunkt, Kirche, Gemeinde & Politik, Vereinsleben, Kurse & Weiteres), Hilfstext «Was macht man dort als Besucher?».
  2. Programm in Apps Script erneuern (`anleitungen/programm-einrichten.md`, Teil A) – erst dann Warnungen im Prüf-Mail.
  3. ~~Tabelle: Einträge mit alten Gruppen auf Themen umstellen.~~ Nicht mehr nötig: Anlass-Prüfer 8.11. – alle Anlässe haben schon ein Thema.
  4. Gleich mit: Formular-Bestätigung «Bitte auch im Spam-Ordner nachsehen». (Test-Einträge und die zwei Vorstandssitzungen sind seit 8.11. gelöscht.)

## Noch offen
- **Hinweis:** Der alte Kalender (rehetobel-tourismus.ch) läuft weiter; der neue ersetzt ihn erst, wenn er so weit ist (siehe Vision im KONZEPT).
- **Vor dem Ersetzen des alten Kalenders:** kommende Anlässe aus dem alten Kalender übernehmen (iCal-Export vom Vorstand).
- **Anlässe 2027 eingetragen (8.11.):** 212 Anlässe (inkl. 12 auswärtige von Rehetobler Vereinen) aus der Liste der Koordinationssitzung direkt in die Tabelle (Freigegeben = ja,
  ohne Mailadressen → keine Mails). Tabelle ist dafür mit dem privaten Google-Konto der Projektleitung geteilt (Claude schreibt darüber).
  Zwei Konzerte 2028 als «vorgemerkt». Vorstandssitzungen gelöscht.
  **Offen** (Details in der privaten Vorstandsablage `kalender/anlaesse-2027/`): Veranstalter (klärt Projektleitung mit dem Vorstand),
  fehlende Zeiten und Orte, Anlässe ohne Datum. Nachträge macht Claude direkt in der Tabelle (geteilt mit dem privaten Konto).
- Bestätigungsnachricht im Formular: «Bitte auch im Spam-Ordner nachsehen.»
- Google-Benachrichtigung «neue Antworten» behalten oder ausschalten (Prüf-Mail ersetzt sie).
- Einbindung in die ClubDesk-Webseite (Code in KONZEPT.md / README.md).
- Offene Fragen: Anlässe aus dem alten Kalender übernehmen?
