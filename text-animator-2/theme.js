import { settings } from './core.js';

const themeSelect = document.getElementById('themeSelect');

function updateTheme() {
    const theme = themeSelect.value;
    document.body.classList.toggle('light-mode', theme === 'light');
}

themeSelect.addEventListener('change', () => {
    updateTheme();
    updateSettings();
});

updateTheme(); 