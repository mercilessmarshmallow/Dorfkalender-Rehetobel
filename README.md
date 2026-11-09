# Dorfkalender Rehetobel

Öffentlicher Veranstaltungskalender fürs ganze Dorf Rehetobel, betrieben vom Verkehrsverein Rehetobel.
Vereine melden ihre Anlässe über ein Google-Formular, der Verkehrsverein prüft und gibt sie frei.

- **Kalender:** https://verkehrsvereinrehetobel-collab.github.io/Dorfkalender-Rehetobel/
- **Eingebettet** (ohne Kopf, z. B. für die Vereinswebseite): https://verkehrsvereinrehetobel-collab.github.io/Dorfkalender-Rehetobel/?einbetten=1
- **Einbindung in ClubDesk** (HTML-Block):
  `<iframe src="https://verkehrsvereinrehetobel-collab.github.io/Dorfkalender-Rehetobel/?einbetten=1" title="Dorfkalender Rehetobel" style="width:100%; height:1400px; border:0;" loading="lazy"></iframe>`

## Was liegt wo
| Datei / Ordner | Inhalt |
|---|---|
| [KONZEPT.md](KONZEPT.md) | Der Plan: Jahresablauf mit Koordinationssitzung, Mails, Formular, Grundsätze |
| [ENTSCHEIDE.md](ENTSCHEIDE.md) | Alle Entscheide mit Datum |
| [STAND.md](STAND.md) | Was läuft, was gebaut, was offen ist |
| [anleitungen/](anleitungen/) | Schritt-für-Schritt-Anleitungen (Formular und Tabelle, Programm einrichten) |
| `index.html`, `css/`, `js/`, `bilder/`, `data/` | Die Kalender-Webseite |
| `entscheid.html` | Prüfseite: Anlass annehmen/ablehnen mit einem Tipp aus dem Prüf-Mail |
| `apps-script/Mails.gs` | Programm in der Google-Tabelle (Mails, Annehmen/Ablehnen) |
| `tests/test.js` | Test für Programm, Prüfseite und Kalender: `node tests/test.js` |
| `CLAUDE.md`, `.claude/agents/` | Arbeitsregeln und Prüf-Agent für Claude |
