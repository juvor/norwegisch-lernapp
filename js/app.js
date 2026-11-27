/* Ansichten & Navigation */
(function (g) {
  'use strict';
  const { esc, today, addDays, daysBetween, uid, shuffle, Store, SRS, Check, TTS, logStat, streak } = g.Core;
  const UI = g.UI, Ex = g.Ex;
  const $ = s => document.querySelector(s);
  const main = () => UI.main();
  const S = () => Store.state.settings;

  const POS = ['Nomen', 'Verb', 'Adjektiv', 'Ausdruck', 'Sonstiges'];
  const inDays = d => { const n = daysBetween(today(), d); return n <= 0 ? 'heute' : n === 1 ? 'morgen' : `in ${n} Tagen`; };

  /* ════════════ START ════════════ */
  function viewHome() {
    const due = SRS.due(), fresh = SRS.fresh(), newToday = Math.min(SRS.newLeft(), fresh.length);
    const gDue = SRS.gDue(), gActive = Object.values(Store.state.grammar).filter(x => x.active).length;
    const counts = SRS.phaseCounts(), maxC = Math.max(1, ...counts);
    const day = Store.state.stats.days[today()] || { vocab: 0, vocabOk: 0, grammar: 0, grammarOk: 0 };
    const days = []; for (let i = 13; i >= 0; i--) { const d = addDays(today(), -i); const s = Store.state.stats.days[d]; days.push({ d, n: s ? s.vocab + s.grammar : 0 }); }
    const maxD = Math.max(1, ...days.map(x => x.n));
    let warn = '';
    if (!TTS.voices.length) warn += `<div class="card warn">🔇 <b>Keine norwegische Stimme gefunden.</b> Für die Aussprache bitte unter Windows die norwegische Sprachausgabe installieren – siehe <a href="#settings">Einstellungen → Audio</a>.</div>`;
    if (Store.state.vocab.length && (!Store.state.lastBackup || daysBetween(Store.state.lastBackup, today()) > 14))
      warn += `<div class="card warn">💾 Dein letztes Backup ist ${Store.state.lastBackup ? 'über 14 Tage her' : 'noch nicht gemacht'}. <a href="#settings">Jetzt sichern</a></div>`;
    main().innerHTML = `
      <h1>Hei! <span class="muted small">Heute ist ${new Date().toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long' })}</span></h1>
      ${warn}
      ${packageCard(true)}
      <div class="grid3">
        <div class="card stat">
          <div class="stat-label">Vokabeln fällig</div><div class="stat-num">${due.length}</div>
          <div class="muted">+ ${newToday} neue für heute${fresh.length > newToday ? ` (${fresh.length} warten insgesamt)` : ''}</div>
          <button class="btn primary" ${due.length + newToday ? '' : 'disabled'} onclick="location.hash='#learn'">Vokabeln lernen</button>
        </div>
        <div class="card stat">
          <div class="stat-label">Grammatik fällig</div><div class="stat-num">${gDue.length}</div>
          <div class="muted">${gActive ? gDue.slice(0, S().grammarPointsPerDay).map(id => esc(g.Grammar.byId[id].title)).join(' · ') || `${gActive} Lektionen im Training` : 'Noch keine Lektion im Training'}</div>
          ${gActive ? `<button class="btn primary" ${gDue.length ? '' : 'disabled'} onclick="location.hash='#gtrain'">Grammatik-Training</button>` : `<button class="btn" onclick="location.hash='#grammar'">Lektionen auswählen</button>`}
        </div>
        <div class="card stat">
          <div class="stat-label">Lernserie</div><div class="stat-num">${streak()} 🔥</div>
          <div class="muted">Heute: ${day.vocab} Vokabeln (${day.vocabOk} ✓), ${day.grammar} Grammatikaufgaben (${day.grammarOk} ✓)</div>
          <button class="btn" onclick="location.hash='#trainer'">Freies Training</button>
        </div>
      </div>
      <div class="grid2">
        <div class="card"><h3>Vokabeln nach Phasen</h3>
          <div class="phasebars">${counts.map((c, i) => `<div class="pb"><div class="pb-bar p${i}" style="height:${Math.round(c / maxC * 100)}%"></div><div class="pb-n">${c}</div><div class="pb-l">${i === 0 ? 'neu' : i}</div></div>`).join('')}</div>
          <div class="muted small">${Store.state.vocab.length} Vokabeln · ${SRS.dirs().length === 2 ? 'beide Richtungen' : SRS.dirs()[0] === 'de2ko' ? 'Deutsch → Norwegisch' : 'Norwegisch → Deutsch'}</div>
        </div>
        <div class="card"><h3>Letzte 14 Tage</h3>
          <div class="daybars">${days.map(x => `<div class="db" title="${x.d}: ${x.n} Aufgaben"><div style="height:${Math.round(x.n / maxD * 100)}%"></div></div>`).join('')}</div>
          <div class="muted small">Aufgaben pro Tag (Vokabeln + Grammatik)</div>
        </div>
      </div>
      ${Store.state.vocab.length || pkgs().length ? '' : `<div class="card"><h3>Los geht's</h3><p>Noch keine Vokabeln vorhanden. Unter <a href="#vocab">Vokabeln verwalten</a> kannst du eine Tabelle (Excel/CSV) einfügen – die App macht daraus Karteikarten. Oder übernimm die Phrasen eines <a href="#topics">Themas</a>.</p></div>`}`;
  }

  /* ════════════ VOKABELN LERNEN ════════════ */
  function viewLearn(topic) {
    const filter = topic ? v => topicMatch(v, topic) : null;
    const due = shuffle(SRS.due(filter));
    const fresh = shuffle(SRS.fresh(filter).slice(0, SRS.newLeft()));
    const queue = due.concat(fresh).map(x => Object.assign(x, { practice: false }));
    const title = topic ? 'Vokabeln: ' + topicTitle(topic) : 'Vokabeln lernen';
    if (!queue.length) {
      main().innerHTML = `<h1>${esc(title)}</h1><div class="card"><p>🎉 Für heute ist nichts mehr fällig${SRS.fresh(filter).length ? ' – das Tageslimit für neue Vokabeln ist erreicht (änderbar in den Einstellungen)' : ''}.</p>
        <div class="actions"><button class="btn" onclick="location.hash='#home'">Zur Startseite</button>${SRS.fresh(filter).length ? `<button class="btn ghost" id="more">5 weitere neue Vokabeln</button>` : ''}</div></div>`;
      const m = $('#more'); if (m) m.onclick = () => { Store.state.stats.newCount.n = Math.max(0, Store.state.stats.newCount.n - 5); Store.save(); viewLearn(topic); };
      return;
    }
    const totalSrs = queue.length; let doneSrs = 0, okSrs = 0;
    const promoted = {};
    function next() {
      UI.onEnter = null;
      const item = queue.shift();
      if (!item) return summary();
      card(item);
    }
    function predicted(v, dir, ok) {
      const p = v.srs[dir].phase;
      return ok ? Math.min(6, p + 1) : 1;
    }
    function card(item) {
      const { v, dir } = item; SRS.ensure(v);
      const ph = v.srs[dir].phase;
      const isKo = dir === 'ko2de';
      const promptHtml = isKo ? UI.koLine(v.ko, true) : `<div class="prompt big">${esc(v.de)}</div>`;
      const answer = isKo ? v.de : v.ko;
      const meta = [v.topic && `<span class="tag">${esc(v.topic)}</span>`, v.pos && `<span class="tag">${esc(v.pos)}</span>`, item.practice ? '<span class="tag warn">Wiederholung</span>' : UI.phaseBadge(ph), prioStars(v)].filter(Boolean).join(' ');
      main().innerHTML = `
        <div class="run-head"><h2>${esc(title)}</h2><div class="run-prog"><div class="progress"><div style="width:${Math.round(doneSrs / totalSrs * 100)}%"></div></div><span class="muted">${doneSrs} / ${totalSrs}</span></div><button class="btn ghost small" id="quit">Beenden</button></div>
        <div class="card ex-card">
          <div class="ex-type">${isKo ? 'Norwegisch → Deutsch' : 'Deutsch → Norwegisch'} ${meta}</div>
          ${promptHtml}
          ${S().answerMode === 'type' ? `<input class="answer ${isKo ? '' : 'ko-input'}" placeholder="${isKo ? 'Deutsche Bedeutung …' : 'på norsk …'}" autocomplete="off" spellcheck="false" ${isKo ? 'lang="de"' : 'lang="nb"'}>
            <div class="actions"><button class="btn primary" id="chk">Prüfen ⏎</button><button class="btn ghost" id="idk">Weiß ich nicht</button></div>`
          : `<div class="actions"><button class="btn primary" id="flip">Antwort zeigen ⏎</button></div>`}
          <div id="sol"></div>
        </div><div id="fb"></div>`;
      $('#quit').onclick = summary;
      if (isKo && S().autoplay) TTS.speak(v.ko);
      let verdictOk = null;
      const extras = () => {
        let h = isKo ? '' : '';
        h += `<div class="label">${isKo ? 'Bedeutung' : 'Norwegisch'}:</div>` + (isKo ? `<div class="solution">${esc(v.de)}</div>` + UI.koLine(v.ko) : UI.koLine(v.ko, true) + `<div class="muted">${esc(v.de)}</div>`);
        if (v.note) h += `<div class="hint">📝 ${esc(v.note)}</div>`;
        if (v.exKo) h += `<div class="label">Beispiel:</div>${UI.koLine(v.exKo)}${v.exDe ? `<div class="muted">${esc(v.exDe)}</div>` : ''}`;
        const rw = Ex.resolveWord(v);
        if (rw) h += `<div class="muted small">Formen: <span class="ko">${esc(Ex.formsLine(rw))}</span> · <a href="#table/${encodeURIComponent(String(v.ko).replace(/\(.*?\)/g, '').trim())}">Tabelle</a></div>`;
        return h;
      };
      const phaseLine = ok => item.practice ? '' : `<div class="phase-move">${UI.phaseBadge(ph)} → ${UI.phaseBadge(predicted(v, dir, ok))}</div>`;
      const finalize = () => {
        UI.onEnter = null;
        if (!item.practice) {
          SRS.answer(v, dir, verdictOk); doneSrs++; if (verdictOk) okSrs++;
          if (verdictOk) promoted[v.id + dir] = true;
        }
        if (!verdictOk) queue.push({ v, dir, practice: true });
        next();
      };
      const showResult = (ok, typedHtml, overridable) => {
        verdictOk = ok;
        $('#sol').innerHTML = (ok === null ? '' : Ex.verdict(ok, ok ? undefined : undefined)) + (typedHtml || '') + extras() + `<div id="pl">${ok === null ? '' : phaseLine(ok)}</div>`;
        if (S().autoplay && !isKo) TTS.speak(v.ko);
        const btns = [];
        if (ok === false && overridable) btns.push(`<button class="btn ghost" id="ovr">Ich hatte doch recht</button>`);
        btns.push(`<button class="btn primary" id="nx">Weiter ⏎</button>`);
        $('#fb').innerHTML = `<div class="actions">${btns.join('')}</div>`;
        const ovr = $('#ovr');
        if (ovr) ovr.onclick = () => { verdictOk = true; ovr.remove(); document.querySelectorAll('.verdict').forEach(x => { x.className = 'verdict ok'; x.textContent = '✓ Als richtig gewertet'; }); $('#pl').innerHTML = phaseLine(true); };
        $('#nx').onclick = finalize; UI.onEnter = finalize; $('#nx').focus();
      };
      if (S().answerMode === 'type') {
        const inp = main().querySelector('input.answer');
        setTimeout(() => inp.focus(), 30);
        const check = () => {
          const val = inp.value.trim();
          if (!val) { UI.toast('Antwort eingeben – oder „Weiß ich nicht“.'); return; }
          inp.disabled = true; $('.ex-card .actions').remove();
          const r = isKo ? Check.de(val, v.de) : Check.ko(val, v.ko);
          let typed = '';
          if (r === 'typo') typed = `<div class="hint">${isKo ? 'Kleiner Tippfehler – zählt als richtig.' : 'Zählt als richtig – aber denk an den Artikel bzw. an „å“.'}</div>`;
          if (r === 'wrong') typed = `<div class="label">Deine Antwort:</div><div class="diff ${isKo ? '' : 'ko'}">${isKo ? `<del>${esc(val)}</del>` : Check.diff(val, (Check.alts(answer)[0] || answer))}</div>`;
          showResult(r !== 'wrong', typed, true);
        };
        $('#chk').onclick = check; UI.onEnter = check;
        $('#idk').onclick = () => { inp.disabled = true; $('.ex-card .actions').remove(); showResult(false, '', false); };
      } else {
        const flip = () => {
          $('.ex-card .actions').remove();
          $('#sol').innerHTML = extras();
          if (S().autoplay && !isKo) TTS.speak(v.ko);
          $('#fb').innerHTML = `<div class="actions"><button class="btn good" id="y">✓ Gewusst ⏎</button><button class="btn bad" id="n">✗ Nicht gewusst</button></div>`;
          $('#y').onclick = () => { verdictOk = true; finalize(); };
          $('#n').onclick = () => { verdictOk = false; finalize(); };
          UI.onEnter = () => $('#y').click();
        };
        $('#flip').onclick = flip; UI.onEnter = flip;
      }
    }
    function summary() {
      UI.onEnter = null;
      main().innerHTML = `<h1>${esc(title)}</h1><div class="card"><h3>Geschafft! 🎉</h3>
        <p>${okSrs} von ${doneSrs} Abfragen richtig${doneSrs ? ` (${Math.round(okSrs / doneSrs * 100)} %)` : ''}. ${Object.keys(promoted).length} Karten sind eine Phase aufgestiegen.</p>
        <div class="actions"><button class="btn primary" onclick="location.hash='#home'">Zur Startseite</button><button class="btn" onclick="location.hash='#vocab'">Vokabelliste</button></div></div>`;
    }
    next();
  }

  /* ════════════ VOKABELN VERWALTEN ════════════ */
  function splitCSV(line, d) {
    const out = []; let cur = '', q = false;
    for (let i = 0; i < line.length; i++) {
      const c = line[i];
      if (q) { if (c === '"' && line[i + 1] === '"') { cur += '"'; i++; } else if (c === '"') q = false; else cur += c; }
      else if (c === '"' && cur === '') q = true;
      else if (c === d) { out.push(cur); cur = ''; }
      else cur += c;
    }
    out.push(cur);
    return out.map(s => s.trim());
  }
  // erkennt norwegische Einträge (für vertauschte Spalten): æøå, Artikel oder Infinitiv-å
  const hasHangul = s => /[æøå]/i.test(s || '') || /^(en|ei|et|å)\s/i.test(s || '');
  function normPos(p, ko, de) {
    const x = (p || '').toLowerCase().trim();
    if (/^(aus|phrase|satz|redewendung|wendung)/.test(x)) return 'Ausdruck';
    if (/^(n|nomen|substantiv|noun)\b/.test(x) || x === 'n') return 'Nomen';
    if (/^(v|verb)\b/.test(x)) return 'Verb';
    if (/^(a|adj|adjektiv|adjective)\b/.test(x)) return 'Adjektiv';
    if (x) return 'Sonstiges';
    const k = (ko || '').trim();
    if (/^å\s+\S+$/i.test(k)) return 'Verb';
    if (/^(en|ei|et)\s+\S+$/i.test(k)) return 'Nomen';
    if (/[\s.?!]/.test(k)) return 'Ausdruck';
    return '';
  }
  const normPrio = x => { const n = parseInt(x, 10); return n >= 1 && n <= 5 ? n : undefined; };
  const STARS = { 1: '★★★★★', 2: '★★★★', 3: '★★★', 4: '★★', 5: '★' };
  const PRIO_LABEL = { 1: 'sehr häufig', 2: 'häufig', 3: 'mittel', 4: 'seltener', 5: 'selten' };
  const prioStars = v => `<span class="stars" title="Häufigkeit: ${PRIO_LABEL[v.prio || 3]}">${STARS[v.prio || 3]}</span>`;
  function parseTable(text) {
    text = text.replace(/^﻿/, '');
    const lines = text.split(/\r?\n/).filter(l => l.trim());
    if (!lines.length) return [];
    const l0 = lines[0];
    const d = l0.includes('\t') ? '\t' : (l0.split(';').length > 1 && l0.split(';').length >= l0.split(',').length) ? ';' : ',';
    let rows = lines.map(l => splitCSV(l, d));
    let map = { ko: 0, de: 1, topic: 2, pos: 3, note: 4, exKo: 5, exDe: 6 };
    const h = rows[0].map(x => x.toLowerCase());
    if (h.some(x => /norw|norsk|bokm|deutsch|thema|wortart|bedeutung/.test(x))) {
      const find = re => h.findIndex(x => re.test(x));
      map = { ko: find(/norw|norsk|bokm/), de: find(/deutsch|german|bedeutung|übersetzung/), topic: find(/thema|topic|kategorie|lektion/), pos: find(/wortart|^typ|pos/),
        note: find(/notiz|hinweis|note|bemerkung/), exKo: find(/beispiel.*(no|nor)|example.*no/), exDe: find(/beispiel.*(de|deu)|example.*de/), prio: find(/priorit|häufigkeit|stufe|prio/) };
      rows = rows.slice(1);
    }
    const get = (r, k) => map[k] >= 0 && map[k] !== undefined ? (r[map[k]] || '').trim() : '';
    return rows.map(r => {
      let ko = get(r, 'ko'), de = get(r, 'de');
      if (!hasHangul(ko) && hasHangul(de)) [ko, de] = [de, ko];
      return { ko, de, topic: get(r, 'topic'), pos: normPos(get(r, 'pos'), ko, de), note: get(r, 'note'), exKo: get(r, 'exKo'), exDe: get(r, 'exDe'), prio: normPrio(get(r, 'prio')) };
    }).filter(x => x.ko && x.de);
  }
  const vkey = v => Check.normKo(v.ko) + '|' + v.de.trim().toLowerCase();
  // Für „aktualisieren“: exakt gleiches Wort (nur Leerzeichen vereinheitlicht) – Schreibweise muss exakt stimmen
  const koKey = ko => String(ko).replace(/\s+/g, ' ').trim();
  /* Import. update=true: gibt es genau eine Karte mit demselben norwegischen Wort,
     werden Bedeutung/Thema/Notiz … übernommen – der Lernstand (Phase) bleibt erhalten. */
  function importRows(rows, update) {
    const have = new Set(Store.state.vocab.map(vkey)); let added = 0, dup = 0, updated = 0;
    const byKo = {};
    Store.state.vocab.forEach(v => { const k = koKey(v.ko); (byKo[k] = byKo[k] || []).push(v); });
    const apply = (v, r) => {
      let changed = false;
      for (const k of ['de', 'topic', 'pos', 'note', 'exKo', 'exDe', 'prio']) if (r[k] && r[k] !== v[k]) { v[k] = r[k]; changed = true; }
      return changed;
    };
    for (const r of rows) {
      const same = byKo[koKey(r.ko)] || [];
      if (update) {
        const target = same.find(v => vkey(v) === vkey(r)) || (same.length === 1 ? same[0] : null);
        if (target) { if (apply(target, r)) updated++; else dup++; have.add(vkey(r)); continue; }
      }
      if (have.has(vkey(r))) { dup++; continue; }
      have.add(vkey(r));
      const v = SRS.ensure(Object.assign({ id: uid(), created: today() }, r));
      Store.state.vocab.push(v);
      (byKo[koKey(r.ko)] = byKo[koKey(r.ko)] || []).push(v);
      added++;
    }
    Store.save();
    return { added, dup, updated };
  }

  /* ═══ Vokabelpakete (vokabeln/pakete.js, erzeugt von build_pakete.py) ═══ */
  // eingebautes Startpaket (js/data/startpaket.js) + eigene private Pakete (vokabeln/pakete.js)
  const pkgs = () => [].concat(Array.isArray(window.START_PAKETE) ? window.START_PAKETE : [], Array.isArray(window.VOKABEL_PAKETE) ? window.VOKABEL_PAKETE : []);
  function pkgStatus(p) {
    const done = (Store.state.importedPackages || {})[p.id];
    return !done ? 'neu' : done === p.version ? 'ok' : 'update';
  }
  function packageCard(onlyPending) {
    const list = pkgs(); if (!list.length) return '';
    const pending = list.filter(p => pkgStatus(p) !== 'ok');
    if (onlyPending && !pending.length) return '';
    const label = { neu: '<span class="tag warn">neu</span>', update: '<span class="tag warn">aktualisiert</span>', ok: '<span class="tag">importiert ✓</span>' };
    return `<div class="card ${pending.length ? 'warn' : ''}"><h3>📦 Deine Vokabelpakete</h3>
      ${pending.length ? `<p>${pending.length === 1 ? 'Ein Paket ist' : pending.length + ' Pakete sind'} bereit (${pending.reduce((n, p) => n + p.rows.length, 0)} Karten). Ein Klick genügt – vorhandene Karten werden nur aktualisiert, dein Lernstand bleibt.</p>` : '<p class="muted small">Alle Pakete sind importiert.</p>'}
      <div class="tablewrap"><table>${list.map(p => `<tr><td>${esc(p.title)}</td><td>${p.rows.length} Karten</td><td>${label[pkgStatus(p)]}</td>
        <td><button class="btn small ${pkgStatus(p) === 'ok' ? 'ghost' : ''}" data-pkg="${esc(p.id)}">${pkgStatus(p) === 'ok' ? 'Erneut importieren' : 'Importieren'}</button></td></tr>`).join('')}</table></div>
      ${pending.length > 1 ? '<div class="actions"><button class="btn primary" data-pkg="*">Alle importieren</button></div>' : ''}</div>`;
  }
  function importPackages(id) {
    const list = id === '*' ? pkgs().filter(p => pkgStatus(p) !== 'ok') : pkgs().filter(p => p.id === id);
    let added = 0, updated = 0;
    for (const p of list) {
      const r = importRows(p.rows.map(x => Object.assign({ topic: '', pos: '', note: '', exKo: '', exDe: '' }, x)), true);
      added += r.added; updated += r.updated;
      Store.state.importedPackages = Store.state.importedPackages || {};
      Store.state.importedPackages[p.id] = p.version;
    }
    Store.save();
    UI.toast(`${added} neue Karten${updated ? `, ${updated} aktualisiert` : ''}.`);
    route(); updateBadges();
  }
  document.addEventListener('click', e => { const b = e.target.closest('[data-pkg]'); if (b) importPackages(b.dataset.pkg); });

  function viewVocab() {
    const topics = allTopicNames();
    main().innerHTML = `
      <h1>Vokabeln verwalten</h1>
      ${packageCard(false)}
      <div class="card"><h3>📋 Tabelle importieren</h3>
        <p class="muted">Kopiere Zeilen aus Excel / Google Tabellen hier hinein – oder wähle eine CSV-Datei. Spalten (Überschrift optional):<br>
        <b>Norwegisch · Deutsch · Thema · Wortart · Notiz · Beispiel NO · Beispiel DE</b> — nur die ersten beiden sind Pflicht. Nomen mit Artikel (<i>en bil</i>), Verben mit <i>å</i> (<i>å spise</i>) – dann wird die Wortart automatisch erkannt. Unregelmäßige Formen in Klammern: <i>å skrive (skriver, skrev, har skrevet)</i>, <i>ei bok (boka, bøker, bøkene)</i>. Optional: Spalte <b>Häufigkeit</b> 1–5 (1 = sehr häufig, wird zuerst gelernt).</p>
        <textarea id="imp" rows="6" placeholder="en bil&#9;Auto&#9;Unterwegs
å spise&#9;essen&#9;Essen
å skrive (skriver, skrev, har skrevet)&#9;schreiben"></textarea>
        <div class="actions"><label class="btn ghost">📂 Datei wählen<input type="file" id="impf" accept=".csv,.tsv,.txt" hidden></label><button class="btn" id="prev">Vorschau</button><button class="btn primary" id="doimp" disabled>Importieren</button></div>
        <label class="chk"><input type="checkbox" id="impupd" checked> Vorhandene Karten mit gleichem norwegischen Wort aktualisieren (Lernstand bleibt erhalten) – z. B. für eine korrigierte Liste</label>
        <div id="impprev"></div>
      </div>
      <div class="card"><h3>➕ Einzelne Vokabel</h3>${vocabForm({})}<div class="actions"><button class="btn primary" id="addv">Hinzufügen</button></div></div>
      <div class="card"><h3>📚 Meine Vokabeln (${Store.state.vocab.length})</h3>
        <div class="filters"><input id="q" placeholder="Suchen …"><select id="ft"><option value="">Alle Themen</option>${topics.map(t => `<option>${esc(t)}</option>`).join('')}</select>
        <select id="fs"><option value="new">Neueste zuerst</option><option value="prio">Häufigste zuerst</option><option value="ko">Alphabetisch</option></select>
        <select id="fp"><option value="">Alle Phasen</option>${[0, 1, 2, 3, 4, 5, 6].map(p => `<option value="${p}">${p === 0 ? 'neu' : 'Phase ' + p}</option>`).join('')}</select></div>
        <div id="vlist"></div>
        <div class="actions"><button class="btn ghost small" id="csv">Als CSV exportieren</button><button class="btn ghost small" id="resetp">Fortschritt aller Vokabeln zurücksetzen</button><button class="btn ghost small danger" id="delall">Alle Vokabeln löschen</button></div>
      </div>`;
    let parsed = [];
    const preview = () => {
      parsed = parseTable($('#imp').value);
      const have = new Set(Store.state.vocab.map(vkey));
      const haveKo = new Set(Store.state.vocab.map(v => koKey(v.ko)));
      const dups = parsed.filter(r => have.has(vkey(r)) || ($('#impupd').checked && haveKo.has(koKey(r.ko)))).length;
      $('#impprev').innerHTML = parsed.length ? `<p><b>${parsed.length}</b> Zeilen erkannt${dups ? `, davon ${dups} schon vorhanden${$('#impupd').checked ? ' (werden aktualisiert)' : ' (werden übersprungen)'}` : ''}.</p>
        <div class="tablewrap"><table><tr><th>Norwegisch</th><th>Deutsch</th><th>Thema</th><th>Wortart</th><th>Notiz</th><th>Beispiel</th></tr>
        ${parsed.slice(0, 30).map(r => `<tr><td class="ko">${esc(r.ko)}</td><td>${esc(r.de)}</td><td>${esc(r.topic)}</td><td>${esc(r.pos)}</td><td>${esc(r.note)}</td><td class="ko">${esc(r.exKo)}</td></tr>`).join('')}</table></div>${parsed.length > 30 ? `<p class="muted">… und ${parsed.length - 30} weitere</p>` : ''}`
        : '<p class="muted">Keine gültigen Zeilen gefunden (es braucht mindestens Norwegisch und Deutsch).</p>';
      $('#doimp').disabled = !parsed.length;
    };
    $('#prev').onclick = preview;
    $('#impf').onchange = e => { const f = e.target.files[0]; if (!f) return; const r = new FileReader(); r.onload = () => { $('#imp').value = r.result; preview(); }; r.readAsText(f, 'UTF-8'); };
    $('#impupd').onchange = () => { if (parsed.length) preview(); };
    $('#doimp').onclick = () => { const r = importRows(parsed, $('#impupd').checked); UI.toast(`${r.added} neu${r.updated ? `, ${r.updated} aktualisiert` : ''}${r.dup ? `, ${r.dup} unverändert` : ''}.`); viewVocab(); };
    $('#addv').onclick = () => {
      const v = readForm(main());
      if (!v.ko || !v.de) { UI.toast('Norwegisch und Deutsch sind Pflicht.'); return; }
      const r = importRows([v]); UI.toast(r.added ? 'Hinzugefügt.' : 'Gibt es schon.'); viewVocab();
    };
    const renderList = () => {
      const q = $('#q').value.trim().toLowerCase(), ft = $('#ft').value, fp = $('#fp').value;
      const dirs = SRS.dirs();
      let list = Store.state.vocab.filter(v => (!q || v.ko.toLowerCase().includes(q) || v.de.toLowerCase().includes(q)) && (!ft || topicMatch(v, ft)) && (fp === '' || dirs.some(d => SRS.ensure(v).srs[d].phase === +fp)));
      const total = list.length; const fs = $('#fs').value;
      list = fs === 'prio' ? list.slice().sort((a, b) => (a.prio || 3) - (b.prio || 3)) : fs === 'ko' ? list.slice().sort((a, b) => a.ko.localeCompare(b.ko, 'ko')) : list.slice().reverse();
      list = list.slice(0, 300);
      $('#vlist').innerHTML = total ? `<div class="tablewrap"><table class="vt"><tr><th>Norwegisch</th><th>Deutsch</th><th>Thema</th><th>Wortart</th><th>Häufigkeit</th><th>Phase</th><th></th></tr>
        ${list.map(v => `<tr><td><span class="ko">${esc(v.ko)}</span> ${UI.speakBtn(v.ko, 'tiny')}</td><td>${esc(v.de)}</td><td>${esc(v.topic || '')}</td><td>${esc(v.pos || '')}</td><td class="nowrap">${prioStars(v)}</td>
        <td>${dirs.map(d => `<span title="${d === 'de2ko' ? 'DE→KO' : 'KO→DE'}${v.srs[d].due ? ', fällig ' + inDays(v.srs[d].due) : ''}">${UI.phaseBadge(v.srs[d].phase)}</span>`).join(' ')}</td>
        <td class="nowrap"><button class="icon-btn" data-edit="${v.id}" title="Bearbeiten">✏️</button><button class="icon-btn" data-del="${v.id}" title="Löschen">🗑️</button></td></tr>`).join('')}</table></div>
        ${total > 300 ? `<p class="muted">Zeige 300 von ${total} – nutze die Suche oder die Sortierung.</p>` : ''}` : '<p class="muted">Keine Vokabeln gefunden.</p>';
      $('#vlist').querySelectorAll('[data-del]').forEach(b => b.onclick = () => {
        const v = Store.state.vocab.find(x => x.id === b.dataset.del);
        if (confirm(`„${v.ko} – ${v.de}“ löschen?`)) { Store.state.vocab = Store.state.vocab.filter(x => x !== v); Store.save(); renderList(); }
      });
      $('#vlist').querySelectorAll('[data-edit]').forEach(b => b.onclick = () => editVocab(Store.state.vocab.find(x => x.id === b.dataset.edit), renderList));
    };
    ['#q', '#ft', '#fp', '#fs'].forEach(s => $(s).oninput = renderList);
    renderList();
    $('#csv').onclick = exportCSV;
    $('#resetp').onclick = () => { if (confirm('Alle Vokabeln wieder auf „neu“ setzen?')) { Store.state.vocab.forEach(v => { v.srs = null; SRS.ensure(v); }); Store.save(); renderList(); } };
    $('#delall').onclick = () => { if (confirm('Wirklich ALLE Vokabeln löschen? (Vorher ein Backup machen!)')) { Store.state.vocab = []; Store.save(); viewVocab(); } };
  }
  function vocabForm(v) {
    const topics = allTopicNames();
    return `<div class="form-grid">
      <label>Norwegisch<input name="ko" class="ko-input" lang="nb" spellcheck="false" value="${esc(v.ko || '')}"></label>
      <label>Deutsch<input name="de" value="${esc(v.de || '')}"></label>
      <label>Thema<input name="topic" list="topiclist" value="${esc(v.topic || '')}"><datalist id="topiclist">${topics.map(t => `<option value="${esc(t)}">`).join('')}</datalist></label>
      <label>Wortart<select name="pos"><option value="">automatisch</option>${POS.map(p => `<option ${v.pos === p ? 'selected' : ''}>${p}</option>`).join('')}</select></label>
      <label>Häufigkeit<select name="prio">${[1, 2, 3, 4, 5].map(n => `<option value="${n}" ${(v.prio || 3) === n ? 'selected' : ''}>${STARS[n]} ${PRIO_LABEL[n]}</option>`).join('')}</select></label>
      <label>Notiz<input name="note" value="${esc(v.note || '')}"></label>
      <label class="wide">Beispielsatz (Norwegisch)<input name="exKo" class="ko-input" lang="nb" spellcheck="false" value="${esc(v.exKo || '')}"></label>
      <label class="wide">Beispielsatz (Deutsch)<input name="exDe" value="${esc(v.exDe || '')}"></label></div>`;
  }
  function readForm(root) {
    const f = n => (root.querySelector(`[name="${n}"]`).value || '').trim();
    const v = { ko: f('ko'), de: f('de'), topic: f('topic'), pos: f('pos'), note: f('note'), exKo: f('exKo'), exDe: f('exDe') };
    v.pos = v.pos || normPos('', v.ko, v.de);
    v.prio = parseInt(root.querySelector('[name="prio"]').value, 10) || 3;
    return v;
  }
  function editVocab(v, done) {
    const dlg = document.createElement('dialog');
    dlg.innerHTML = `<h3>Vokabel bearbeiten</h3>${vocabForm(v)}<div class="actions"><button class="btn ghost" id="rs">Fortschritt zurücksetzen</button><button class="btn ghost" id="cn">Abbrechen</button><button class="btn primary" id="sv">Speichern</button></div>`;
    document.body.appendChild(dlg); dlg.showModal();
    const close = () => { dlg.close(); dlg.remove(); };
    dlg.querySelector('#cn').onclick = close;
    dlg.querySelector('#rs').onclick = () => { v.srs = null; SRS.ensure(v); Store.save(); UI.toast('Zurückgesetzt.'); };
    dlg.querySelector('#sv').onclick = () => {
      const n = readForm(dlg); if (!n.ko || !n.de) return UI.toast('Norwegisch und Deutsch sind Pflicht.');
      if (n.cls === undefined) delete v.cls;
      Object.assign(v, n); Store.save(); close(); done && done();
    };
  }
  function download(name, text, type) {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([text], { type }));
    a.download = name; document.body.appendChild(a); a.click(); a.remove();
  }
  function exportCSV() {
    const q = s => /[;"\n]/.test(s || '') ? '"' + String(s).replace(/"/g, '""') + '"' : (s || '');
    const lines = ['Norwegisch;Deutsch;Thema;Wortart;Notiz;Beispiel NO;Beispiel DE;Häufigkeit'].concat(Store.state.vocab.map(v => [v.ko, v.de, v.topic, v.pos, v.note, v.exKo, v.exDe, String(v.prio || 3)].map(q).join(';')));
    download('vokabeln-' + today() + '.csv', '﻿' + lines.join('\r\n'), 'text/csv;charset=utf-8');
  }

  /* ════════════ GRAMMATIK ════════════ */
  function gStatus(id) {
    const s = Store.state.grammar[id];
    if (!s || !s.active) return '<span class="muted small">nicht im Training</span>';
    return `${UI.phaseBadge(s.phase)} <span class="small ${s.due <= today() ? 'due' : 'muted'}">${s.due <= today() ? 'fällig' : 'fällig ' + inDays(s.due)}</span>`;
  }
  function viewGrammar() {
    const due = SRS.gDue();
    const levels = [...new Set(g.Grammar.points.map(p => p.level))];
    main().innerHTML = `<h1>Grammatik</h1>
      <div class="card"><p>Lies eine Lektion und nimm sie <b>ins Training</b> auf. Dann wird sie – wie Vokabeln – in Phasen wiederholt: mit Übersetzungen in beide Richtungen, Fehlersuche, Satzbau, Hördiktat und Konjugationsaufgaben. Den Rhythmus stellst du in den <a href="#settings">Einstellungen</a> ein.</p>
      <div class="actions"><button class="btn primary" ${due.length ? '' : 'disabled'} onclick="location.hash='#gtrain'">Fällige trainieren (${due.length})</button></div></div>
      ${levels.map(l => `<h2>Level ${l}</h2><div class="glist">${g.Grammar.points.filter(p => p.level === l).map(p => `
        <a class="gitem card" href="#g/${p.id}"><div><div class="gtitle">${esc(p.title)}</div><div class="muted small">${esc(p.summary)}</div></div><div class="gstat">${gStatus(p.id)}</div></a>`).join('')}</div>`).join('')}`;
  }
  function viewGrammarDetail(id) {
    const p = g.Grammar.byId[id]; if (!p) return viewGrammar();
    const s = Store.state.grammar[id]; const active = s && s.active;
    main().innerHTML = `<a href="#grammar" class="back">← Grammatik</a>
      <h1>${esc(p.title)}</h1><div class="muted">Level ${p.level} · ${esc(p.summary)}</div>
      <div class="card explain">${p.explain}</div>
      <div class="card"><h3>Beispielsätze</h3>${p.s.map(([ko, de]) => `<div class="ex-row">${UI.koLine(ko)}<div class="muted">${esc(de)}</div></div>`).join('')}</div>
      <div class="card"><div class="actions">
        <button class="btn ${active ? 'ghost' : 'primary'}" id="tog">${active ? 'Aus dem Training nehmen' : '➕ Ins Training aufnehmen'}</button>
        <button class="btn" id="prac">Jetzt frei üben</button>
        ${p.drill && p.drill.kind === 'conj' ? `<a class="btn ghost" href="#trainer">Konjugationstrainer</a>` : ''}
        </div><div class="muted small">${active ? 'Status: ' + gStatus(id) : 'Freies Üben verändert die Phase nicht.'}</div></div>`;
    $('#tog').onclick = () => { SRS.gActivate(id, !active); viewGrammarDetail(id); };
    $('#prac').onclick = () => {
      Ex.runExercises({ title: p.title + ' – freies Üben', list: Ex.grammarExercises(p, S().grammarPerPoint + 2),
        onFinish: res => { res.forEach(r => logStat('grammar', r.ok)); Store.save(); resultScreen(p.title, res, `#g/${id}`); } });
    };
  }
  function resultScreen(title, res, back, extraHtml) {
    const ok = res.filter(r => r.ok).length;
    main().innerHTML = `<h1>${esc(title)}</h1><div class="card"><h3>${res.length ? `${ok} von ${res.length} richtig (${Math.round(ok / res.length * 100)} %)` : 'Keine Aufgaben bearbeitet'}</h3>${extraHtml || ''}
      ${res.some(r => !r.ok) ? `<div class="label">Das solltest du dir nochmal ansehen:</div>${res.filter(r => !r.ok).map(r => mistakeLine(r.ex)).join('')}` : ''}
      <div class="actions"><button class="btn primary" onclick="location.hash='${back}'">Zurück</button><button class="btn" onclick="location.hash='#home'">Startseite</button></div></div>`;
  }
  function mistakeLine(ex) {
    if (ex.type === 'conj') return `<div class="ex-row"><span class="ko">${esc(ex.show)}</span> → ${esc(ex.label)}: ${UI.koLine(Check.alts(ex.answer)[0] || ex.answer)}</div>`;
    if (ex.type === 'error') return `<div class="ex-row">${UI.koLine(ex.right)}<div class="muted small">💡 ${esc(ex.hint)}</div></div>`;
    if (ex.type === 'choice') return `<div class="ex-row">${UI.koLine(ex.full || ex.q.replace(/\s*\(.*?\)\s*$/, '').replace(/_{2,}/, ex.answer))}</div>`;
    if (ex.type === 'number') return `<div class="ex-row">${esc(ex.q)}: ${UI.koLine(ex.answers[0])}</div>`;
    return `<div class="ex-row">${UI.koLine(ex.ko)}<div class="muted small">${esc(ex.de)}</div></div>`;
  }
  function viewGrammarTrain() {
    const ids = SRS.gDue().slice(0, S().grammarPointsPerDay);
    if (!ids.length) { main().innerHTML = `<h1>Grammatik-Training</h1><div class="card"><p>Heute ist keine Grammatik fällig. 👍</p><div class="actions"><a class="btn" href="#grammar">Zu den Lektionen</a></div></div>`; return; }
    const per = S().grammarPerPoint;
    let list = [];
    ids.forEach(id => { list = list.concat(Ex.grammarExercises(g.Grammar.byId[id], per)); });
    list = shuffle(list);
    const counts = {}; list.forEach(e => counts[e.gid] = (counts[e.gid] || 0) + 1);
    Ex.runExercises({
      title: 'Grammatik-Training', list,
      onFinish: res => {
        res.forEach(r => logStat('grammar', r.ok));
        let html = '<table class="res"><tr><th>Lektion</th><th>Ergebnis</th><th>Phase</th><th>Nächstes Training</th></tr>';
        ids.forEach(id => {
          const mine = res.filter(r => r.ex.gid === id); const p = g.Grammar.byId[id];
          if (mine.length < counts[id]) { html += `<tr><td>${esc(p.title)}</td><td colspan="3" class="muted">nicht vollständig – bleibt fällig</td></tr>`; return; }
          const pct = mine.filter(r => r.ok).length / mine.length; const r = SRS.gResult(id, pct);
          html += `<tr><td>${esc(p.title)}</td><td>${Math.round(pct * 100)} %</td><td>${UI.phaseBadge(r.before)} → ${UI.phaseBadge(r.after)}</td><td>${inDays(r.due)}</td></tr>`;
        });
        html += '</table><p class="muted small">≥ 80 %: Phase steigt · 50–79 %: Phase bleibt, morgen nochmal · unter 50 %: zurück auf Phase 1</p>';
        Store.save();
        resultScreen('Grammatik-Training', res, '#grammar', html);
      }
    });
  }

  /* ════════════ TRAINER ════════════ */
  function viewTrainer(tab) {
    tab = tab || 'verb';
    const NS = g.Norsk;
    const t = S().trainer = Object.assign({ vforms: ['pres', 'pret', 'perf'], vtype: 'all', nforms: ['def', 'pl', 'defPl'], aforms: ['n', 'pl'], source: 'both', numbers: ['zahl', 'preis', 'uhr', 'datum'] }, S().trainer || {});
    const tabs = [['verb', 'Verben'], ['noun', 'Substantive'], ['adj', 'Adjektive'], ['num', 'Zahlen'], ['table', 'Formentabelle']];
    const chk = (dict, sel) => Object.entries(dict).map(([k, f]) => `<label class="chk"><input type="checkbox" value="${k}" ${sel.includes(k) ? 'checked' : ''}> ${esc(f.label)} <span class="muted small">${esc(f.hint)}</span></label>`).join('');
    const src = n => `<div class="filters"><label>Wörter: <select id="src"><option value="both">eingebaut + meine</option><option value="builtin">nur eingebaut</option><option value="mine">nur meine Vokabeln (${n})</option></select></label></div>`;
    const go = '<div class="actions"><button class="btn primary" id="go">Start</button></div>';
    let body = '';
    if (tab === 'verb') {
      body = `<p>Zeiten und Formen – inklusive starker Verben. Eigene Verben zählen mit, wenn sie im Lexikon stehen oder mit Formen eingetragen sind, z. B. <i>å skrive (skriver, skrev, har skrevet)</i>.</p>
        ${chk(NS.VERB_FORMS, t.vforms)}
        <div class="filters"><label>Verbtyp: <select id="vtype"><option value="all">alle</option><option value="weak">nur schwache (Klasse 1–4)</option><option value="strong">nur starke / unregelmäßige</option></select></label></div>${src(Ex.userVerbs().length)}${go}`;
    } else if (tab === 'noun') {
      body = `<p>Bestimmte Form und Plural – mit allen unregelmäßigen Nomen (mann – menn, bok – bøker …). Bei ei-Wörtern zählen beide Formen (jenta / jenten).</p>${chk(NS.NOUN_FORMS, t.nforms)}${src(Ex.userNouns().length)}${go}`;
    } else if (tab === 'adj') {
      body = `<p>Angleichung (stort, store) und Steigerung (større, størst).</p>${chk(NS.ADJ_FORMS, t.aforms)}${src(Ex.userAdjs().length)}${go}`;
    } else if (tab === 'num') {
      body = `<p>Zahlen, Preise, Uhrzeiten und Datum. Leerzeichen sind egal, „syv“ statt „sju“ zählt auch.</p>
        ${[['zahl', 'Zahlen ausschreiben'], ['preis', 'Preise in Kronen'], ['uhr', 'Uhrzeiten (halv fire …)'], ['datum', 'Datum (syttende mai)']].map(([k, l]) => `<label class="chk"><input type="checkbox" value="${k}" ${t.numbers.includes(k) ? 'checked' : ''}> ${l}</label>`).join('')}${go}`;
    } else {
      body = tableBody();
    }
    main().innerHTML = `<h1>Trainer</h1><div class="tabs">${tabs.map(([k, l]) => `<a href="#trainer/${k}" class="${k === tab ? 'active' : ''}">${l}</a>`).join('')}</div><div class="card">${body}</div>`;
    if (tab === 'table') return tableInit();
    if ($('#src')) $('#src').value = t.source;
    if ($('#vtype')) $('#vtype').value = t.vtype;
    $('#go').onclick = () => {
      const checked = [...main().querySelectorAll('.card input[type=checkbox][value]:checked')].map(x => x.value);
      if (!checked.length) return UI.toast('Bitte mindestens eine Option wählen.');
      if ($('#src')) t.source = $('#src').value;
      if (tab === 'verb') { t.vforms = checked; t.vtype = $('#vtype').value; }
      if (tab === 'noun') t.nforms = checked;
      if (tab === 'adj') t.aforms = checked;
      if (tab === 'num') t.numbers = checked;
      Store.save();
      const next = tab === 'verb' ? () => Ex.verbEx(t.vforms, { source: t.source, weakOnly: t.vtype === 'weak', strongOnly: t.vtype === 'strong' })
        : tab === 'noun' ? () => Ex.nounEx(t.nforms, { source: t.source })
          : tab === 'adj' ? () => Ex.adjEx(t.aforms, { source: t.source }) : () => Ex.numberEx(t.numbers);
      Ex.runExercises({ title: tabs.find(x => x[0] === tab)[1] + '-Trainer', next, onFinish: res => { res.forEach(r => logStat('grammar', r.ok)); Store.save(); resultScreen('Trainer', res, '#trainer/' + tab); } });
    };
  }
  let tablePreset = '';
  function tableBody() {
    const ex = ['å gå', 'å skrive', 'å snakke', 'å bo', 'en mann', 'ei bok', 'et barn', 'et øye', 'god', 'liten', 'gammel'];
    return `<p>Gib ein Wort ein und sieh alle Formen: Verben mit <b>å</b> (å spise), Nomen mit Artikel (<b>en/ei/et</b> bil), Adjektive ohne Zusatz (stor).</p>
      <div class="filters"><input id="tv" class="ko-input" lang="nb" spellcheck="false" placeholder="z. B. å skrive, et hus, stor" value="${esc(tablePreset)}"></div>
      <div id="tout"></div>
      <div class="label">Beispiele:</div><div class="chips">${ex.map(w => `<button class="chip" data-v="${esc(w)}">${esc(w)}</button>`).join('')}</div>`;
  }
  function tableInit() {
    const NS = g.Norsk, Lx = g.Lexicon;
    const row = (label, val) => `<tr><td>${esc(label)}</td><td><span class="ko">${esc(val)}</span> ${UI.speakBtn(val, 'tiny')}</td></tr>`;
    const render = () => {
      const w = $('#tv').value.trim().toLowerCase(); if (!w) { $('#tout').innerHTML = ''; return; }
      let m, html = '', warn = '';
      const mine = Store.state.vocab.map(v => ({ v, r: Ex.resolveWord(v) })).filter(x => x.r);
      if ((m = w.match(/^å\s+(\S+)$/)) || Lx.verbs.find(x => x.inf === w)) {
        const inf = m ? m[1] : w;
        const hit = Lx.verbs.find(x => x.inf === inf) || (mine.find(x => x.r.kind === 'verb' && x.r.word.inf === inf) || {}).r?.word;
        if (!hit) warn = 'Nicht im Lexikon – Formen nach Regel (schwaches Verb). Bitte prüfen!';
        const e = hit || { inf }; const f = NS.verbForms(e);
        html = `<div class="hint">${hit && hit.de ? `<b>${esc(hit.de)}</b> · ` : ''}${esc(NS.CLASS_INFO[f.cls] || '')}</div><div class="tablewrap"><table>` +
          [['Infinitiv', f.inf], ['Präsens', f.pres], ['Präteritum', f.pret], ['Perfektum', f.perf], ['Plusquamperfekt', f.plusq], ['Futur', f.fut], ['Futur (Vorhersage)', f.futK], ['Imperativ', f.imp + '!']]
            .filter(([k]) => !(e.modal && ['Futur', 'Futur (Vorhersage)', 'Imperativ'].includes(k))).map(([k, v]) => row(k, v)).join('') + '</table></div>';
      } else if ((m = w.match(/^(en|ei|et)\s+(\S+)$/)) || Lx.nouns.find(x => x.no === w)) {
        const no = m ? m[2] : w;
        const hit = Lx.nouns.find(x => x.no === no) || (mine.find(x => x.r.kind === 'noun' && x.r.word.no === no) || {}).r?.word;
        if (!hit) warn = 'Nicht im Lexikon – Formen nach Regel. Bitte prüfen!';
        const e = hit || { no, g: { en: 'm', ei: 'f', et: 'n' }[m[1]] }; const f = NS.nounForms(e);
        html = `<div class="hint">${hit && hit.de ? `<b>${esc(hit.de)}</b> · ` : ''}Geschlecht: ${esc(NS.GENUS[e.g])}</div><div class="tablewrap"><table>` +
          row('unbestimmt Singular', f.indef) + row('bestimmt Singular', f.def + (f.defAlt ? ' / ' + f.defAlt : '')) + row('unbestimmt Plural', f.pl) + row('bestimmt Plural', f.defPl) + '</table></div>';
      } else {
        const hit = Lx.adjs.find(x => x.no === w) || (mine.find(x => x.r.kind === 'adj' && x.r.word.no === w) || {}).r?.word;
        if (!hit) warn = 'Nicht im Lexikon – als Adjektiv nach Regel gebildet. Verben bitte mit „å“, Nomen mit en/ei/et eingeben.';
        const f = NS.adjForms(hit || { no: w });
        html = `<div class="hint">${hit && hit.de ? `<b>${esc(hit.de)}</b>` : 'Adjektiv'}</div><div class="tablewrap"><table>` +
          row('en / ei (Grundform)', f.m) + row('et (Neutrum)', f.n) + row('Plural / bestimmt', f.pl) + row('Komparativ', f.komp) + row('Superlativ', f.sup) + '</table></div>';
      }
      $('#tout').innerHTML = (warn ? `<div class="card warn small">⚠️ ${esc(warn)}</div>` : '') + html;
    };
    $('#tv').oninput = render;
    main().querySelectorAll('[data-v]').forEach(b => b.onclick = () => { $('#tv').value = b.dataset.v; render(); });
    if (tablePreset) render();
  }

  /* ════════════ THEMEN ════════════ */
  function allTopicNames() {
    const set = new Set(g.Topics.list.map(t => t.id));
    Store.state.vocab.forEach(v => { if (v.topic) set.add(v.topic); });
    return [...set];
  }
  function topicTitle(id) { const t = g.Topics.byId[id]; return t ? t.title : id; }
  function topicMatch(v, id) {
    if (!v.topic) return false;
    const a = v.topic.trim().toLowerCase(); const t = g.Topics.byId[id];
    return a === id.toLowerCase() || (t && a === t.title.toLowerCase());
  }
  function viewTopics() {
    const names = allTopicNames();
    main().innerHTML = `<h1>Themen</h1><p class="muted">Alltagsthemen mit nützlichen Sätzen. Eigene Vokabeln landen automatisch beim Thema aus ihrer Spalte „Thema“.</p>
      <div class="topic-grid">${names.map(id => {
        const t = g.Topics.byId[id]; const n = Store.state.vocab.filter(v => topicMatch(v, id)).length;
        const due = SRS.due(v => topicMatch(v, id)).length;
        return `<a class="card topic" href="#topic/${encodeURIComponent(id)}"><div class="ticon">${t ? t.icon : '🏷️'}</div><div class="gtitle">${esc(t ? t.title : id)}</div>
          <div class="muted small">${t ? t.phrases.length + ' Sätze · ' : ''}${n} Vokabeln${due ? ` · <span class="due">${due} fällig</span>` : ''}</div></a>`;
      }).join('')}</div>`;
  }
  function viewTopic(id) {
    const t = g.Topics.byId[id];
    const vocab = Store.state.vocab.filter(v => topicMatch(v, id));
    const due = SRS.due(v => topicMatch(v, id)).length, fresh = SRS.fresh(v => topicMatch(v, id)).length;
    main().innerHTML = `<a href="#topics" class="back">← Themen</a><h1>${t ? t.icon + ' ' + esc(t.title) : esc(id)}</h1>
      ${t ? `<div class="card"><h3>Nützliche Sätze</h3>${t.phrases.map(([ko, de]) => `<div class="ex-row">${UI.koLine(ko)}<div class="muted">${esc(de)}</div></div>`).join('')}
        <div class="actions"><button class="btn primary" id="pp">Sätze üben</button><button class="btn ghost" id="padd">Sätze als Karteikarten übernehmen</button></div></div>` : ''}
      <div class="card"><h3>Meine Vokabeln zu diesem Thema (${vocab.length})</h3>
        ${vocab.length ? `<div class="tablewrap"><table>${vocab.map(v => `<tr><td><span class="ko">${esc(v.ko)}</span> ${UI.speakBtn(v.ko, 'tiny')}</td><td>${esc(v.de)}</td><td>${SRS.dirs().map(d => UI.phaseBadge(SRS.ensure(v).srs[d].phase)).join(' ')}</td></tr>`).join('')}</table></div>`
        : '<p class="muted">Noch keine. Trage beim Import in der Spalte „Thema“ <b>' + esc(id) + '</b> ein.</p>'}
        <div class="actions"><button class="btn primary" id="vl" ${due + Math.min(fresh, SRS.newLeft()) ? '' : 'disabled'}>Vokabeln lernen (${due} fällig, ${fresh} neu)</button>
        <button class="btn" id="vp" ${vocab.length ? '' : 'disabled'}>Alle frei üben</button></div></div>`;
    if (t) {
      $('#pp').onclick = () => {
        const pool = shuffle(Ex.sentenceExercises(t.phrases)); const used = {}; const list = [];
        for (const e of pool) { const k = e.ko + e.type; if (used[k] || list.filter(x => x.ko === e.ko).length >= 2) continue; used[k] = 1; list.push(e); if (list.length >= 12) break; }
        Ex.runExercises({ title: t.title, list, onFinish: res => { res.forEach(r => logStat('grammar', r.ok)); Store.save(); resultScreen(t.title, res, '#topic/' + encodeURIComponent(id)); } });
      };
      $('#padd').onclick = () => { const r = importRows(t.phrases.map(([ko, de]) => ({ ko, de, topic: id, pos: 'Ausdruck' }))); UI.toast(`${r.added} Karten angelegt${r.dup ? `, ${r.dup} gab es schon` : ''}.`); viewTopic(id); };
    }
    $('#vl').onclick = () => { location.hash = '#learn/' + encodeURIComponent(id); };
    $('#vp').onclick = () => {
      const list = shuffle(vocab).slice(0, 20).map(v => Math.random() < 0.5 ? { type: 'de2ko', ko: v.ko, de: v.de } : { type: 'ko2de', ko: v.ko, de: v.de });
      Ex.runExercises({ title: topicTitle(id) + ' – frei üben', list, onFinish: res => resultScreen(topicTitle(id), res, '#topic/' + encodeURIComponent(id)) });
    };
  }

  /* ════════════ EINSTELLUNGEN ════════════ */
  const V_PRESETS = { 'Klassisch': [1, 3, 9, 29, 90, 180], 'Intensiv': [1, 2, 4, 8, 16, 32], 'Entspannt': [2, 5, 14, 40, 120, 240] };
  const G_PRESETS = { 'Häufig': [1, 2, 4, 7, 14, 30], 'Normal': [1, 3, 7, 14, 30, 60], 'Selten': [2, 5, 10, 21, 45, 90] };
  function viewSettings() {
    const s = S();
    const intInputs = (name, arr) => arr.map((d, i) => `<label class="int">Phase ${i + 1}<input type="number" min="1" max="999" data-int="${name}" data-i="${i}" value="${d}"></label>`).join('');
    const ui = s.ui, T = g.Theme;
    const presetHit = T.ACCENTS.some(([c]) => c.toLowerCase() === ui.accent.toLowerCase());
    main().innerHTML = `<h1>Einstellungen</h1>
      <div class="card"><h3>🎨 Darstellung</h3>
        <div class="label">Modus</div>
        <div class="seg">${T.THEMES.map(([k, l]) => `<button data-theme="${k}" class="${ui.theme === k ? 'on' : ''}">${l}</button>`).join('')}</div>
        <div class="label">Akzentfarbe</div>
        <div class="swatches">${T.ACCENTS.map(([c, n]) => `<button class="swatch ${ui.accent.toLowerCase() === c ? 'on' : ''}" style="background:${c}" data-accent="${c}" title="${n}"></button>`).join('')}
          <label class="swatch-custom">eigene:<input type="color" id="acc" value="${esc(ui.accent)}" class="${presetHit ? '' : 'on'}"></label></div>
        <div class="label">Schriftgröße</div>
        <div class="seg">${T.SCALES.map(([v, l]) => `<button data-scale="${v}" class="${ui.scale === v ? 'on' : ''}">${l}</button>`).join('')}</div>
        <div class="muted small">Vorschau: <span class="ko">Hei og velkommen!</span> · <span class="phase p3">Phase 3</span> · <a href="#settings">Link</a></div>
      </div>
      <div class="card"><h3>⌨️ æ ø å</h3>
        <p class="muted small">Unten rechts findest du den Knopf <b>⌨️ æøå</b>: Er blendet eine kleine Leiste mit æ, ø, å (und Großbuchstaben) ein.</p>
        <label class="chk"><input type="checkbox" id="kphys" ${s.kbd.physical ? 'checked' : ''}> Deutsche Tastatur in norwegischen Feldern: <b>ä → æ</b>, <b>ö → ø</b>, <b>ü → å</b> (mit Umschalt: Æ Ø Å)</label>
        <label class="chk"><input type="checkbox" id="kauto" ${s.kbd.auto ? 'checked' : ''}> Leiste automatisch öffnen, sobald ein norwegisches Feld aktiv ist (praktisch auf dem iPad)</label>
      </div>
      <div class="card"><h3>📇 Vokabeln</h3>
        <p class="muted small">Tage bis zur nächsten Abfrage, nachdem eine Karte die jeweilige Phase erreicht hat. Falsch beantwortet → zurück auf Phase 1.</p>
        <div class="ints">${intInputs('vocabIntervals', s.vocabIntervals)}</div>
        <div class="chips">${Object.keys(V_PRESETS).map(k => `<button class="chip" data-vp="${k}">${k}</button>`).join('')}</div>
        <div class="form-grid">
          <label>Abfragerichtung<select id="dir"><option value="both">Beide Richtungen</option><option value="de2ko">Deutsch → Norwegisch</option><option value="ko2de">Norwegisch → Deutsch</option></select></label>
          <label>Antwortmodus<select id="mode"><option value="type">Eintippen</option><option value="flip">Karte umdrehen & selbst bewerten</option></select></label>
          <label>Neue Karten pro Tag<input type="number" id="npd" min="0" max="500" value="${s.newPerDay}"></label>
          <label class="chk"><input type="checkbox" id="typo" ${s.typoTolerance ? 'checked' : ''}> kleine Tippfehler im Deutschen tolerieren</label>
        </div></div>
      <div class="card"><h3>📘 Grammatik-Rhythmus</h3>
        <p class="muted small">Wie oft Grammatiklektionen fällig werden (Tage pro Phase).</p>
        <div class="ints">${intInputs('grammarIntervals', s.grammarIntervals)}</div>
        <div class="chips">${Object.keys(G_PRESETS).map(k => `<button class="chip" data-gp="${k}">${k}</button>`).join('')}</div>
        <div class="form-grid">
          <label>Aufgaben pro Lektion<input type="number" id="gpp" min="3" max="30" value="${s.grammarPerPoint}"></label>
          <label>Max. Lektionen pro Training<input type="number" id="gpd" min="1" max="20" value="${s.grammarPointsPerDay}"></label>
        </div></div>
      <div class="card"><h3>🔊 Audio</h3>
        <div class="form-grid">
          <label>Stimme<select id="voice">${TTS.voices.length ? TTS.voices.map(v => `<option value="${esc(v.voiceURI)}" ${v.voiceURI === s.voiceURI ? 'selected' : ''}>${esc(v.name)}${v.localService ? ' (offline)' : ' (online!)'}</option>`).join('') : '<option>— keine norwegische Stimme gefunden —</option>'}</select></label>
          <label>Tempo <span id="ratev">${s.rate}</span><input type="range" id="rate" min="0.5" max="1.3" step="0.05" value="${s.rate}"></label>
          <label class="chk"><input type="checkbox" id="auto" ${s.autoplay ? 'checked' : ''}> Norwegisch automatisch vorlesen</label>
        </div>
        <div class="actions"><button class="btn" data-speak="Hei! Jeg lærer norsk, og det er veldig gøy.">▶ Stimme testen</button></div>
        <p class="muted small">💡 Gefällt dir eine Stimme besser (z. B. die zweite Stimme in den Dialogen)? Hier auswählen und testen. Stimmen mit „(online!)“ klingen oft natürlicher, brauchen aber Internet – ohne Internet nimmt die App automatisch die Offline-Stimme. In den Dialogen spricht die andere Rolle dann mit der übrigen Stimme.</p>
        <details ${TTS.voices.length ? '' : 'open'}><summary>Norwegische Stimme unter Windows installieren</summary>
          <ol><li>Windows-Einstellungen → <b>Zeit und Sprache</b> → <b>Sprache und Region</b></li>
          <li><b>Sprache hinzufügen</b> → „Norsk bokmål (Norwegisch)“ wählen</li>
          <li>Bei den optionalen Features <b>Sprachausgabe</b> (Text-to-Speech) anhaken – „Als Anzeigesprache festlegen“ <i>nicht</i> nötig</li>
          <li>Installieren, dann den Browser komplett neu starten. Danach erscheint z. B. „Microsoft Heami“ (offline).</li></ol>
          <p class="small"><b>Norwegisch installiert, aber keine Stimme gefunden?</b> Windows installiert „Microsoft Jon“ nur als moderne Stimme, die Browser offline nicht sehen. Lösung: im App-Ordner <b>tools\norwegische-stimme-freischalten.reg</b> doppelklicken, Nachfrage bestätigen, Browser komplett neu starten. (Rückgängig: norwegische-stimme-rueckgaengig.reg.) Alternative mit Internet: Microsoft Edge bietet die Online-Stimmen „Pernille“ und „Finn“.</p><p class="muted small">Stimmen mit „(online!)“ brauchen Internet – die App bevorzugt Offline-Stimmen.</p></details>
      </div>
      <div class="card"><h3>💾 Sicherung</h3>
        <p class="muted small">Alle Daten liegen nur in diesem Browser (lokaler Speicher). Mach regelmäßig ein Backup – z. B. bevor du den Browser-Verlauf löschst oder den Ordner verschiebst. ${Store.state.lastBackupAt ? `Letztes Backup: Nr. ${Store.state.backupNo} am ${new Date(Store.state.lastBackupAt).toLocaleString('de-DE', { dateStyle: 'medium', timeStyle: 'short' })}` : Store.state.lastBackup ? 'Letztes Backup: ' + Store.state.lastBackup : ''}</p>
        <div class="actions"><button class="btn primary" id="bk">Backup herunterladen</button><label class="btn">Backup wiederherstellen<input type="file" id="rst" accept=".json" hidden></label>
        <button class="btn ghost" id="csv2">Vokabeln als CSV</button><button class="btn ghost danger" id="wipe">Alles zurücksetzen</button></div></div>`;
    $('#dir').value = s.directions; $('#mode').value = s.answerMode;
    const save = () => { Store.save(); UI.toast('Gespeichert.'); };
    const setUi = (k, v) => { ui[k] = v; Store.save(); g.Theme.apply(ui); viewSettings(); };
    main().querySelectorAll('[data-theme]').forEach(b => b.onclick = () => setUi('theme', b.dataset.theme));
    main().querySelectorAll('[data-accent]').forEach(b => b.onclick = () => setUi('accent', b.dataset.accent));
    main().querySelectorAll('[data-scale]').forEach(b => b.onclick = () => setUi('scale', parseFloat(b.dataset.scale)));
    $('#acc').oninput = e => { ui.accent = e.target.value; g.Theme.apply(ui); };
    $('#acc').onchange = e => setUi('accent', e.target.value);
    $('#kphys').onchange = e => { s.kbd.physical = e.target.checked; save(); };
    $('#kauto').onchange = e => { s.kbd.auto = e.target.checked; save(); };
    main().querySelectorAll('[data-int]').forEach(inp => inp.onchange = () => { const v = Math.max(1, parseInt(inp.value, 10) || 1); s[inp.dataset.int][+inp.dataset.i] = v; save(); });
    main().querySelectorAll('[data-vp]').forEach(b => b.onclick = () => { s.vocabIntervals = V_PRESETS[b.dataset.vp].slice(); save(); viewSettings(); });
    main().querySelectorAll('[data-gp]').forEach(b => b.onclick = () => { s.grammarIntervals = G_PRESETS[b.dataset.gp].slice(); save(); viewSettings(); });
    $('#dir').onchange = e => { s.directions = e.target.value; save(); };
    $('#mode').onchange = e => { s.answerMode = e.target.value; save(); };
    $('#npd').onchange = e => { s.newPerDay = Math.max(0, parseInt(e.target.value, 10) || 0); save(); };
    $('#gpp').onchange = e => { s.grammarPerPoint = Math.max(3, parseInt(e.target.value, 10) || 6); save(); };
    $('#gpd').onchange = e => { s.grammarPointsPerDay = Math.max(1, parseInt(e.target.value, 10) || 3); save(); };
    $('#typo').onchange = e => { s.typoTolerance = e.target.checked; save(); };
    $('#auto').onchange = e => { s.autoplay = e.target.checked; save(); };
    $('#voice').onchange = e => { s.voiceURI = e.target.value; save(); };
    $('#rate').oninput = e => { s.rate = parseFloat(e.target.value); $('#ratev').textContent = s.rate; };
    $('#rate').onchange = save;
    $('#bk').onclick = () => { const b = Store.backup(); download(b.name, b.json, 'application/json'); UI.toast('Gespeichert als ' + b.name); viewSettings(); };
    $('#rst').onchange = e => {
      const f = e.target.files[0]; if (!f) return;
      const r = new FileReader();
      r.onload = () => {
        try {
          const st = JSON.parse(r.result);
          const c = Store.checkBackup(st); if (!c.ok) throw new Error(c.msg);
          const at = st.lastBackupAt || st.exportedAt;
          const when = at ? new Date(at).toLocaleString('de-DE', { dateStyle: 'medium', timeStyle: 'short' }) : (st.lastBackup || 'unbekannt');
          if (confirm(`Backup${st.backupNo ? ' Nr. ' + st.backupNo : ''} vom ${when} mit ${st.vocab.length} Vokabeln laden?\nDer aktuelle Stand auf diesem Gerät wird ersetzt.`)) {
            Store.replace(st); g.Theme.apply(Store.state.settings.ui); UI.toast('Backup wiederhergestellt.'); viewSettings();
          }
        } catch (err) { alert(err.message.startsWith('Unexpected') ? 'Die Datei konnte nicht gelesen werden (kein gültiges Backup).' : err.message); }
        e.target.value = '';
      };
      r.readAsText(f, 'UTF-8');
    };
    $('#csv2').onclick = exportCSV;
    $('#wipe').onclick = () => { if (confirm('Wirklich ALLES löschen (Vokabeln, Fortschritt, Einstellungen)?')) { Store.reset(); g.Theme.apply(Store.state.settings.ui); viewSettings(); } };
  }

  /* ════════════ ROUTER ════════════ */
  function route() {
    UI.onEnter = null; document.onkeydown = null;
    if (typeof speechSynthesis !== 'undefined') speechSynthesis.cancel();
    if (g.DialogView) g.DialogView.stop();
    if (g.MemoryView) g.MemoryView.stop();
    const h = decodeURIComponent(location.hash.slice(1) || 'home');
    const [r, arg] = [h.split('/')[0], h.split('/').slice(1).join('/')];
    document.querySelectorAll('#nav a').forEach(a => a.classList.toggle('active', a.getAttribute('href').slice(1) === r || (r === 'g' && a.getAttribute('href') === '#grammar') || (r === 'topic' && a.getAttribute('href') === '#topics') || (r === 'dialog' && a.getAttribute('href') === '#dialogs')));
    window.scrollTo(0, 0);
    switch (r) {
      case 'learn': return viewLearn(arg);
      case 'vocab': return viewVocab();
      case 'grammar': return viewGrammar();
      case 'g': return viewGrammarDetail(arg);
      case 'gtrain': return viewGrammarTrain();
      case 'trainer': return viewTrainer(arg);
      case 'table': tablePreset = arg; return (location.hash = '#trainer/table');
      case 'topics': return viewTopics();
      case 'dialogs': return g.DialogView.list();
      case 'dialog': return g.DialogView.detail(arg);
      case 'memory': return arg ? g.MemoryView.start(arg) : g.MemoryView.list();
      case 'topic': return viewTopic(arg);
      case 'settings': return viewSettings();
      default: return viewHome();
    }
  }
  function updateBadges() {
    const n = SRS.due().length, gn = SRS.gDue().length;
    const b1 = $('#nb-learn'), b2 = $('#nb-gram');
    if (b1) { b1.textContent = n; b1.hidden = !n; }
    if (b2) { b2.textContent = gn; b2.hidden = !gn; }
  }

  function start() {
    Store.load();
    g.Theme.apply(Store.state.settings.ui);
    matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => g.Theme.apply(Store.state.settings.ui));
    // Offline-Fähigkeit (iPad/Web): nur wenn über http(s) geladen, nicht bei file://
    if ('serviceWorker' in navigator && location.protocol.startsWith('http')) navigator.serviceWorker.register('sw.js').catch(e => console.warn('SW', e));
    if (navigator.storage && navigator.storage.persist) navigator.storage.persist().catch(() => {});
    window.addEventListener('hashchange', () => { route(); updateBadges(); });
    TTS.init(() => { if ((location.hash || '#home').startsWith('#home') || location.hash === '#settings') route(); });
    route(); updateBadges();
    setInterval(updateBadges, 60000);
  }
  g.App = { start, parseTable, importRows };
  document.addEventListener('DOMContentLoaded', start);
})(window);
