document.addEventListener('DOMContentLoaded', () => {
    const gridElement = document.getElementById('grid');
    const gridContainer = document.getElementById('grid-container');
    const colorPicker = document.getElementById('color-picker');
    const gridSize = 100;
    const pixelSize = 10;
    const pixelData = JSON.parse(localStorage.getItem('pixelData')) || {};
    const colorUsage = JSON.parse(localStorage.getItem('colorUsage')) || {};

    let scale = 1;
    let isPanning = false;
    let startX, startY;
    let selectedPixel;

    // Create the grid
    for (let i = 0; i < gridSize * gridSize; i++) {
        const pixel = document.createElement('div');
        pixel.className = 'pixel';
        pixel.dataset.index = i;
        pixel.style.backgroundColor = pixelData[i] || 'white';
        gridElement.appendChild(pixel);

        // Add event listener to change color on click
        pixel.addEventListener('click', function(event) {
            selectedPixel = pixel;
            showColorPicker(event.clientX, event.clientY);
            event.stopPropagation();
        });
    }

    // Hide color picker when clicking outside
    document.body.addEventListener('click', () => {
        colorPicker.classList.add('hidden');
    });

    // Create color picker
    function showColorPicker(x, y) {
        colorPicker.innerHTML = '';
        const topColors = getTopColors();
        topColors.forEach(color => {
            const colorOption = document.createElement('div');
            colorOption.className = 'color-option';
            colorOption.style.backgroundColor = color;
            colorOption.addEventListener('click', () => {
                selectedPixel.style.backgroundColor = color;
                pixelData[selectedPixel.dataset.index] = color;
                localStorage.setItem('pixelData', JSON.stringify(pixelData));
                updateColorUsage(color);
                colorPicker.classList.add('hidden');
            });
            colorPicker.appendChild(colorOption);
        });

        colorPicker.style.left = `${x}px`;
        colorPicker.style.top = `${y}px`;
        colorPicker.classList.remove('hidden');
    }

    function updateColorUsage(color) {
        if (colorUsage[color]) {
            colorUsage[color]++;
        } else {
            colorUsage[color] = 1;
        }
        localStorage.setItem('colorUsage', JSON.stringify(colorUsage));
    }

    function getTopColors() {
        const colorEntries = Object.entries(colorUsage);
        colorEntries.sort((a, b) => b[1] - a[1]);
        return colorEntries.slice(0, 10).map(entry => entry[0]);
    }

    // Zooming
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

    updateColorPicker();
});
