document.addEventListener('DOMContentLoaded', () => {
    const gridElement = document.getElementById('grid');
    const gridContainer = document.getElementById('grid-container');
    const colorPalette = document.getElementById('color-palette');
    const gridSize = 100;
    const pixelSize = 10;
    const pixelData = JSON.parse(localStorage.getItem('pixelData')) || {};

    let selectedPixel;
    let selectedColor = 'black'; // Default color

    // List of colors
    const colors = [
        '#FF5733', '#FFBD33', '#FFFF33', '#BDFF33', '#33FF57', '#33FFBD', '#33FFFF', '#33BDFF', '#3357FF', '#5733FF', '#BD33FF', '#FF33FF', 
        '#FF33BD', '#FF3357', '#FFFFFF', '#C0C0C0', '#808080', '#404040', '#000000'
    ];

    // Create the grid
    for (let i = 0; i < gridSize * gridSize; i++) {
        const pixel = document.createElement('div');
        pixel.className = 'pixel';
        pixel.dataset.index = i;
        pixel.style.backgroundColor = pixelData[i] || 'white';
        gridElement.appendChild(pixel);

        // Add event listener to change color on click
        pixel.addEventListener('click', function() {
            selectedPixel = pixel;
            selectedPixel.style.backgroundColor = selectedColor;
            pixelData[selectedPixel.dataset.index] = selectedColor;
            localStorage.setItem('pixelData', JSON.stringify(pixelData));
        });
    }

    // Create the color palette
    colors.forEach(color => {
        const colorOption = document.createElement('div');
        colorOption.className = 'color-option';
        colorOption.style.backgroundColor = color;
        colorOption.addEventListener('click', () => {
            selectedColor = color;
        });
        colorPalette.appendChild(colorOption);
    });

    // Zooming
    let scale = 1;
    let isPanning = false;
    let startX, startY;

    gridContainer.addEventListener('wheel', (e) => {
        e.preventDefault();
        scale += e.deltaY * -0.01;
        scale = Math.min(Math.max(0.5, scale), 4);
        gridElement.style.transform = `scale(${scale})`;
    });

    // Panning
    gridContainer.addEventListener('mousedown', (e) => {
        isPanning = true;
        startX = e.clientX - gridElement.offsetLeft;
        startY = e.clientY - gridElement.offsetTop;
        gridContainer.style.cursor = 'move';
    });

    gridContainer.addEventListener('mouseup', () => {
        isPanning = false;
        gridContainer.style.cursor = 'default';
    });

    gridContainer.addEventListener('mousemove', (e) => {
        if (isPanning) {
            gridElement.style.left = `${e.clientX - startX}px`;
            gridElement.style.top = `${e.clientY - startY}px`;
        }
    });

    // Touch events for mobile
    gridContainer.addEventListener('touchstart', (e) => {
        if (e.touches.length === 1) {
            isPanning = true;
            startX = e.touches[0].clientX - gridElement.offsetLeft;
            startY = e.touches[0].clientY - gridElement.offsetTop;
            gridContainer.style.cursor = 'move';
        }
    });

    gridContainer.addEventListener('touchend', () => {
        isPanning = false;
        gridContainer.style.cursor = 'default';
    });

    gridContainer.addEventListener('touchmove', (e) => {
        if (isPanning) {
            gridElement.style.left = `${e.touches[0].clientX - startX}px`;
            gridElement.style.top = `${e.touches[0].clientY - startY}px`;
        }
    });
});
