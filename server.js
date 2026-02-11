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
