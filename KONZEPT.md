# Konzept Dorfkalender Rehetobel

Der Dorfkalender zeigt **alle öffentlichen Anlässe in Rehetobel** an einem Ort. Er wird vom
Verkehrsverein Rehetobel (VVR) betrieben, der seit Jahren die Termine der Dorfvereine koordiniert.

Zeichen: ✅ läuft · 🔧 gebaut, noch nicht eingerichtet · 📋 geplant

## Vision: der optimale Dorfkalender (Projektleitung, 7.11.2026)
**Ziel: Der Kalender soll dazu beitragen, dass mehr Leute an die Anlässe im Dorf gehen.**
Heute läuft noch der alte Kalender (rehetobel-tourismus.ch). Der neue wird erst eingesetzt, wenn er so weit ist.
Problem heute: unattraktiv, nicht auf der Gemeinde-Webseite, zu viele uninteressante Termine (z. B. jede Übung, jede Woche Kirche).

| Baustein | Idee | Machbarkeit |
|---|---|---|
| Zwei Arten | **«Für alle offen»** und **«Nur für Mitglieder»**: alle erscheinen, «Nur für Mitglieder» als Etikett (kein Häkchen). Keine «Highlights» (Entscheide 7.11.) | Webseite ✅, Formularfrage 📋 |
| Regelmässiges | wöchentliche Anlässe (z. B. Gottesdienst) zusammenfassen statt jede Woche einzeln | gut 📋 |
| Bilder | **Vereinslogos**: Vereine schicken ihr Logo, es erscheint automatisch bei ihren Anlässen (Liste in `js/logos.js`); sonst einfach keines. Kein Hochladen im Formular (bräuchte Google-Konto) | ✅ (17 Logos) |
| «App» | Kalender als App auf den Startbildschirm (ohne App Store, gratis) | gut 📋 |
| In meinen Kalender | Knopf «In meinen Kalender» im Fenster beim Antippen → Anlass im eigenen Handy-Kalender; Erinnerung stellt jede Person selbst ein (Entscheid 7.11.) | ✅ |
| Benachrichtigungen | direkt aus der «App» | aufwändig, später |
| Reichweite | **Gemeinde-Webseite (Zusage der Gemeinde)**, QR-Plakate, «Was läuft diese Woche» (Text für WhatsApp-Kanal/Gmäändsblatt), Jahresbüchli | gut 📋 |
| Design | Foto von Rehetobel je Jahreszeit, Farben pro Kategorie, gut lesbar für Ältere | ✅ (7.11.2026) |

**Grundsatz: Übersichtlich suchen geht vor schönem Aussehen** (Projektleitung, 7.11.2026). Suchen nur mit drei Dingen:
1. ein Suchfeld (sucht in Titel, Verein, Ort – «Samariter» findet alle Samariter-Anlässe),
2. eine Reihe grosser Kategorie-Knöpfe (Vereine, Kirche, Schule, Gemeinde, Gewerbe …),
3. ein Häkchen «Auch Anlässe nur für Mitglieder zeigen».
Keine zusätzliche Vereinsliste beim Suchen; Tipp auf Logo/Vereinsnamen zeigt alle Anlässe dieses Vereins.
Die Vereins-Auswahlliste im **Formular** sorgt nur für gleich geschriebene Namen (bessere Suche, Logo automatisch).

Nächster Schritt (Vorschlag): eine **Vorschau** des optimalen Kalenders zum Anschauen und Diskutieren (auch für den Vorstand),
ohne das laufende System zu ändern.

## Was in den Kalender gehört
- Anlässe **in Rehetobel**: Vereine, Gemeinde, Kirche, Schule, Gewerbe, Parteien, Kommissionen. Ausnahme: Haus zur Stickerei (Heiden).
- **«Für alle offen»** erscheint standardmässig; **«Nur für Mitglieder»** (z. B. Übungen, Proben, Sitzungen) nur mit dem
  Häkchen «Auch Anlässe nur für Mitglieder zeigen». 📋
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
| Prüfseite | `entscheid.html` auf der Webseite | Annehmen/Ablehnen mit einem Tipp, auch in der Gmail-App; Jahr freigeben. 🔧 |
| Planungskalender | Webseite mit `?planung=…` (Link kommt mit den Mails) | Vorgemerkte Anlässe des nächsten Jahres für die Vereine; «Liste zum Drucken». 🔧 |
| Jahresbüchli | Papier, in jeden Haushalt | Jahresprogramm nach der Koordinationssitzung, besonders für ältere Personen. |

Google-Konto des Vereins: **verkehrsverein.rehetobel@gmail.com** – unabhängig von der Vereinsadresse info@.

## Der Jahresablauf

### Grundidee: ein Kalender, ein Formular – das Programm sortiert nach dem Datum 🔧
Die Vereine haben **einen** Link zum Formular. Das Programm entscheidet anhand des Datums, was mit der Meldung passiert:

| Datum des Anlasses | Art | Nach «Annehmen» |
|---|---|---|
| dieses Jahr (oder ein bereits freigegebenes Jahr) | **Nachmeldung** | sofort **öffentlich** im Dorfkalender |
| nächstes Jahr, das noch **nicht freigegeben** ist | **Planungsmeldung** | **vorgemerkt**: nur im **Planungskalender** sichtbar, nicht öffentlich |
| noch weiter weg (z. B. übernächstes Jahr) | – | automatische Absage mit Hinweis, ab wann es möglich ist |
| in der Vergangenheit | – | automatische Absage (läuft schon ✅) |

Damit gilt automatisch: **Bis zur Freigabe** nimmt der öffentliche Kalender nur Anlässe **bis 31.12. dieses Jahres** auf;
**nach der Freigabe** ist das **ganze nächste Jahr** offen für Nachmeldungen.

### 1. Planung fürs nächste Jahr (bis zur Koordinationssitzung) 🔧
- Die Vereine melden ihre Anlässe fürs nächste Jahr übers gleiche Formular und geben an, ob das Datum
  **verschiebbar** ist (z. B. Turnfest mit festem Datum = nein, Dorffest = ja). Diese Angabe ist für die Projektleitung:
  Sie zeigt, **wen man bei einer Überschneidung kontaktieren** kann. Nach der Freigabe spielt sie keine Rolle mehr.
- Die Projektleitung tippt im Prüf-Mail «Annehmen» = **vorgemerkt** (Unsinn: «Ablehnen»).
- Der Verein bekommt: «Ihr Anlass ist für die Jahresplanung vorgemerkt. Das Datum wird an der Koordinationssitzung festgelegt.»
- **Planungskalender:** sieht aus wie der Dorfkalender, zeigt aber die **vorgemerkten Anlässe des nächsten Jahres**
  (mit «verschiebbar ja/nein»). Erreichbar nur über einen **eigenen Link**, den die planenden Vereine bekommen –
  so sehen sie beim Planen schon, was andere eingetragen haben. Die Öffentlichkeit sieht nichts davon.
  (Wer den Link hat, kann hineinschauen – für provisorische Termine von Dorfanlässen genügt das; ein Login pro Verein wäre viel aufwändiger.)

### 2. Koordinationssitzung (jeweils erster Mittwoch im November) 🔧
- Die Sitzung bleibt **das Herzstück**: Nur im Gespräch findet man **Kompromisse** («das ist wichtiger, könnt ihr verschieben?»).
- **Eine Woche vorher** kommt automatisch ein Mail mit dem Link zur **Planungsliste** zum Ausdrucken: Monat für Monat alle
  vorgemerkten Anlässe, **Überschneidungen am gleichen Tag rot markiert**, mit «verschiebbar ja/nein». Jeder bekommt ein Exemplar zum Mitstreichen.
  (Auch jederzeit über den Planungskalender → «Liste zum Drucken».)
- Man geht Monat für Monat durch und bespricht die Überschneidungen. Vereine passen ihre Daten an.

### 3. Nach der Sitzung: nächstes Jahr freigeben – ein Befehl 🔧
- Geänderte Daten werden in der Tabelle angepasst (Projektleitung oder Claude).
- Dann **ein Befehl** «Jahr freigeben»: Alle vorgemerkten Anlässe des Jahres werden **öffentlich**, und ab sofort
  gehen Meldungen fürs ganze Jahr als Nachmeldungen direkt in den öffentlichen Kalender. Nichts muss umkopiert werden.
- Am **Tag nach der Sitzung** kommt automatisch ein Mail mit dem Knopf **«[Jahr] freigeben»**. Antippen → Seite zeigt, wie viele
  Anlässe öffentlich werden → **«jetzt freigeben»**. Das Mail kann man liegen lassen, bis die Daten bereinigt sind.
  Zusätzlich im Menü der Tabelle: «Dorfkalender» → «Nächstes Jahr freigeben …».
- Danach: Grundlage fürs **Jahresbüchli**. Die Daten sind fix.

### 4. Unter dem Jahr: spontane Anlässe nachmelden ✅ / 🔧
- Z. B. ein Konzert in zwei Wochen: übers Formular melden, damit es im Kalender steht und Werbung macht.
- Prüf-Mail mit allen Angaben und dem Hinweis, was am gleichen Tag schon läuft (🔧), dann **ein Tipp**:
  «Annehmen» → sofort öffentlich, «Ablehnen» → Absage an den Verein.

## Die Mails
| Mail | Von | An | Wann |
|---|---|---|---|
| Eingangsbestätigung | verkehrsverein.rehetobel@gmail.com | meldender Verein | sofort nach der Meldung ✅ |
| Prüf-Mail mit «Annehmen»/«Ablehnen», Art der Meldung, Überschneidungen | verkehrsverein.rehetobel@gmail.com | Vereins-Gmail + Projektleitung | sofort nach der Meldung ✅ / 🔧 |
| «vorgemerkt» mit Link zum Planungskalender | verkehrsverein.rehetobel@gmail.com | meldender Verein | nach «Annehmen» einer Planungsmeldung 🔧 |
| automatische Absage «noch zu früh» | verkehrsverein.rehetobel@gmail.com | meldender Verein | Datum zu weit in der Zukunft 🔧 |
| Planungsliste / «Jahr freigeben» | verkehrsverein.rehetobel@gmail.com | Vereins-Gmail + Projektleitung | eine Woche vor / am Tag nach der Sitzung 🔧 |
| «angenommen» / «abgelehnt» | verkehrsverein.rehetobel@gmail.com | meldender Verein | nach dem Tipp ✅ |
| automatische Absage | verkehrsverein.rehetobel@gmail.com | meldender Verein | Datum liegt in der Vergangenheit ✅ |

- Unter jedem Mail an die Vereine: «Dies ist eine automatisch verschickte Nachricht. Bitte nicht auf dieses Mail antworten.»
- Antworten gehen ans Vereins-Gmail. **Private Adressen der Projektleitung sehen die Vereine nie**;
  sie stehen nur in einer Einstellung von Apps Script (Skripteigenschaft `PRUEF_MAILS_AUCH_AN`), nie im Programmtext.
- Ein neuer Absender landet bei strengen Mailsystemen (z. B. Schulen) anfangs im Spam →
  Hinweis in der Bestätigungsnachricht des Formulars: «Bitte auch im Spam-Ordner nachsehen.» 📋

## Das Formular
Titel · Datum · Bis · Zeit (Beginn) · Zeit (Ende) · Ort · Veranstalter · Kategorie · Beschreibung · Link ·
**Kann das Datum verschoben werden? (Ja/Nein)** 📋 (ersetzt «Status fix/provisorisch»; nur wichtig für Planungsmeldungen) · Name der Kontaktperson · E-Mail (Pflicht).
Kontaktname und E-Mail erscheinen nie im öffentlichen Kalender.

## Ideenspeicher (6.11.2026, noch nicht entschieden) 📋
- **Eigene Adresse statt «mercilessmarshmallow»:** Ablage in eine GitHub-Organisation des Vereins (gehört dem Vereins-Gmail)
  umziehen und Adresse **kalender.rehetobel-tourismus.ch** (DNS-Eintrag bei green.ch). Löst auch die Übergabe.
  Die Domain rehetobel-tourismus.ch gehört dem VVR (green.ch, Logins beim Vorstand) – geklärt 6.11.2026.
  Hängt mit dem Entscheid zur Vereinswebseite zusammen (Vorstand, 17.2.2027).
- **Kalender abonnieren:** alle Dorfanlässe automatisch im eigenen Handy-Kalender (ICS-Abo). ⭐
- **Jahresbüchli automatisch:** nach der Freigabe druckfertige Vorlage mit allen Anlässen des Jahres. ⭐
- Aussehen: Foto von Rehetobel im Kopf, Farben pro Kategorie, grössere Schrift für Ältere.
- «Diese Woche im Dorf» oben auf der Seite; Teilen per WhatsApp; QR-Code-Plakat für Anschlagbrett und Prospektständer.
- Übersicht für den VVR: welche Vereine noch nichts gemeldet haben.
- **Liste kürzen** (entschieden 7.11.): zuerst diese und nächste Woche (ca. 20 Anlässe), dann «Weitere anzeigen». 📋
- **Für alle offen / Nur für Mitglieder** (entschieden 7.11.): Formularfrage, Häkchen im Kalender, Etikett «nur für Mitglieder». 📋
- **Vereinslogos:** Ordner `bilder/vereine/`, Zuordnung Veranstalter → Logo. Tipp: «Veranstalter» im Formular als Auswahlliste der Vereine,
  damit die Namen immer gleich geschrieben sind (sonst klappt die automatische Zuordnung nicht). 📋
- **Kasten «Nächste Anlässe»** für die Startseite der Vereinswebseite (wie die Spalte rechts im alten Kalender), mit Link «alle Veranstaltungen». 📋
- **Anlässe aus dem alten Kalender übernehmen:** alle kommenden Anlässe als iCal-Datei aus dem alten Kalender exportieren
  (Vorstand) → Claude liest sie ein. Nötig vor der Umstellung, sonst fehlen Nov./Dez. 2026. 📋
- **Übergabe-Anleitung** (wenn die Projektleitung wechselt): Google-Konto (Passwort, Wiederherstellung, Telefon, Passkey),
  GitHub-Ablage, Skripteigenschaft `PRUEF_MAILS_AUCH_AN`. Wird angelegt, sobald die GitHub-Frage entschieden ist.

## Grundsätze
- **Einfach für die Projektleitung:** alles Wichtige mit einem Tipp in der Gmail-App, ohne Computer.
- **Ein Ort für alles:** diese Ablage. Keine zweite Kopie anderswo.
- **Öffentlich, aber ohne Personendaten:** keine privaten Mailadressen, Telefonnummern oder Namen von Kontaktpersonen in dieser Ablage.
- **Erst erklären, dann umsetzen:** Bevor die Projektleitung etwas tun muss, wird die ganze Lösung erklärt.
