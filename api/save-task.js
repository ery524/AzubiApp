const fs = require('fs');
const path = require('path');

module.exports = async (req, res) => {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Handle OPTIONS request for CORS
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { user, task, completed, date, time } = req.body;
        
        // Validate data
        if (!user || !task || !date || !time) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        
        // Path to CSV file
        const CSV_FILE = path.join(process.cwd(), 'Azubi Tabelle', 'Aufgaben-Tabelle.csv');
        
        // Create CSV row (semicolon-separated for German Excel)
        const csvRow = `${user};${task};${completed ? 'Ja' : 'Nein'};${date};${time}\n`;
        
        // Append to CSV file
        fs.appendFileSync(CSV_FILE, csvRow, 'utf8');
        
        console.log(`✓ Task saved: ${user} - ${task} - ${date} ${time}`);
        
        res.status(200).json({ 
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
};
