// Titelbild je nach Jahreszeit (Entscheide 7.11.2026). Gibt es mehrere Fotos, kommt jeden Tag das nächste.
//   März–Mai:          Frühling – Wiese mit Säntis, Hütte
//   Juni–August:       Sommer – Baum (Bild «Kirche» entfernt, Entscheid 10.11.2026)
//   September–November: Herbst
//   Dezember–Februar:  Winter – Langlauf, Hügel, Tannen
// Zum Ausprobieren: ?monat=4 (Monat) und ?foto=fruehling2 / winter1 / winter2 / winter3
// Die Bilder selbst und wo die Schrift steht (Kirche nie verdecken!) stehen in css/kalender.css.
(function () {
  "use strict";
  const q = new URLSearchParams(location.search), foto = q.get("foto");
  const m = Number(q.get("monat")) || (new Date().getMonth() + 1);
  const heute = new Date();
  const tagNr = Math.floor((heute - new Date(heute.getFullYear(), 0, 1)) / 864e5);
  const k = document.documentElement.classList;
  if (m >= 3 && m <= 5) {
    k.add("fruehling", "fruehling" + (foto === "fruehling1" ? 1 : foto === "fruehling2" ? 2 : (tagNr % 2) + 1));
  } else if (m >= 6 && m <= 8) {
    k.add("sommer", "baum");
  } else if (m === 12 || m <= 2) {
    const w = foto && /^winter[123]$/.test(foto) ? Number(foto.slice(-1)) : (tagNr % 3) + 1;
    k.add("winter", "winter" + w);
  } else {
    k.add("herbst");
  }
})();
