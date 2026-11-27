# Norsk – Norwegisch-Lernapp (Bokmål) – Anleitung

## Starten
**Doppelklick auf `index.html`** (Edge oder Chrome). Kein Internet, keine Installation nötig.
Die App ist komplett getrennt von der Koreanisch-App – eigene Vokabeln, eigener Fortschritt, eigene Einstellungen.

> ⚠️ Daten liegen im Browser-Speicher. Immer denselben Browser nutzen und unter *Einstellungen → Sicherung* regelmäßig ein **Backup** machen.

## Einmalig einrichten
1. **Norwegische Stimme** (offline): Windows-Einstellungen → Zeit und Sprache → Sprache und Region → Sprache hinzufügen →
   **Norsk bokmål** → „Sprachausgabe“ anhaken → installieren → Browser komplett schließen und neu öffnen.
   Test: *Einstellungen → Audio → ▶ Stimme testen*.
   **Andere Stimme?** Unter *Einstellungen → Audio* wählen. Stimmen mit „(online!)“ (Edge) klingen natürlicher, brauchen aber Internet – offline nimmt die App automatisch die Offline-Stimme.
   **Stimme installiert, aber die App findet sie nicht?** Windows legt „Microsoft Jon“ nur als *moderne* Stimme an – Browser sehen offline nur *klassische* Stimmen.
   → Im App-Ordner `tools
orwegische-stimme-freischalten.reg` doppelklicken, Sicherheitsabfrage bestätigen, Browser komplett schließen und neu öffnen.
   Es wird nur der vorhandene Stimmen-Eintrag zusätzlich registriert. Rückgängig: `tools
orwegische-stimme-rueckgaengig.reg`.
2. **æ ø å:** In norwegischen Feldern tippt deine deutsche Tastatur **ä → æ, ö → ø, ü → å** (mit Umschalt Æ Ø Å).
   Oder Knopf **⌨️ æøå** unten rechts.

## Startpaket
Beim ersten Öffnen erscheint auf der Startseite **„📦 Grundwortschatz (Startpaket)“** mit 245 Karten
(Nomen mit Artikel, Verben mit å, Adjektive) → **Importieren**.

## Eigene Vokabeln
*Vokabeln verwalten → Tabelle importieren* (aus Excel kopieren oder CSV wählen). Vorlage: `vorlage_vokabeln.csv`.

| Norwegisch | Deutsch | Thema | Wortart | Notiz | Beispiel NO | Beispiel DE | Häufigkeit |
|---|---|---|---|---|---|---|---|
| en bil | Auto | Unterwegs | | | Bilen er ny. | Das Auto ist neu. | 1 |
| å skrive (skriver, skrev, har skrevet) | schreiben | Arbeit | | | | | 1 |

- **Nomen mit Artikel** (en/ei/et), **Verben mit å** → die Wortart wird automatisch erkannt.
- **Unregelmäßige Formen in Klammern** – dann übt der Trainer auch dieses Wort:
  Verben `(Präsens, Präteritum, Perfekt)`, Nomen `(bestimmt, Plural, bestimmter Plural)`, Adjektive `(Neutrum, Plural, Komparativ, Superlativ)`.
- Beim Abfragen zählt eine Antwort ohne Artikel/å als richtig, mit Hinweis. ä/ö statt æ/ø zählen ebenfalls.
- **Mit Claude:** Datei `VOKABELN_FUER_CLAUDE.md` an Claude geben (im Chat hochladen) und schreiben: *„Lies VOKABELN_FUER_CLAUDE.md und mach aus meiner Liste eine Import-Tabelle:“* – dann die Vokabeln einfügen (gern unordentlich, auch Fotos).
  Die fertige Tabelle unter *Vokabeln verwalten → Tabelle importieren* einfügen → Vorschau → Importieren. Mit Claude Code im App-Ordner wird daraus direkt ein Paket.

## Phasen
Wie in der Koreanisch-App: Phase 1–6, falsch → zurück auf 1; Abstände und Richtung einstellbar; neue Karten nach Häufigkeit (★).

## Grammatik
30 Lektionen von A1 bis B1: Pronomen, en/ei/et, bestimmte Form, Plural, Präsens, Wortstellung (V2), ikke, Fragen, Adjektive,
Possessiv, Modalverben, Zahlen/Uhrzeit, Präpositionen, Präteritum (4 Klassen), starke Verben, Perfektum, Futur, Imperativ,
doppelte Bestimmtheit, Steigerung, Objekt-/Reflexivpronomen, Nebensätze, sin/si/sitt, det finnes, Konjunktionen,
Passiv, Plusquamperfekt, indirekte Rede, som-Sätze, Konditional.
Lektion lesen → **Ins Training aufnehmen** → wird in eigenem Rhythmus fällig (Übersetzen, Fehler finden, Satzbau, Hördiktat, Lückentext, Formen).

## Dialoge im Alltag
Menüpunkt **💬 Dialoge**: 9 typische Gespräche – Café, Restaurant, Supermarkt, U-Bahn, Post, Arzt, Apotheke, Hotel, Taxi.
- **Lesen & Hören:** jeder Satz mit 🔊, „▶ Ganzen Dialog anhören“, Übersetzung ein-/ausblendbar.
- **🎭 Rollenspiel:** Rolle wählen (z. B. Gast); die App spricht die andere Rolle, du **schreibst** deinen Satz (wird geprüft) oder **sprichst** ihn (mit 🎙️ aufnehmen, selbst bewerten). Danach „Rollen tauschen“.
- **✍️ Üben:** Übersetzen, Satzbau und Hördiktat mit den Dialogsätzen.
- **📇 Schlüsselwörter** mit einem Klick als Karteikarten übernehmen – nur Wörter, die du noch nicht hast.

## Memory
Menüpunkt **🃏 Memory**: Paare finden – mit Bildern für Farben, Tiere, Möbel, Verkehrsmittel, Obst & Gemüse, Körper, Kleidung, Natur & Wetter.
- **Spielarten:** 🖼️ Bild ↔ Wort · 🔤 Wort ↔ Deutsch · 🎧 Hören ↔ Bild (die 🔊-Karte spricht das Wort beim Aufdecken)
- **6, 8 oder 10 Paare**; Züge und Zeit werden gezählt, Bestwerte gespeichert.
- **Mit meinen Vokabeln:** jedes Thema mit mindestens 6 Karten (Wort ↔ Deutsch).
- Nach dem Spiel: neue Wörter mit einem Klick als Karteikarten übernehmen.

## Trainer
- **Verben:** Präsens, Präteritum, Perfektum, Plusquamperfekt, Futur, Imperativ – wahlweise nur schwache oder nur starke
- **Substantive:** bestimmte Form, Plural (inkl. mann – menn, bok – bøker …)
- **Adjektive:** stort/store, Steigerung
- **Zahlen:** Zahlen, Kronen, Uhrzeit (halv fire = 3:30), Datum (syttende mai)
- **Formentabelle:** beliebiges Wort eingeben (å …, en/ei/et …, Adjektiv)

## Darstellung
Wie in der Koreanisch-App: *Einstellungen → Darstellung* (Modus, Akzentfarbe, Schriftgröße).

## iPad & iPhone
Die App ist online unter **https://juvor.github.io/norwegisch-lernapp/** – einmal öffnen, danach läuft sie offline.
1. Auf iPad/iPhone die Adresse in **Safari** öffnen → Teilen-Symbol → **„Zum Home-Bildschirm“**.
2. Ab jetzt über das Symbol auf dem Home-Bildschirm starten (auch im Flugmodus). Immer diesen Weg nutzen – Safari, Firefox und das Home-Bildschirm-Symbol haben jeweils einen eigenen Speicher.
3. **Vokabeln & Lernstand übertragen:** am PC *Einstellungen → Backup herunterladen* (z. B. in einen Cloud-Ordner wie OneDrive oder iCloud Drive), auf dem iPad über die Dateien-App *Einstellungen → Backup wiederherstellen*. Geräte gleichen sich nicht automatisch ab.
4. Updates: Wenn die App am PC verbessert und veröffentlicht wurde, lädt das iPad die neue Version beim nächsten Start mit Internet (eventuell zweimal öffnen).
Eigene Vokabelpakete aus dem Ordner `vokabeln/` sind bewusst **nicht** online – sie kommen über das Backup aufs iPad.


## Backups – wo speichern?
In einem Cloud-Ordner (z. B. OneDrive oder iCloud Drive, Unterordner `Sprach-Backups`) – synchronisiert und auf dem iPad über die Dateien-App erreichbar.
Der Browser lädt nach *Downloads* – Datei dorthin verschieben oder im Browser „Jedes Mal fragen, wo gespeichert wird“ einstellen.
Etwa wöchentlich sichern, die letzten 3–4 Backups behalten.

**Backup-Dateien** heißen z. B. `norwegisch-backup_2026-11-27_14-35_Nr-012.json` – mit Datum, Uhrzeit und fortlaufender Nummer (die Nummer zählt über alle Geräte weiter, wenn du immer das neueste Backup einspielst). Beim Einspielen zeigt die App Nummer, Zeitpunkt und Anzahl der Vokabeln an.
- Ein Backup der jeweils anderen Sprach-App wird abgelehnt.
- Ein Backup aus einer **neueren** App-Version (z. B. Handy schon aktualisiert, Laptop noch nicht) wird abgelehnt – dann die App zuerst mit Internet öffnen/neu laden.
- Backups aus **älteren** Versionen funktionieren immer – auch nach Updates mit neuen Dialogen, Spielen usw. bleibt der Lernstand erhalten.
- Im Backup steckt alles: Vokabeln mit Phase und Fälligkeitsdatum je Richtung, Grammatik-Stand, Statistik, Bestwerte, Einstellungen. Was auf dem einen Gerät heute fällig war, ist nach dem Einspielen auch auf dem anderen heute fällig.
- Mehrere Geräte: immer abwechselnd lernen und vor jedem Wechsel ein Backup machen und auf dem anderen Gerät einspielen (Einspielen **ersetzt** den Stand).
