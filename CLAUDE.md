# Projektregeln (Norsk – Norwegisch-Lernapp)

- **ENTWICKLUNG.md immer aktualisieren**, sobald etwas an der App ergänzt oder geändert wird (Abschnitte + Änderungsprotokoll). Wunsch der Nutzerin / des Nutzers.
- Bei Nutzer-relevanten Änderungen auch ANLEITUNG.md anpassen.
- Bei jeder Änderung an App-Dateien `VERSION` in `sw.js` erhöhen; neue Dateien in `FILES` eintragen.
- App muss offline und per file:// laufen: keine ES-Module, keine CDNs.
- Ableger der Koreanisch-App (Nachbarordner `Sprachenlernapp`, Repo `koreanisch-lernapp`): Verbesserungen am gemeinsamen Gerüst (core/ui/app/theme/css) ggf. in beide Apps übernehmen. Speicher-Schlüssel getrennt halten (`norwegisch-lernapp-v1`).
- Vor Abschluss: `tests/test.html` über den Server „norsk“ (Port 8766) ausführen – 0 Fehler.
- Nach Lexikon-Änderungen: `python -I tools/make_startpaket.py`. Nach Änderungen an Vokabel-CSVs in `vokabeln/`: `python -I vokabeln/build_pakete.py`.
- Eigene Vokabeln nur mit sicheren Formen in die Formübungen (Lexikon oder Klammer-Formen) – keine geratenen Formen abfragen.
- `js/dialogs.js` und `js/memory.js` sind in beiden Apps identisch – Änderungen immer in beide Projekte kopieren.
- **Vokabellisten erstellen:** Format, Regeln und Beispiele stehen in `VOKABELN_FUER_CLAUDE.md` – bei Vokabel-Aufgaben zuerst dort lesen.
- Veröffentlicht über GitHub Pages: https://juvor.github.io/norwegisch-lernapp/ (Repo `juvor/norwegisch-lernapp`, Branch `main`). Nach Änderungen fragen, ob veröffentlicht werden soll (commit + push) – nicht ungefragt pushen. Vorher `VERSION` in `sw.js` erhöhen.
- Commits mit der anonymen Adresse (repo-lokal gesetzt); nie die private E-Mail eintragen.
