import { canvas } from './core.js';

const captureButton = document.getElementById('captureButton');
const exportGifButton = document.getElementById('exportGifButton');
const exportMp4Button = document.getElementById('exportMp4Button');

let isRecording = false;
let recordedFrames = [];
let recordingStartTime = 0;

function startRecording() {
    if (isRecording) return;
    
    isRecording = true;
    recordedFrames = [];
    recordingStartTime = performance.now();
    
    // Show recording indicator
    const indicator = document.createElement('div');
    indicator.id = 'recordingIndicator';
    indicator.style.position = 'absolute';
    indicator.style.top = '10px';
    indicator.style.left = '10px';
    indicator.style.backgroundColor = 'rgba(255, 0, 0, 0.7)';
    indicator.style.color = 'white';
    indicator.style.padding = '5px 10px';
    indicator.style.borderRadius = '5px';
    indicator.style.zIndex = '100';
    indicator.textContent = 'RECORDING...';
    document.body.appendChild(indicator);
    
    // Stop recording after 3 seconds
    setTimeout(stopRecording, 3000);
}

function stopRecording() {
    if (!isRecording) return;
    
    isRecording = false;
    
    // Remove recording indicator
    const indicator = document.getElementById('recordingIndicator');
    if (indicator) {
        document.body.removeChild(indicator);
    }
    
    return recordedFrames;
}

function exportGif() {
    startRecording();
    
    setTimeout(() => {
        const frames = stopRecording();
        if (!frames || frames.length === 0) return;
        
        // Create a GIF using gif.js
        const gif = new GIF({
            workers: 2,
            quality: 10,
            width: canvas.width,
            height: canvas.height
        });
        
        // Add frames to the GIF
        const promises = frames.map(frame => {
            return new Promise(resolve => {
                const img = new Image();
                img.onload = () => {
                    gif.addFrame(img, { delay: 1000 / 30 }); // 30 FPS
                    resolve();
                };
                img.src = frame;
            });
        });
        
        Promise.all(promises).then(() => {
            gif.on('finished', blob => {
                // Create download link
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = 'text-animation.gif';
                link.click();
            });
            
            gif.render();
        });
    }, 3100);
}

function exportMp4() {
    alert("MP4 export requires a server-side component. This is a simplified version that captures frames. In a full implementation, these frames would be sent to a server for MP4 encoding.");
    startRecording();
}

captureButton.addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = 'text-animation.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
});

exportGifButton.addEventListener('click', exportGif);
exportMp4Button.addEventListener('click', exportMp4); 