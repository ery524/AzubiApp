# AzubiApp - Auszubildenden Aufgabenverwaltung

Eine mobile Web-App zur Verwaltung und Verfolgung von Aufgaben für Auszubildende. Die App zeigt unterschiedliche Aufgaben an, abhängig davon, ob Liane anwesend ist oder nicht.

## Features

- ✅ **Benutzer-Login**: Kürzel-Abfrage beim Start für personalisierte Nutzung
- ✅ **Dynamisches Laden von Aufgaben** basierend auf Manifest-Dateien
- ✅ **Aufgaben-Tracking**: Automatische Speicherung mit Datum, Uhrzeit und Benutzer
- ✅ **Automatischer CSV-Export**: CSV-Datei wird bei jedem abgehakten Task automatisch heruntergeladen
- ✅ Aufgabenanzeige basierend auf Liane's Anwesenheitsstatus
- ✅ Slide-für-Slide Navigation durch Aufgaben
- ✅ Abhaken erledigter Aufgaben mit grünem Button (✓, unten rechts)
- ✅ Automatisches Vorrücken zur nächsten Aufgabe nach Abhaken
- ✅ Fortschrittsspeicherung (LocalStorage)
- ✅ Mobile-optimiertes, responsives Design
- ✅ Tastaturnavigation (Pfeiltasten, Enter, Leertaste)

## Verwendung

### App starten

**Wichtig**: Diese App funktioniert am besten mit einem lokalen Webserver!

**Empfohlene Methode (mit Webserver):**
```bash
# Im Projektverzeichnis ausführen:
python3 -m http.server 8080
# Dann öffne im Browser: http://localhost:8080
```

**Alternative Methoden:**
- Mit Node.js: `npx http-server -p 8080`
- Mit VS Code: Extension "Live Server" installieren und verwenden
- Mit PHP: `php -S localhost:8080`

**Direktes Öffnen (ohne Webserver):**
- Du kannst `index.html` auch direkt im Browser öffnen
- Die App nutzt dann Standard-Einstellungen
- ⚠️ Hinweis: Einige Funktionen könnten eingeschränkt sein

**Nach dem Start:**
1. Gib beim ersten Start dein Kürzel ein (z.B. "AB", "MK")
2. Das Kürzel wird für Tracking-Zwecke gespeichert
3. Beginne mit den Aufgaben!

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

### Automatischer CSV-Export

**Wichtig:** Bei jedem Klick auf den ✓ Button wird automatisch eine CSV-Datei heruntergeladen!

Die CSV-Datei:
- Heißt: **`Aufgaben-Tabelle.csv`**
- Wird automatisch beim Browser heruntergeladen
- Sollte im Ordner **`Azubi Tabelle`** im Projektverzeichnis gespeichert werden
- Kann direkt in Microsoft Excel geöffnet werden
- Verwendet Semikolon als Trennzeichen (deutscher Standard)
- Enthält alle Spalten: **Kürzel, Aufgabe, Erledigt, Datum, Uhrzeit**
- Wird bei jedem abgehakten Task aktualisiert und heruntergeladen

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

- **Frontend-only**: Keine Backend-Abhängigkeiten
- **Vanilla JavaScript**: Keine externen Frameworks
- **Mobile-first Design**: Optimiert für Smartphones
- **LocalStorage**: Fortschritt und Tracking-Daten werden lokal gespeichert
- **iframe-basiert**: Aufgaben werden in isolierten iframes geladen
- **Manifest-basiert**: Dynamisches Laden von Aufgaben aus tasks.json
- **Auto-Export**: CSV wird bei jedem abgehakten Task automatisch heruntergeladen

## Browser-Kompatibilität

- ✅ Chrome/Edge (empfohlen)
- ✅ Firefox
- ✅ Safari (iOS/macOS)
- ✅ Mobile Browser (iOS Safari, Chrome Mobile)

## Lizenz

Dieses Projekt ist für den internen Gebrauch bestimmt.