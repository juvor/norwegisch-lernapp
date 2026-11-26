# Anleitung für Claude: Vokabellisten für die Norsk-Lernapp erstellen

> **Für den Menschen:** Gib diese Datei Claude (im Chat hochladen oder – bei Claude Code – einfach im App-Ordner arbeiten lassen)
> und schreib dazu z. B.: *„Lies VOKABELN_FUER_CLAUDE.md und mach aus meiner Liste eine Import-Tabelle:“* – dann deine Vokabeln einfügen
> (egal in welcher Form: Notizen, Fotos von Heftseiten, Listen, durcheinander).
> Ergebnis einfügen: App öffnen → **Vokabeln verwalten → Tabelle importieren** → Text ins Feld kopieren → **Vorschau** → **Importieren**.

---

## Deine Aufgabe, Claude

Du wandelst die Vokabeln der Person in eine **Import-Tabelle** für eine Offline-Lernapp (Norwegisch **Bokmål** ↔ Deutsch) um.
Die App macht daraus Karteikarten mit Phasen-System, Formentrainer (Verben, Nomen, Adjektive) und Audio.

### 1. Ausgabeformat (genau so)

Eine Tabelle, **Semikolon-getrennt**, erste Zeile ist die Kopfzeile. Gib sie in **einem Codeblock** aus, damit man sie kopieren kann.

```
Norwegisch;Deutsch;Thema;Wortart;Notiz;Beispiel NO;Beispiel DE;Häufigkeit
```

| Spalte | Inhalt | Pflicht |
|---|---|---|
| Norwegisch | das Wort / der Ausdruck, siehe Regeln unten | ja |
| Deutsch | Bedeutung(en), mehrere mit Komma: `schnell, rasch` | ja |
| Thema | eines der Themen unten | empfohlen |
| Wortart | `Nomen`, `Verb`, `Adjektiv`, `Ausdruck` oder `Sonstiges` | empfohlen |
| Notiz | Hinweise, Korrekturen („Original: …“), Merkhilfen | nein |
| Beispiel NO / Beispiel DE | ein kurzer Beispielsatz mit Übersetzung | nein |
| Häufigkeit | 1 = sehr häufig/Grundwortschatz … 5 = selten | empfohlen |

- **Kein Semikolon innerhalb eines Feldes.** Falls doch nötig: Feld in "Anführungszeichen" setzen.
- Leere Felder bleiben leer (`;;`).
- Keine zusätzliche Erklärung **innerhalb** des Codeblocks.

### 2. Regeln für die Spalte „Norwegisch“ (wichtig für die Trainer!)

- **Nomen immer mit Artikel:** `en bil`, `ei bok`, `et hus` (en = maskulin, ei = feminin, et = neutrum).
  Feminine Wörter mit `ei` angeben (im Bokmål wäre auch `en` erlaubt – `ei` ist für Lernende informativer).
- **Verben immer mit „å“:** `å spise`, `å snakke`.
- **Adjektive ohne Zusatz:** `stor`, `glad`.
- **Ausdrücke/Sätze** so wie gesprochen: `Takk for maten!`, `Hvor mye koster det?`
- **Unregelmäßige Formen in Klammern direkt dahinter** – dann übt die App diese Wörter auch im Formentrainer:
  - Verben (stark/unregelmäßig): `å skrive (skriver, skrev, har skrevet)` → Präsens, Präteritum, Perfekt
  - Nomen mit unregelmäßigen Formen: `ei bok (boka, bøker, bøkene)` → bestimmt Sg., unbestimmt Pl., bestimmt Pl.
  - Adjektive mit unregelmäßigen Formen: `liten (lite, små, mindre, minst)` → Neutrum, Plural, Komparativ, Superlativ
  - Regelmäßige Wörter brauchen **keine** Klammern (`en bil`, `å snakke`, `stor`).
  - Nur Formen angeben, bei denen du **sicher** bist. Lieber keine Klammer als eine falsche.

### 3. Themen (Spalte „Thema“)

Verwende möglichst diese Bezeichnungen (exakt so geschrieben) – dann landen die Wörter bei den passenden Themen der App:

`Alltag` · `Essen` · `Einkaufen` · `Unterwegs` · `Wetter` · `Arbeit` · `Freizeit` · `Gesundheit` · `Familie` · `Zeit` · `Haushalt` · `Natur & Tiere` · `Farben & Beschreibung`

Eigene Themen sind erlaubt (z. B. `Grammatik`, `Kurs Lektion 3`), wenn nichts passt.

### 4. Häufigkeit (Spalte „Häufigkeit“)

Neue Karten werden in dieser Reihenfolge gelernt – die wichtigsten zuerst.

| Stufe | Bedeutung | Beispiele |
|---|---|---|
| 1 | Grundwortschatz, täglich gebraucht | `å være`, `en dag`, `god`, `Takk!` |
| 2 | häufig | `å bestille`, `en regning`, `trøtt` |
| 3 | mittel (Standard, wenn unsicher) | `en forkjølelse`, `å flytte` |
| 4 | seltener, fachspezifisch | `en sykemelding`, `et skjema` |
| 5 | selten, sehr speziell | Fachbegriffe, seltene Redewendungen |

### 5. Qualität: korrigieren, aber nichts verschweigen

- **Tippfehler korrigieren** (Norwegisch und Deutsch) und in der Notiz vermerken: `Original: bokk`.
- **Falsche Bedeutungen** korrigieren und vermerken: `Original: „langsam“`.
- **Mehrdeutig?** Wenn das Original selbst ein echtes Wort mit anderer Bedeutung sein könnte, **nicht einfach überschreiben**:
  beide Bedeutungen auf die Karte schreiben (`Bein; Knochen`) oder in der Notiz erwähnen (`Mehrdeutig: …`).
- **Unklare Einträge** (keine Übersetzung, unleserlich, Bedeutung nicht eindeutig) **nicht raten**:
  nicht in die Tabelle aufnehmen, sondern **nach** dem Codeblock in einer kurzen Liste „Bitte klären“ aufführen – mit deiner Vermutung.
- **Doppelte** zusammenführen (eine Zeile, Bedeutungen kombiniert).
- **Keine persönlichen Daten** übernehmen (Namen von Lehrkräften, Kursdaten, Adressen …).
- Überschriften, Datumszeilen und Ähnliches aus Notizen weglassen.
- Immer **Bokmål** (nicht Nynorsk). Sju statt syv ist der gängige Standard, beides ist richtig.

### 6. Nach dem Codeblock kurz zusammenfassen

1. Anzahl der Zeilen.
2. Was du korrigiert hast (die wichtigsten Punkte).
3. Liste „Bitte klären“ (falls vorhanden).
4. Hinweis zum Einfügen: *Vokabeln verwalten → Tabelle importieren → einfügen → Vorschau → Importieren* (Häkchen „Vorhandene Karten aktualisieren“ an lassen).

Bei sehr langen Listen (über ca. 300 Wörter): in mehreren Teilen ausgeben („Teil 1“, „Teil 2“ …), jeder Teil mit eigener Kopfzeile.

### 7. Beispiel

Eingabe der Person (ungeordnet):
```
bil - auto
bok buch
skrive = schreiben
liten klein
takk for maten
forkjolelse erkältung
vær - ???
```

Deine Ausgabe:
```
Norwegisch;Deutsch;Thema;Wortart;Notiz;Beispiel NO;Beispiel DE;Häufigkeit
en bil;Auto;Unterwegs;Nomen;;Bilen er ny.;Das Auto ist neu.;1
ei bok (boka, bøker, bøkene);Buch;Alltag;Nomen;unregelmäßiger Plural;Jeg leser ei bok.;Ich lese ein Buch.;1
å skrive (skriver, skrev, har skrevet);schreiben;Arbeit;Verb;starkes Verb;Hun skriver et brev.;Sie schreibt einen Brief.;1
liten (lite, små, mindre, minst);klein;Farben & Beschreibung;Adjektiv;unregelmäßig;Et lite hus.;Ein kleines Haus.;1
Takk for maten!;Danke für das Essen!;Essen;Ausdruck;;;;1
en forkjølelse;Erkältung;Gesundheit;Nomen;Original: forkjolelse;Jeg har en forkjølelse.;Ich habe eine Erkältung.;3
```
**Bitte klären:** „vær“ – ohne Übersetzung. Möglich: *vær* = Wetter (et vær) oder Imperativ von *å være* (Sei …!). Welche Bedeutung war gemeint?

---

## Zusatz für Claude Code (wenn du direkt im App-Ordner arbeitest)

Statt die Tabelle nur auszugeben, kannst du sie als **Paket** anlegen, das die App automatisch zum Import anbietet:

1. Tabelle als **UTF-8 mit BOM** speichern unter `vokabeln/meine_vokabeln_teilN.csv` (N = nächste freie Nummer; gleiches Format wie oben, Semikolon).
2. Vor dem Speichern gegen vorhandene Teile abgleichen (`vokabeln/meine_vokabeln_teil*.csv`): Wörter, die es schon gibt, nicht doppelt anlegen.
3. Ausführen: `python -I vokabeln/build_pakete.py` → erzeugt `vokabeln/pakete.js`.
4. Der Person sagen: App neu laden (F5) → Startseite → „📦 Deine Vokabelpakete“ → **Importieren**.
5. Unklare Einträge in `vokabeln/zu_pruefen.md` sammeln.
Verändere dabei **keine** App-Dateien (`js/`, `css/`, `index.html`) – die Projektregeln stehen in `CLAUDE.md`, technische Details in `ENTWICKLUNG.md`.
