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
- **Kategorien** als Knöpfe (Gemeinde, Vereine, Schule, Kirche, Gewerbe, Parteien, Kommissionen, Andere); auf dem Handy zugeklappt.
  «Verkehrsverein Rehetobel» und «Gemeinde Rehetobel» aus der Tabelle werden automatisch zu «Vereine» bzw. «Gemeinde».
- Monat und Terminplanung bleiben als Ansichten (Reiter unter der Suche). Planungskalender und `?einbetten=1` funktionieren weiter.
- **«Dorfkalender aufs Handy»** (7.11.): eigenes quadratisches Symbol (Kalenderblatt in VVR-Farben, Wahl B, `bilder/app/`), Name «Dorfkalender» (`manifest.webmanifest`),
  öffnet sich vom Startbildschirm ohne Adressleiste. Hinweis-Kasten mit Anleitung fürs iPhone bzw. Android; auf dem Computer und
  in der «App» selbst ausgeblendet. **Android: getestet ✓** (Symbol, Name, Design, «In meinen Kalender» aus der App, 7.11.). **Noch testen:** iPhone hinzufügen; in der «App» prüfen, ob
  «📅 In meinen Kalender» funktioniert (iPhone-Apps vom Startbildschirm laden Dateien manchmal nicht).
- Unten: «Dorfkalender aufs Handy» und «Den Verkehrsverein unterstützen und Mitglied werden» (Mail an info@rehetobel-tourismus.ch).
- **Logos (17, `js/logos.js` + `bilder/logos/`):** Verkehrsverein, Gemeinde, Kirche, Jugendmusik, MG Brass Band, Chor, Sportverein,
  Gewerbeverein, Samariter, Feuerwehr, Spielgruppe, Sonjolino, Ornithologen, Schwimmbad (selbst gezeichnetes Symbol), Solardorf,
  Lesegesellschaft (quer gedreht), FDP. Zuordnung über den Veranstalter-Namen (mehrere Schreibweisen pro Verein).
  - Logos bleiben so. Lesegesellschaft (gedreht): laut Projektleitung sicher okay. Schwimmbad (eigenes Symbol): fragt die Projektleitung vor dem offiziellen Start.
  - **Bessere Datei wäre gut:** Spielgruppe (Scan), Solardorf (sehr klein), Feuerwehr (klein), MG Brass Band und Kirche (Bildschirmfoto; Kirche hat SVG).
- **«Nur für Mitglieder» vorerst nicht** (Entscheid 7.11.): keine Formularfrage, kein Etikett sichtbar. Falls später doch:
  Spalte «Für wen» im Blatt «Kalender» einzeln anhängen (z. B. `FILTER({B:L\X:X}; …)`), **nie** B:P o. ä. (sonst Kontaktdaten öffentlich).
- **PC-Aufgabe (zuerst erklären):** Kategorie-Auswahl im Formular ohne «Verkehrsverein», neue Reihenfolge.
  Ideenspeicher: Veranstalter als Auswahlliste (für die Logos).
- **Später besprechen:** Was gehört überhaupt in den Dorfkalender (z. B. Proben, Übungen, Sitzungen)?

## Hier weitermachen (8.11.2026)
- **iPhone-Test «aufs Handy» läuft:** Webseite öffnet, «App herunterladen» geht nicht. Ursache noch NICHT geklärt –
  Frage an die Projektleitung offen: Wo bleibt sie stecken (Teilen-Knopf nicht gefunden / «Zum Home-Bildschirm» fehlt /
  kein Symbol)? Link in Safari geöffnet oder aus WhatsApp/Gmail? Nicht raten.
- **Vorschau Themen + «Meine Auswahl»** ist für den Vorstand online (…/vorschau/), Projektleitung schickt sie weiter.
  Live schalten erst nach Okay des Vorstands (Schritte siehe unten).
- Arbeitszweig `claude/pensive-thompson-br689r` enthält die neue Seite + Programm (nicht live); main = jetziger Kalender + vorschau/.

## Noch offen
- **Themen + «Meine Auswahl» + Warnungen im Prüf-Mail (8.11.): gebaut auf dem Arbeitszweig, NICHT live.**
  Vorschau für den Vorstand: https://mercilessmarshmallow.github.io/Dorfkalender-Rehetobel/vorschau/ (mit Beispiel-Prüf-Mail).
  Live schalten, wenn der Vorstand einverstanden ist – in einem Schritt: (1) Formular-Auswahl «Kategorie» auf die neun Themen,
  (2) Programm in Apps Script erneuern (Teil A der Anleitung), (3) Webseite auf main, (4) Vorschau-Ordner löschen.
  Bestehende Einträge in der Tabelle dann neu zuordnen (alte Gruppen werden teilweise übersetzt).
- **Hinweis:** Der alte Kalender (rehetobel-tourismus.ch) läuft weiter; der neue ersetzt ihn erst, wenn er so weit ist (siehe Vision im KONZEPT).
- **Vor dem Ersetzen des alten Kalenders:** kommende Anlässe aus dem alten Kalender übernehmen (iCal-Export vom Vorstand).
- **Anlässe 2027** aus der Koordinationssitzung vom 4.11.2026 eintragen – Test erfolgreich, Liste liegt beim Vorstand.

## Kleinigkeiten offen
- Test-Einträge in der Tabelle löschen (test, test 2, test 3, test 4, TEST A, TEST B, TEST C, Test D).
- Die zwei Vorstandssitzungen (3.11.2026, 17.02.2027) bleiben vorerst als Beispiel zum Zeigen; vor den echten Daten 2027 löschen
  (interne Sitzungen gehören nicht in den Dorfkalender).
- Bestätigungsnachricht im Formular: «Bitte auch im Spam-Ordner nachsehen.»
- Google-Benachrichtigung «neue Antworten» behalten oder ausschalten (Prüf-Mail ersetzt sie).
- Einbindung in die ClubDesk-Webseite (Code in KONZEPT.md / README.md).
- Offene Fragen: Anlässe aus dem alten Kalender übernehmen?
