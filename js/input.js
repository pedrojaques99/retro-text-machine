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
const randomButton = document.getElementById('randomButton');

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

    // Add random button handler
    randomButton.addEventListener('click', () => {
        randomizeSettings();
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

// Function to randomize animation settings
function randomizeSettings() {
    // Random animation
    const animations = Array.from(animationSelect.options).map(option => option.value);
    const randomAnimation = animations[Math.floor(Math.random() * animations.length)];
    animationSelect.value = randomAnimation;
    
    // Random font
    const fonts = Array.from(fontSelect.options).map(option => option.value);
    const randomFont = fonts[Math.floor(Math.random() * fonts.length)];
    fontSelect.value = randomFont;
    
    // Random font size (between 24 and 72)
    const randomFontSize = Math.floor(Math.random() * 48) + 24;
    fontSizeSlider.value = randomFontSize;
    fontSizeValue.innerText = randomFontSize;
    
    // Random text color
    const randomTextColor = getRandomColor();
    textColor.value = randomTextColor;
    textColorHex.value = randomTextColor;
    
    // Random background color
    const randomBgColor = getRandomColor();
    backgroundColor.value = randomBgColor;
    backgroundColorHex.value = randomBgColor;
    
    // Random animation speed (between 3 and 8)
    const randomSpeed = Math.floor(Math.random() * 6) + 3;
    animationSpeedSlider.value = randomSpeed;
    animationSpeedValue.innerText = randomSpeed;
    
    // Random animation intensity (between 5 and 15)
    const randomIntensity = Math.floor(Math.random() * 11) + 5;
    animationIntensitySlider.value = randomIntensity;
    animationIntensityValue.innerText = randomIntensity;
    
    // Random text multiplier (between 1 and 3)
    const randomMultiplier = Math.floor(Math.random() * 3) + 1;
    textMultiplierInput.value = randomMultiplier;
    
    // Random global intensity (between 1 and 8)
    const randomGlobalIntensity = Math.floor(Math.random() * 8) + 1;
    globalIntensitySlider.value = randomGlobalIntensity;
    globalIntensityValue.innerText = randomGlobalIntensity;
    
    // Random effects (50% chance for each)
    scanlinesCheckbox.checked = Math.random() > 0.5;
    vhsLinesCheckbox.checked = Math.random() > 0.5;
    retroGlowCheckbox.checked = Math.random() > 0.5;
    
    // Show animation controls if needed
    if (randomAnimation === 'none') {
        animationControls.style.display = 'none';
    } else {
        animationControls.style.display = 'flex';
    }
    
    // Update settings
    updateSettings();
    
    // Add a visual feedback for the randomize action
    randomButton.classList.add('active');
    setTimeout(() => {
        randomButton.classList.remove('active');
    }, 300);
}

// Helper function to generate random colors
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

initInputHandlers(); 