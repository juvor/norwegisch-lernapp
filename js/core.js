/* Kern: Speicher, Phasen-System (SRS), Antwortprüfung, Zahlen, Audio */
(function (g) {
  'use strict';

  /* ───────── Hilfen ───────── */
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const pad = n => String(n).padStart(2, '0');
  const dateStr = d => d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
  const today = () => dateStr(new Date());
  function addDays(str, n) { const [y, m, d] = str.split('-').map(Number); return dateStr(new Date(y, m - 1, d + n)); }
  function daysBetween(a, b) { const [y1, m1, d1] = a.split('-').map(Number), [y2, m2, d2] = b.split('-').map(Number); return Math.round((new Date(y2, m2 - 1, d2) - new Date(y1, m1 - 1, d1)) / 864e5); }
  const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const pick = a => a[Math.floor(Math.random() * a.length)];

  /* ───────── Speicher ───────── */
  const KEY = 'norwegisch-lernapp-v1';   // eigener Speicher – getrennt von der Koreanisch-App
  const DEFAULT_SETTINGS = {
    vocabIntervals: [1, 3, 9, 29, 90, 180],   // Tage bis zur nächsten Abfrage nach Erreichen von Phase 1..6
    grammarIntervals: [1, 3, 7, 14, 30, 60],
    directions: 'both',          // both | de2ko | ko2de
    answerMode: 'type',          // type | flip
    newPerDay: 20,
    grammarPerPoint: 6,
    grammarPointsPerDay: 3,
    autoplay: true,
    rate: 0.85,
    voiceURI: '',
    typoTolerance: true,
    ui: { theme: 'auto', accent: '#c2362f', scale: 1 },     // Darstellung
    kbd: { physical: true, auto: false }                     // Tastatur
  };
  /* ───────── Datenformat, Migration & Backups ─────────
     Regeln für künftige Updates (damit alte Backups und der Lernstand erhalten bleiben):
     - Kennungen (Vokabel-id, Lektions-id, Dialog-/Memory-Set-id, Felder) nie umbenennen oder löschen – nur hinzufügen.
     - Ändert sich das Format, SCHEMA erhöhen und in MIGRATIONS einen Schritt ergänzen (alt → neu, ohne Datenverlust).
     - tests/test.html enthält ein Backup im alten Format, das nach jedem Update fehlerfrei laden muss. */
  const APP_ID = KEY.replace(/-v\d+$/, '');          // z. B. 'koreanisch-lernapp'
  const SCHEMA = 2;
  const MIGRATIONS = {
    // 1 → 2: App-Kennung und Backup-Zähler; Bereiche, die später dazukamen (Pakete, Dialoge, Memory)
    2: st => {
      st.appId = st.appId || APP_ID;
      st.backupNo = st.backupNo || 0;
      st.importedPackages = st.importedPackages || {};
      st.dialogs = st.dialogs || {};
      if (!st.memory) st.memory = { opts: { mode: 'pic', size: 8, speak: true }, best: {} };
    }
  };
  function migrate(st) {
    st = st || {};
    st.version = st.version || 1;
    for (let v = st.version + 1; v <= SCHEMA; v++) { if (MIGRATIONS[v]) MIGRATIONS[v](st); st.version = v; }
    // fehlende Bereiche und neue Einstellungen mit Standardwerten ergänzen – Vorhandenes bleibt unverändert
    st.vocab = Array.isArray(st.vocab) ? st.vocab : [];
    st.grammar = st.grammar || {};
    st.settings = Object.assign({}, JSON.parse(JSON.stringify(DEFAULT_SETTINGS)), st.settings || {});
    st.settings.ui = Object.assign({}, DEFAULT_SETTINGS.ui, st.settings.ui || {});
    st.settings.kbd = Object.assign({}, DEFAULT_SETTINGS.kbd, st.settings.kbd || {});
    st.stats = st.stats || {};
    st.stats.days = st.stats.days || {};
    st.stats.newCount = st.stats.newCount || { date: '', n: 0 };
    return st;
  }
  // Prüft ein Backup vor dem Einspielen. Ergebnis: { ok, msg }
  function checkBackup(st) {
    if (!st || typeof st !== 'object' || !Array.isArray(st.vocab) || !st.settings) return { ok: false, msg: 'Das ist keine gültige Backup-Datei dieser App.' };
    if (st.appId && st.appId !== APP_ID) return { ok: false, msg: `Dieses Backup gehört zu einer anderen App („${st.appId}“) und kann hier nicht eingespielt werden.` };
    if ((st.version || 1) > SCHEMA) return { ok: false, msg: 'Dieses Backup stammt aus einer neueren Version der App. Bitte die App zuerst aktualisieren (mit Internet öffnen bzw. neu laden) und dann erneut versuchen.' };
    return { ok: true, msg: '' };
  }
  // Inhalt der Backup-Datei: exportedAt ist immer der aktuelle Zeitpunkt
  // (ein alter Wert aus einem eingespielten Backup darf ihn nicht überschreiben)
  function fileJson(st, now) { return JSON.stringify(Object.assign({ exportedAt: now.toISOString() }, st, { exportedAt: now.toISOString() }), null, 1); }

  const Store = {
    state: null,
    APP_ID, SCHEMA, migrate, checkBackup, fileJson,
    load() {
      try {
        const raw = localStorage.getItem(KEY);
        this.state = migrate(raw ? JSON.parse(raw) : defaultState());
      } catch (e) {
        console.error(e);
        this.state = defaultState();
      }
      return this.state;
    },
    save() { localStorage.setItem(KEY, JSON.stringify(this.state)); },
    replace(st) { st = migrate(st); delete st.exportedAt; localStorage.setItem(KEY, JSON.stringify(st)); this.load(); },
    reset() { this.state = defaultState(); this.save(); },
    // Backup-Datei erzeugen: fortlaufende Nummer, Datum und Uhrzeit im Namen
    backup() {
      const st = this.state, now = new Date();
      st.backupNo = (st.backupNo || 0) + 1;
      st.lastBackup = today();
      st.lastBackupAt = now.toISOString();
      this.save();
      const stamp = today() + '_' + pad(now.getHours()) + '-' + pad(now.getMinutes());
      const name = APP_ID.replace(/-lernapp$/, '') + '-backup_' + stamp + '_Nr-' + String(st.backupNo).padStart(3, '0') + '.json';
      delete st.exportedAt;
      return { name, json: fileJson(st, now) };
    },
    DEFAULT_SETTINGS
  };
  function defaultState() {
    return migrate({ version: SCHEMA, appId: APP_ID, backupNo: 0, vocab: [], grammar: {}, settings: JSON.parse(JSON.stringify(DEFAULT_SETTINGS)), stats: { days: {}, newCount: { date: '', n: 0 } }, lastBackup: '' });
  }

  function logStat(kind, correct) {
    const d = today();
    const s = Store.state.stats.days[d] = Store.state.stats.days[d] || { vocab: 0, vocabOk: 0, grammar: 0, grammarOk: 0 };
    s[kind]++; if (correct) s[kind + 'Ok']++;
  }
  function streak() {
    const days = Store.state.stats.days; let n = 0; let d = today();
    if (!days[d]) d = addDays(d, -1);
    while (days[d]) { n++; d = addDays(d, -1); }
    return n;
  }

  /* ───────── Phasen (SRS) ───────── */
  const SRS = {
    dirs() { const d = Store.state.settings.directions; return d === 'both' ? ['de2ko', 'ko2de'] : [d]; },
    ensure(v) {
      v.srs = v.srs || {};
      for (const d of ['de2ko', 'ko2de']) if (!v.srs[d]) v.srs[d] = { phase: 0, due: '' };
      return v;
    },
    newLeft() {
      const nc = Store.state.stats.newCount;
      if (nc.date !== today()) { nc.date = today(); nc.n = 0; }
      return Math.max(0, Store.state.settings.newPerDay - nc.n);
    },
    due(filter) {
      const t = today(); const out = [];
      for (const v of Store.state.vocab) {
        if (filter && !filter(v)) continue;
        this.ensure(v);
        for (const d of this.dirs()) { const s = v.srs[d]; if (s.phase >= 1 && s.due <= t) out.push({ v, dir: d }); }
      }
      return out;
    },
    fresh(filter) {
      const out = [];
      for (const v of Store.state.vocab) {
        if (filter && !filter(v)) continue;
        this.ensure(v);
        for (const d of this.dirs()) if (v.srs[d].phase === 0) out.push({ v, dir: d });
      }
      // Wichtigste zuerst: Häufigkeitsstufe 1 (sehr häufig) … 5 (selten); ohne Angabe = 3. Sortierung ist stabil.
      return out.sort((a, b) => (a.v.prio || 3) - (b.v.prio || 3));
    },
    answer(v, dir, ok) {
      this.ensure(v);
      const s = v.srs[dir]; const ints = Store.state.settings.vocabIntervals;
      const before = s.phase;
      if (before === 0) { const nc = Store.state.stats.newCount; if (nc.date !== today()) { nc.date = today(); nc.n = 0; } nc.n++; }
      if (ok) { s.phase = Math.min(6, s.phase + 1); s.due = addDays(today(), ints[s.phase - 1] || 1); }
      else { s.phase = 1; s.due = addDays(today(), 1); }
      s.last = today();
      s.ts = Date.now();
      logStat('vocab', ok);
      Store.save();
      return { before, after: s.phase, due: s.due };
    },
    phaseCounts() {
      const c = [0, 0, 0, 0, 0, 0, 0];
      for (const v of Store.state.vocab) { this.ensure(v); for (const d of this.dirs()) c[v.srs[d].phase]++; }
      return c;
    },
    // Grammatik
    gDue() {
      const t = today();
      return Object.entries(Store.state.grammar).filter(([id, s]) => s.active && s.due <= t && g.Grammar.byId[id]).map(([id]) => id);
    },
    gActivate(id, on) {
      const gs = Store.state.grammar;
      if (on) gs[id] = Object.assign({ phase: 1, due: today(), history: [] }, gs[id] || {}, { active: true });
      else if (gs[id]) gs[id].active = false;
      Store.save();
    },
    gResult(id, pct) {
      const s = Store.state.grammar[id]; if (!s) return null;
      const ints = Store.state.settings.grammarIntervals; const before = s.phase;
      if (pct >= 0.8) { s.phase = Math.min(6, s.phase + 1); s.due = addDays(today(), ints[s.phase - 1] || 1); }
      else if (pct < 0.5) { s.phase = 1; s.due = addDays(today(), 1); }
      else { s.due = addDays(today(), 1); }
      s.ts = Date.now();
      s.history = (s.history || []).concat([{ d: today(), p: Math.round(pct * 100) }]).slice(-20);
      Store.save();
      return { before, after: s.phase, due: s.due };
    }
  };

  /* ───────── Antwortprüfung ───────── */
  const Check = {
    // Zielsprache (Norwegisch): klein, ä→æ, ö→ø, ohne Satzzeichen und Leerzeichen. (Name „normKo“ aus der Koreanisch-App übernommen.)
    normKo(s) {
      return String(s || '').toLowerCase().replace(/\(.*?\)/g, '').replace(/ä/g, 'æ').replace(/ö/g, 'ø')
        .replace(/[\s.,!?~…·"'“”‘’«»\-:;]/g, '');
    },
    // ohne Artikel (en/ei/et) und ohne Infinitivzeichen å
    bare(s) { return String(s || '').trim().replace(/^(en|ei|et|å)\s+/i, ''); },
    normDe(s) {
      return String(s || '').toLowerCase().replace(/\(.*?\)|\[.*?\]/g, ' ')
        .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
        .replace(/[.,!?;:"'“”„‘’…]/g, ' ')
        .replace(/^\s*(der|die|das|ein|eine|einen|sich|zu|etw\.?|jdn\.?|jdm\.?|etwas)\s+/g, '')
        .replace(/\s+/g, ' ').trim();
    },
    // Alternativen (getrennt durch , ; / oder „oder“) – Klammerinhalte zählen nicht (z. B. Formen: „ei bok (boka, bøker, bøkene)“)
    alts(target) { return String(target).replace(/\(.*?\)/g, '').split(/[,;/]|\boder\b/).map(s => s.trim()).filter(Boolean); },
    lev(a, b) {
      const m = a.length, n = b.length; if (!m) return n; if (!n) return m;
      let prev = Array.from({ length: n + 1 }, (_, i) => i);
      for (let i = 1; i <= m; i++) {
        const cur = [i];
        for (let j = 1; j <= n; j++) cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
        prev = cur;
      }
      return prev[n];
    },
    // Ergebnis: 'ok' | 'typo' | 'wrong'
    de(input, target) {
      const inp = this.normDe(input); if (!inp) return 'wrong';
      const cands = this.alts(target).map(x => this.normDe(x)).concat([this.normDe(target)]);
      if (cands.includes(inp)) return 'ok';
      if (Store.state.settings.typoTolerance && cands.some(c => c.length >= 5 && this.lev(c, inp) <= 1)) return 'typo';
      return 'wrong';
    },
    // Ergebnis: 'ok' | 'typo' (richtig, aber Artikel/å fehlt) | 'wrong'
    ko(input, target) {
      const inp = this.normKo(input); if (!inp) return 'wrong';
      const alts = this.alts(target).concat([target]);
      if (alts.some(x => this.normKo(x) === inp)) return 'ok';
      if (alts.some(x => this.normKo(this.bare(x)) === this.normKo(this.bare(input)) && this.bare(x) !== x)) return 'typo';
      return 'wrong';
    },
    // Zeichenweiser Vergleich -> HTML (fehlend = grün unterstrichen, zu viel = rot durchgestrichen)
    diff(input, target) {
      const a = [...String(input)], b = [...String(target)];
      const m = a.length, n = b.length;
      const L = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
      for (let i = m - 1; i >= 0; i--) for (let j = n - 1; j >= 0; j--) L[i][j] = a[i] === b[j] ? L[i + 1][j + 1] + 1 : Math.max(L[i + 1][j], L[i][j + 1]);
      let i = 0, j = 0, out = '';
      while (i < m && j < n) {
        if (a[i] === b[j]) { out += esc(a[i]); i++; j++; }
        else if (L[i + 1][j] >= L[i][j + 1]) { out += '<del>' + esc(a[i]) + '</del>'; i++; }
        else { out += '<ins>' + esc(b[j]) + '</ins>'; j++; }
      }
      while (i < m) out += '<del>' + esc(a[i++]) + '</del>';
      while (j < n) out += '<ins>' + esc(b[j++]) + '</ins>';
      return out;
    }
  };

  /* ───────── Zahlen ───────── */
  const Numbers = { gen: kinds => g.Norsk.genNumber(kinds) };

  /* ───────── Audio: Sprachausgabe ───────── */
  const TTS = {
    voices: [],
    supported: typeof speechSynthesis !== 'undefined',
    init(cb) {
      if (!this.supported) return;
      const load = () => { this.voices = speechSynthesis.getVoices().filter(v => /^(nb|no|nn)/i.test(v.lang)); cb && cb(); };
      load();
      speechSynthesis.onvoiceschanged = load;
    },
    voice() {
      const uri = Store.state.settings.voiceURI;
      let v = this.voices.find(x => x.voiceURI === uri);
      // Online-Stimmen (z. B. Edge „… Online (Natural)“) gehen ohne Internet nicht → dann automatisch die Offline-Stimme
      if (v && !v.localService && navigator.onLine === false) v = null;
      return v || this.voices.find(x => x.localService) || this.voices[0] || null;
    },
    speak(text, rate) {
      if (!this.supported) return;
      const clean = String(text).replace(/\(.*?\)/g, '').replace(/_+/g, ' ').trim();
      if (!clean) return;
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(clean);
      u.lang = 'nb-NO';
      const v = this.voice(); if (v) u.voice = v;
      u.rate = rate || Store.state.settings.rate || 0.9;
      speechSynthesis.speak(u);
      return u;
    }
  };

  /* ───────── Audio: eigene Aufnahme (Nachsprechen) ───────── */
  const Recorder = {
    rec: null, chunks: [], urls: {}, current: null,
    supported: !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia && typeof MediaRecorder !== 'undefined'),
    async toggle(key, onState) {
      if (this.rec && this.rec.state === 'recording') { this.rec.stop(); return; }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        this.chunks = []; this.current = key;
        this.rec = new MediaRecorder(stream);
        this.rec.ondataavailable = e => this.chunks.push(e.data);
        this.rec.onstop = () => {
          stream.getTracks().forEach(t => t.stop());
          if (this.urls[key]) URL.revokeObjectURL(this.urls[key]);
          this.urls[key] = URL.createObjectURL(new Blob(this.chunks, { type: this.rec.mimeType }));
          onState && onState('stopped');
        };
        this.rec.start();
        onState && onState('recording');
      } catch (e) {
        alert('Mikrofon nicht verfügbar: ' + e.message);
        onState && onState('error');
      }
    },
    play(key) { if (this.urls[key]) new Audio(this.urls[key]).play(); },
    has(key) { return !!this.urls[key]; }
  };

  g.Core = { esc, today, addDays, daysBetween, uid, shuffle, pick, Store, SRS, Check, Numbers, TTS, Recorder, logStat, streak };
})(typeof window !== 'undefined' ? window : globalThis);
