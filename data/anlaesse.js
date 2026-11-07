// BEISPIELDATEN für den Prototyp.
// Übernommen aus dem alten Kalender (rehetobel-tourismus.ch, Stand 2.11.2026)
// und aus öffentlichen Einträgen auf Localcities / MySwitzerland.
// Wird später durch die echte Datenquelle ersetzt (z. B. Google-Tabelle).
//
// Felder pro Anlass:
//   id          eindeutige Kennung
//   titel       Name des Anlasses
//   datum       Startdatum JJJJ-MM-TT
//   bis         (optional) Enddatum bei mehrtägigen Anlässen
//   zeit        (optional) Startzeit HH:MM – leer = ganztägig
//   zeitBis     (optional) Endzeit HH:MM
//   ort         Lokalität, z. B. "Gemeindezentrum"
//   gemeinde    z. B. "Rehetobel"
//   veranstalter (optional)
//   kategorie   Veranstalter-Gruppe: Gemeinde Rehetobel, Vereine, Schule, Kirche, Gewerbe,
//               Parteien, Kommissionen, Andere («Verkehrsverein …» zeigt die Webseite bei «Vereine»)
//   beschreibung (optional)
//   link        (optional) Webseite mit mehr Infos
//   status      "fix" oder "provisorisch" (für die Terminplanung)

window.ANLAESSE = [
  { id: "a1", titel: "Gespräche und Andacht", datum: "2026-11-03", zeit: "10:00",
    ort: "Alters- u. Pflegeheim Krone", gemeinde: "Rehetobel", kategorie: "Kirche", status: "fix" },
  { id: "a2", titel: "Seniorenzmittag im Dorf", datum: "2026-11-04", zeit: "12:00",
    ort: "Alters- u. Pflegeheim Krone", gemeinde: "Rehetobel", kategorie: "Kirche", status: "fix" },
  { id: "a3", titel: "Unentgeltliche Rechtsberatung", datum: "2026-11-04", zeit: "17:00",
    ort: "Gemeindehaus Heiden", gemeinde: "Heiden", kategorie: "Andere", status: "fix" },
  { id: "a4", titel: "Koordinationssitzung Veranstaltungsdaten 2027", datum: "2026-11-04", zeit: "20:00",
    ort: "Dorf 5", gemeinde: "Rehetobel", veranstalter: "Verkehrsverein Rehetobel", kategorie: "Verkehrsverein Rehetobel",
    beschreibung: "Die Ortsvereine stimmen ihre Veranstaltungsdaten für das Jahr 2027 ab.", status: "fix" },
  { id: "a5", titel: "Ideenwerkstatt Apéro", datum: "2026-11-05", zeit: "17:30", zeitBis: "19:30",
    ort: "Sägholzstrasse 11", gemeinde: "Rehetobel", kategorie: "Andere", status: "fix" },
  { id: "a6", titel: "Traditionelles Frauenfrühstück", datum: "2026-11-07", zeit: "09:00",
    ort: "Haus zur Stickerei", gemeinde: "Heiden", kategorie: "Vereine", status: "fix" },
  { id: "a7", titel: "Weiherpflege Schutzgebiet Ettenberg", datum: "2026-11-07", zeit: "09:00",
    ort: "Schutzgebiet Ettenberg", gemeinde: "Rehetobel", kategorie: "Vereine", status: "fix" },
  { id: "a8", titel: "50 Jahre Jugendmusik Rehetobel", datum: "2026-11-07", bis: "2026-11-08",
    ort: "Gemeindezentrum", gemeinde: "Rehetobel", veranstalter: "Jugendmusik Rehetobel", kategorie: "Vereine", status: "fix" },
  { id: "a9", titel: "Adventsmarkt", datum: "2026-11-28",
    ort: "Urwaldhaus", gemeinde: "Rehetobel", kategorie: "Gewerbe", status: "fix" },
  { id: "a10", titel: "Dorfhus-Brunch", datum: "2026-12-06", zeit: "09:00",
    ort: "Dorfhus zum Gupf", gemeinde: "Rehetobel", kategorie: "Gewerbe",
    beschreibung: "Jeden ersten Sonntag im Monat.", status: "fix" },
  { id: "a11", titel: "Hauptversammlung Verkehrsverein", datum: "2027-03-12", zeit: "19:30",
    ort: "Gemeindezentrum", gemeinde: "Rehetobel", veranstalter: "Verkehrsverein Rehetobel", kategorie: "Verkehrsverein Rehetobel",
    beschreibung: "Beispiel-Eintrag (Datum erfunden).", status: "provisorisch" },
  { id: "a12", titel: "Vo 11 bis 11", datum: "2027-07-03", zeit: "11:00", zeitBis: "23:00",
    ort: "Dorf", gemeinde: "Rehetobel", veranstalter: "Verkehrsverein Rehetobel", kategorie: "Verkehrsverein Rehetobel",
    beschreibung: "Auf dem Kaienspitz (Stobetebüel).", status: "fix" },
  { id: "a13", titel: "1. August-Feier und Wanderung", datum: "2027-08-01",
    ort: "Rehetobel", gemeinde: "Rehetobel", veranstalter: "Verkehrsverein Rehetobel", kategorie: "Verkehrsverein Rehetobel", status: "provisorisch" }
];
