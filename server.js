const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname)); // Serve static files from root directory

// Path to CSV file
const CSV_FILE = path.join(__dirname, 'Azubi Tabelle', 'Aufgaben-Tabelle.csv');

// API endpoint to save task completion
app.post('/api/save-task', (req, res) => {
    try {
        const { user, task, completed, date, time } = req.body;
        
        // Validate data
        if (!user || !task || !date || !time) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        
        // Create CSV row (semicolon-separated for German Excel)
        const csvRow = `${user};${task};${completed ? 'Ja' : 'Nein'};${date};${time}\n`;
        
        // Append to CSV file
        fs.appendFileSync(CSV_FILE, csvRow, 'utf8');
        
        console.log(`✓ Task saved: ${user} - ${task} - ${date} ${time}`);
        
        res.json({ 
            success: true, 
            message: 'Task erfolgreich gespeichert' 
        });
        
    } catch (error) {
        console.error('Error saving task:', error);
        res.status(500).json({ 
            error: 'Fehler beim Speichern der Aufgabe',
            details: error.message 
        });
    }
});

// API endpoint to get table data
app.get('/api/get-table', (req, res) => {
    try {
        // Check if file exists
        if (!fs.existsSync(CSV_FILE)) {
            return res.json({
                headers: ['Kürzel', 'Aufgabe', 'Erledigt', 'Datum', 'Uhrzeit'],
                rows: []
            });
        }
        
        // Read CSV file
        const csvContent = fs.readFileSync(CSV_FILE, 'utf8');
        const lines = csvContent.trim().split('\n');
        
        if (lines.length === 0) {
            return res.json({
                headers: ['Kürzel', 'Aufgabe', 'Erledigt', 'Datum', 'Uhrzeit'],
                rows: []
            });
        }
        
        // Parse CSV (semicolon-separated)
        const headers = lines[0].split(';');
        const rows = lines.slice(1).map(line => line.split(';'));
        
        // Reverse rows to show newest first
        rows.reverse();
        
        res.json({
            headers: headers,
            rows: rows
        });
        
    } catch (error) {
        console.error('Error reading table data:', error);
        res.status(500).json({ 
            error: 'Fehler beim Laden der Tabellendaten',
            details: error.message 
        });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Server läuft' });
});

// Start server
app.listen(PORT, () => {
    console.log(`\n🚀 AzubiApp Server läuft auf Port ${PORT}`);
    console.log(`📊 CSV-Datei: ${CSV_FILE}`);
    console.log(`🌐 Öffne im Browser: http://localhost:${PORT}\n`);
});
