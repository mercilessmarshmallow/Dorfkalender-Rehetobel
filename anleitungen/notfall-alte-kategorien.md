# Notfall: zurück zu den alten Kategorien

Seit dem 8.11.2026 hat der Dorfkalender **Themen** statt Veranstalter-Gruppen (Entscheid in ENTSCHEIDE.md).
Die Projektleitung ist klar **gegen** die alten Kategorien. Diese Seite ist nur für den Notfall da, falls es
unbedingt zurück muss. Alles Alte ist aufbewahrt und kann wieder hergestellt werden.

## Alt und neu im Vergleich

| | Alt (bis 8.11.2026) | Neu (ab 8.11.2026) |
|---|---|---|
| Idee | **Wer** macht den Anlass? | **Was** mache ich dort als Besucher? |
| Auswahl im Formular | Gemeinde Rehetobel, Vereine, Schule, Kirche, Gewerbe, Parteien, Kommissionen, Andere | Musik & Kultur, Feste & Märkte, Sport & Natur, Kinder & Familie, Senioren & Treffpunkt, Kirche, Gemeinde & Politik, Vereinsleben, Kurse & Weiteres |
| Auf der Webseite | Knöpfe «Nach Kategorie filtern» | «Meine Auswahl» (Häkchen pro Thema, auf dem Handy gespeichert), «☆ Immer oben», «📅 Alle in meinen Kalender» |
| Prüf-Mail | ohne Warnungen | Warnung bei abweichender Kategorie und bei gleicher Art am gleichen Tag |

## Wo das Alte gespeichert ist
- **Webseite und Programm:** im Verlauf der Ablage beim Stand **`8b595f2`** (8.11.2026, letzter Stand mit den alten Kategorien,
  schon mit der iPhone-Anleitung). Nichts davon ist gelöscht.
- **Programm in Apps Script:** Google bewahrt jede Version auf. Unter «Bereitstellungen verwalten → Bearbeiten» kann man die
  frühere Version wieder auswählen (die Version vor dem Erneuern für die Themen).

## So geht es zurück (Claude macht die Webseite, die Projektleitung Formular und Programm)
1. **Webseite (Claude):** `index.html`, `css/kalender.css`, `js/kalender.js` und `tests/test.js` vom Stand `8b595f2` zurückholen,
   `node tests/test.js`, Prüfer, auf main. Dauert wenige Minuten.
2. **Formular (Projektleitung, PC):** Auswahl «Kategorie» wieder auf die alte Liste oben.
3. **Programm (Projektleitung, PC):** in Apps Script die frühere Version bereitstellen (siehe oben) oder `apps-script/Mails.gs`
   vom Stand `8b595f2` einfügen und eine neue Version bereitstellen.
4. **Tabelle:** Anlässe, die schon mit Themen gemeldet wurden, kennt die alte Webseite nicht – sie erscheinen grau mit dem
   Themen-Namen. Entweder in der Tabelle von Hand zurückstellen, oder Claude baut eine Übersetzung Thema → alte Gruppe ein
   (geht nur ungefähr, z. B. «Gemeinde & Politik» → «Gemeinde Rehetobel»; die Parteien wären dann falsch).

**Unsicher:** Je länger die Themen laufen, desto mehr Einträge müssen beim Zurückschalten angepasst werden.
