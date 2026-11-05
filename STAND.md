# Stand Dorfkalender

Stand: 5.11.2026. Bei jedem Arbeitsbeginn lesen, am Ende nachführen.

## Läuft
- Webseite mit Liste, Monat und Terminplanung; liest die freigegebenen Anlässe aus der Google-Tabelle.
- Formular «Anlass melden» mit Name der Kontaktperson und E-Mail.
- Programm (alte Fassung, eingerichtet am 4./5.11.2026):
  - Eingangsbestätigung an den Verein ✓
  - Prüf-Mail an Vereins-Gmail und Projektleitung ✓
  - Datum in der Vergangenheit → automatische Absage ✓
  - Mails kommen von verkehrsverein.rehetobel@gmail.com, auch an strenge Mailsysteme (dort anfangs im Spam) ✓
  - **Einschränkung:** Die Knöpfe «Annehmen»/«Ablehnen» funktionieren nur ohne Google-Anmeldung
    (am PC: Rechtsklick → «Link in InPrivate-Fenster öffnen»), **nicht in der Gmail-App**.

## Gebaut und getestet, noch nicht eingerichtet
- **Prüfseite `entscheid.html`** – online. Annehmen/Ablehnen mit einem Tipp, auch in der Gmail-App.
- **Neue Programmfassung** `apps-script/Mails.gs`: Knöpfe führen auf die Prüfseite; Ablehnen mit einem Tipp;
  Zeile «Bei Fragen …» entfernt; private Adresse über Skripteigenschaft `PRUEF_MAILS_AUCH_AN`.
  → Einrichten nach `anleitungen/programm-einrichten.md` (am PC, einmalig).

## Geplant (siehe KONZEPT.md)
1. Jahresablauf: ein Formular, Programm sortiert nach Datum; Vormerken fürs nächste Jahr; **Planungskalender** (eigener Link) für die Vereine; «Jahr freigeben» mit einem Befehl.
2. Formularfrage «Kann das Datum verschoben werden?» statt «Status».
3. Prüf-Mail zeigt, was am gleichen Tag schon eingetragen ist.
4. Planungsliste zum Ausdrucken; «Jahr freigeben» als Knopf im Mail und im Menü der Tabelle.
5. Anlässe 2027 aus der Koordinationssitzung vom 4.11.2026 eintragen (Liste von der Projektleitung nötig).

Sinnvolle Reihenfolge: 1–4 zusammen bauen und testen, dann **einmal** einrichten (zusammen mit der neuen
Programmfassung oben), damit die Projektleitung nur einmal etwas am PC tun muss.

## Kleinigkeiten offen
- Test-Einträge in der Tabelle löschen (test, test 2, test 3, test 4).
- Bestätigungsnachricht im Formular: «Bitte auch im Spam-Ordner nachsehen.»
- Google-Benachrichtigung «neue Antworten» behalten oder ausschalten (Prüf-Mail ersetzt sie).
- Einbindung in die ClubDesk-Webseite (Code in KONZEPT.md / README.md).
- Offene Fragen: Themen-Kategorien zusätzlich zu Veranstalter-Gruppen? Anlässe aus dem alten Kalender übernehmen?
