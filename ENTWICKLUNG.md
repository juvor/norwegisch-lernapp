# Entwicklungsdokumentation – Norsk (Norwegisch-Lernapp)

> **Zweck:** Alles, um diese App nachzuvollziehen, weiterzuentwickeln oder neu zu bauen.
> **Regel:** Bei jeder Änderung an der App wird dieses Dokument mit aktualisiert (Abschnitte + Änderungsprotokoll).
> Die App ist ein **Ableger der Koreanisch-App** (Nachbarordner `Sprachenlernapp`, Repo `koreanisch-lernapp`). Deren `ENTWICKLUNG.md` beschreibt das gemeinsame
> Gerüst ausführlich (Phasen-System, Übungs-Runner, Pakete, Darstellung, PWA, Testvorgehen). Hier steht, was **anders** ist.

## 1. Ziel
Gleiche App wie für Koreanisch, aber für **Norwegisch (Bokmål)**, getrennt (eigener Ordner, eigener Speicher). Schwerpunkte wie gewünscht:
Deklination (Nomen, Adjektive), Zeiten und Unregelmäßigkeiten, Grammatik in einstellbarem Rhythmus, Themen, Audio, offline.

## 2. Gemeinsam mit der Koreanisch-App (unverändert übernommen)
`js/core.js` (bis auf Prüfung/Zahlen/TTS), `js/ui.js` (Runner und Übungstypen), `js/app.js` (Ansichten), `js/theme.js`, `css/style.css`, PWA-Dateien.
**Historische Namen bewusst beibehalten:** Das Zielsprachen-Feld heißt im Datenmodell `ko`, Richtungen `de2ko`/`ko2de`, CSS-Klassen `.ko`/`.ko-input`,
Prüffunktion `Check.ko`/`normKo`. Gemeint ist überall „Zielsprache = Norwegisch“. So bleiben beide Apps leicht vergleichbar.
**Verbesserungen in einer App gegebenenfalls in die andere übernehmen** (Dateien sind weitgehend parallel).

## 3. Was anders ist

| Bereich | Koreanisch | Norwegisch |
|---|---|---|
| Sprach-Engine | `hangul.js` + `conjugate.js` | `js/norsk.js` |
| Speicher-Schlüssel | `koreanisch-lernapp-v1` | `norwegisch-lernapp-v1` (core.js **und** theme.js) |
| Tastatur | Hangul mit Silbenbildung | `keyboard.js`: æøå-Leiste + ä→æ, ö→ø, ü→å |
| Trainer | Konjugation, Partikel, Zahlen, Tabelle | Verben, Substantive, Adjektive, Zahlen, Formentabelle |
| Prüfung | Leerzeichen egal | zusätzlich: klein/groß egal, ä≡æ, ö≡ø; fehlender Artikel/å → `typo` (zählt, mit Hinweis) |
| Startpaket | – (eigene Notizen) | `js/data/startpaket.js` (245 Karten aus dem Lexikon, fest in der App) |
| Standardfarbe | Blau | Rot `#c2362f` |
| Stimme | ko-KR | nb-NO (Filter `nb|no|nn`) |

## 4. js/norsk.js
- **Nomen** `{no, g:'m'|'f'|'n', forms?:[bestimmt, Plural, bestimmter Plural]}` → `nounForms()`:
  m: -en/-er/-ene (auf -e: -n/-r/-ne; auf -er mehrsilbig: lærer – læreren – lærere – lærerne);
  f: -a/-er/-ene (+ `defAlt` maskuline Form jenten – beide zählen); n: -et, einsilbig Plural ohne Endung, mehrsilbig -er.
- **Verben** `{inf, cls?:1–4, pres?, pret?, part?, imp?, modal?}` → `verbForms()`: Klasse 1 -et, 2 -te, 3 -de, 4 -dde;
  Doppelkonsonant vor -te/-de vereinfacht (begynte, bygde); starke Verben über `pret/part`; `guessClass()` nur Faustregel.
- **Adjektive** `{no, n?, pl?, komp?, sup?}` → `adjForms()`: +t (stort), -ig/-isk ohne t, Vokal +tt (nytt), Doppelkonsonant (grønt), Plural +e.
- **Zahlen** `num()` (21 = tjueen, 250 = to hundre og femti), `numVariants()` (syv, ett hundre), `ordinal()`, `clock()` (halv fire = 3:30, „klokka ett“), `genNumber()`.
- Übungsformen: `VERB_FORMS`, `NOUN_FORMS`, `ADJ_FORMS`; Erklärtexte `CLASS_INFO`, `GENUS`.

## 5. Eigene Vokabeln in den Formübungen (ui.js)
Nur **sichere** Formen: Wort steht im Lexikon **oder** Formen stehen in Klammern im Norwegisch-Feld/der Notiz:
`å skrive (skriver, skrev, har skrevet)`, `ei bok (boka, bøker, bøkene)`, `liten (lite, små, mindre, minst)`.
`resolveWord(v)` ermittelt die Formen einer Karte (für Lernkarte „Formen: …“ und Formentabelle), `userNouns/userVerbs/userAdjs` für die Trainer.
Formentabelle zeigt unbekannte Wörter nach Regel – mit Warnhinweis.

## 6. Inhalte
- `js/data/lexicon.js`: 104 Nomen, 86 Verben (inkl. Modalverben), 55 Adjektive – alle Formen geprüft.
- `js/data/grammar.js`: 30 Lektionen, Level 1 = A1, 2 = A2, 3 = B1; `drill.kind`: `verb` (forms, only, weakOnly, strongOnly), `noun`, `adj`, `numbers`.
- `js/data/topics.js`: 10 Themen mit Alltagsphrasen.
- Startpaket: `python -I tools/make_startpaket.py` erzeugt `js/data/startpaket.js` aus dem Lexikon (Themen grob zugeordnet, Stufe 1).
  Dasselbe Skript schreibt die Wortliste als **Anhang A** in `VOKABELN_FUER_CLAUDE.md` (zwischen den Markierungen `STARTWORTLISTE`), damit fremde Claude-Instanzen keine Startwörter doppelt erzeugen.
- Eigene Pakete: wie Koreanisch – `vokabeln/meine_vokabeln_teilN.csv` + `vokabeln/build_pakete.py` → `vokabeln/pakete.js` (privat, siehe .gitignore).
  CSV-Spalten: `Norwegisch;Deutsch;Thema;Wortart;Notiz;Beispiel NO;Beispiel DE;Häufigkeit`.

## 7. Testen
- Testserver „norsk“ (Port 8766) in `.claude/launch.json` (auch im Koreanisch-Projekt eingetragen, mit `--directory`).
- `tests/test.html` → muss „0 Fehler“ zeigen (305 Prüfungen: Nomen, Verben aller Klassen, starke Verben, Adjektive, Zahlen, Uhrzeit, Ordinalzahlen, Fehlerindizes).
- Danach App durchklicken; Service Worker vorher abmelden (siehe Koreanisch-Doku, Abschnitt Testen).

## 7b. Dialoge im Alltag (seit 2026-11-26)
- **Gemeinsamer Code** `js/dialogs.js` (identisch in Koreanisch- und Norwegisch-App – bei Änderungen in beide kopieren!), Inhalte in `js/data/dialogs.js`.
- Datenformat: `{ id, icon, title, place, topic, intro, roles: {A: [Name, Deutsch], B: [...]}, lines: [[Rolle, Zielsprache, Deutsch], …], words: [[Zielsprache, Deutsch, Wortart], …] }`.
- Ansichten: `#dialogs` (Übersicht, beste Rollenspiel-Quote), `#dialog/ID` (Chat-Ansicht mit Audio, Übersetzung ein/aus, ganzen Dialog abspielen).
  Rollenspiel und Üben laufen ohne eigene Adresse (gleiche URL) – Zurück-Knöpfe rufen daher `detail()` direkt auf, nicht `location.hash`.
- Zwei Sprecher: Rolle B bekommt eine zweite Stimme, falls vorhanden, sonst andere Tonhöhe (`speakLine`).
- Rollenspiel: Rolle und Modus wählbar (Schreiben mit Prüfung + „Ich hatte doch recht“, oder Sprechen mit Selbstbewertung); Ergebnis in `state.dialogs[id] = {best, last}`.
- Üben: `Ex.sentenceExercises` aus den Dialogsätzen (max. 10).
- Schlüsselwörter: nur Wörter übernehmen, deren Zielsprachen-Wort noch nicht als Karte existiert (kein Überschreiben), Thema = `topic` des Dialogs, Stufe 2.
- Router: `route()` ruft `DialogView.stop()` auf (Sprachausgabe beenden beim Seitenwechsel).
- Dialoge: Café, Restaurant, Supermarkt, U-Bahn, Post, Arzt, Apotheke, Hotel, Taxi.

## 7c. Norwegische Stimme unter Windows
Das Sprachpaket Norsk bokmål installiert „Microsoft Jon“ nur unter `HKLM\SOFTWARE\Microsoft\Speech_OneCore\Voices\Tokens\MSTTS_V110_nbNO_Jon`. Chrome/Edge (Web Speech, offline) lesen nur die klassischen SAPI-Tokens (`…\Speech\Voices\Tokens`, 64 und 32 Bit). Heami (Koreanisch) ist in beiden registriert, Jon nicht.
Lösung: `tools/norwegische-stimme-freischalten.reg` (aus `reg export` des OneCore-Tokens erzeugt, gleiche CLSID/Dateien) kopiert den Token in beide SAPI-Zweige; `tools/norwegische-stimme-rueckgaengig.reg` entfernt sie. Die Nutzerin / der Nutzer führt die Datei selbst aus (Admin-Abfrage). Danach Browser neu starten.

## 7d. Memory (seit 2026-11-26)
- **Gemeinsamer Code** `js/memory.js` (identisch in beiden Apps – Änderungen in beide kopieren), Bildersets in `js/data/memory.js`:
  `{ id, icon, title, topic, pos, items: [[Emoji oder Farbe '#rrggbb', Zielsprache, Deutsch], …] }`. Farben werden als Farbfeld gezeigt.
- 8 Sets: Farben, Tiere, Möbel & Wohnung, Verkehrsmittel, Obst & Gemüse, Körper, Kleidung, Natur & Wetter (Norwegisch mit Artikel).
- Spielarten: `pic` (Bild ↔ Wort), `de` (Wort ↔ Deutsch), `audio` (🔊-Karte spricht das Wort ↔ Bild); 6/8/10 Paare; Vorlesen beim Aufdecken abschaltbar.
- Eigene Vokabeln: Themen mit ≥ 6 Karten, immer Wort ↔ Deutsch, Route `#memory/thema:NAME`.
- Zustand `state.memory = { opts: {mode, size, speak}, best: { 'set|modus|paare': {moves, time} } }`. Router `#memory`, `#memory/ID`; `route()` ruft `MemoryView.stop()` (Timer).
- Nach dem Spiel: Wörter (nur neue, exakt verglichen) als Karten übernehmen, Thema = Set-Thema, Stufe 2.

## 7e. Veröffentlichung
Online: **https://juvor.github.io/norwegisch-lernapp/** (Repo `juvor/norwegisch-lernapp`, öffentlich, `main`, Pages aus root). Ablauf, anonyme Commit-Adresse und Ausschlüsse wie in der Koreanisch-Doku (Abschnitt 9b). Ausgeschlossen: `vokabeln/meine_vokabeln_*.csv`, `vokabeln/pakete.js`, `.claude/`, Backups.

## 7f. Datenformat, Backups & Updates (seit 2026-11-27)
- Jeder Datenstand/jedes Backup hat `version` (Formatversion = `SCHEMA` in core.js, aktuell 2), `appId` (`koreanisch-lernapp` / `norwegisch-lernapp`),
  `backupNo` (fortlaufend, reist im Backup mit), `lastBackupAt` (ISO-Zeit) und im Backup zusätzlich `exportedAt`.
- `Store.migrate(st)` läuft beim Laden **und** beim Einspielen: bringt ältere Formate schrittweise über `MIGRATIONS[n]` auf den neuesten Stand und ergänzt fehlende Bereiche/Einstellungen mit Standardwerten – Vorhandenes bleibt unverändert. Mehrfaches Migrieren ändert nichts.
- `Store.checkBackup(st)` lehnt ab: keine Backup-Datei, Backup einer anderen App (`appId`), Backup aus einer **neueren** Formatversion (dann zuerst App aktualisieren).
- `Store.backup()` erzeugt Dateinamen wie `koreanisch-backup_2026-11-27_14-35_Nr-012.json`.
- Lernkarten speichern zusätzlich `srs[richtung].ts` (Zeitstempel der letzten Abfrage), Grammatik `grammar[id].ts` – Grundlage für ein späteres Zusammenführen von Backups.
- **Regeln für Updates (Lernstand muss erhalten bleiben):**
  1. Kennungen nie umbenennen/löschen: Vokabel-`id`, Lektions-`id`, Dialog-`id`, Memory-Set-`id`, Paket-`id`, Feldnamen im Datenmodell.
  2. Neue Funktionen legen ihre Daten in **neuen** Feldern ab und kommen ohne sie aus (z. B. `state.memory = state.memory || …`).
  3. Muss sich das Format ändern: `SCHEMA` erhöhen, Schritt in `MIGRATIONS` ergänzen, Testfall in `tests/test.html` ergänzen.
  4. `tests/test.html` enthält ein Backup im alten Format 1 – es muss nach jedem Update fehlerfrei und vollständig laden.

## 8. Offene Ideen
- Größerer Grundwortschatz (500+) als weiteres Paket.
- Nynorsk-Variante (eigene Formen).
- Mehr Lektionen B1/B2 (Partizipien als Adjektiv, Modalpartikeln, Wortbildung).

## 9. Änderungsprotokoll

| Datum | Version | Änderung |
|---|---|---|
| 2026-11-27 | no-v9 | Backup-Fehler behoben: Nach dem Einspielen eines Backups stand im nächsten Backup die alte Exportzeit (`exportedAt`) – jetzt immer aktuelle Zeit (`Store.fileJson`), beim Einspielen wird der Wert nicht mehr in den Stand übernommen; Abfrage beim Einspielen zeigt `lastBackupAt`. Lernstand war nicht betroffen. Testfall ergänzt. |
| 2026-11-27 | no-v8 | Backups wie Koreanisch v13: Formatversion, App-Kennung, Migration, Prüfung beim Einspielen, Dateiname mit Datum/Uhrzeit/Nummer; Backup-Tests mit altem Format. |
| 2026-11-26 | – | `VOKABELN_FUER_CLAUDE.md`: Abschnitt „Keine Doppelten“ (Grundwort-Vergleich, zusätzliche Bedeutungen zusammenführen, eigene Export-CSV mitgeben), neues Beispiel, Anhang A mit allen 245 Startwörtern (automatisch aus `make_startpaket.py`). Keine Änderung am App-Code. |
| 2026-11-26 | no-v7 | Datenschutz: Doku neutral formuliert, `noindex` gegen Suchmaschinen; Repository-Verlauf auf eine saubere Version zurückgesetzt. |
| 2026-11-26 | no-v6 | Veröffentlicht auf GitHub Pages (https://juvor.github.io/norwegisch-lernapp/); Anleitung iPad/iPhone mit echter Adresse. |
| 2026-11-26 | no-v6 | `VOKABELN_FUER_CLAUDE.md`: Anleitung für (fremde) Claude-Instanzen zum Erstellen von Import-Tabellen/Paketen; `Check.alts()` ignoriert Klammerinhalte (Formen in Klammern zählten sonst als richtige Antwort). |
| 2026-11-26 | no-v5 | Online-Stimme → automatischer Rückfall auf Offline-Stimme ohne Internet (wie Koreanisch v10); Tipp in Einstellungen → Audio. |
| 2026-11-26 | no-v4 | Neue Funktion „🃏 Memory“ (gemeinsamer Code `js/memory.js`), 8 norwegische Bildersets mit Artikel. |
| 2026-11-26 | no-v3 | Stimme: Hilfetext + `tools/norwegische-stimme-freischalten.reg` / `-rueckgaengig.reg`, weil „Microsoft Jon“ nur als OneCore-Stimme installiert wird. |
| 2026-11-26 | no-v2 | Neue Funktion „💬 Dialoge“: 9 norwegische Alltagsdialoge (kafé, restaurant, butikk, T-bane, post, lege, apotek, hotell, taxi); `js/dialogs.js` gemeinsam mit der Koreanisch-App. |
| 2026-11-26 | no-v1 | Erstversion als Ableger der Koreanisch-App: norsk.js (Nomen/Verben/Adjektive/Zahlen), Lexikon (245 Wörter), 30 Grammatiklektionen A1–B1, 10 Themen, æøå-Tastatur, Trainer (Verben, Substantive, Adjektive, Zahlen, Formentabelle), Startpaket, eigener Speicher, rote Standardfarbe, Icons, 305 Engine-Tests. |
