let shape = null;
let isDrawing = false;
let isDragging = false;
let startX, startY;
let shapes = [];
let selectedShapeIndex = null;

document.getElementById('shapeSelector').addEventListener('change', (e) => {
    shape = e.target.value;
});

const canvas = document.getElementById('overlayCanvas');
const ctx = canvas.getContext('2d');
const penColor = document.getElementById('penColor');

canvas.addEventListener('mousedown', (e) => {
    const mouseX = e.offsetX;
    const mouseY = e.offsetY;

    if (shape) {
        isDrawing = true;
        startX = mouseX;
        startY = mouseY;
    } else {
        // Check if a shape is clicked
        selectedShapeIndex = shapes.findIndex(shape => isMouseInShape(mouseX, mouseY, shape));
        if (selectedShapeIndex !== -1) {
            isDragging = true;
            startX = mouseX;
            startY = mouseY;
        }
    }
});

canvas.addEventListener('mousemove', (e) => {
    const mouseX = e.offsetX;
    const mouseY = e.offsetY;

    if (isDrawing) {
        const currentX = mouseX;
        const currentY = mouseY;
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

        // Redraw all shapes
        shapes.forEach(shape => drawShape(shape));

        ctx.fillStyle = penColor.value;

        if (shape === 'rectangle') {
            const width = currentX - startX;
            const height = currentY - startY;
            ctx.fillRect(startX, startY, width, height);
        } else if (shape === 'circle') {
            const radius = Math.sqrt(Math.pow(currentX - startX, 2) + Math.pow(currentY - startY, 2));
            ctx.beginPath();
            ctx.arc(startX, startY, radius, 0, 2 * Math.PI);
            ctx.fill();
        }
    } else if (isDragging && selectedShapeIndex !== null) {
        const dx = mouseX - startX;
        const dy = mouseY - startY;
        const shape = shapes[selectedShapeIndex];

        shape.startX += dx;
        shape.startY += dy;

        startX = mouseX;
        startY = mouseY;

        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
        shapes.forEach(shape => drawShape(shape)); // Redraw all shapes
    }
});

canvas.addEventListener('mouseup', (e) => {
    if (isDrawing) {
        const currentX = e.offsetX;
        const currentY = e.offsetY;
        ctx.fillStyle = penColor.value;

        if (shape === 'rectangle') {
            const width = currentX - startX;
            const height = currentY - startY;
            shapes.push({ type: 'rectangle', startX, startY, width, height, color: penColor.value });
        } else if (shape === 'circle') {
            const radius = Math.sqrt(Math.pow(currentX - startX, 2) + Math.pow(currentY - startY, 2));
            shapes.push({ type: 'circle', startX, startY, radius, color: penColor.value });
        }

        isDrawing = false;
        shape = null; // Reset shape after drawing
    } else if (isDragging) {
        isDragging = false;
        selectedShapeIndex = null;
    }
});

document.getElementById('clearAll').addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    shapes = [];
});

function drawShape(shape) {
    ctx.fillStyle = shape.color;

    if (shape.type === 'rectangle') {
        ctx.fillRect(shape.startX, shape.startY, shape.width, shape.height);
    } else if (shape.type === 'circle') {
        ctx.beginPath();
        ctx.arc(shape.startX, shape.startY, shape.radius, 0, 2 * Math.PI);
        ctx.fill();
    }
}

function isMouseInShape(mouseX, mouseY, shape) {
    if (shape.type === 'rectangle') {
        return mouseX >= shape.startX && mouseX <= shape.startX + shape.width &&
               mouseY >= shape.startY && mouseY <= shape.startY + shape.height;
    } else if (shape.type === 'circle') {
        const dx = mouseX - shape.startX;
        const dy = mouseY - shape.startY;
        return Math.sqrt(dx * dx + dy * dy) <= shape.radius;
    }
    return false;
}