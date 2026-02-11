# AzubiApp - Auszubildenden Aufgabenverwaltung

Eine mobile Web-App zur Verwaltung und Verfolgung von Aufgaben für Auszubildende. Die App zeigt unterschiedliche Aufgaben an, abhängig davon, ob Liane anwesend ist oder nicht.

## Features

- ✅ **Benutzer-Login**: Kürzel-Abfrage beim Start für personalisierte Nutzung
- ✅ **Dynamisches Laden von Aufgaben** basierend auf Manifest-Dateien
- ✅ **Aufgaben-Tracking**: Automatische Speicherung mit Datum, Uhrzeit und Benutzer
- ✅ **Server-seitige CSV-Speicherung**: CSV wird auf dem Server erweitert, ohne dass der User etwas merkt
- ✅ **Node.js Backend**: Automatische Speicherung in die CSV-Datei auf dem Server
- ✅ Aufgabenanzeige basierend auf Liane's Anwesenheitsstatus
- ✅ Slide-für-Slide Navigation durch Aufgaben
- ✅ Abhaken erledigter Aufgaben mit grünem Button (✓, unten rechts)
- ✅ Automatisches Vorrücken zur nächsten Aufgabe nach Abhaken
- ✅ Fortschrittsspeicherung (LocalStorage)
- ✅ Mobile-optimiertes, responsives Design
- ✅ Tastaturnavigation (Pfeiltasten, Enter, Leertaste)

## Verwendung

### App starten

**Wichtig**: Diese App benötigt einen Node.js Server um die CSV-Datei auf dem Server zu aktualisieren!

**Installation (einmalig):**
```bash
# Im Projektverzeichnis:
npm install
```

**Server starten:**
```bash
npm start
# Oder:
node server.js
```

Der Server läuft dann auf: **http://localhost:3000**

**Nach dem Start:**
1. Öffne im Browser: http://localhost:3000
2. Gib beim ersten Start dein Kürzel ein (z.B. "AB", "MK")
3. Das Kürzel wird für Tracking-Zwecke gespeichert
4. Beginne mit den Aufgaben!
5. ✓ Wenn du eine Aufgabe abhakst, wird sie automatisch in der CSV-Datei auf dem Server gespeichert

**Wichtig:** Die CSV-Datei (`Azubi Tabelle/Aufgaben-Tabelle.csv`) wird direkt auf dem Server erweitert. Der Benutzer bekommt davon nichts mit - keine Downloads!

### Kürzel zurücksetzen

Falls du das Kürzel ändern möchtest:
1. Öffne die Browser-Konsole (F12)
2. Führe aus: `localStorage.removeItem('userAbbreviation')`
3. Lade die Seite neu

### Liane-Status konfigurieren

Bearbeite die Datei `config.json`:
```json
{
  "LianeIstDa": true    // true = Liane ist da, false = Liane nicht da
}
```

### Aufgaben hinzufügen/bearbeiten

**Schritt 1: HTML-Datei erstellen**

Erstelle eine neue HTML-Datei im entsprechenden Ordner:
- **Für Aufgaben wenn Liane da ist:** `Aufgaben wenn Liane da ist/`
- **Für Aufgaben wenn Liane nicht da ist:** `Aufgaben wenn Liane nicht da ist/`

**Schritt 2: Manifest aktualisieren**

Bearbeite die `tasks.json` Datei im jeweiligen Ordner und füge die neue Aufgabe hinzu:
```json
{
  "tasks": [
    "aufgabe1.html",
    "aufgabe2.html",
    "aufgabe3.html",
    "aufgabe4.html"
  ]
}
```

Die App erkennt automatisch die Anzahl der Aufgaben aus der Manifest-Datei!

### Aufgabenformat

Jede Aufgabe ist eine einfache HTML-Datei:
```html
<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Aufgabe 1</title>
</head>
<body>
    <div class="task-container">
        <h1>Aufgabe 1</h1>
        <p>Beschreibung der Aufgabe...</p>
        <!-- Weitere Inhalte wie Listen, Bilder, etc. -->
    </div>
</body>
</html>
```

## Bedienung

### Mit Maus/Touch:
- **"Weiter →"** Button: Zur nächsten Aufgabe
- **"← Zurück"** Button: Zur vorherigen Aufgabe
- **"✓"** Button (grün, unten rechts): Aufgabe als erledigt markieren

### Mit Tastatur:
- **Pfeil links** (←): Zur vorherigen Aufgabe
- **Pfeil rechts** (→): Zur nächsten Aufgabe
- **Enter** oder **Leertaste**: Aufgabe als erledigt markieren

## Aufgaben-Tracking

Die App speichert automatisch jeden Aufgabenabschluss mit folgenden Informationen:
- Benutzer-Kürzel
- Aufgabenname
- Erledigt-Status (Ja)
- Datum und Uhrzeit der Erledigung
- ISO-Timestamp

### Automatische Server-seitige CSV-Speicherung

**Wichtig:** Bei jedem Klick auf den ✓ Button wird die Aufgabe automatisch auf dem Server in der CSV-Datei gespeichert!

**Der Benutzer bekommt davon nichts mit - keine Downloads!**

Die CSV-Datei:
- Liegt im Ordner: **`Azubi Tabelle/Aufgaben-Tabelle.csv`**
- Wird auf dem Server automatisch erweitert (nicht neu erstellt)
- Kann direkt in Microsoft Excel geöffnet werden
- Verwendet Semikolon als Trennzeichen (deutscher Standard)
- Enthält alle Spalten: **Kürzel, Aufgabe, Erledigt, Datum, Uhrzeit**

**Spalten in der CSV:**
- **Kürzel**: Das beim Start eingegebene Benutzer-Kürzel
- **Aufgabe**: Name der erledigten Aufgabe
- **Erledigt**: "Ja" (wird gesetzt wenn ✓ geklickt wurde)
- **Datum**: Datum im deutschen Format (TT.MM.JJJJ)
- **Uhrzeit**: Uhrzeit im deutschen Format (HH:MM:SS)

**Beispiel CSV-Inhalt:**
```csv
Kürzel;Aufgabe;Erledigt;Datum;Uhrzeit
AB;Aufgabe 1;Ja;11.2.2026;15:12:27
AB;Aufgabe 2;Ja;11.2.2026;15:12:45
```

**Workflow:**
1. Benutzer klickt ✓ bei einer Aufgabe
2. App sendet Daten an Server (POST /api/save-task)
3. Server schreibt neue Zeile in CSV-Datei
4. Benutzer arbeitet einfach weiter - keine Unterbrechung!

### Manuelle Abfrage (Browser-Konsole)

Die Tracking-Daten werden in **LocalStorage** gespeichert und können über die Browser-Konsole abgerufen werden:
```javascript
// Tracking-Daten anzeigen
JSON.parse(localStorage.getItem('taskTracking'))
```

## Projektstruktur

```
AzubiApp/
├── index.html                              # Haupt-App
├── app.js                                  # App-Logik
├── styles.css                              # Styling
├── config.json                             # Konfiguration (LianeIstDa)
├── Azubi Tabelle/                          # Ordner für CSV-Export
│   └── Aufgaben-Tabelle.csv                # Hier CSV speichern!
├── Tabellen/                               # Tracking-Daten
│   └── tracking.json                       # Platzhalter für Tracking
├── Aufgaben wenn Liane da ist/
│   ├── tasks.json                          # Manifest der Aufgaben
│   ├── aufgabe1.html
│   ├── aufgabe2.html
│   └── aufgabe3.html
└── Aufgaben wenn Liane nicht da ist/
    ├── tasks.json                          # Manifest der Aufgaben
    ├── aufgabe1.html
    ├── aufgabe2.html
    └── aufgabe3.html
```

## Technische Details

- **Node.js Backend**: Express-Server für CSV-Speicherung
- **REST API**: POST /api/save-task Endpoint zum Speichern von Aufgaben
- **Vanilla JavaScript Frontend**: Keine externen Frameworks im Frontend
- **Mobile-first Design**: Optimiert für Smartphones
- **LocalStorage**: Fortschritt und Tracking-Daten werden lokal gespeichert
- **Server-seitige Datei-Operationen**: CSV wird direkt auf dem Server erweitert
- **iframe-basiert**: Aufgaben werden in isolierten iframes geladen
- **Manifest-basiert**: Dynamisches Laden von Aufgaben aus tasks.json

## Browser-Kompatibilität

- ✅ Chrome/Edge (empfohlen)
- ✅ Firefox
- ✅ Safari (iOS/macOS)
- ✅ Samsung Internet Browser
- ✅ Mobile Browser (iOS Safari, Chrome Mobile, Samsung Internet)

## Lizenz

Dieses Projekt ist für den internen Gebrauch bestimmt.