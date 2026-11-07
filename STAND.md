# Stand Dorfkalender

Stand: 7.11.2026. Bei jedem Arbeitsbeginn lesen, am Ende nachführen.

## Läuft (eingerichtet am 6.11.2026, mit dem Handy getestet)
- Webseite mit Liste, Monat und Terminplanung; Planungskalender über `?planung=…`.
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

## Neues Design – Vorschau (7.11.2026, noch nicht gebaut)
Vorschau mit Beispiel-Anlässen in der Vorstandsablage (`ideen/originale/dorfkalender-vorschau/`), Entscheide siehe ENTSCHEIDE.md (7.11., Design).
- Titelbild je nach Jahreszeit, Handy quadratisch; Schrift auf der Seite ohne Kirche; kein Logo und kein Bildnachweis im Bild
  (Nachweis in der Fusszeile); Sommer: Kirchen- und Baum-Foto abwechselnd. Liste: 20 Anlässe, dann «Weitere anzeigen».
- Karten: Datum links, Farbe je Kategorie (Streifen + Etikett), Vereinslogo rechts (nur wenn vorhanden);
  Antippen öffnet Fenster mit «In meinen Kalender» und «Alle Anlässe von …». Kasten «Ein Angebot des Verkehrsvereins» mit «Mitglied werden» ganz unten.
- **Logos vorhanden (17):** Verkehrsverein, Jugendmusik, Sportverein, Gemeinde, Gewerbeverein, Samariterverein Rehetobel-Wald,
  Feuerwehr Wald Rehetobel, Reformierte Kirchgemeinde, Spielgruppe Rägeboge, MG Brass Band, FDP, Schwimmbad,
  Ornithologischer Verein, Chor Rehetobel, Kinderzirkus Sonjolino, Solardorf, Lesegesellschaft Dorf Rehetobel (quer gedreht, Original hoch – mit dem Verein klären). Alle anderen Vereine: (noch) kein Logo.
- **Bessere Logo-Datei wäre gut bei:** Spielgruppe (Scan), Solardorf (nur Webseiten-Band, sehr klein), Feuerwehr (sehr klein),
  MG Brass Band und Kirche (Bildschirmfoto; Kirche hat eine SVG-Datei), Schwimmbad (sehr breit → in der Vorschau ein selbst gezeichnetes Schwimmer-Symbol in seinen Farben; vor dem Einsatz mit dem Schwimmbad absprechen).
- Sommer: Kirchen- und Baum-Foto wechseln täglich ab (Entscheid 7.11.).
- Gestaltung unabhängig geprüft (7.11.) und verbessert: Etiketten-Kontrast (Schule, Andere, Parteien waren zu hell), grössere Kleinschriften,
  Logo oben rechts in der Karte (Karten kürzer), Kategorie-Knöpfe umbrechend, Kirche beim Baum-Foto auch am Laptop frei.
  Grüne Zweitknöpfe bewusst behalten (Farbe aus dem VVR-Logo).
- **Offen:** Wohin führt «Mitglied werden»? (heute ClubDesk-Startseite)
- **Beim Umsetzen nicht vergessen:** Formular-Auswahl «Kategorie» ohne «Verkehrsverein», neue Reihenfolge; bestehende Einträge anpassen.
- Hinweis: Logo wird über den Veranstalter-Namen zugeordnet → Veranstalter im Formular als Auswahlliste (Ideenspeicher).

## Noch offen
- **Hinweis:** Der alte Kalender (rehetobel-tourismus.ch) läuft weiter; der neue ersetzt ihn erst, wenn er so weit ist (siehe Vision im KONZEPT).
- **Vor dem Ersetzen des alten Kalenders:** kommende Anlässe aus dem alten Kalender übernehmen (iCal-Export vom Vorstand).
- **Nächste Verbesserungen (entschieden 7.11., zuerst erklären, dann bauen):** «Für alle offen» / «Nur für Mitglieder» mit Häkchen,
  Liste kürzen (20 Anlässe + «Weitere anzeigen»), neues Design wie in der Vorschau (siehe oben).
- **Anlässe 2027** aus der Koordinationssitzung vom 4.11.2026 eintragen – Test erfolgreich, Liste liegt beim Vorstand.

## Kleinigkeiten offen
- Test-Einträge in der Tabelle löschen (test, test 2, test 3, test 4, TEST A, TEST B, TEST C, Test D).
- Die zwei Vorstandssitzungen (3.11.2026, 17.02.2027) bleiben vorerst als Beispiel zum Zeigen; vor den echten Daten 2027 löschen
  (interne Sitzungen gehören nicht in den Dorfkalender).
- Bestätigungsnachricht im Formular: «Bitte auch im Spam-Ordner nachsehen.»
- Google-Benachrichtigung «neue Antworten» behalten oder ausschalten (Prüf-Mail ersetzt sie).
- Einbindung in die ClubDesk-Webseite (Code in KONZEPT.md / README.md).
- Offene Fragen: Anlässe aus dem alten Kalender übernehmen?
