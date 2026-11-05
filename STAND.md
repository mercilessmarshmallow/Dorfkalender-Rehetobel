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

## Gebaut und getestet, noch nicht eingerichtet (Test: 45 Prüfungen bestanden)
- **Prüfseite `entscheid.html`** – Annehmen/Ablehnen mit einem Tipp, auch in der Gmail-App; Seite «Jahr freigeben».
- **Neue Programmfassung** `apps-script/Mails.gs`:
  - Knöpfe führen auf die Prüfseite; Ablehnen mit einem Tipp; Zeile «Bei Fragen …» entfernt.
  - Private Adresse über Skripteigenschaft `PRUEF_MAILS_AUCH_AN` statt im Programmtext.
  - **Jahresablauf:** Sortierung nach Datum (Nachmeldung / Planung / zu früh / vergangen), «vorgemerkt», Überschneidungen
    im Prüf-Mail, Planungskalender-Daten, «Jahr freigeben», Erinnerungsmails (Planungsliste, Freigabe), Menü in der Tabelle.
  - Startwert: freigegeben bis **2027** (Sitzung 4.11.2026 vorbei) → Meldungen für 2027 = Nachmeldungen, 2028 = Planung.
- **Webseite:** Planungskalender (`?planung=…`) mit «Liste zum Drucken» und Etikett «verschiebbar».
- → Einrichten: `anleitungen/programm-einrichten.md` (einmal am PC: Formularfrage ändern, Programm erneuern,
  Skripteigenschaft, neue Version, einmal «einrichten»).

## Noch offen
- **Anlässe 2027** aus der Koordinationssitzung vom 4.11.2026 eintragen (Liste von der Projektleitung nötig).

## Kleinigkeiten offen
- Test-Einträge in der Tabelle löschen (test, test 2, test 3, test 4).
- Bestätigungsnachricht im Formular: «Bitte auch im Spam-Ordner nachsehen.»
- Google-Benachrichtigung «neue Antworten» behalten oder ausschalten (Prüf-Mail ersetzt sie).
- Einbindung in die ClubDesk-Webseite (Code in KONZEPT.md / README.md).
- Offene Fragen: Themen-Kategorien zusätzlich zu Veranstalter-Gruppen? Anlässe aus dem alten Kalender übernehmen?
