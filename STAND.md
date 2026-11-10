# Stand Dorfkalender

Stand: 10.11.2026. Bei jedem Arbeitsbeginn lesen, am Ende nachführen.

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
  **Liste zum Nachfragen liegt in der privaten Vorstandsablage** (`kalender/anlaesse-2027/README.md`, 8.11.) – Projektleitung klärt mit Vorstand/Vereinen, Claude trägt Antworten in der Tabelle nach.

## Umzug auf das Vereinskonto (9.11.2026, erledigt am PC)
- ✅ Umzug, Webseite unter neuer Adresse, Formular «Kategorie» → neun Themen + Beschreibung «Was macht man dort als Besucher?»,
  Bestätigungsnachricht mit Spam-Hinweis, Programm erneuert (693 Zeilen, neue Version). Test: Prüf-Mail mit Knöpfen auf die
  neue Adresse ✓, «Ablehnen» ✓, Absage-Mail mit Logo ✓. Spam-Hinweis nach dem Absenden erscheint ✓ (zweiter Test 9.11.).
  Damit ist der PC-Termin (Punkte 1, 2, 4) erledigt. Beide Test-Meldungen vom 9.11. («test», «asdasds») abgelehnt ✓; die zwei Zeilen (Formularantworten 1, Zeilen 12 und 13) löscht die Projektleitung von Hand (Claude darf hier nicht in die Tabelle schreiben – Sperre der Sicherheitsprüfung).
- Ablage zieht auf das GitHub-Konto `verkehrsvereinrehetobel-collab`. Neue Adresse:
  https://verkehrsvereinrehetobel-collab.github.io/Dorfkalender-Rehetobel/ (alte leitet nicht weiter).
- Alle Links in der Ablage schon umgestellt (auch `Mails.gs`) und auf main.
- **Reihenfolge:** Umzug auf GitHub → Vereinskonto bestätigt → GitHub Pages prüfen (neue Adresse zeigt die Seite) →
  **Programm erneuern nötig (Anleitung Teil A)**, sonst führen Knöpfe in neuen Mails auf die alte Adresse →
  Claude-Zugriff (GitHub-App) fürs Vereinskonto freigeben, eigenes Konto als Mitarbeiter behalten.
- Danach: Vorschau-Link neu an den Vorstand; «Dorfkalender aufs Handy» auf Android und iPhone neu hinzufügen
  (9.11.: alte Verknüpfung auf dem Handy geht nicht mehr – erwartet, sie zeigt auf die alte Adresse; löschen und neu hinzufügen);
  Prüf-Mails, die schon im Postfach liegen, führen auf die alte Adresse (diese Anlässe in der Tabelle freigeben).

## Kompaktere Themen-Knöpfe und zwei Spalten (9.11.2026, live auf main, Okay Projektleitung)
- Wunsch Projektleitung: auf dem Laptop Anlässe sehen, ohne hinunterzuscrollen; Schrift nicht kleiner, Titelbild nicht kleiner
  (niedrigeres Titelbild: abgelehnt, «schlechte Lösung»; Auswahl auf dem Laptop zuklappen: abgelehnt, «doof»).
- **Grosse Bildschirme (ab 1200 px Breite):** zwei Spalten – links Suche und Themen untereinander (mit Zusätzen, bleiben beim
  Scrollen stehen), rechts gleich die Anlässe. Titel bündig mit den Spalten. Gilt nicht für `?einbetten=1`.
- **Mittlere Bildschirme (720–1199 px):** Text + «Alle wählen / Zurücksetzen» in einer Zeile, Knöpfe in zwei Zeilen
  («Kirche» rückt in die erste Zeile), Zusätze bei Vereinsleben / Kurse & Weiteres in zwei kurzen Zeilen im Knopf (vorher zu breit).
- Handy: gleich wie bisher, nur stehen «Alle wählen / Zurücksetzen» im aufgeklappten Bereich jetzt oben beim Text. Tests bestanden, alle Titelbilder angeschaut (Kirche frei), Monat und Terminplanung geprüft.
- Geprüft von `kalender-pruefer` (Fehler gefunden und behoben: Schrift rutschte bei winter3/fruehling2 auf sehr grossen
  Bildschirmen in die Bildmitte) und `handy-anschauer`. Projektleitung hat die zwei Spalten am eigenen PC angeschaut: sieht gut aus ✓ (9.11.).

## Hier weitermachen (10.11.2026) – Reihenfolge der Projektleitung
- **Erledigt 10.11.2026:** 59 Anlässe vom 12.11. bis 31.12.2026 aus dem alten Kalender (Stand 8.11., `vorschau/js/beispiel.js`) in «Formularantworten 1» nachgetragen
  (Freigegeben = ja, Mail-Status «Übernommen aus altem Kalender 2026 (kein Mail)», alte Kategorienamen wie bei 2027). Bereinigt: Ortsnamen wie 2027
  (Gemeindezentrum, Krone, Katholische Kirche), Zimmerschützen Dorf/Sägholz, «Adventsfenster». Angenommene Änderungen (Veranstalter, Ort,
  Kategorie, Zeit) am gleichen Tag wieder auf den alten Kalender zurückgesetzt (Wunsch Projektleitung). Das private Konto der
  Projektleitung kann die Tabelle bearbeiten (Freigabe «Bearbeiter»), Schreiben über die Google-Verbindung klappt.
- **Mail an den Vorstand:** Entwurf im Gmail der Projektleitung; Webseiten-Vorschau (claude.ai) am 10.11. neu hochgeladen mit Kalender direkt in der Seite.
1. **Mail an den Vorstand** schreiben (Entwurf in der privaten Vorstandsablage, `NAECHSTE_SCHRITTE.md`), Projektleitung schickt es ab.
   Themen und «neuer Kalender ab Neujahr» sind darin **Vorschläge** – den Vorstand nicht vor vollendete Tatsachen stellen.
2. **Erst danach** Zweig auf main bringen (Okay Projektleitung): zehn Themen + Titelbilder Laptop. Die Adresse der Seite bleibt gleich.
3. Dann PC-Termin: Formular «Kategorie» auf zehn Themen + Programm erneuern (Punkte 1–2 unten).
4. Rückmeldungen des Vorstands einarbeiten (Frist im Mail: eine Woche).

## Hier weitermachen (8.11.2026)
- **Themen überarbeitet (10.11.2026, Entscheid Projektleitung, siehe ENTSCHEIDE.md):** zehn Themen – Musik & Kultur, Feste & Märkte,
  Sport & Natur, Kinder & Familie, **Senioren**, **Begegnung**, Kirche, Gemeinde & Politik, Vereinsleben, **Vorträge & Weiteres**.
  Webseite und Programm umgebaut, **auf dem Zweig, noch nicht auf main** (wartet auf Okay der Projektleitung). Die Webseite übersetzt
  alte Einträge selbst (Seniorenzmittag/Unterhaltungsnachmittag/Krone → Senioren, sonst Begegnung; Kurse → Vorträge).
  Tests, `kalender-pruefer` ✓. **Tabelle eilt nicht:** Die Projektleitung geht alle Anlässe mit zwei Vorstandsmitgliedern durch
  (Word-Liste in der privaten Vorstandsablage, `kalender/anlaesse-2027/`, Claude führt sie nach, bis abgesegnet).
  In der Tabelle anders einzutragen (Vorschlag): Tag der Begegnung und die zwei Gottesdienste in der Krone → Senioren.
  **Ziel: alter Kalender bis Ende 2026, neuer ab Neujahr 2027, kein Parallelbetrieb.**
- **Titelbilder auf dem Laptop (10.11.2026, auf dem Zweig, noch nicht auf main):** Titelbild wächst ab 900 px mit der Breite
  (1366 px: 420 px hoch wie bisher, 1920 px: 576 px), jedes Bild mit eigenem Ausschnitt (ganze Kirche mit Spitze, Langläufer,
  mehr Dorf beim Baum), Winterbild «Langlauf» heller. Handy unverändert. `handy-anschauer` ✓ (alle Grössen 1024–1920).
  **Projektleitung:** kurz auf dem eigenen Laptop anschauen.
- **📷 Bessere Titelbilder – offen, Projektleitung kümmert sich (10.11.2026):** «Die Webseite ist ein Prozess.»
  - Alle Laptop-Bilder sind nur 1600 px breit → auf grossen und guten Laptop-Bildschirmen leicht unscharf. Ideal: mind. 3000 px.
  - Herbst und Kirche (Appenzellerland Tourismus): Originale in voller Grösse anfragen.
  - Sommer auf dem Laptop nur noch der Baum (Kirche wirkt dort abgeschnitten, Entscheid 10.11.); Kirche bleibt auf dem Handy.
    Ein zweites, breites Sommerbild für den Laptop wäre schön, ebenso ein zweites Herbstbild.
  - Frühling «Hütte»: Foto ist gerade (Hütte senkrecht), wirkt aber schräg, weil die Wiese am Hang ansteigt →
    ersetzen durch ein Frühlingsbild mit geradem Horizont (z. B. Blick übers Dorf oder Richtung Säntis).
  - Neue Bilder vom Nachbarn der Projektleitung (Hobbyfotograf, gute Kamera): diesen Winter Winterbilder, im Frühling Frühlingsbilder.
    Die Projektleitung sagt ihm jeweils, wofür es ein Bild braucht. Breite Bilder (Querformat) für den Laptop, möglichst gross.
    Bildnachweis in der Fusszeile ergänzen, sobald Bilder von ihm drin sind (Name nur mit seinem Einverständnis).
  - Professionelle Fotos allgemein (auch Broschüre, Briefköpfe): Traktandum Vorstandssitzung 17.2.2027 (Vorstandsablage, Pendenz 20).
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
- **Vorschau für den Vorstand (8.11.):** https://verkehrsvereinrehetobel-collab.github.io/Dorfkalender-Rehetobel/vorschau/ – Kalender mit
  Beispiel-Anlässen (aus dem alten Kalender, Nov. 2026–Jan. 2027) und **Probe-Formular** (`vorschau/melden.html`) mit den neuen
  Themen; verschickt nichts, Probe-Anlass erscheint nur im eigenen Browser. Projektleitung schickt Link + Bilder weiter,
  Vorstand gibt Rückmeldung. Excel 2027 und Vereinswebseite (ClubDesk) kommen erst danach.
  Text zum Weiterschicken (8.11.) mit Vergleich zum alten Kalender (rehetobel-tourismus.ch/wp/veranstaltungen/). **Wartet auf Rückmeldungen des Vorstands.**
- **PC-Termin der Projektleitung (Schritte einzeln geben, zuerst Termin abmachen):**
  1. **(neu, offen)** Formular: Auswahl «Kategorie» → die **zehn** Themen vom 10.11.2026 (Frage muss weiterhin **«Kategorie»** heissen –
     das Programm findet die Spalte über die Überschrift): Musik & Kultur, Feste & Märkte, Sport & Natur, Kinder & Familie, Senioren,
     Begegnung, Kirche, Gemeinde & Politik, Vereinsleben, Vorträge & Weiteres. Hilfstext bleibt «Was macht man dort als Besucher?».
  2. **(neu, offen)** Gleich danach Programm in Apps Script erneuern (`anleitungen/programm-einrichten.md`, Teil A) – erst wenn die
     Webseite mit den zehn Themen auf main ist. Formular und Programm zusammen, sonst passen die Hinweise im Prüf-Mail nicht.
  3. ~~Tabelle: Einträge mit alten Gruppen auf Themen umstellen.~~ Nicht mehr nötig: Anlass-Prüfer 8.11. – alle Anlässe haben schon ein Thema.
  4. Gleich mit: Formular-Bestätigung «Bitte auch im Spam-Ordner nachsehen». (Test-Einträge und die zwei Vorstandssitzungen sind seit 8.11. gelöscht.)

## Noch offen
- **In der Hinterhand: Entsorgung** (Grüngut, Altmetall, Papiersammlung) könnte man theoretisch als eigenes Thema in den Kalender nehmen.
  Vorerst nicht (Projektleitung 9.11., bestätigt Entscheid 8.11.); Idee steht in KONZEPT.md (Ideenspeicher).
- **Hinweis:** Der alte Kalender (rehetobel-tourismus.ch) läuft weiter; der neue ersetzt ihn erst, wenn er so weit ist (siehe Vision im KONZEPT).
- **Vor dem Ersetzen des alten Kalenders:** kommende Anlässe aus dem alten Kalender übernehmen (iCal-Export vom Vorstand).
- **Anlässe 2027 eingetragen (8.11.):** 212 Anlässe (inkl. 12 auswärtige von Rehetobler Vereinen) aus der Liste der Koordinationssitzung direkt in die Tabelle (Freigegeben = ja,
  ohne Mailadressen → keine Mails). Tabelle ist dafür mit dem privaten Google-Konto der Projektleitung geteilt (Claude schreibt darüber).
  Zwei Konzerte 2028 als «vorgemerkt». Vorstandssitzungen gelöscht.
  **Offen** (Details in der privaten Vorstandsablage `kalender/anlaesse-2027/`): Veranstalter (klärt Projektleitung mit dem Vorstand),
  fehlende Zeiten und Orte, Anlässe ohne Datum. Nachträge macht Claude direkt in der Tabelle (geteilt mit dem privaten Konto).
- Google-Benachrichtigung «neue Antworten» behalten oder ausschalten (Prüf-Mail ersetzt sie).
- Einbindung in die ClubDesk-Webseite (Code in KONZEPT.md / README.md).
- Offene Fragen: Anlässe aus dem alten Kalender übernehmen?
