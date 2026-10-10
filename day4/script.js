const noteText = document.getElementById('note-text');
const charCount = document.getElementById('char-count');
const wordCount = document.getElementById('word-count');
const clearBtn = document.getElementById('clear-btn');
const themeToggleBtn = document.getElementById('theme-toggle');

// Update counters and apply warning classes
function updateCounts() {
    const text = noteText.value;
    const currentLength = text.length;
    
    // Word count calculation (split by spaces/whitespace and filter empty strings)
    const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;

    // Update text content
    charCount.textContent = `${currentLength} / 200 characters`;
    wordCount.textContent = `${words} words`;

    // Handle warning/over classes
    charCount.classList.remove('warning', 'over');
    if (currentLength > 200) {
        charCount.classList.add('over');
    } else if (currentLength > 180) {
        charCount.classList.add('warning');
    }
}

// Save draft and update on every input event
noteText.addEventListener('input', () => {
    updateCounts();
    localStorage.setItem('noteDraft', noteText.value);
});

// Clear functionality
function clearNote() {
    noteText.value = '';
    localStorage.removeItem('noteDraft');
    updateCounts();
}

clearBtn.addEventListener('click', clearNote);

// Escape key clears the textarea
noteText.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        clearNote();
    }
});

// Theme toggle functionality
themeToggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    const isDark = document.body.classList.contains('dark');
    
    // Update label and save choice
    themeToggleBtn.textContent = isDark ? 'Light mode' : 'Dark mode';
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

// Initialization on page load
window.addEventListener('DOMContentLoaded', () => {
    // Restore saved draft
    const savedDraft = localStorage.getItem('noteDraft');
    if (savedDraft !== null) {
        noteText.value = savedDraft;
    }

    // Restore saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark');
        themeToggleBtn.textContent = 'Light mode';
    } else {
        themeToggleBtn.textContent = 'Dark mode';
    }

    // Run initial counter check
    updateCounts();
});
