# AzubiApp - Auszubildenden Aufgabenverwaltung

Eine mobile Web-App zur Verwaltung und Verfolgung von Aufgaben für Auszubildende. Die App zeigt unterschiedliche Aufgaben an, abhängig davon, ob Liane anwesend ist oder nicht.

## Features

- ✅ Dynamisches Laden von Aufgaben basierend auf Liane's Anwesenheitsstatus
- ✅ Slide-für-Slide Navigation durch Aufgaben
- ✅ Abhaken erledigter Aufgaben mit grünem Button (unten rechts)
- ✅ Automatisches Vorrücken zur nächsten Aufgabe nach Abhaken
- ✅ Fortschrittsspeicherung (LocalStorage)
- ✅ Mobile-optimiertes, responsives Design
- ✅ Tastaturnavigation (Pfeiltasten, Enter, Leertaste)

## Verwendung

### App starten

1. Öffne `index.html` in einem Webbrowser (empfohlen: Chrome, Firefox, Safari)
2. Für lokale Entwicklung mit HTTP-Server:
   ```bash
   python3 -m http.server 8080
   # Dann öffne http://localhost:8080
   ```

### Liane-Status konfigurieren

Bearbeite die Datei `config.json`:
```json
{
  "LianeIstDa": true    // true = Liane ist da, false = Liane nicht da
}
```

### Aufgaben hinzufügen/bearbeiten

**Für Aufgaben wenn Liane da ist:**
- Speichere HTML-Dateien im Ordner: `Aufgaben wenn Liane da ist/`
- Benenne sie: `aufgabe1.html`, `aufgabe2.html`, `aufgabe3.html`, etc.

**Für Aufgaben wenn Liane nicht da ist:**
- Speichere HTML-Dateien im Ordner: `Aufgaben wenn Liane nicht da ist/`
- Benenne sie: `aufgabe1.html`, `aufgabe2.html`, `aufgabe3.html`, etc.

**Wichtig:** Nach dem Hinzufügen neuer Aufgaben, aktualisiere die Dateiliste in `app.js` (Zeile 76):
```javascript
const taskFiles = ['aufgabe1.html', 'aufgabe2.html', 'aufgabe3.html', 'aufgabe4.html'];
```

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
- **"✓ Erledigt"** Button (grün, unten rechts): Aufgabe als erledigt markieren

### Mit Tastatur:
- **Pfeil links** (←): Zur vorherigen Aufgabe
- **Pfeil rechts** (→): Zur nächsten Aufgabe
- **Enter** oder **Leertaste**: Aufgabe als erledigt markieren

## Projektstruktur

```
AzubiApp/
├── index.html                              # Haupt-App
├── app.js                                  # App-Logik
├── styles.css                              # Styling
├── config.json                             # Konfiguration (LianeIstDa)
├── Aufgaben wenn Liane da ist/
│   ├── aufgabe1.html
│   ├── aufgabe2.html
│   └── aufgabe3.html
└── Aufgaben wenn Liane nicht da ist/
    ├── aufgabe1.html
    ├── aufgabe2.html
    └── aufgabe3.html
```

## Technische Details

- **Frontend-only**: Keine Backend-Abhängigkeiten
- **Vanilla JavaScript**: Keine externen Frameworks
- **Mobile-first Design**: Optimiert für Smartphones
- **LocalStorage**: Fortschritt wird lokal gespeichert
- **iframe-basiert**: Aufgaben werden in isolierten iframes geladen

## Browser-Kompatibilität

- ✅ Chrome/Edge (empfohlen)
- ✅ Firefox
- ✅ Safari (iOS/macOS)
- ✅ Mobile Browser (iOS Safari, Chrome Mobile)

## Lizenz

Dieses Projekt ist für den internen Gebrauch bestimmt.