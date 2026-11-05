# Anleitung: Programm «Dorfkalender Mails» einrichten oder erneuern

Das Programm verschickt die Mails und nimmt die Entscheide von der Prüfseite entgegen.
Es läuft in der Google-Tabelle «Dorfkalender Rehetobel» (Erweiterungen → Apps Script).
Quelltext: [`apps-script/Mails.gs`](../apps-script/Mails.gs).

**Am PC, nicht am Handy.** Claude führt Schritt für Schritt durch; nach jedem Schritt «ok».

## Wichtig vorweg: nur mit dem Vereinskonto
Google kommt durcheinander, wenn im Browser mehrere Google-Konten angemeldet sind
(Fehler «Datei kann derzeit nicht geöffnet werden»). Darum immer so:
1. Im Browser **Ctrl + Shift + N** → privates Fenster.
2. **sheets.google.com** → mit **verkehrsverein.rehetobel@gmail.com** anmelden.
3. Tabelle **«Dorfkalender Rehetobel»** → **Erweiterungen → Apps Script**.

## Übersicht: Umstellung auf den Jahresablauf (einmalig, nach Okay der Projektleitung)
1. Formular: Frage «Status» ändern (Teil D)
2. Programm erneuern (Teil A)
3. Eigene Adresse für Prüf-Mails (Teil B)
4. Einmal «einrichten» ausführen (Teil E) – nötig wegen der neuen Erinnerungsmails
5. Testen

## A. Programm erneuern (wenn es schon eingerichtet ist)
1. Im selben privaten Fenster einen neuen Tab öffnen und diese Adresse aufrufen:
   https://raw.githubusercontent.com/mercilessmarshmallow/Dorfkalender-Rehetobel/main/apps-script/Mails.gs
   → **Ctrl + A**, **Ctrl + C**.
2. In Apps Script ins Textfeld klicken → **Ctrl + A** → **Ctrl + V** → **💾 Speichern**.
3. **Bereitstellen → Bereitstellungen verwalten → Stift ✏ → Version: «Neue Version» → Bereitstellen → Fertig.**
   (Die Adresse der Web-App bleibt gleich. **Nicht** «Neue Bereitstellung» wählen und nichts archivieren.)

## B. Einmalig: eigene Adresse für die Prüf-Mails
Damit die Prüf-Mails auch ins private Gmail der Projektleitung kommen, ohne dass die Adresse im öffentlichen Programmtext steht:
1. In Apps Script links auf das **Zahnrad ⚙ (Projekteinstellungen)**.
2. Ganz unten **«Skripteigenschaften» → «Skripteigenschaft hinzufügen»**.
3. Eigenschaft: **PRUEF_MAILS_AUCH_AN** · Wert: die eigene Gmail-Adresse (mehrere mit Komma trennen).
4. **«Skripteigenschaften speichern»**.

Diese Einstellung bleibt, auch wenn das Programm später erneuert wird.

## C. Ersteinrichtung (nur in einer ganz neuen Tabelle)
Nach A und B zusätzlich:
1. **Bereitstellen → Neue Bereitstellung → Zahnrad → Web-App**; Ausführen als **«Ich»**, Zugriff **«Jeder»** → Bereitstellen.
   Die Web-App-URL in `apps-script/Mails.gs` bei `WEB_APP_URL` und in `entscheid.html` bei `API` eintragen (Claude).
2. Oben die Funktion **einrichten** wählen → **▷ Ausführen** → Berechtigungen erlauben
   («Fortgeschritten» → «Weiter zu Dorfkalender Mails» → «Zulassen»).

## D. Formularfrage «Status» → «Kann das Datum verschoben werden?»
1. Formular «Anlass melden – Dorfkalender Rehetobel» öffnen (im Vereinskonto), Reiter **Fragen**.
2. Die Frage **«Status»** anklicken. Titel ändern in: **Kann das Datum verschoben werden?**
3. Die zwei Antworten «fix» und «provisorisch» ändern in **Ja** und **Nein**.
4. Bei der Frage auf **⋮ → Beschreibung**: **Wichtig für die Jahresplanung: Kann Ihr Anlass bei einer Überschneidung auf ein anderes Datum verschoben werden?**
5. Google speichert von selbst. Ältere Antworten bleiben, wie sie sind.

## E. Einmal «einrichten» ausführen
1. In Apps Script oben in der Auswahl **einrichten** wählen → **▷ Ausführen**.
2. Falls Google nach einer Erlaubnis fragt: «Fortgeschritten» → «Weiter zu Dorfkalender Mails» → «Zulassen».
3. Unten «Ausführung abgeschlossen». Beim nächsten Öffnen der Tabelle erscheint oben das Menü **«Dorfkalender»**.

## Testen
1. Im Dorfkalender «+ Anlass melden», Datum in der Zukunft, bei E-Mail eine eigene Adresse.
2. In der **Gmail-App** im Prüf-Mail auf **«✓ Annehmen»** tippen → Seite zeigt «✓ Angenommen».
3. Kurz danach kommt «Ihr Anlass … ist im Dorfkalender» an die angegebene Adresse.
4. Test-Zeile in der Tabelle löschen.

Achtung: Ältere Prüf-Mails (vor der Erneuerung) haben noch die alten Knöpfe; die gehen in der Gmail-App nicht.

## Wenn etwas nicht geht
In Apps Script links **≡▶ «Ausführungen»**: Dort steht, ob das Programm gelaufen ist und ob es einen Fehler gab.
Bildschirmfoto davon an Claude.
