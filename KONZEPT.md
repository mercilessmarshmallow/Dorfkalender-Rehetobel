# Konzept Dorfkalender Rehetobel

Der Dorfkalender zeigt **alle öffentlichen Anlässe in Rehetobel** an einem Ort. Er wird vom
Verkehrsverein Rehetobel (VVR) betrieben, der seit Jahren die Termine der Dorfvereine koordiniert.

Zeichen: ✅ läuft · 🔧 gebaut, noch nicht eingerichtet · 📋 geplant

## Was in den Kalender gehört
- Öffentliche Anlässe **in Rehetobel**: Vereine, Gemeinde, Kirche, Schule, Gewerbe, Parteien, Kommissionen.
- Auch öffentliche Anlässe des VVR selbst, z. B. die **Hauptversammlung** (viele Dorfbewohner kommen).
- **Nicht** hinein: interne Sitzungen (z. B. Vorstandssitzungen) und Anlässe ausserhalb von Rehetobel
  (die gehören zu Appenzellerland Tourismus).

## Die Bausteine
| Baustein | Wo | Wozu |
|---|---|---|
| Webseite | https://mercilessmarshmallow.github.io/Dorfkalender-Rehetobel/ (diese Ablage, GitHub Pages) | Kalender für alle: Liste, Monat, Terminplanung. Eingebettet in ClubDesk mit `?einbetten=1`. ✅ |
| Formular «Anlass melden» | Google-Konto des Vereins | Vereine melden ihre Anlässe. ✅ |
| Tabelle «Dorfkalender Rehetobel» | Google-Konto des Vereins | Alle Meldungen. Das Blatt «Kalender» enthält nur freigegebene Anlässe ohne Kontaktdaten und ist als CSV veröffentlicht. ✅ |
| Programm «Dorfkalender Mails» | Apps Script in der Tabelle, Quelltext in `apps-script/Mails.gs` | Mails an Vereine und Prüf-Mails, Annehmen/Ablehnen. ✅ / 🔧 |
| Prüfseite | `entscheid.html` auf der Webseite | Annehmen/Ablehnen mit einem Tipp, auch in der Gmail-App. 🔧 |
| Jahresbüchli | Papier, in jeden Haushalt | Jahresprogramm nach der Koordinationssitzung, besonders für ältere Personen. |

Google-Konto des Vereins: **verkehrsverein.rehetobel@gmail.com** – unabhängig von der Vereinsadresse info@.

## Der Jahresablauf

### 1. Bis zur Koordinationssitzung: Anlässe fürs nächste Jahr sammeln 📋
- Die Vereine melden **alle** Anlässe fürs nächste Jahr übers Formular und geben an,
  ob das Datum **verschiebbar** ist (z. B. Turnfest mit festem Datum = nein, Dorffest = ja).
- Die Meldungen sind **nicht öffentlich** – niemand sieht vorher, wer was eingetragen hat.
  Es gilt nicht «wer zuerst kommt», sondern es wird an der Sitzung gemeinsam abgemacht.
- Die Projektleitung bekommt ein Prüf-Mail und tippt «Annehmen» = **vorgemerkt** (offensichtlicher Unsinn: «Ablehnen»).
- Der Verein bekommt: «Ihr Anlass ist für die Koordinationssitzung vorgemerkt. Das Datum wird dort festgelegt.»

### 2. Koordinationssitzung (jeweils erster Mittwoch im November) 📋
- Vorher wird die **Planungsliste** ausgedruckt: Monat für Monat alle vorgemerkten Anlässe,
  **Überschneidungen am gleichen Tag markiert**, mit «verschiebbar ja/nein». Jeder bekommt ein Exemplar zum Mitstreichen.
  Erstellt mit einem Klick in der Tabelle (Menü «Dorfkalender» → «Planungsliste erstellen»).
- Man geht Monat für Monat durch und bespricht nur die Überschneidungen. Vereine passen ihre Daten an.

### 3. Nach der Sitzung: Jahr freigeben 📋
- Geänderte Daten werden in der Tabelle angepasst.
- Menü «Dorfkalender» → «Jahr freigeben»: alle Anlässe des Jahres werden öffentlich.
- Grundlage fürs **Jahresbüchli**. Die Daten sind damit fix.

### 4. Unter dem Jahr: spontane Anlässe nachmelden ✅ / 📋
- Für Anlässe in einem bereits freigegebenen Jahr (z. B. ein Konzert in zwei Wochen).
- Prüf-Mail mit allen Angaben und dem Hinweis, was am gleichen Tag schon läuft (📋), dann **ein Tipp**:
  «Annehmen» → sofort öffentlich, «Ablehnen» → Absage an den Verein.

Das Programm erkennt am Jahr des Anlasses selbst, ob es eine Meldung für die Jahresplanung (1) oder eine Nachmeldung (4) ist. 📋

## Die Mails
| Mail | Von | An | Wann |
|---|---|---|---|
| Eingangsbestätigung | verkehrsverein.rehetobel@gmail.com | meldender Verein | sofort nach der Meldung ✅ |
| Prüf-Mail mit «Annehmen»/«Ablehnen» | verkehrsverein.rehetobel@gmail.com | Vereins-Gmail + Projektleitung | sofort nach der Meldung ✅ |
| «angenommen» / «abgelehnt» | verkehrsverein.rehetobel@gmail.com | meldender Verein | nach dem Tipp ✅ |
| automatische Absage | verkehrsverein.rehetobel@gmail.com | meldender Verein | Datum liegt in der Vergangenheit ✅ |

- Unter jedem Mail an die Vereine: «Dies ist eine automatisch verschickte Nachricht. Bitte nicht auf dieses Mail antworten.»
- Antworten gehen ans Vereins-Gmail. **Private Adressen der Projektleitung sehen die Vereine nie**;
  sie stehen nur in einer Einstellung von Apps Script (Skripteigenschaft `PRUEF_MAILS_AUCH_AN`), nie im Programmtext.
- Ein neuer Absender landet bei strengen Mailsystemen (z. B. Schulen) anfangs im Spam →
  Hinweis in der Bestätigungsnachricht des Formulars: «Bitte auch im Spam-Ordner nachsehen.» 📋

## Das Formular
Titel · Datum · Bis · Zeit (Beginn) · Zeit (Ende) · Ort · Veranstalter · Kategorie · Beschreibung · Link ·
**Kann das Datum verschoben werden? (Ja/Nein)** 📋 (ersetzt «Status fix/provisorisch») · Name der Kontaktperson · E-Mail (Pflicht).
Kontaktname und E-Mail erscheinen nie im öffentlichen Kalender.

## Grundsätze
- **Einfach für die Projektleitung:** alles Wichtige mit einem Tipp in der Gmail-App, ohne Computer.
- **Ein Ort für alles:** diese Ablage. Keine zweite Kopie anderswo.
- **Öffentlich, aber ohne Personendaten:** keine privaten Mailadressen, Telefonnummern oder Namen von Kontaktpersonen in dieser Ablage.
- **Erst erklären, dann umsetzen:** Bevor die Projektleitung etwas tun muss, wird die ganze Lösung erklärt.
