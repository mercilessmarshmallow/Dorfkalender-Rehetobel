# Stand Dorfkalender

Stand: 7.11.2026. Bei jedem Arbeitsbeginn lesen, am Ende nachführen.

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

## Neues Design (gebaut am 7.11.2026)
Vorschau dazu in der Vorstandsablage (`ideen/originale/dorfkalender-vorschau/`), Entscheide siehe ENTSCHEIDE.md (7.11., Design).
- **Titelbild je nach Jahreszeit** (`js/titelbild.js`, Bilder in `bilder/titel/`, Handy quadratisch): Frühling (2), Sommer (2), Herbst (1),
  Winter (3), täglich abwechselnd. Schrift immer auf der Seite ohne Kirche/Hauptmotiv. Kein Logo und kein Bildnachweis im Bild,
  Nachweis in der Fusszeile «Fotos: Appenzellerland Tourismus, Verkehrsverein Rehetobel» (ohne Namen).
- **Liste:** «Diese Woche im Dorf», «Nächste Woche», dann Monate; 20 Anlässe, dann «Weitere anzeigen» (beim Suchen alle).
  Karten: Datum links («Heute» grün), Farbstreifen + Etikett je Kategorie, Vereinslogo oben rechts (nur wenn vorhanden),
  Etikett «Nur für Mitglieder». Antippen → Fenster mit «📅 In meinen Kalender» und «Alle Anlässe von …».
- **Kategorien** als Knöpfe (Gemeinde, Vereine, Schule, Kirche, Gewerbe, Parteien, Kommissionen, Andere); auf dem Handy zugeklappt.
  «Verkehrsverein Rehetobel» und «Gemeinde Rehetobel» aus der Tabelle werden automatisch zu «Vereine» bzw. «Gemeinde».
- Monat und Terminplanung bleiben als Ansichten (Reiter unter der Suche). Planungskalender und `?einbetten=1` funktionieren weiter.
- Unten: «Dorfkalender aufs Handy» und «Den Verkehrsverein unterstützen und Mitglied werden» (Mail an info@rehetobel-tourismus.ch).
- **Logos (17, `js/logos.js` + `bilder/logos/`):** Verkehrsverein, Gemeinde, Kirche, Jugendmusik, MG Brass Band, Chor, Sportverein,
  Gewerbeverein, Samariter, Feuerwehr, Spielgruppe, Sonjolino, Ornithologen, Schwimmbad (selbst gezeichnetes Symbol), Solardorf,
  Lesegesellschaft (quer gedreht), FDP. Zuordnung über den Veranstalter-Namen (mehrere Schreibweisen pro Verein).
  - **Mit den Vereinen klären:** Schwimmbad (eigenes Symbol ok?), Lesegesellschaft (gedreht ok?).
  - **Bessere Datei wäre gut:** Spielgruppe (Scan), Solardorf (sehr klein), Feuerwehr (klein), MG Brass Band und Kirche (Bildschirmfoto; Kirche hat SVG).
- **Noch nicht im Formular (PC-Aufgabe, zuerst erklären):** Frage «Für wen ist der Anlass? Für alle offen / Nur für Mitglieder»
  und die passende Spalte «Für wen» im Blatt «Kalender». Bis dahin gelten alle Anlässe als «für alle offen».
  Bei der Gelegenheit: Kategorie-Auswahl ohne «Verkehrsverein», neue Reihenfolge. Ideenspeicher: Veranstalter als Auswahlliste (für die Logos).
- **Später besprechen:** Was gehört überhaupt in den Dorfkalender (z. B. Proben, Übungen, Sitzungen)?

## Noch offen
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
