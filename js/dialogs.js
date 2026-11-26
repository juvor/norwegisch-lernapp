/* Alltagsdialoge: Lesen & Hören, Rollenspiel, Üben, Schlüsselwörter.
   Gemeinsamer Code für die Koreanisch- und die Norwegisch-App – die Inhalte stehen in js/data/dialogs.js.
   Datenformat: g.Dialogs = { lang, list: [{ id, icon, title, place, topic, intro, roles: { A: [Name, Deutsch], B: [...] },
                                            lines: [[Rolle, Zielsprache, Deutsch], …], words: [[Zielsprache, Deutsch, Wortart?], …] }] } */
(function (g) {
  'use strict';
  const { esc, shuffle, Store, TTS, Check } = g.Core;
  const UI = g.UI, Ex = g.Ex;
  const $ = s => document.querySelector(s);
  const main = () => UI.main();
  const data = () => (g.Dialogs && g.Dialogs.list) || [];
  const byId = id => data().find(d => d.id === id);
  const st = () => (Store.state.dialogs = Store.state.dialogs || {});
  const koKey = s => String(s).replace(/\s+/g, ' ').trim();

  /* ── Sprachausgabe mit zwei Sprechern (andere Stimme, falls vorhanden; sonst andere Tonhöhe) ── */
  let playing = null;
  function speakLine(text, role, onend) {
    if (!TTS.supported || !TTS.voices.length) { if (onend) setTimeout(onend, 600); return; }
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(String(text).replace(/\(.*?\)/g, ''));
    const v1 = TTS.voice();
    const usable = TTS.voices.filter(x => x.localService || navigator.onLine !== false);   // offline keine Online-Stimmen
    const v2 = usable.find(x => x !== v1 && x.localService) || usable.find(x => x !== v1);
    const v = role === 'B' && v2 ? v2 : v1;
    if (v) { u.voice = v; u.lang = v.lang; } else u.lang = g.Dialogs.lang;
    u.rate = Store.state.settings.rate || 0.9;
    if (!(role === 'B' && v2)) u.pitch = role === 'A' ? 1.15 : 0.85;
    u.onend = u.onerror = () => onend && onend();
    speechSynthesis.speak(u);
  }
  function stopAll() { playing = null; if (TTS.supported) speechSynthesis.cancel(); document.querySelectorAll('.bubble.playing').forEach(b => b.classList.remove('playing')); }

  const roleName = (d, r) => `${d.roles[r][0]} <span class="muted">(${esc(d.roles[r][1])})</span>`;
  function bubble(d, line, i, withAudio) {
    const [role, tl, de] = line;
    return `<div class="bubble ${role}" data-i="${i}"><div class="who">${roleName(d, role)}</div>
      <div class="tl ko">${esc(tl)}</div>${withAudio ? UI.audio(tl) : ''}<div class="tr">${esc(de)}</div></div>`;
  }
  function newWords(d) {
    const have = new Set(Store.state.vocab.map(v => koKey(v.ko)));
    return d.words.filter(w => !have.has(koKey(w[0])));
  }

  /* ── Übersicht ── */
  function list() {
    stopAll();
    const s = st();
    main().innerHTML = `<h1>Dialoge im Alltag</h1>
      <p class="muted">Typische Gespräche zum Hören, Mitlesen und Nachspielen. Im <b>Rollenspiel</b> sprichst oder schreibst du eine Rolle selbst.</p>
      <div class="topic-grid">${data().map(d => `<a class="card topic" href="#dialog/${d.id}"><div class="ticon">${d.icon}</div>
        <div class="gtitle">${esc(d.title)}</div><div class="muted small">${esc(d.place)} · ${d.lines.length} Sätze${s[d.id] && s[d.id].best != null ? ` · Rollenspiel: ${s[d.id].best} %` : ''}</div></a>`).join('')}</div>`;
  }

  /* ── Lesen & Hören ── */
  function detail(id) {
    stopAll();
    const d = byId(id); if (!d) return list();
    const nw = newWords(d);
    main().innerHTML = `<a href="#dialogs" class="back">← Dialoge</a><h1>${d.icon} ${esc(d.title)}</h1>
      <p class="muted">${esc(d.intro)}</p>
      <div class="card"><div class="actions" style="margin-top:0">
        <button class="btn primary" id="play">▶ Ganzen Dialog anhören</button>
        <button class="btn" id="tr">Übersetzung ausblenden</button>
        <button class="btn" id="rp">🎭 Rollenspiel</button>
        <button class="btn" id="pr">✍️ Üben</button></div></div>
      <div class="dlg" id="dlg">${d.lines.map((l, i) => bubble(d, l, i, true)).join('')}</div>
      <div class="card" style="margin-top:14px"><h3>Schlüsselwörter</h3>
        <div class="tablewrap"><table>${d.words.map(w => `<tr><td><span class="ko">${esc(w[0])}</span> ${UI.speakBtn(w[0], 'tiny')}</td><td>${esc(w[1])}</td></tr>`).join('')}</table></div>
        <div class="actions"><button class="btn" id="addw" ${nw.length ? '' : 'disabled'}>📇 ${nw.length ? `${nw.length} neue Wörter als Karteikarten übernehmen` : 'Alle Wörter sind schon in deinen Vokabeln'}</button></div></div>`;
    $('#tr').onclick = () => { const h = $('#dlg').classList.toggle('hide-tr'); $('#tr').textContent = h ? 'Übersetzung einblenden' : 'Übersetzung ausblenden'; };
    $('#play').onclick = () => {
      if (playing) { stopAll(); $('#play').textContent = '▶ Ganzen Dialog anhören'; return; }
      const token = playing = {}; $('#play').textContent = '⏹ Stopp';
      const step = i => {
        document.querySelectorAll('.bubble.playing').forEach(b => b.classList.remove('playing'));
        if (playing !== token || i >= d.lines.length) { if (playing === token) { playing = null; $('#play').textContent = '▶ Ganzen Dialog anhören'; } return; }
        const b = document.querySelector(`.bubble[data-i="${i}"]`); b.classList.add('playing'); b.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        speakLine(d.lines[i][1], d.lines[i][0], () => setTimeout(() => step(i + 1), 350));
      };
      step(0);
    };
    $('#rp').onclick = () => chooseRole(d);
    $('#pr').onclick = () => practice(d);
    $('#addw').onclick = () => {
      const rows = newWords(d).map(([tl, de, pos]) => ({ ko: tl, de, topic: d.topic, pos: pos || '', note: 'aus Dialog: ' + d.title, prio: 2 }));
      const r = g.App.importRows(rows, false);
      UI.toast(`${r.added} Wörter als Karteikarten angelegt.`); detail(id);
    };
  }

  /* ── Rollenspiel ── */
  function chooseRole(d) {
    stopAll();
    main().innerHTML = `<a href="#dialog/${d.id}" class="back" id="bk">← ${esc(d.title)}</a><h1>🎭 Rollenspiel: ${esc(d.title)}</h1>
      <div class="card"><div class="label">Welche Rolle übernimmst du?</div>
        <div class="seg">${['A', 'B'].map(r => `<button data-role="${r}" class="${r === 'B' ? 'on' : ''}">${roleName(d, r)}</button>`).join('')}</div>
        <div class="label">Wie antwortest du?</div>
        <div class="seg"><button data-mode="type" class="on">✍️ Schreiben</button><button data-mode="speak">🗣️ Sprechen (selbst bewerten)</button></div>
        <p class="muted small">Du siehst jeweils, was du sagen sollst (auf Deutsch). Die andere Rolle spricht die App.</p>
        <div class="actions"><button class="btn primary" id="go">Los geht's</button></div></div>`;
    let role = 'B', mode = 'type';
    main().querySelectorAll('[data-role]').forEach(b => b.onclick = () => { role = b.dataset.role; main().querySelectorAll('[data-role]').forEach(x => x.classList.toggle('on', x === b)); });
    main().querySelectorAll('[data-mode]').forEach(b => b.onclick = () => { mode = b.dataset.mode; main().querySelectorAll('[data-mode]').forEach(x => x.classList.toggle('on', x === b)); });
    $('#go').onclick = () => roleplay(d, role, mode);
    $('#bk').onclick = e => { e.preventDefault(); detail(d.id); };   // gleiche Adresse → direkt aufrufen
  }
  function roleplay(d, me, mode) {
    stopAll();
    const results = [];
    let i = 0;
    main().innerHTML = `<div class="run-head"><h2>🎭 ${esc(d.title)}</h2><div class="run-prog"><div class="progress"><div id="rpbar" style="width:0%"></div></div></div><button class="btn ghost small" id="quit">Beenden</button></div>
      <div class="dlg" id="dlg"></div><div id="turn"></div>`;
    $('#quit').onclick = () => finish(true);
    const dlg = $('#dlg'), turn = $('#turn');
    const bar = () => { $('#rpbar').style.width = Math.round(i / d.lines.length * 100) + '%'; };
    function next() {
      UI.onEnter = null; bar();
      if (i >= d.lines.length) return finish(false);
      const line = d.lines[i];
      if (line[0] !== me) {
        dlg.insertAdjacentHTML('beforeend', bubble(d, line, i, true));
        const b = dlg.lastElementChild; b.classList.add('playing'); b.scrollIntoView({ block: 'nearest' });
        turn.innerHTML = `<div class="actions"><button class="btn" id="nx">Weiter ⏎</button></div>`;
        let done = false;
        const go = () => { if (done) return; done = true; b.classList.remove('playing'); i++; next(); };
        $('#nx').onclick = go; UI.onEnter = go;
        if (Store.state.settings.autoplay) speakLine(line[1], line[0], () => setTimeout(() => { if (TTS.voices.length) go(); }, 500));
        return;
      }
      // eigene Zeile
      turn.innerHTML = `<div class="card ex-card"><div class="ex-type">Du bist dran – ${roleName(d, me)}</div>
        <div class="prompt">„${esc(line[2])}“</div>
        ${mode === 'type' ? `<input class="answer ko-input" autocomplete="off" spellcheck="false" placeholder="Was sagst du? …">
          <div class="actions"><button class="btn primary" id="chk">Prüfen ⏎</button><button class="btn ghost" id="idk">Lösung zeigen</button></div>`
          : `<p class="muted small">Sag den Satz laut (gern mit 🎙️ aufnehmen) – dann vergleichen.</p><div class="actions"><button class="btn primary" id="show">Lösung zeigen ⏎</button></div>`}
        <div id="sol"></div></div><div id="fb"></div>`;
      const inp = turn.querySelector('input');
      if (inp) setTimeout(() => inp.focus(), 30);
      const reveal = (ok, typed, selfRate) => {
        UI.onEnter = null;
        turn.querySelectorAll('.ex-card .actions').forEach(a => a.remove()); if (inp) inp.disabled = true;
        $('#sol').innerHTML = (ok === null ? '' : Ex.verdict(ok)) + (typed || '') + `<div class="label">So heißt es im Dialog:</div>${UI.koLine(line[1])}`;
        speakLine(line[1], line[0]);
        const rec = { ok: !!ok }; results.push(rec);
        const fin = () => { dlg.insertAdjacentHTML('beforeend', bubble(d, line, i, false)); dlg.lastElementChild.classList.add(rec.ok ? 'good' : 'bad'); i++; next(); };
        if (selfRate) {
          $('#fb').innerHTML = `<div class="actions"><span class="muted">Wie war's?</span><button class="btn good" id="y">✓ Richtig ⏎</button><button class="btn bad" id="n">✗ Nicht ganz</button></div>`;
          $('#y').onclick = () => { rec.ok = true; fin(); }; $('#n').onclick = () => { rec.ok = false; fin(); }; UI.onEnter = () => $('#y').click();
        } else {
          $('#fb').innerHTML = `<div class="actions">${!ok ? '<button class="btn ghost" id="ovr">Ich hatte doch recht</button>' : ''}<button class="btn primary" id="nx">Weiter ⏎</button></div>`;
          const o = $('#ovr'); if (o) o.onclick = () => { rec.ok = true; o.remove(); turn.querySelectorAll('.verdict').forEach(v => { v.className = 'verdict ok'; v.textContent = '✓ Als richtig gewertet'; }); };
          $('#nx').onclick = fin; UI.onEnter = fin;
        }
      };
      if (mode === 'type') {
        const check = () => {
          const val = inp.value.trim(); if (!val) { UI.toast('Bitte etwas eingeben – oder „Lösung zeigen“.'); return; }
          const r = Check.ko(val, line[1]), ok = r !== 'wrong';
          reveal(ok, ok ? '' : `<div class="label">Dein Satz im Vergleich:</div><div class="diff ko">${Check.diff(val, line[1])}</div>`, false);
        };
        $('#chk').onclick = check; UI.onEnter = check;
        $('#idk').onclick = () => reveal(false, '', false);
      } else {
        const show = () => reveal(null, '', true);
        $('#show').onclick = show; UI.onEnter = show;
      }
    }
    function finish(aborted) {
      stopAll(); UI.onEnter = null;
      const ok = results.filter(r => r.ok).length, pct = results.length ? Math.round(ok / results.length * 100) : 0;
      if (!aborted && results.length) { const s = st(); s[d.id] = { best: Math.max(pct, (s[d.id] && s[d.id].best) || 0), last: pct }; results.forEach(r => g.Core.logStat('grammar', r.ok)); Store.save(); }
      turn.innerHTML = `<div class="card"><h3>${results.length ? `${ok} von ${results.length} Sätzen richtig (${pct} %)` : 'Rollenspiel beendet'}</h3>
        <div class="actions"><button class="btn primary" id="again">Nochmal</button><button class="btn" id="swap">Rollen tauschen</button><button class="btn ghost" id="back">Zum Dialog</button></div></div>`;
      $('#again').onclick = () => roleplay(d, me, mode);
      $('#swap').onclick = () => roleplay(d, me === 'A' ? 'B' : 'A', mode);
      $('#back').onclick = () => detail(d.id);
    }
    next();
  }

  /* ── Üben (Übersetzen, Satzbau, Hördiktat) ── */
  function practice(d) {
    stopAll();
    const pool = shuffle(Ex.sentenceExercises(d.lines.map(l => [l[1], l[2]])));
    const seen = {}, items = [];
    for (const e of pool) { if ((seen[e.ko] = (seen[e.ko] || 0) + 1) > 1) continue; items.push(e); if (items.length >= 10) break; }
    Ex.runExercises({ title: d.icon + ' ' + d.title + ' – üben', list: items, onFinish: res => {
      res.forEach(r => g.Core.logStat('grammar', r.ok)); Store.save();
      const ok = res.filter(r => r.ok).length;
      main().innerHTML = `<h1>${d.icon} ${esc(d.title)}</h1><div class="card"><h3>${res.length ? `${ok} von ${res.length} richtig` : 'Keine Aufgaben bearbeitet'}</h3>
        <div class="actions"><button class="btn primary" id="back">Zum Dialog</button><button class="btn" onclick="location.hash='#dialogs'">Alle Dialoge</button></div></div>`;
      $('#back').onclick = () => detail(d.id);
    } });
  }

  g.DialogView = { list, detail, stop: stopAll };
})(window);
