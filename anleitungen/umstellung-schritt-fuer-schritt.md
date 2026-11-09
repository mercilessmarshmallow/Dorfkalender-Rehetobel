# Umstellung auf den Jahresablauf – Schritt für Schritt

Einmalig, am PC, etwa 15 Minuten. Handy daneben legen (für den Test am Schluss).
Claude gibt **einen Schritt nach dem anderen**; nach jedem Schritt «ok» schreiben.
Wenn etwas anders aussieht: einfach beschreiben, was du siehst.

## Vorbereitung
**Schritt 1 – Privates Fenster**
Im Browser **Ctrl + Shift + N** drücken. Es öffnet sich ein dunkles Fenster.
→ Du siehst: ein leeres, dunkles Browserfenster.

**Schritt 2 – Anmelden**
Im dunklen Fenster **forms.google.com** öffnen und mit **verkehrsverein.rehetobel@gmail.com** anmelden.
→ Du siehst: deine Formulare, darunter «Anlass melden – Dorfkalender Rehetobel».

## Formular
**Schritt 3 – Frage umbenennen**
Formular öffnen → Reiter **Fragen** → Frage **«Status»** anklicken → Titel ersetzen durch
**Kann das Datum verschoben werden?**

**Schritt 4 – Antworten ändern**
Bei derselben Frage: «fix» ersetzen durch **Ja**, «provisorisch» ersetzen durch **Nein**.

**Schritt 5 – Erklärung dazu**
Bei derselben Frage unten rechts **⋮ → Beschreibung** → hineinschreiben:
**Wichtig für die Jahresplanung: Kann Ihr Anlass bei einer Überschneidung auf ein anderes Datum verschoben werden?**
→ Google speichert von selbst.

## Programm
**Schritt 6 – Apps Script öffnen**
Im gleichen dunklen Fenster neuer Tab → **sheets.google.com** → Tabelle **«Dorfkalender Rehetobel»** →
oben **Erweiterungen → Apps Script**.
→ Du siehst: einen langen Programmtext.

**Schritt 7 – Neues Programm kopieren**
Neuer Tab → diese Adresse öffnen:
https://raw.githubusercontent.com/verkehrsvereinrehetobel-collab/Dorfkalender-Rehetobel/main/apps-script/Mails.gs
→ **Ctrl + A**, dann **Ctrl + C**.

**Schritt 8 – Einfügen**
Zurück zum Tab mit Apps Script → in den Programmtext klicken → **Ctrl + A** → **Ctrl + V** → oben **💾** (Speichern).
→ Die erste Zeile heisst jetzt: «// Dorfkalender Rehetobel – Meldungen prüfen, Mails an die Vereine, Jahresplanung».

**Schritt 9 – Deine Adresse für die Prüf-Mails**
Links das **Zahnrad ⚙** (Projekteinstellungen) → ganz nach unten → **«Skripteigenschaft hinzufügen»** →
Eigenschaft: **PRUEF_MAILS_AUCH_AN** · Wert: **deine private Gmail-Adresse** → **«Skripteigenschaften speichern»**.

**Schritt 10 – Neue Version**
Links **< >** (zurück zum Programm) → oben rechts **Bereitstellen → Bereitstellungen verwalten** →
Stift ✏ → bei «Version» **«Neue Version»** → **Bereitstellen** → **Fertig**.
(Nicht «Neue Bereitstellung» wählen.)

**Schritt 11 – Einschalten**
Oben in der Auswahl **einrichten** wählen → **▷ Ausführen**.
Falls Google fragt: «Fortgeschritten» → «Weiter zu Dorfkalender Mails» → «Zulassen».
→ Unten steht: «Ausführung abgeschlossen». Fertig am PC.

## Test mit dem Handy
**Schritt 12 – Nachmeldung testen**
Im Dorfkalender «+ Anlass melden»: Titel **TEST A**, Datum im **Dezember 2026**, E-Mail: deine Adresse. Absenden.
In der **Gmail-App** kommt das Prüf-Mail «Dorfkalender: neue Meldung «TEST A»» → **«✓ Annehmen»** antippen.
→ Die Seite zeigt «✓ Angenommen».

**Schritt 13 – Planung testen**
Nochmals melden: Titel **TEST B**, Datum im **Juni 2028**. Prüf-Mail «Planung 2028» → **«✓ Annehmen»**.
→ Die Seite zeigt «✓ Vorgemerkt». Im Mail an dich (als Verein) ist der Link zum Planungskalender: antippen → TEST B steht dort.

**Schritt 14 – Aufräumen**
In der Tabelle die Zeilen TEST A, TEST B und die alten Tests (test, test 2, test 3, test 4) löschen:
Zeilennummer mit rechter Maustaste → «Zeile löschen».

## Danach
Der Vorstand schickt die Anlässe 2027 → Claude trägt sie als öffentlich ein.
