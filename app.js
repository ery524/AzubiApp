// App state
let tasks = [];
let currentTaskIndex = 0;
let completedTasks = new Set();
let lianeStatus = false;

// DOM elements
const taskFrame = document.getElementById('task-frame');
const statusIndicator = document.getElementById('status-indicator');
const currentTaskSpan = document.getElementById('current-task');
const totalTasksSpan = document.getElementById('total-tasks');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const completeBtn = document.getElementById('complete-btn');

// Initialize app
async function init() {
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
    
    // Get list of HTML files in the folder
    // Since we can't list directory contents directly in browser,
    // we'll use a predefined list of tasks
    const taskFiles = ['aufgabe1.html', 'aufgabe2.html', 'aufgabe3.html'];
    
    tasks = taskFiles.map(file => ({
        path: `${folderName}/${file}`,
        name: file.replace('.html', '').replace('aufgabe', 'Aufgabe ')
    }));
    
    totalTasksSpan.textContent = tasks.length;
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
        completeBtn.textContent = '✓';
    } else {
        completeBtn.classList.remove('completed');
        completeBtn.textContent = '✓ Erledigt';
    }
}

// Mark current task as complete
function completeCurrentTask() {
    if (completedTasks.has(currentTaskIndex)) {
        // Unmark as complete
        completedTasks.delete(currentTaskIndex);
    } else {
        // Mark as complete
        completedTasks.add(currentTaskIndex);
        
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
    } else if (e.key === 'Enter' || e.key === ' ') {
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
