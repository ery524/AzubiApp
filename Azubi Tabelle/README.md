# Azubi Tabelle - CSV Export Ordner

Dieser Ordner ist für die automatisch heruntergeladene CSV-Datei vorgesehen.

## Verwendung

1. **Aufgaben in der App erledigen**: Klicke auf den ✓ Button bei jeder Aufgabe
2. **CSV wird automatisch heruntergeladen**: Die Datei `Aufgaben-Tabelle.csv` wird bei jedem Klick neu heruntergeladen
3. **Datei hier speichern**: Speichere die heruntergeladene CSV-Datei in diesem Ordner
4. **In Excel öffnen**: Öffne die CSV-Datei mit Microsoft Excel

## CSV-Format

Die CSV-Datei enthält folgende Spalten:
- **Kürzel**: Benutzer-Kürzel (beim Start eingegeben)
- **Aufgabe**: Name der Aufgabe
- **Erledigt**: Ja (wird gesetzt wenn ✓ geklickt wurde)
- **Datum**: Datum im Format TT.MM.JJJJ
- **Uhrzeit**: Uhrzeit im Format HH:MM:SS

## Beispiel

```csv
Kürzel;Aufgabe;Erledigt;Datum;Uhrzeit
AB;Aufgabe 1;Ja;11.2.2026;15:12:27
AB;Aufgabe 2;Ja;11.2.2026;15:12:45
MK;Aufgabe 1;Ja;11.2.2026;16:30:12
```

## Hinweis

Da Browser-Apps nicht direkt auf das Dateisystem zugreifen können, wird die CSV-Datei über den Download-Dialog des Browsers heruntergeladen. Du musst sie manuell in diesem Ordner speichern, um eine zentrale Sammlung zu haben.
