// App state
let tasks = [];
let currentTaskIndex = 0;
let completedTasks = new Set();
let lianeStatus = false;
let userAbbreviation = '';

// DOM elements
const loginModal = document.getElementById('login-modal');
const userAbbreviationInput = document.getElementById('user-abbreviation');
const loginBtn = document.getElementById('login-btn');
const userInfo = document.getElementById('user-info');
const taskFrame = document.getElementById('task-frame');
const statusIndicator = document.getElementById('status-indicator');
const currentTaskSpan = document.getElementById('current-task');
const totalTasksSpan = document.getElementById('total-tasks');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const completeBtn = document.getElementById('complete-btn');

// Initialize app
async function init() {
    // Check if user abbreviation exists
    const savedAbbreviation = localStorage.getItem('userAbbreviation');
    if (!savedAbbreviation) {
        // Show login modal
        showLoginModal();
    } else {
        userAbbreviation = savedAbbreviation;
        userInfo.textContent = `Benutzer: ${userAbbreviation}`;
        startApp();
    }
}

// Show login modal
function showLoginModal() {
    loginModal.classList.add('active');
    userAbbreviationInput.focus();
}

// Handle login
function handleLogin() {
    const abbreviation = userAbbreviationInput.value.trim().toUpperCase();
    if (abbreviation.length > 0) {
        userAbbreviation = abbreviation;
        localStorage.setItem('userAbbreviation', abbreviation);
        userInfo.textContent = `Benutzer: ${userAbbreviation}`;
        loginModal.classList.remove('active');
        startApp();
    } else {
        alert('Bitte gib ein gültiges Kürzel ein.');
    }
}

// Start the app after login
async function startApp() {
    try {
        // Load config
        const config = await loadConfig();
        lianeStatus = config.LianeIstDa;
        
        // Update status indicator
        updateStatusIndicator();
        
        // Load tasks based on Liane's status
        await loadTasks();
        
        // Load saved progress
        loadProgress();
        
        // Display first task
        if (tasks.length > 0) {
            displayTask(currentTaskIndex);
        } else {
            taskFrame.srcdoc = '<div class="loading">Keine Aufgaben gefunden. Bitte füge HTML-Dateien im entsprechenden Ordner hinzu.</div>';
        }
        
    } catch (error) {
        console.error('Fehler beim Initialisieren der App:', error);
        const isFileProtocol = window.location.protocol === 'file:';
        let errorMessage;
        if (isFileProtocol) {
            const msg = document.createElement('div');
            msg.className = 'loading';
            msg.innerHTML = '<h3>Hinweis</h3><p>Diese App sollte über einen Webserver geöffnet werden.</p><p>Verwende z.B.: <code>python3 -m http.server 8080</code></p><p>Oder öffne die Datei mit "Live Server" in VS Code.</p>';
            const small = document.createElement('small');
            small.textContent = 'Technischer Fehler: ' + error.message;
            const p = document.createElement('p');
            p.appendChild(small);
            msg.appendChild(p);
            errorMessage = msg.outerHTML;
        } else {
            const msg = document.createElement('div');
            msg.className = 'loading';
            msg.textContent = 'Fehler beim Laden der Aufgaben: ' + error.message;
            errorMessage = msg.outerHTML;
        }
        taskFrame.srcdoc = errorMessage;
    }
}

// Load config from JSON
async function loadConfig() {
    try {
        const response = await fetch('config.json');
        if (!response.ok) {
            throw new Error('Konnte config.json nicht laden');
        }
        return await response.json();
    } catch (error) {
        // Fallback for file:// protocol or when config.json is not accessible
        console.warn('Konnte config.json nicht laden, verwende Standard-Konfiguration:', error.message);
        // Return default configuration
        return {
            LianeIstDa: true
        };
    }
}

// Update status indicator
function updateStatusIndicator() {
    if (lianeStatus) {
        statusIndicator.textContent = 'Liane ist da';
        statusIndicator.className = 'liane-present';
    } else {
        statusIndicator.textContent = 'Liane nicht da';
        statusIndicator.className = 'liane-absent';
    }
}

// Load tasks from the appropriate folder
async function loadTasks() {
    const folderName = lianeStatus 
        ? 'Aufgaben wenn Liane da ist' 
        : 'Aufgaben wenn Liane nicht da ist';
    
    try {
        // Load tasks from manifest file
        const response = await fetch(`${folderName}/tasks.json`);
        if (!response.ok) {
            throw new Error('Konnte tasks.json nicht laden');
        }
        const manifest = await response.json();
        const taskFiles = manifest.tasks || [];
        
        tasks = taskFiles.map(file => ({
            path: `${folderName}/${file}`,
            name: file.replace('.html', '').replace('aufgabe', 'Aufgabe ')
        }));
        
        totalTasksSpan.textContent = tasks.length;
    } catch (error) {
        console.error('Fehler beim Laden der Aufgaben:', error);
        // Fallback to hardcoded list if manifest not found
        const taskFiles = ['aufgabe1.html', 'aufgabe2.html', 'aufgabe3.html'];
        tasks = taskFiles.map(file => ({
            path: `${folderName}/${file}`,
            name: file.replace('.html', '').replace('aufgabe', 'Aufgabe ')
        }));
        totalTasksSpan.textContent = tasks.length;
    }
}

// Display a specific task
function displayTask(index) {
    if (index < 0 || index >= tasks.length) return;
    
    currentTaskIndex = index;
    const task = tasks[index];
    
    // Load task HTML
    taskFrame.src = task.path;
    
    // Update UI
    currentTaskSpan.textContent = index + 1;
    updateNavigationButtons();
    updateCompleteButton();
}

// Update navigation button states
function updateNavigationButtons() {
    prevBtn.disabled = currentTaskIndex === 0;
    nextBtn.disabled = currentTaskIndex === tasks.length - 1;
}

// Update complete button state
function updateCompleteButton() {
    if (completedTasks.has(currentTaskIndex)) {
        completeBtn.classList.add('completed');
    } else {
        completeBtn.classList.remove('completed');
    }
    // Button always shows just the checkmark
    completeBtn.textContent = '✓';
}

// Mark current task as complete
async function completeCurrentTask() {
    if (completedTasks.has(currentTaskIndex)) {
        // Unmark as complete
        completedTasks.delete(currentTaskIndex);
    } else {
        // Mark as complete
        completedTasks.add(currentTaskIndex);
        
        // Save to tracking table
        await saveTaskCompletion();
        
        // Auto-advance to next task if not the last one
        if (currentTaskIndex < tasks.length - 1) {
            setTimeout(() => {
                displayTask(currentTaskIndex + 1);
            }, 500);
        }
    }
    
    updateCompleteButton();
    saveProgress();
}

// Save task completion to tracking table
async function saveTaskCompletion() {
    const currentTask = tasks[currentTaskIndex];
    const now = new Date();
    const date = now.toLocaleDateString('de-DE');
    const time = now.toLocaleTimeString('de-DE');
    
    const trackingEntry = {
        user: userAbbreviation,
        task: currentTask.name,
        taskFile: currentTask.path,
        lianeStatus: lianeStatus ? 'Liane da' : 'Liane nicht da',
        completed: true,
        date: date,
        time: time,
        timestamp: now.toISOString()
    };
    
    try {
        // Get existing tracking data from localStorage
        let trackingData = [];
        const savedTracking = localStorage.getItem('taskTracking');
        if (savedTracking) {
            try {
                trackingData = JSON.parse(savedTracking);
            } catch (e) {
                console.error('Fehler beim Parsen der Tracking-Daten:', e);
                trackingData = [];
            }
        }
        
        // Add new entry
        trackingData.push(trackingEntry);
        
        // Save to localStorage
        localStorage.setItem('taskTracking', JSON.stringify(trackingData));
        console.log('Tracking-Daten gespeichert:', trackingEntry);
        
        // Auto-export CSV file
        autoExportCSV();
        
    } catch (error) {
        console.error('Fehler beim Speichern der Tracking-Daten:', error);
    }
}

// Save progress to localStorage
function saveProgress() {
    const progress = {
        currentTaskIndex,
        completedTasks: Array.from(completedTasks),
        lianeStatus
    };
    localStorage.setItem('azubiAppProgress', JSON.stringify(progress));
}

// Load progress from localStorage
function loadProgress() {
    const saved = localStorage.getItem('azubiAppProgress');
    if (saved) {
        try {
            const progress = JSON.parse(saved);
            // Only restore progress if Liane status matches
            if (progress.lianeStatus === lianeStatus) {
                currentTaskIndex = progress.currentTaskIndex || 0;
                completedTasks = new Set(progress.completedTasks || []);
            }
        } catch (error) {
            console.error('Fehler beim Laden des Fortschritts:', error);
        }
    }
}

// Event listeners
loginBtn.addEventListener('click', handleLogin);

userAbbreviationInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleLogin();
    }
});

prevBtn.addEventListener('click', () => {
    if (currentTaskIndex > 0) {
        displayTask(currentTaskIndex - 1);
    }
});

nextBtn.addEventListener('click', () => {
    if (currentTaskIndex < tasks.length - 1) {
        displayTask(currentTaskIndex + 1);
    }
});

completeBtn.addEventListener('click', completeCurrentTask);

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' && !prevBtn.disabled) {
        prevBtn.click();
    } else if (e.key === 'ArrowRight' && !nextBtn.disabled) {
        nextBtn.click();
    } else if (e.key === 'Enter' || (e.key === ' ' && e.target === document.body)) {
        // Only prevent default for Space when not in an input/scrollable element
        e.preventDefault();
        completeBtn.click();
    }
});

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}


// Auto-export CSV to "Azubi Tabelle" folder
function autoExportCSV() {
    // Get tracking data from localStorage
    const savedTracking = localStorage.getItem('taskTracking');
    let trackingData = [];
    
    if (savedTracking) {
        try {
            trackingData = JSON.parse(savedTracking);
        } catch (e) {
            console.error('Fehler beim Laden der Tracking-Daten:', e);
            return;
        }
    }
    
    if (trackingData.length === 0) {
        return; // No data to export
    }
    
    // Create CSV content with UTF-8 BOM for Excel compatibility
    // Use semicolon as separator for German Excel
    const BOM = '\uFEFF';
    const headers = ['Kürzel', 'Aufgabe', 'Erledigt', 'Datum', 'Uhrzeit'];
    let csvContent = BOM + headers.join(';') + '\n';
    
    // Add data rows
    trackingData.forEach(entry => {
        const row = [
            escapeCSV(entry.user || '-'),
            escapeCSV(entry.task || '-'),
            entry.completed ? 'Ja' : 'Nein',
            escapeCSV(entry.date || '-'),
            escapeCSV(entry.time || '-')
        ];
        csvContent += row.join(';') + '\n';
    });
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'Aufgaben-Tabelle.csv');
    
    // Trigger download automatically
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up
    URL.revokeObjectURL(url);
    
    console.log('CSV-Datei wurde heruntergeladen. Bitte speichere sie im Ordner "Azubi Tabelle".');
}

// Helper function to escape CSV values
function escapeCSV(value) {
    if (typeof value !== 'string') {
        value = String(value);
    }
    // If value contains semicolon, newline, or quotes, wrap in quotes
    if (value.includes(';') || value.includes('\n') || value.includes('"')) {
        value = '"' + value.replace(/"/g, '""') + '"';
    }
    return value;
}
