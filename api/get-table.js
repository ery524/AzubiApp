const fs = require('fs');
const path = require('path');

module.exports = async (req, res) => {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Handle OPTIONS request for CORS
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    try {
        // Path to CSV file
        const CSV_FILE = path.join(process.cwd(), 'Azubi Tabelle', 'Aufgaben-Tabelle.csv');
        
        // Check if file exists
        if (!fs.existsSync(CSV_FILE)) {
            return res.status(200).json({
                headers: ['Kürzel', 'Aufgabe', 'Erledigt', 'Datum', 'Uhrzeit'],
                rows: []
            });
        }
        
        // Read CSV file
        const csvContent = fs.readFileSync(CSV_FILE, 'utf8');
        const lines = csvContent.trim().split('\n');
        
        if (lines.length === 0) {
            return res.status(200).json({
                headers: ['Kürzel', 'Aufgabe', 'Erledigt', 'Datum', 'Uhrzeit'],
                rows: []
            });
        }
        
        // Parse CSV (semicolon-separated)
        const headers = lines[0].split(';');
        const rows = lines.slice(1).map(line => line.split(';'));
        
        // Reverse rows to show newest first
        rows.reverse();
        
        res.status(200).json({
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
};
