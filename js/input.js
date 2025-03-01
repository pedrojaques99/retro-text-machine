import { settings, resizeCanvas } from './core.js';

const inputText = document.getElementById('inputText');
const fontSelect = document.getElementById('fontSelect');
const fontSizeSlider = document.getElementById('fontSizeSlider');
const fontSizeValue = document.getElementById('fontSizeValue');
const textColor = document.getElementById('textColor');
const textColorHex = document.getElementById('textColorHex');
const backgroundColor = document.getElementById('backgroundColor');
const backgroundColorHex = document.getElementById('backgroundColorHex');
const animationSelect = document.getElementById('animationSelect');
const animationControls = document.getElementById('animationControls');
const animationSpeedSlider = document.getElementById('animationSpeedSlider');
const animationSpeedValue = document.getElementById('animationSpeedValue');
const animationIntensitySlider = document.getElementById('animationIntensitySlider');
const animationIntensityValue = document.getElementById('animationIntensityValue');
const textMultiplierInput = document.getElementById('textMultiplierInput');
const globalIntensitySlider = document.getElementById('globalIntensitySlider');
const globalIntensityValue = document.getElementById('globalIntensityValue');
const scanlinesCheckbox = document.getElementById('scanlinesCheckbox');
const vhsLinesCheckbox = document.getElementById('vhsLinesCheckbox');
const retroGlowCheckbox = document.getElementById('retroGlowCheckbox');

let isDragging = false;
let offsetX, offsetY;
const controlPanel = document.getElementById('controlPanel');
const panelHeader = document.getElementById('panelHeader');
const panelContent = document.getElementById('panelContent');
const collapseButton = document.getElementById('collapseButton');

function updateSettings() {
    settings.text = inputText.value;
    settings.fontFamily = fontSelect.value;
    settings.fontSize = fontSizeSlider.value;
    settings.textColor = textColor.value;
    settings.backgroundColor = backgroundColor.value;
    settings.animation = animationSelect.value;
    settings.animationSpeed = animationSpeedSlider.value;
    settings.animationIntensity = animationIntensitySlider.value;
    settings.textMultiplier = parseInt(textMultiplierInput.value, 10);
    settings.globalIntensity = globalIntensitySlider.value;
    settings.scanlines = scanlinesCheckbox.checked;
    settings.vhsLines = vhsLinesCheckbox.checked;
    settings.retroGlow = retroGlowCheckbox.checked;
}

// Function to validate and format hex color
function validateHexColor(hex) {
    // Remove any leading #
    hex = hex.replace(/^#/, '');
    
    // Check if it's a valid hex color
    if (/^[0-9A-F]{3}$/i.test(hex)) {
        // Convert 3-digit hex to 6-digit
        hex = hex.split('').map(char => char + char).join('');
    } else if (!/^[0-9A-F]{6}$/i.test(hex)) {
        return null; // Invalid hex
    }
    
    return '#' + hex.toUpperCase();
}

function initInputHandlers() {
    // Sync hex input with color picker
    textColor.addEventListener('input', () => {
        textColorHex.value = textColor.value;
        updateSettings();
    });
    
    textColorHex.addEventListener('input', () => {
        const validHex = validateHexColor(textColorHex.value);
        if (validHex) {
            textColor.value = validHex;
            textColorHex.value = validHex;
            updateSettings();
        }
    });
    
    backgroundColor.addEventListener('input', () => {
        backgroundColorHex.value = backgroundColor.value;
        updateSettings();
    });
    
    backgroundColorHex.addEventListener('input', () => {
        const validHex = validateHexColor(backgroundColorHex.value);
        if (validHex) {
            backgroundColor.value = validHex;
            backgroundColorHex.value = validHex;
            updateSettings();
        }
    });

    inputText.addEventListener('input', () => {
        updateSettings();
    });

    fontSelect.addEventListener('change', () => {
        updateSettings();
    });

    fontSizeSlider.addEventListener('input', () => {
        updateSettings();
        fontSizeValue.innerText = fontSizeSlider.value;
    });

    animationSelect.addEventListener('change', () => {
        updateSettings();
        if (animationSelect.value === 'none') {
            animationControls.style.display = 'none';
        } else {
            animationControls.style.display = 'flex';
        }
    });

    animationSpeedSlider.addEventListener('input', () => {
        updateSettings();
        animationSpeedValue.innerText = animationSpeedSlider.value;
    });

    animationIntensitySlider.addEventListener('input', () => {
        updateSettings();
        animationIntensityValue.innerText = animationIntensitySlider.value;
    });

    textMultiplierInput.addEventListener('input', () => {
        updateSettings();
    });

    globalIntensitySlider.addEventListener('input', () => {
        updateSettings();
        globalIntensityValue.innerText = globalIntensitySlider.value;
    });
    
    scanlinesCheckbox.addEventListener('change', () => {
        updateSettings();
    });
    
    vhsLinesCheckbox.addEventListener('change', () => {
        updateSettings();
    });

    retroGlowCheckbox.addEventListener('change', () => {
        updateSettings();
    });

    panelHeader.addEventListener('mousedown', (e) => {
        isDragging = true;
        offsetX = e.clientX - controlPanel.offsetLeft;
        offsetY = e.clientY - controlPanel.offsetTop;
        controlPanel.style.transition = 'none'; // Disable transition during drag
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
        controlPanel.style.transition = ''; // Re-enable transition
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        controlPanel.style.left = (e.clientX - offsetX) + 'px';
        controlPanel.style.top = (e.clientY - offsetY) + 'px';
    });

    collapseButton.addEventListener('click', () => {
        panelContent.classList.toggle('collapsed');
        collapseButton.innerText = panelContent.classList.contains('collapsed') ? '▶' : '▲';
    });
}

initInputHandlers(); 