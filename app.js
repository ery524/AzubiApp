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
        }
        
    } catch (error) {
        console.error('Fehler beim Initialisieren der App:', error);
        taskFrame.srcdoc = '<div class="loading">Fehler beim Laden der Aufgaben.</div>';
    }
}

// Load config from JSON
async function loadConfig() {
    const response = await fetch('config.json');
    if (!response.ok) {
        throw new Error('Konnte config.json nicht laden');
    }
    return await response.json();
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
        // Get existing tracking data
        let trackingData = [];
        try {
            const response = await fetch('Tabellen/tracking.json');
            if (response.ok) {
                trackingData = await response.json();
            }
        } catch (e) {
            // File might not exist yet, start with empty array
            console.log('Tracking file not found, creating new one');
        }
        
        // Add new entry
        trackingData.push(trackingEntry);
        
        // Save to localStorage as backup (since we can't write files from browser)
        localStorage.setItem('taskTracking', JSON.stringify(trackingData));
        
        // Also try to save via a simple download mechanism
        // This creates a downloadable file that users can save to the Tabellen folder
        downloadTrackingData(trackingData);
        
    } catch (error) {
        console.error('Fehler beim Speichern der Tracking-Daten:', error);
    }
}

// Download tracking data as JSON file
function downloadTrackingData(data) {
    // Only download every 5 completions to avoid too many downloads
    const completionCount = completedTasks.size;
    if (completionCount % 5 === 0 || completionCount === 1) {
        const dataStr = JSON.stringify(data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'tracking.json';
        // Don't actually trigger download automatically - just store in localStorage
        // Users can manually download if needed
        console.log('Tracking data saved to localStorage');
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
