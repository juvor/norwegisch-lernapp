/* Service Worker: speichert die App für den Offline-Betrieb (iPad / Home-Bildschirm).
   WICHTIG: Bei jeder Änderung an App-Dateien VERSION erhöhen, sonst sieht das iPad die alte Version. */
const VERSION = 'no-v8';
const CACHE = 'norwegisch-app-' + VERSION;
const FILES = [
  './', './index.html', './manifest.webmanifest', './css/style.css',
  './js/theme.js', './js/norsk.js', './js/data/lexicon.js', './js/data/grammar.js', './js/data/topics.js', './js/data/dialogs.js', './js/dialogs.js', './js/data/memory.js', './js/memory.js', './js/data/startpaket.js',
  './js/core.js', './js/ui.js', './js/keyboard.js', './js/app.js',
  './icons/icon-180.png', './icons/icon-192.png', './icons/icon-512.png', './vorlage_vokabeln.csv'
];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
// Erst Cache (offline), im Hintergrund aktualisieren, wenn Internet da ist
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(caches.match(e.request, { ignoreSearch: true }).then(hit => {
    const net = fetch(e.request).then(res => {
      if (res && res.ok && new URL(e.request.url).origin === location.origin) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); }
      return res;
    }).catch(() => hit);
    return hit || net;
  }));
});
