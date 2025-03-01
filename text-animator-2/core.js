const canvas = document.getElementById('textCanvas');
const ctx = canvas.getContext('2d');

// Import animation functions from effects.js
import {
    renderWaveEffect,
    renderMatrixEffect,
    renderMatrixCodeEffect,
    renderTypewriterEffect,
    renderPixelateEffect,
    renderChaoticEffect,
    renderPulseEffect,
    renderSimpleGlitchEffect,
    renderRotationEffect,
    renderDVDBounceEffect
} from './effects.js';

const primaryColor = '#d1d1d1';
const accelColor = '#bfff38';

let settings = {
    text: 'BOXY®',
    fontFamily: 'VT323',
    fontSize: 48,
    textColor: '#00ff00',
    backgroundColor: '#000000',
    animation: 'none',
    animationSpeed: 5,
    animationIntensity: 10,
    textMultiplier: 1,
    globalIntensity: 1,
    scanlines: true,
    vhsLines: false,
    retroGlow: false
};

let animationFrameId;

function resizeCanvas() {
    const container = canvas.parentElement;
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
}

function renderCanvas() {
    if (!canvas.width || !canvas.height) {
        resizeCanvas();
    }

    // Clear canvas
    ctx.fillStyle = settings.backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add grain effect only if global intensity is not 0
    if (settings.globalIntensity > 0) {
        // Optimize grain effect to use fewer particles at higher intensities
        const grainIntensity = settings.globalIntensity / 10; // Normalize to 0-1 range
        const particleCount = Math.min(500, 100 * settings.globalIntensity); // Cap at 500 particles
        const particleSize = Math.max(1, Math.floor(settings.globalIntensity / 3));
        
        // Use a more efficient approach with fewer, larger particles
        for (let i = 0; i < particleCount; i++) {
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height;
            
            if (Math.random() < grainIntensity) {
                const grainColor = Math.random() > 0.5 ? primaryColor : accelColor;
                ctx.fillStyle = grainColor;
                ctx.fillRect(x, y, particleSize, particleSize);
            }
        }
    }

    // Base text settings
    ctx.font = `${settings.fontSize}px ${settings.fontFamily}`;
    ctx.fillStyle = settings.textColor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const time = performance.now() * 0.001 * settings.animationSpeed / 5;

    // Apply animation effects
    switch (settings.animation) {
        case 'wave':
            renderWaveEffect(ctx, centerX, centerY, time, settings);
            break;
        case 'matrix':
            renderMatrixEffect(ctx, centerX, centerY, time, settings);
            break;
        case 'matrixCode':
            renderMatrixCodeEffect(ctx, centerX, centerY, time, settings);
            break;
        case 'typewriter':
            renderTypewriterEffect(ctx, centerX, centerY, time, settings);
            break;
        case 'pixelate':
            renderPixelateEffect(ctx, centerX, centerY, time, settings);
            break;
        case 'chaotic':
            renderChaoticEffect(ctx, centerX, centerY, time, settings);
            break;
        case 'pulse':
            renderPulseEffect(ctx, centerX, centerY, time, settings);
            break;
        case 'glitch':
            renderSimpleGlitchEffect(ctx, centerX, centerY, time, settings);
            break;
        case 'rotate':
            renderRotationEffect(ctx, centerX, centerY, time, settings);
            break;
        case 'dvd':
            renderDVDBounceEffect(ctx, centerX, centerY, time, settings);
            break;
        default:
            renderStaticText(ctx, centerX, centerY, settings);
    }

    // Apply scanlines if enabled (always on top of other effects)
    if (settings.scanlines) {
        applyScanlinesEffect(ctx, time, settings);
    }
    
    // Apply VHS lines if enabled
    if (settings.vhsLines) {
        applyVHSLinesEffect(ctx, time, settings);
    }
    
    // Apply retro glow if enabled
    if (settings.retroGlow) {
        applyRetroGlowEffect(ctx, time, settings);
    }
}

// Separate function to apply scanlines on top of any effect
function applyScanlinesEffect(ctx, time, settings) {
    const scanlineSpacing = Math.max(2, 6 - Math.floor(settings.globalIntensity / 2)); // Adjust spacing based on intensity
    const scanlineOpacity = Math.min(0.5, settings.globalIntensity / 10); // Cap opacity at 0.5
    
    ctx.fillStyle = `rgba(0, 0, 0, ${scanlineOpacity})`;
    
    // Draw fewer scanlines by increasing the spacing
    for (let i = 0; i < canvas.height; i += scanlineSpacing) {
        ctx.fillRect(0, i, canvas.width, 1);
    }
    
    // Add a moving scanline
    const scanLineY = (Math.sin(time * 2) + 1) * canvas.height / 2;
    ctx.fillStyle = `rgba(255, 255, 255, 0.1)`;
    ctx.fillRect(0, scanLineY, canvas.width, 2);
}

// Function to apply VHS lines effect
function applyVHSLinesEffect(ctx, time, settings) {
    // Simple retro scan effect - optimized version
    const scanHeight = Math.min(30, 10 + settings.globalIntensity * 2);
    const scanSpeed = settings.animationSpeed / 5;
    
    // Calculate scan position based on time
    const scanPos = (time * scanSpeed * 100) % (canvas.height + scanHeight * 2) - scanHeight;
    
    // Apply the scan effect with a simpler approach
    ctx.globalCompositeOperation = 'lighter';
    
    // Use a simple rectangle with gradient-like opacity instead of a full gradient
    const centerY = scanPos + scanHeight / 2;
    const maxOpacity = Math.min(0.15, 0.05 * settings.globalIntensity);
    
    // Draw the main scan line
    ctx.fillStyle = `rgba(255, 255, 255, ${maxOpacity})`;
    ctx.fillRect(0, centerY - 2, canvas.width, 4);
    
    // Draw fading edges
    const edgeOpacity = maxOpacity / 2;
    ctx.fillStyle = `rgba(255, 255, 255, ${edgeOpacity})`;
    ctx.fillRect(0, scanPos, canvas.width, scanHeight / 4);
    ctx.fillRect(0, scanPos + scanHeight * 0.75, canvas.width, scanHeight / 4);
    
    // Add a subtle color shift only at higher intensity levels
    if (settings.globalIntensity > 5) {
        // Simplified RGB shift
        const shiftAmount = Math.min(5, settings.globalIntensity / 2);
        
        // Red channel shift - only on the scan line
        ctx.fillStyle = `rgba(255, 0, 0, 0.05)`;
        ctx.fillRect(shiftAmount, centerY - 1, canvas.width, 2);
        
        // Blue channel shift - only on the scan line
        ctx.fillStyle = `rgba(0, 0, 255, 0.05)`;
        ctx.fillRect(-shiftAmount, centerY - 1, canvas.width, 2);
    }
    
    ctx.globalCompositeOperation = 'source-over';
}

// Function to apply retro glow effect
function applyRetroGlowEffect(ctx, time, settings) {
    // Save the current context state
    ctx.save();
    
    // Get the current text settings
    const text = settings.text;
    const multiplier = settings.textMultiplier || 1;
    const textWidth = ctx.measureText(text).width;
    const textHeight = parseInt(settings.fontSize);
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    // Calculate a pulsing glow intensity based on time
    const pulseRate = 1.5; // Speed of pulsing
    const baseGlowIntensity = 10 + settings.globalIntensity * 2; // Base intensity affected by global intensity
    const glowIntensity = baseGlowIntensity + Math.sin(time * pulseRate) * 5;
    
    // Set up the glow effect with enhanced parameters
    ctx.globalCompositeOperation = 'lighter';
    
    // Draw multiple layers of text with decreasing blur and opacity to create a more pronounced glow
    const layers = 5; // Increased from 3 to 5 layers
    const colors = getGlowColors(settings.textColor);
    
    for (let layer = 0; layer < layers; layer++) {
        // Vary the blur amount for each layer
        const layerBlur = glowIntensity * (1 - layer / layers);
        ctx.shadowBlur = layerBlur;
        ctx.shadowColor = colors[layer % colors.length];
        
        // Vary the opacity for each layer
        const opacity = 0.5 - (layer * 0.08);
        ctx.globalAlpha = opacity;
        
        // Draw the text for each multiplier position
        for (let i = 0; i < multiplier; i++) {
            for (let j = 0; j < multiplier; j++) {
                const x = centerX + (i - (multiplier - 1) / 2) * textWidth * 1.2;
                const y = centerY + (j - (multiplier - 1) / 2) * textHeight * 1.5;
                ctx.fillText(text, x, y);
            }
        }
    }
    
    // Add an extra bright core to the text
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 0.9;
    ctx.fillStyle = settings.textColor;
    
    for (let i = 0; i < multiplier; i++) {
        for (let j = 0; j < multiplier; j++) {
            const x = centerX + (i - (multiplier - 1) / 2) * textWidth * 1.2;
            const y = centerY + (j - (multiplier - 1) / 2) * textHeight * 1.5;
            ctx.fillText(text, x, y);
        }
    }
    
    // Restore the context to its original state
    ctx.globalAlpha = 1.0;
    ctx.globalCompositeOperation = 'source-over';
    ctx.shadowBlur = 0;
    ctx.restore();
}

// Helper function to generate glow colors based on the text color
function getGlowColors(baseColor) {
    // Parse the base color to RGB
    let r, g, b;
    
    if (baseColor.startsWith('#')) {
        const hex = baseColor.substring(1);
        r = parseInt(hex.substring(0, 2), 16);
        g = parseInt(hex.substring(2, 4), 16);
        b = parseInt(hex.substring(4, 6), 16);
    } else if (baseColor.startsWith('rgb')) {
        const rgbValues = baseColor.match(/\d+/g);
        r = parseInt(rgbValues[0]);
        g = parseInt(rgbValues[1]);
        b = parseInt(rgbValues[2]);
    } else {
        // Default to the base color if parsing fails
        return [baseColor, baseColor, baseColor];
    }
    
    // Create variations of the color
    const brighterColor = `rgb(${Math.min(255, r + 50)}, ${Math.min(255, g + 50)}, ${Math.min(255, b + 50)})`;
    const originalColor = baseColor;
    const complementaryColor = `rgb(${255 - r}, ${255 - g}, ${255 - b})`;
    
    return [brighterColor, originalColor, complementaryColor, originalColor, brighterColor];
}

function renderStaticText(ctx, centerX, centerY, settings) {
    const multiplier = settings.textMultiplier || 1;
    const text = settings.text;
    const textWidth = ctx.measureText(text).width;
    const textHeight = parseInt(settings.fontSize);
    
    for (let i = 0; i < multiplier; i++) {
        for (let j = 0; j < multiplier; j++) {
            const x = centerX + (i - (multiplier - 1) / 2) * textWidth * 1.2;
            const y = centerY + (j - (multiplier - 1) / 2) * textHeight * 1.5;
            ctx.fillText(text, x, y);
        }
    }
}

function animate() {
    renderCanvas();
    animationFrameId = requestAnimationFrame(animate);
}

function init() {
    // Resize canvas initially and on window resize
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    animate();
}

init();

export { ctx, canvas, settings, primaryColor, accelColor, resizeCanvas }; 