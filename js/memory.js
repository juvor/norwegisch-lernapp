/* Memory-Spiel: Bild ↔ Wort, Wort ↔ Deutsch, Hören ↔ Bild; eingebaute Bildersets oder eigene Vokabeln eines Themas.
   Gemeinsamer Code für die Koreanisch- und die Norwegisch-App – die Sets stehen in js/data/memory.js:
   g.MemorySets = { list: [{ id, icon, title, topic, pos, items: [[Bild (Emoji) oder Farbe '#rrggbb', Zielsprache, Deutsch], …] }] } */
(function (g) {
  'use strict';
  const { esc, shuffle, Store, TTS } = g.Core;
  const UI = g.UI;
  const $ = s => document.querySelector(s);
  const main = () => UI.main();
  const sets = () => (g.MemorySets && g.MemorySets.list) || [];
  const st = () => (Store.state.memory = Store.state.memory || { opts: { mode: 'pic', size: 8, speak: true }, best: {} });
  const koKey = s => String(s).replace(/\s+/g, ' ').trim();
  const MODES = [['pic', '🖼️ Bild ↔ Wort'], ['de', '🔤 Wort ↔ Deutsch'], ['audio', '🎧 Hören ↔ Bild']];
  const MIN = 6;
  let timer = null;
  function stop() { if (timer) { clearInterval(timer); timer = null; } }

  // eigene Vokabeln nach Thema (mind. 6 Karten)
  function myTopics() {
    const c = {};
    Store.state.vocab.forEach(v => { if (v.topic) c[v.topic] = (c[v.topic] || 0) + 1; });
    return Object.entries(c).filter(([, n]) => n >= MIN).sort((a, b) => b[1] - a[1]);
  }

  /* ── Übersicht ── */
  function list() {
    stop();
    const s = st(), o = s.opts;
    const seg = (name, opts, cur) => `<div class="seg">${opts.map(([k, l]) => `<button data-${name}="${k}" class="${String(cur) === String(k) ? 'on' : ''}">${l}</button>`).join('')}</div>`;
    const best = id => { const b = s.best[`${id}|${o.mode}|${o.size}`]; return b ? ` · Bestwert: ${b.moves} Züge, ${fmt(b.time)}` : ''; };
    const tps = myTopics();
    main().innerHTML = `<h1>🃏 Memory</h1>
      <div class="card"><div class="label">Spielart</div>${seg('mode', MODES, o.mode)}
        <div class="label">Anzahl Paare</div>${seg('size', [[6, '6'], [8, '8'], [10, '10']], o.size)}
        <label class="chk"><input type="checkbox" id="spk" ${o.speak ? 'checked' : ''}> Wörter beim Aufdecken vorlesen</label></div>
      <h2>Bildersets</h2>
      <div class="topic-grid">${sets().map(x => `<a class="card topic" href="#memory/${x.id}"><div class="ticon">${x.icon}</div>
        <div class="gtitle">${esc(x.title)}</div><div class="muted small">${x.items.length} Wörter${best(x.id)}</div></a>`).join('')}</div>
      <h2>Mit meinen Vokabeln</h2>
      ${tps.length ? `<p class="muted small">Immer als „Wort ↔ Deutsch“ (deine Karten haben keine Bilder).</p><div class="topic-grid">${tps.map(([t, n]) => `<a class="card topic" href="#memory/${encodeURIComponent('thema:' + t)}"><div class="ticon">📚</div>
        <div class="gtitle">${esc(t)}</div><div class="muted small">${n} Vokabeln${best('thema:' + t)}</div></a>`).join('')}</div>`
        : '<p class="muted">Sobald ein Thema mindestens 6 Vokabeln hat, kannst du es hier spielen.</p>'}`;
    main().querySelectorAll('[data-mode]').forEach(b => b.onclick = () => { o.mode = b.dataset.mode; Store.save(); list(); });
    main().querySelectorAll('[data-size]').forEach(b => b.onclick = () => { o.size = +b.dataset.size; Store.save(); list(); });
    $('#spk').onchange = e => { o.speak = e.target.checked; Store.save(); };
  }
  const fmt = sec => `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}`;

  /* ── Spiel ── */
  function start(id) {
    stop();
    const s = st(), o = s.opts;
    let title, icon, items, mode = o.mode, topic = '', pos = '';
    if (id.startsWith('thema:')) {
      topic = id.slice(6); title = topic; icon = '📚'; mode = 'de';
      items = Store.state.vocab.filter(v => v.topic === topic).map(v => ['', v.ko, v.de]);
    } else {
      const set = sets().find(x => x.id === id); if (!set) return list();
      title = set.title; icon = set.icon; items = set.items; topic = set.topic; pos = set.pos || '';
    }
    const n = Math.min(o.size, items.length);
    if (n < 3) return list();
    const chosen = shuffle(items).slice(0, n);
    const sideA = mode === 'de' ? 'tl' : mode === 'audio' ? 'audio' : 'pic';
    const sideB = mode === 'de' ? 'de' : mode === 'audio' ? 'pic' : 'tl';
    const cards = shuffle(chosen.flatMap((it, i) => [{ pair: i, side: sideA, it }, { pair: i, side: sideB, it }]));
    const face = c => {
      const [pic, tl, de] = c.it;
      if (c.side === 'pic') return /^#[0-9a-f]{3,8}$/i.test(pic) ? `<span class="mem-swatch" style="background:${pic}"></span>` : `<span class="mem-emoji">${pic}</span>`;
      if (c.side === 'audio') return `<span class="mem-emoji">🔊</span>`;
      if (c.side === 'tl') return `<span class="ko mem-word">${esc(tl)}</span>`;
      return `<span class="mem-word mem-de">${esc(de)}</span>`;
    };
    let open = [], matched = 0, moves = 0, lock = false, t0 = Date.now(), secs = 0;
    const key = `${id}|${mode}|${n}`;
    main().innerHTML = `<div class="run-head"><h2>${icon} ${esc(title)}</h2>
        <div class="run-prog"><span class="muted" id="mstat">0 Züge · 0:00 · 0 / ${n} Paare</span></div>
        <button class="btn ghost small" id="quit">Beenden</button></div>
      <div class="mem-grid ${n > 8 ? 'big' : ''}" id="board">${cards.map((c, i) => `<button class="mem-card" data-i="${i}" aria-label="Karte"><span class="mem-inner"><span class="mem-back">?</span><span class="mem-front">${face(c)}</span></span></button>`).join('')}</div>`;
    const stat = () => { const el = $('#mstat'); if (el) el.textContent = `${moves} Züge · ${fmt(secs)} · ${matched} / ${n} Paare`; };
    timer = setInterval(() => { secs = Math.round((Date.now() - t0) / 1000); stat(); }, 1000);
    $('#quit').onclick = () => { stop(); location.hash = '#memory'; list(); };
    const els = [...main().querySelectorAll('.mem-card')];
    els.forEach((el, i) => el.onclick = () => {
      if (lock || el.classList.contains('open') || el.classList.contains('done')) return;
      const c = cards[i];
      el.classList.add('open'); open.push(i);
      if (o.speak && (c.side === 'tl' || c.side === 'audio')) TTS.speak(c.it[1]);
      if (open.length < 2) return;
      moves++;
      const [a, b] = open; open = [];
      if (cards[a].pair === cards[b].pair) {
        els[a].classList.add('done'); els[b].classList.add('done'); matched++;
        if (o.speak) setTimeout(() => TTS.speak(cards[a].it[1]), 250);
        stat();
        if (matched === n) setTimeout(() => finish(), 700);
      } else {
        lock = true; stat();
        setTimeout(() => { els[a].classList.remove('open'); els[b].classList.remove('open'); lock = false; }, 1000);
      }
    });
    function finish() {
      stop(); secs = Math.round((Date.now() - t0) / 1000);
      const old = s.best[key], isBest = !old || moves < old.moves || (moves === old.moves && secs < old.time);
      if (isBest) s.best[key] = { moves, time: secs };
      g.Core.logStat('grammar', true); Store.save();
      const have = new Set(Store.state.vocab.map(v => koKey(v.ko)));
      const fresh = id.startsWith('thema:') ? [] : chosen.filter(it => !have.has(koKey(it[1])));
      main().innerHTML = `<h1>${icon} ${esc(title)}</h1>
        <div class="card"><h3>🎉 Geschafft: ${moves} Züge in ${fmt(secs)}${isBest ? ' – neuer Bestwert!' : ''}</h3>
          <p class="muted small">Perfekt wären ${n} Züge.${old ? ` Bisheriger Bestwert: ${old.moves} Züge, ${fmt(old.time)}.` : ''}</p>
          <div class="tablewrap"><table>${chosen.map(([pic, tl, de]) => `<tr><td style="width:3em">${pic ? (/^#/.test(pic) ? `<span class="mem-swatch small" style="background:${pic}"></span>` : pic) : ''}</td>
            <td><span class="ko">${esc(tl)}</span> ${UI.speakBtn(tl, 'tiny')}</td><td>${esc(de)}</td></tr>`).join('')}</table></div>
          <div class="actions"><button class="btn primary" id="again">Nochmal</button><button class="btn" id="back">Andere Sets</button>
          ${id.startsWith('thema:') ? '' : `<button class="btn ghost" id="addw" ${fresh.length ? '' : 'disabled'}>📇 ${fresh.length ? fresh.length + ' neue Wörter als Karteikarten' : 'Alle Wörter schon in deinen Vokabeln'}</button>`}</div></div>`;
      $('#again').onclick = () => start(id);
      $('#back').onclick = () => { location.hash = '#memory'; list(); };
      const aw = $('#addw');
      if (aw) aw.onclick = () => {
        const r = g.App.importRows(fresh.map(([, tl, de]) => ({ ko: tl, de, topic, pos, note: 'aus Memory: ' + title, prio: 2 })), false);
        UI.toast(`${r.added} Wörter als Karteikarten angelegt.`); aw.disabled = true; aw.textContent = '📇 übernommen';
      };
    }
  }

  g.MemoryView = { list, start, stop };
})(window);
