
async function startWebRTC() {
    const video = document.getElementById('video');
    const videoSource = document.getElementById('videoSource');
    try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        videoDevices.forEach(device => {
            const option = document.createElement('option');
            option.value = device.deviceId;
            option.text = device.label || `Camera ${videoSource.length + 1}`;
            videoSource.appendChild(option);
        });

        videoSource.addEventListener('change', async () => {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { deviceId: { exact: videoSource.value } },
                audio: false
            });
            video.srcObject = stream;
        });

        const stream = await navigator.mediaDevices.getUserMedia({
            video: { deviceId: { exact: videoDevices[0].deviceId } },
            audio: false
        });
        video.srcObject = stream;
    } catch (error) {
        console.error('Error accessing media devices.', error);
    }
}

function setupCanvas() {
    const canvas = document.getElementById('overlayCanvas');
    const ctx = canvas.getContext('2d');
    const statusBar = document.getElementById('status-bar-container');

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    let drawing = false;
    let erasing = false;

    canvas.addEventListener('mousedown', () => {
        drawing = true;
        statusBar.textContent = erasing ? 'Erasing...' : 'Drawing...';
    });

    canvas.addEventListener('mouseup', () => {
        drawing = false;
        ctx.beginPath();
        statusBar.textContent = 'Ready';
    });

    canvas.addEventListener('mousemove', (event) => {
        if (!drawing) return;
        const rect = canvas.getBoundingClientRect();
        ctx.lineWidth = document.getElementById('penWidth').value;
        ctx.lineCap = 'round';
        ctx.strokeStyle = document.getElementById('penColor').value;
        ctx.globalCompositeOperation = erasing ? 'destination-out' : 'source-over';

        ctx.lineTo(event.clientX - rect.left, event.clientY - rect.top);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(event.clientX - rect.left, event.clientY - rect.top);
    });

    document.getElementById('pen').addEventListener('click', () => {
        erasing = false;
        canvas.style.cursor = 'crosshair'; 
        statusBar.textContent = 'Pen selected';
    });

    document.getElementById('eraser').addEventListener('click', () => {
        erasing = true;
        canvas.style.cursor = 'not-allowed';
        statusBar.textContent = 'Eraser selected';
    });

    document.getElementById('clearAll').addEventListener('click', () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        statusBar.textContent = 'Canvas cleared';
    });
    document.getElementById('exportAsImage').addEventListener('click', () => {
        exportCanvas('image');
    });
    
    document.getElementById('exportAsHtml').addEventListener('click', () => {
        exportCanvas('html');
    });
    
    function exportCanvas(format) {
        const canvas = document.getElementById('overlayCanvas');
        const ctx = canvas.getContext('2d');
        const video = document.getElementById('video');
        const includeWebRTC = document.getElementById('includeWebRTC').checked;
    
        // Create a temporary canvas to combine video and drawing
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height;
    
        // Draw the video frame if includeWebRTC is checked
        if (includeWebRTC) {
            tempCtx.drawImage(video, 0, 0, tempCanvas.width, tempCanvas.height);
        }
    
        // Draw the existing canvas content (drawings) on top of the video frame
        tempCtx.drawImage(canvas, 0, 0);
    
        // Export the combined content as a data URL
        const dataURL = tempCanvas.toDataURL('image/png');
    
        if (format === 'image') {
            // Create a download link for the image
            const downloadLink = document.createElement('a');
            downloadLink.href = dataURL;
            downloadLink.download = 'canvas_drawing.png';
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
        } else if (format === 'html') {
            // Create HTML content
            const htmlContent = `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Exported Canvas</title>
                    <style>
                        body, html {
                            margin: 0;
                            padding: 0;
                            width: 100%;
                            height: 100%;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            background-color: #000;
                        }
                        img {
                            max-width: 100%;
                            max-height: 100%;
                        }
                    </style>
                </head>
                <body>
                    <img src="${dataURL}" alt="Exported Canvas">
                </body>
                </html>
            `;
    
            // Create a Blob from the HTML content
            const blob = new Blob([htmlContent], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
    
            // Create a download link for the HTML file
            const downloadLink = document.createElement('a');
            downloadLink.href = url;
            downloadLink.download = 'canvas_drawing.html';
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
        }
    
        const statusBar = document.getElementById('statusBar');
        statusBar.textContent = 'Canvas exported';
    
        video.play();
    }

    // Modal close functionality
    const modal = document.getElementById('previewModal');
    const span = document.getElementsByClassName('close')[0];
    const closeButton = document.querySelector('.close');
    const video = document.getElementById('video');
    
    closeButton.addEventListener('click', () => {
        modal.style.display = "none";
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        video.play();
    });
    span.onclick = function() {
        modal.style.display = "none";
        statusBar.textContent = 'Ready';
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        video.play();
    }
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
            statusBar.textContent = 'Ready';
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }
}

startWebRTC();
setupCanvas();