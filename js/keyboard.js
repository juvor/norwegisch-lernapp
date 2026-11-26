/* æ ø å – Bildschirmleiste und Umleitung der deutschen Tastatur (ä→æ, ö→ø, ü→å) in norwegischen Feldern (.ko-input) */
(function (g) {
  'use strict';
  const MAP = { 'ä': 'æ', 'ö': 'ø', 'ü': 'å', 'Ä': 'Æ', 'Ö': 'Ø', 'Ü': 'Å' };
  const KEYS = ['æ', 'ø', 'å', 'Æ', 'Ø', 'Å'];
  let target = null, open = false, panel = null, btn = null;
  const isField = el => el && el.tagName === 'INPUT' && el.classList.contains('ko-input') && !el.disabled;
  const settings = () => (g.Core && g.Core.Store.state && g.Core.Store.state.settings.kbd) || { physical: true, auto: false };

  function insertText(el, t) {
    const s = el.selectionStart == null ? el.value.length : el.selectionStart;
    const e = el.selectionEnd == null ? s : el.selectionEnd;
    el.value = el.value.slice(0, s) + t + el.value.slice(e);
    try { el.setSelectionRange(s + t.length, s + t.length); } catch (err) { /* ignorieren */ }
    el.dispatchEvent(new Event('input', { bubbles: true }));
  }

  // Deutsche Tastatur: ä/ö/ü in norwegischen Feldern direkt als æ/ø/å
  document.addEventListener('keydown', e => {
    if (!isField(e.target) || e.ctrlKey || e.metaKey || e.altKey || e.isComposing) return;
    if (settings().physical && MAP[e.key]) { e.preventDefault(); insertText(e.target, MAP[e.key]); }
  }, true);
  document.addEventListener('focusin', e => {
    if (!isField(e.target)) return;
    target = e.target;
    if (!open && settings().auto) show(true);
  });

  function findTarget() {
    if (isField(target) && document.body.contains(target)) return target;
    return [...document.querySelectorAll('input.ko-input')].find(x => !x.disabled && x.offsetParent) || null;
  }
  function press(k) {
    if (k === 'hide') return show(false);
    const el = findTarget();
    if (!el) { g.UI && g.UI.toast('Kein norwegisches Eingabefeld auf dieser Seite.'); return; }
    if (k === 'enter') { if (g.UI && g.UI.onEnter) g.UI.onEnter(); return; }
    insertText(el, k);
  }
  function show(on) {
    open = on;
    panel.classList.toggle('open', on);
    document.body.classList.toggle('osk-open', on);
    btn.classList.toggle('on', on);
    if (on) { const el = findTarget(); if (el && document.activeElement !== el) el.focus({ preventScroll: true }); }
  }
  function init() {
    if (!document.getElementById('main')) return;
    panel = document.createElement('div'); panel.id = 'osk'; panel.className = 'osk-small';
    panel.innerHTML = `<div class="k-row">${KEYS.map(k => `<button class="k" data-k="${k}">${k}</button>`).join('')}
      <button class="k k-wide k-enter" data-k="enter">⏎</button><button class="k k-wide" data-k="hide" title="Ausblenden">✕</button></div>`;
    btn = document.createElement('button'); btn.id = 'osk-btn'; btn.title = 'æ ø å einblenden'; btn.innerHTML = '⌨️<span>æøå</span>';
    document.body.append(panel, btn);
    // pointerdown + preventDefault: das Eingabefeld behält den Fokus
    panel.addEventListener('pointerdown', e => { const b = e.target.closest('[data-k]'); e.preventDefault(); if (b) press(b.dataset.k); });
    btn.addEventListener('pointerdown', e => e.preventDefault());
    btn.addEventListener('click', () => show(!open));
  }
  document.addEventListener('DOMContentLoaded', init);
  g.Keyboard = { MAP, show: on => show(on), get open() { return open; } };
})(window);
