const fs = require('fs').promises;
const path = require('path');

// NOTE: This function writes to the filesystem, which works locally but NOT on Vercel
// Vercel serverless functions have a read-only filesystem (except /tmp)
// For production use on Vercel, consider using a database or cloud storage solution
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
        
        // Append to CSV file (using async operation)
        await fs.appendFile(CSV_FILE, csvRow, 'utf8');
        
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
