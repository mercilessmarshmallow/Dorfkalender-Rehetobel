// Einstellungen für den Dorfkalender – hier muss man später nur zwei Links einsetzen.
window.KALENDER_CONFIG = {
  // Link zum Google-Formular «Anlass melden» (Formular → Senden → Link kopieren).
  // Leer lassen = Knopf zeigt nur einen Hinweis.
  formularUrl: "https://docs.google.com/forms/d/e/1FAIpQLSeKT9Vj2d2BhPkuX7gYlE9mK_gae2x-f5uYJN-bJc8TcsTbYQ/viewform",

  // Link zur veröffentlichten Kalender-Tabelle als CSV
  // (Google-Tabelle → Datei → Freigeben → Im Web veröffentlichen → Blatt «Kalender» → CSV).
  // Leer lassen = es werden die Beispieldaten aus data/anlaesse.js angezeigt.
  tabelleCsvUrl: "https://docs.google.com/spreadsheets/d/e/2PACX-1vSyroUV1FK_j_fvwqEibQNkXLuSSmVSMMBnow8-VK-8tKR1GkEQLpNZEJNYw69OuPlReQN32gtKf6PH/pub?gid=308241126&single=true&output=csv",

  // Google-Programm (Web-App) – liefert dem Planungskalender die vorgemerkten Anlässe (nur mit Link ?planung=…)
  webAppUrl: "https://script.google.com/macros/s/AKfycbzuNZ27F1NhpYGpJ4i1sGFxalk1lCvedJ943s-_EhoT6aOph1VdG5FNRp30H94sS6ykEQ/exec",
};
// Anleitung zum Einrichten: anleitungen/formular-und-tabelle.md
