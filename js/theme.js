/* Darstellung: Modus (hell/dunkel/sepia/automatisch), Akzentfarbe, Schriftgröße.
   Wird im <head> geladen, damit beim Start nichts aufblitzt. */
(function (g) {
  'use strict';
  const KEY = 'norwegisch-lernapp-v1';
  const DEFAULT = { theme: 'auto', accent: '#c2362f', scale: 1 };
  const ACCENTS = [
    ['#2f5bd3', 'Blau'], ['#c2362f', 'Rot'], ['#1f8a4c', 'Grün'], ['#7c4dcc', 'Lila'],
    ['#d6457f', 'Pink'], ['#d97706', 'Orange'], ['#0f8b8d', 'Türkis'], ['#475569', 'Schiefer']
  ];
  const THEMES = [['auto', '🖥️ Automatisch'], ['light', '☀️ Hell'], ['dark', '🌙 Dunkel'], ['sepia', '📜 Sepia']];
  const SCALES = [[0.9, 'Klein'], [1, 'Normal'], [1.15, 'Groß'], [1.3, 'Sehr groß']];

  function apply(ui) {
    ui = Object.assign({}, DEFAULT, ui || {});
    const root = document.documentElement;
    root.dataset.theme = ui.theme;
    root.style.setProperty('--accent-base', ui.accent);
    root.style.setProperty('--scale', ui.scale);
    const dark = ui.theme === 'dark' || (ui.theme === 'auto' && matchMedia('(prefers-color-scheme: dark)').matches);
    let meta = document.querySelector('meta[name="theme-color"]');
    if (!meta) { meta = document.createElement('meta'); meta.name = 'theme-color'; document.head.appendChild(meta); }
    meta.content = dark ? '#1f2227' : ui.theme === 'sepia' ? '#fbf6ea' : '#ffffff';
  }
  try {
    const st = JSON.parse(localStorage.getItem(KEY) || '{}');
    apply(st.settings && st.settings.ui);
  } catch (e) { apply(); }

  g.Theme = { apply, DEFAULT, ACCENTS, THEMES, SCALES };
})(window);
