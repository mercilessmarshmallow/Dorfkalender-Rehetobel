# Entscheide Dorfkalender

Neueste zuoberst. Jeder Entscheid mit Datum und kurzer Begründung. Wird ein Entscheid geändert,
den alten nicht löschen, sondern als «ersetzt durch …» markieren.

## 5.11.2026 (Abend)
- **Ein Kalender, ein Formular:** Das Programm sortiert nach dem Datum (Nachmeldung / Planungsmeldung / zu weit weg).
  Grund: ein Link für die Vereine, nichts von Hand umkopieren. (Alternative «zwei getrennte Kalender» verworfen.)
- **Planungskalender für die planenden Vereine:** Vorgemerkte Anlässe des nächsten Jahres sind über einen eigenen Link
  für die Vereine sichtbar, für die Öffentlichkeit nicht. **Ersetzt** den Punkt «niemand sieht vorher etwas» vom Nachmittag.
  Grund: Wer plant, soll sehen, was schon eingetragen ist.
- **Zeitfenster:** Bis zur Freigabe nur Anlässe bis 31.12. dieses Jahres öffentlich; nach der Freigabe das ganze nächste Jahr.
- **Nächstes Jahr freigeben mit einem einzigen Befehl.**
- **«Verschiebbar ja/nein»** dient der Projektleitung, um zu wissen, wen sie bei Überschneidungen kontaktiert.
- **Koordinationssitzung bleibt:** Kompromisse findet man nur im Gespräch.

## 5.11.2026
- **Jahresablauf mit Koordinationssitzung** (siehe KONZEPT.md): Anlässe fürs nächste Jahr werden vorgemerkt und
  sind bis zur Freigabe nach der Sitzung nicht öffentlich. Grund: An der Sitzung wird gemeinsam verhandelt, nicht «wer zuerst kommt».
  *(Teilweise ersetzt am Abend: Die planenden Vereine sehen die Einträge im Planungskalender.)*
- **Neue Formularfrage «Kann das Datum verschoben werden?»** statt «Status fix/provisorisch». Grund: Ob ein Anlass
  provisorisch oder definitiv ist, entscheidet der VVR; der Verein sagt nur, ob er flexibel ist.
- **Planungsliste zum Ausdrucken** für die Sitzung (nicht am Bildschirm). Grund: Jeder soll mitstreichen und mitdenken können.
- **Öffentliche VVR-Anlässe** (z. B. HV) kommen in den Kalender, **interne Sitzungen nicht**.
- **Ein Ort für alles:** Alles zum Dorfkalender liegt in dieser (öffentlichen) Ablage, ohne Personendaten.
  Die frühere Kopie in der Vorstandsablage des VVR wurde aufgelöst. Grund: zwei Kopien führten zu Durcheinander.
- **Annehmen/Ablehnen über die Prüfseite** `entscheid.html` statt direkt über Google. Grund: Google blockiert seine
  Web-App, wenn man mit einem Google-Konto angemeldet ist (immer der Fall in der Gmail-App). Die Prüfseite fragt Google ohne Anmeldung.
- **Ablehnen mit einem Tipp**, ohne Begründungsfeld. Grund: Alles soll mit einem Tipp gehen.
- **Zeile «Bei Fragen schreiben Sie an …» entfernt.** Im Mail «angenommen» bleibt der Satz «Ändert sich etwas … schreiben Sie an verkehrsverein.rehetobel@gmail.com».
- **Prüf-Mails an Vereins-Gmail und Projektleitung**; private Adresse nur in der Skripteigenschaft `PRUEF_MAILS_AUCH_AN`.
  Grund: Die Weiterleitung im neuen Gmail-Konto liess sich nicht bestätigen; private Adressen gehören nicht in den öffentlichen Programmtext.
- **Eigenes Gmail für den Kalender:** Das Google-Konto des Vereins heisst jetzt verkehrsverein.rehetobel@gmail.com
  und ist ganz von info@ getrennt (auch Wiederherstellung). Grund: Mails «im Namen» von info@ (Anbieter green.ch)
  wurden von strengen Mailsystemen (z. B. Stadt St. Gallen) blockiert.

## 4.11.2026
- **Automatische Mails an die Vereine:** Eingangsbestätigung, «angenommen», «abgelehnt». Mit Hinweis
  «automatisch verschickt, bitte nicht antworten».
- **Prüf-Mail mit Knöpfen** «Annehmen»/«Ablehnen», damit niemand mehr in der Tabelle «ja» schreiben muss
  (geht aber weiterhin).
- **Datum in der Vergangenheit → automatisch abgelehnt** (mit Link zum Neu-Melden). Grund: Google-Formulare
  können vergangene Daten nicht sperren; meist ist es ein Tippfehler beim Jahr.
- **Formular:** «Name der Kontaktperson» und «E-Mail» (Pflicht, geprüft); keine Telefonnummer.

## 3.11.2026
- **Die Vereine tragen ihre Anlässe selbst ein**, der VVR gibt sie frei.
- **Nur Anlässe in Rehetobel.** Regionale Anlässe gehören zu Appenzellerland Tourismus.
- **Google-Konto des Vereins** für Formular und Tabelle (nicht ein privates Konto), damit die Übergabe bei einem Wechsel im Vorstand einfach ist.
- **Online über GitHub Pages**, eingebunden in die Vereinswebseite (ClubDesk) als iframe.

## 2.11.2026
- **Aufbau:** Eingabe über Google-Formular, Speicher in Google-Tabelle mit Freigabe, Anzeige über eigene Kalenderseite.
- **Vereinswebseite bleibt bei ClubDesk.** Der ClubDesk-Kalender passt nur für einen Verein, nicht für ein ganzes Dorf.
- **Kategorien** = Veranstalter-Gruppen des alten Kalenders: Gemeinde, Kirche, Schule, Vereine, Gewerbe, Parteien, Kommissionen, Verkehrsverein, Andere.
