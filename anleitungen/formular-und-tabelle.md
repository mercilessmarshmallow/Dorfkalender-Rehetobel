# Anleitung: Formular «Anlass melden» und Kalender-Tabelle

> Diese Anleitung beschreibt die **Ersteinrichtung** (erledigt am 3.11.2026). Seither geändert: Frage 12 heisst «Name der Kontaktperson», dazu kam die Pflichtfrage «E-Mail» (4.11.2026); das Google-Konto heisst verkehrsverein.rehetobel@gmail.com (5.11.2026). Aktueller Stand: [../KONZEPT.md](../KONZEPT.md).
> Seit der Frage «E-Mail» liegt «Freigegeben» eine Spalte weiter rechts (vermutlich O statt N); Google hat die Formel im Blatt «Kalender» dabei selbst angepasst.

Ziel: Vereine melden ihre Anlässe über ein Google-Formular. Die Meldungen landen in einer Google-Tabelle.
Der Vorstand setzt bei jedem Anlass ein **«ja»** in die Spalte *Freigegeben*. Nur freigegebene Anlässe
erscheinen im Dorfkalender. Alles läuft über das **Google-Konto des Vereins** (nicht über ein privates Konto).

Dauer: ca. 15 Minuten. Danach Claude die zwei Links geben (Schritt 5) – fertig.

## 1. Formular anlegen
Im Vereinskonto: **forms.google.com → Leeres Formular**. Titel: **Anlass melden – Dorfkalender Rehetobel**
Beschreibung: *«Melden Sie hier Ihren Anlass. Der Verkehrsverein prüft jede Meldung, bevor sie im Kalender erscheint.»*

Fragen genau so anlegen (die **Namen sind wichtig**, der Kalender liest sie):

| Nr | Frage (genauer Name) | Fragetyp | Pflicht |
|---|---|---|---|
| 1 | **Titel** | Kurzantwort | ✅ |
| 2 | **Datum** | Datum | ✅ |
| 3 | **Bis** (nur bei mehrtägigen Anlässen) | Datum | |
| 4 | **Zeit** (Beginn) | Uhrzeit | |
| 5 | **Zeit bis** (Ende) | Uhrzeit | |
| 6 | **Ort** (z. B. «Gemeindezentrum») | Kurzantwort | ✅ |
| 7 | **Veranstalter** (Name des Vereins/der Firma) | Kurzantwort | ✅ |
| 8 | **Kategorie** | Drop-down: Gemeinde Rehetobel, Vereine, Schule, Kirche, Gewerbe, Parteien, Kommissionen, Entsorgung, Andere («Entsorgung» = Grüngut, Papier, Altmetall, seit 8.11.2026; seit 7.11.2026 ohne «Verkehrsverein» – der VVR gehört zu den Vereinen; alte Einträge «Verkehrsverein Rehetobel» zeigt die Webseite automatisch bei «Vereine») | ✅ |
| 9 | **Beschreibung** | Absatz | |
| 10 | **Link** (Webseite mit mehr Infos) | Kurzantwort | |
| 11 | **Status** | Drop-down: fix, provisorisch | ✅ |
| 12 | **Kontakt für Rückfragen** (Name und E-Mail/Telefon) | Kurzantwort | ✅ |

Frage 12 ist **nur für den Vorstand** und erscheint nie im Kalender.

## 2. Tabelle verbinden
Im Formular oben **Antworten → In Google Tabellen verknüpfen → Neue Tabelle**. Name: *Dorfkalender Rehetobel*.
Das erste Blatt heisst «Formularantworten 1».

Nur **Anlässe in Rehetobel** (Entscheid 3.11.2026) – darum gibt es keine Frage «Gemeinde»; der Kalender setzt automatisch «Rehetobel».

In diesem Blatt in der ersten **leeren Spalte rechts** als Überschrift **Freigegeben** schreiben.
Hier trägt der Vorstand bei geprüften Anlässen **ja** ein.

## 3. Blatt «Kalender» (nur freigegebene Anlässe, ohne Kontaktdaten)
Unten **+** → neues Blatt, umbenennen in **Kalender**. In Zelle **A1** diese Formel einfügen
(A = Zeitstempel, B–L = Fragen 1–11, M = Kontakt, N = Freigegeben):

**A1** (Überschriften):
```
={"Titel"\"Datum"\"Bis"\"Zeit"\"Zeit bis"\"Ort"\"Veranstalter"\"Kategorie"\"Beschreibung"\"Link"\"Status"}
```
**A2** (nur freigegebene Anlässe):
```
=IFERROR(FILTER('Formularantworten 1'!B:L;LOWER(TRIM('Formularantworten 1'!N:N))="ja");"")
```
Bei englischer Spracheinstellung in A1 Kommas statt `\` verwenden. (Alles in einer Zelle ergibt «#VALUE!», solange noch nichts freigegeben ist – darum zwei Zellen.)
⚠️ **Ganze Spalten (B:L, N:N) verwenden, nicht B2:L!** Google Formulare fügt neue Antworten als neue Zeilen ein; dabei verschiebt Google Bereiche wie «B2:L» auf «B3:L», und die neueste Antwort fällt heraus.

So enthält das Blatt *Kalender* **nur** freigegebene Anlässe und **keine** Kontaktdaten.

## 4. Nur das Blatt «Kalender» veröffentlichen
**Datei → Freigeben → Im Web veröffentlichen** → statt «Gesamtes Dokument» das Blatt **Kalender** wählen →
Format **Kommagetrennte Werte (.csv)** → **Veröffentlichen** → Link kopieren.

⚠️ Wirklich nur das Blatt *Kalender* veröffentlichen – sonst wären die Kontaktdaten öffentlich.

## 5. Formular veröffentlichen ⚠️ wichtig
Im Formular oben rechts auf **«Veröffentlichen»** klicken und bestätigen. **Ohne diesen Schritt kann niemand das Formular ausfüllen.**
Danach unter **Einstellungen → Antworten** prüfen: «Antworten akzeptieren» = an, «Anmeldung erforderlich» / «Auf Nutzer beschränken» = aus.
Test: Formular-Link in einem **privaten Browserfenster** öffnen – das Formular muss erscheinen.

## 6. Claude die zwei Links geben
- **Formular-Link**: im Formular **Senden → Link-Symbol → Link kopieren**
- **CSV-Link** aus Schritt 4

Claude trägt sie in `js/config.js` ein. Ab dann:
- Knopf «+ Anlass melden» öffnet das Formular,
- der Kalender zeigt automatisch alle freigegebenen Anlässe (Google aktualisiert den CSV-Link nach ein paar Minuten).

## Ablauf im Alltag
1. Verein füllt das Formular aus → Zeile erscheint in «Formularantworten 1».
2. Die Projektleitung bekommt ein Prüf-Mail mit den Knöpfen «Annehmen»/«Ablehnen» (siehe [programm-einrichten.md](programm-einrichten.md)). Von Hand **ja** in der Tabelle geht weiterhin.
3. Nach wenigen Minuten ist der Anlass im Dorfkalender.
Ändern oder löschen: direkt in der Tabelle; zurückziehen: «ja» entfernen.
