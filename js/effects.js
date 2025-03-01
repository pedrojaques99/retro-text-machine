// Matrix code characters
const matrixChars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+-=[]{}|;:,./<>?';

// Define colors locally to avoid circular dependency
const primaryColor = '#d1d1d1';
const accelColor = '#bfff38';

// Animation Effect Functions
function renderWaveEffect(ctx, centerX, centerY, time, settings) {
    const multiplier = settings.textMultiplier || 1;
    const text = settings.text;
    const textWidth = ctx.measureText(text).width;
    const textHeight = parseInt(settings.fontSize);
    
    for (let m = 0; m < multiplier; m++) {
        for (let n = 0; n < multiplier; n++) {
            const baseX = centerX + (m - (multiplier - 1) / 2) * textWidth * 1.2;
            const baseY = centerY + (n - (multiplier - 1) / 2) * textHeight * 1.5;
            
            const chars = text.split('');
            let xPos = baseX - ctx.measureText(text).width / 2;

            chars.forEach((char, i) => {
                const yOffset = Math.sin(time + i * 0.3) * settings.animationIntensity * 1.5;
                ctx.fillText(char, xPos, baseY + yOffset);
                xPos += ctx.measureText(char).width;
            });
        }
    }
}

function renderMatrixEffect(ctx, centerX, centerY, time, settings) {
    const multiplier = settings.textMultiplier || 1;
    const text = settings.text;
    const textWidth = ctx.measureText(text).width;
    const textHeight = parseInt(settings.fontSize);
    
    // Digital Rain effect - vertical falling characters
    for (let m = 0; m < multiplier; m++) {
        for (let n = 0; n < multiplier; n++) {
            const baseX = centerX + (m - (multiplier - 1) / 2) * textWidth * 1.2;
            const baseY = centerY + (n - (multiplier - 1) / 2) * textHeight * 1.5;
            
            const chars = text.split('');
            let xPos = baseX - ctx.measureText(text).width / 2;

            chars.forEach((char, i) => {
                // Calculate a vertical offset based on time
                const yOffset = ((time * settings.animationSpeed * 2) + i) % (settings.animationIntensity * 2);
                const normalizedYOffset = yOffset < settings.animationIntensity 
                    ? yOffset 
                    : settings.animationIntensity * 2 - yOffset;
                
                // Add a glow effect
                ctx.shadowColor = '#00ff00';
                ctx.shadowBlur = 5;
                ctx.fillStyle = settings.textColor;
                
                // Draw the character with the calculated offset
                ctx.fillText(char, xPos, baseY + normalizedYOffset - settings.animationIntensity/2);
                
                // Reset shadow for next character
                ctx.shadowBlur = 0;
                
                xPos += ctx.measureText(char).width;
            });
        }
    }
}

function renderMatrixCodeEffect(ctx, centerX, centerY, time, settings) {
    const multiplier = settings.textMultiplier || 1;
    const text = settings.text;
    const textWidth = ctx.measureText(text).width;
    const textHeight = parseInt(settings.fontSize);
    
    // Use a cleaner, simpler data stream effect
    // Draw the main text with a digital glow effect
    for (let m = 0; m < multiplier; m++) {
        for (let n = 0; n < multiplier; n++) {
            const x = centerX + (m - (multiplier - 1) / 2) * textWidth * 1.2;
            const y = centerY + (n - (multiplier - 1) / 2) * textHeight * 1.5;
            
            // Add subtle digital noise around the text
            const chars = text.split('');
            let xPos = x - textWidth / 2;
            
            chars.forEach((char, i) => {
                // Draw subtle digital particles around each character
                const particleCount = Math.floor(settings.animationIntensity / 2);
                for (let p = 0; p < particleCount; p++) {
                    const pX = xPos + (Math.random() - 0.5) * settings.fontSize * 0.8;
                    const pY = y + (Math.random() - 0.5) * settings.fontSize * 0.8;
                    const size = Math.random() * 2 + 1;
                    
                    // Digital particle color with time-based opacity
                    const opacity = 0.1 + 0.2 * Math.sin(time * 3 + i + p);
                    ctx.fillStyle = `rgba(0, 255, 0, ${opacity})`;
                    ctx.fillRect(pX, pY, size, size);
                }
                
                // Add glow effect to the text
                ctx.shadowColor = '#00ff00';
                ctx.shadowBlur = 5 + 3 * Math.sin(time * 2 + i * 0.3);
                ctx.fillStyle = settings.textColor;
                
                // Draw the character with a slight vertical movement
                const charOffset = Math.sin(time * 3 + i * 0.5) * settings.animationIntensity * 0.15;
                ctx.fillText(char, xPos, y + charOffset);
                
                xPos += ctx.measureText(char).width;
            });
            
            // Reset shadow
            ctx.shadowBlur = 0;
        }
    }
}

function renderTypewriterEffect(ctx, centerX, centerY, time, settings) {
    const multiplier = settings.textMultiplier || 1;
    const text = settings.text;
    const textWidth = ctx.measureText(text).width;
    const textHeight = parseInt(settings.fontSize);
    
    for (let m = 0; m < multiplier; m++) {
        for (let n = 0; n < multiplier; n++) {
            const x = centerX + (m - (multiplier - 1) / 2) * textWidth * 1.2;
            const y = centerY + (n - (multiplier - 1) / 2) * textHeight * 1.5;

            const visibleChars = Math.min(
                text.length,
                Math.floor((time + m * 0.5 + n * 0.3) * 6) % (text.length + 10)
            );
            const visibleText = text.substring(0, visibleChars);
            ctx.fillText(visibleText, x, y);
        }
    }
}

function renderPixelateEffect(ctx, centerX, centerY, time, settings) {
    const multiplier = settings.textMultiplier || 1;
    const text = settings.text;
    const fontSize = parseInt(settings.fontSize);
    const textWidth = ctx.measureText(text).width;
    const textHeight = fontSize;
    
    // First render the text to an offscreen canvas
    const offscreenCanvas = document.createElement('canvas');
    offscreenCanvas.width = textWidth * 1.2 * multiplier;
    offscreenCanvas.height = textHeight * 1.5 * multiplier;
    const offCtx = offscreenCanvas.getContext('2d');
    
    // Clear the offscreen canvas
    offCtx.clearRect(0, 0, offscreenCanvas.width, offscreenCanvas.height);
    
    // Render the text
    offCtx.font = `${fontSize}px ${settings.fontFamily}`;
    offCtx.fillStyle = settings.textColor;
    offCtx.textAlign = 'center';
    offCtx.textBaseline = 'middle';
    
    // Calculate horizontal movement (infinite scroll to the left)
    const scrollSpeed = settings.animationSpeed * 30; // Adjust speed based on animation speed setting
    const scrollOffset = -(time * scrollSpeed) % (offscreenCanvas.width * 2);
    
    // Draw the text multiple times to create continuous scrolling effect
    for (let i = -1; i <= multiplier + 1; i++) {
        const x = offscreenCanvas.width / 2 + scrollOffset + (i * textWidth * 1.5);
        const y = offscreenCanvas.height / 2;
        offCtx.fillText(text, x, y);
    }
    
    // Apply fixed pixelation effect (no animation in the pixel size)
    const pixelSize = Math.max(2, Math.min(10, settings.animationIntensity / 2)); // Fixed pixel size based on intensity
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = offscreenCanvas.width;
    tempCanvas.height = offscreenCanvas.height;
    const tempCtx = tempCanvas.getContext('2d');
    
    // Draw at a lower resolution
    tempCtx.drawImage(offscreenCanvas, 0, 0, offscreenCanvas.width / pixelSize, offscreenCanvas.height / pixelSize);
    // Scale back up with pixelated rendering
    tempCtx.imageSmoothingEnabled = false;
    tempCtx.drawImage(tempCanvas, 0, 0, offscreenCanvas.width / pixelSize, offscreenCanvas.height / pixelSize, 0, 0, offscreenCanvas.width, offscreenCanvas.height);
    
    // Draw the pixelated image to the main canvas
    const x = centerX - offscreenCanvas.width / 2;
    const y = centerY - offscreenCanvas.height / 2;
    ctx.drawImage(tempCanvas, x, y);
}

function renderChaoticEffect(ctx, centerX, centerY, time, settings) {
    const multiplier = settings.textMultiplier || 1;
    const text = settings.text;
    const textWidth = ctx.measureText(text).width;
    const textHeight = parseInt(settings.fontSize);
    
    // Neon Pulse effect - clean, colorful pulsing with subtle movement
    for (let m = 0; m < multiplier; m++) {
        for (let n = 0; n < multiplier; n++) {
            const x = centerX + (m - (multiplier - 1) / 2) * textWidth * 1.2;
            const y = centerY + (n - (multiplier - 1) / 2) * textHeight * 1.5;
            
            // Create multiple color layers with different glow intensities
            const layers = [
                { color: '#ff00ff', blur: 15, offset: 0 },  // Magenta
                { color: '#00ffff', blur: 10, offset: 0.2 }, // Cyan
                { color: '#ffff00', blur: 5, offset: 0.4 }   // Yellow
            ];
            
            layers.forEach(layer => {
                // Calculate time-based pulse for this layer
                const pulseIntensity = Math.sin(time * 3 + layer.offset * Math.PI * 2) * 0.5 + 0.5;
                const glowSize = layer.blur * (0.5 + pulseIntensity * 0.5) * (settings.animationIntensity / 10);
                
                // Apply glow effect
                ctx.shadowColor = layer.color;
                ctx.shadowBlur = glowSize;
                
                // Subtle position shift based on time
                const shiftX = Math.sin(time * 2 + layer.offset) * settings.animationIntensity * 0.1;
                const shiftY = Math.cos(time * 2 + layer.offset) * settings.animationIntensity * 0.1;
                
                // Draw text with this layer's effect
                ctx.fillStyle = layer.color;
                ctx.fillText(text, x + shiftX, y + shiftY);
            });
            
            // Draw the main text on top
            ctx.shadowBlur = 0;
            ctx.fillStyle = settings.textColor;
            ctx.fillText(text, x, y);
        }
    }
}

function renderPulseEffect(ctx, centerX, centerY, time, settings) {
    const multiplier = settings.textMultiplier || 1;
    const text = settings.text;
    const textWidth = ctx.measureText(text).width;
    const textHeight = parseInt(settings.fontSize);
    
    for (let m = 0; m < multiplier; m++) {
        for (let n = 0; n < multiplier; n++) {
            const x = centerX + (m - (multiplier - 1) / 2) * textWidth * 1.2;
            const y = centerY + (n - (multiplier - 1) / 2) * textHeight * 1.5;
            
            // Pulse size based on time
            const scale = 1 + Math.sin(time * 3) * (settings.animationIntensity / 20);
            const fontSize = settings.fontSize * scale;
            
            // Pulse color between text color and accent color
            const colorMix = (Math.sin(time * 2) + 1) / 2;
            ctx.fillStyle = colorMix > 0.5 ? settings.textColor : accelColor;
            
            ctx.font = `${fontSize}px ${settings.fontFamily}`;
            ctx.fillText(text, x, y);
        }
    }
}

function renderSimpleGlitchEffect(ctx, centerX, centerY, time, settings) {
    const multiplier = settings.textMultiplier || 1;
    const text = settings.text;
    const textWidth = ctx.measureText(text).width;
    const textHeight = parseInt(settings.fontSize);
    
    for (let m = 0; m < multiplier; m++) {
        for (let n = 0; n < multiplier; n++) {
            const x = centerX + (m - (multiplier - 1) / 2) * textWidth * 1.2;
            const y = centerY + (n - (multiplier - 1) / 2) * textHeight * 1.5;
            
            // Only glitch occasionally based on time
            const shouldGlitch = Math.sin(time * 5 + m + n) > 0.7;
            
            if (shouldGlitch) {
                // Draw with offset and different color
                const offsetX = (Math.random() - 0.5) * settings.animationIntensity;
                const offsetY = (Math.random() - 0.5) * settings.animationIntensity;
                
                // Draw shadow/ghost effect
                ctx.fillStyle = accelColor;
                ctx.fillText(text, x + offsetX, y + offsetY);
                
                // Draw main text
                ctx.fillStyle = settings.textColor;
                ctx.fillText(text, x, y);
            } else {
                // Normal rendering
                ctx.fillStyle = settings.textColor;
                ctx.fillText(text, x, y);
            }
        }
    }
}

function renderRotationEffect(ctx, centerX, centerY, time, settings) {
    const multiplier = settings.textMultiplier || 1;
    const text = settings.text;
    
    for (let m = 0; m < multiplier; m++) {
        for (let n = 0; n < multiplier; n++) {
            // Calculate position in grid
            const gridX = centerX + (m - (multiplier - 1) / 2) * settings.fontSize * 3;
            const gridY = centerY + (n - (multiplier - 1) / 2) * settings.fontSize * 3;
            
            // Calculate rotation angle
            const angle = time + (m * 0.5) + (n * 0.5);
            
            // Save context state
            ctx.save();
            
            // Move to position, rotate, then draw
            ctx.translate(gridX, gridY);
            ctx.rotate(angle * settings.animationIntensity / 20);
            
            // Draw text
            ctx.fillText(text, 0, 0);
            
            // Restore context state
            ctx.restore();
        }
    }
}

function renderDVDBounceEffect(ctx, centerX, centerY, time, settings) {
    const text = settings.text;
    const textWidth = ctx.measureText(text).width;
    const textHeight = parseInt(settings.fontSize);
    
    // Get canvas dimensions from the context
    const canvasWidth = ctx.canvas.width;
    const canvasHeight = ctx.canvas.height;
    
    // Calculate position based on time
    const speed = settings.animationSpeed * 50;
    
    // Create persistent position and velocity state using a closure
    if (!renderDVDBounceEffect.state || 
        renderDVDBounceEffect.canvasWidth !== canvasWidth || 
        renderDVDBounceEffect.canvasHeight !== canvasHeight) {
        
        // Store canvas dimensions to detect resizing
        renderDVDBounceEffect.canvasWidth = canvasWidth;
        renderDVDBounceEffect.canvasHeight = canvasHeight;
        
        renderDVDBounceEffect.state = {
            x: Math.random() * (canvasWidth - textWidth),
            y: Math.random() * (canvasHeight - textHeight) + textHeight/2,
            vx: (Math.random() > 0.5 ? 1 : -1) * speed,
            vy: (Math.random() > 0.5 ? 1 : -1) * speed,
            lastTime: time,
            color: getRandomColor()
        };
    }
    
    const state = renderDVDBounceEffect.state;
    
    // Calculate time delta for smooth animation regardless of frame rate
    const deltaTime = time - state.lastTime;
    state.lastTime = time;
    
    // Update position with safety checks
    state.x += state.vx * deltaTime;
    state.y += state.vy * deltaTime;
    
    // Check for collisions with canvas boundaries with improved boundary checks
    const effectiveTextWidth = Math.min(textWidth, canvasWidth * 0.8);
    const effectiveTextHeight = Math.min(textHeight, canvasHeight * 0.8);
    
    if (state.x <= 0 || state.x >= canvasWidth - effectiveTextWidth) {
        state.vx = -state.vx;
        state.color = getRandomColor();
        
        // Ensure we're not stuck in the boundary
        if (state.x < 0) state.x = 0;
        if (state.x > canvasWidth - effectiveTextWidth) state.x = canvasWidth - effectiveTextWidth;
    }
    
    if (state.y <= effectiveTextHeight/2 || state.y >= canvasHeight - effectiveTextHeight/2) {
        state.vy = -state.vy;
        state.color = getRandomColor();
        
        // Ensure we're not stuck in the boundary
        if (state.y < effectiveTextHeight/2) state.y = effectiveTextHeight/2;
        if (state.y > canvasHeight - effectiveTextHeight/2) state.y = canvasHeight - effectiveTextHeight/2;
    }
    
    // Apply a stronger glow effect
    ctx.shadowColor = state.color;
    ctx.shadowBlur = 20;
    
    // Draw the text with the current color
    ctx.fillStyle = state.color;
    ctx.fillText(text, state.x, state.y);
    
    // Add a second layer with more blur for enhanced glow
    ctx.shadowBlur = 30;
    ctx.globalAlpha = 0.6;
    ctx.fillText(text, state.x, state.y);
    
    // Reset shadow and opacity
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1.0;
    ctx.fillStyle = settings.textColor;
}

// Helper function to generate random colors for the DVD effect
function getRandomColor() {
    const colors = [
        '#ff0000', // Red
        '#00ff00', // Green
        '#0000ff', // Blue
        '#ffff00', // Yellow
        '#ff00ff', // Magenta
        '#00ffff'  // Cyan
    ];
    return colors[Math.floor(Math.random() * colors.length)];
}

export {
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
};
