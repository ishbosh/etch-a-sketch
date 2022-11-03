// INITIALIZATION OF VARIABLES AND FUNCTION CALLS //

// Set the default starting grid size
const DEFAULT_SIZE = 32;
const DEFAULT_COLOR = "black";
const DEFAULT_SHADING = .10;
const DEFAULT_LIGHTENING = .10;
// Initialize the starting state of the grid
const gridState = {color: DEFAULT_COLOR, gridSize: DEFAULT_SIZE, gridLines: false, shading: DEFAULT_SHADING, lightening: DEFAULT_LIGHTENING}
// Create the initial grid
createGrid(gridState.gridSize);
// Listen for changes to grid size
changeGridSizeOnButtonClick();
// Listen for changes to color
changeColorOnButtonClick();
// Listen for changes to shading amount
changeShadingOnButtonClick();
// Listen for changes to lightening amount
changeLighteningOnButtonClick();
// Listen for clear grid button
clearGridOnButtonClick();
// Display current value of range sliders
displaySliderText();


// FUNCTIONS: GRID CREATION AND MANIPULATION //

function createGrid(sizeOfGrid) {
    //Limit size of grid
    if (sizeOfGrid > 100) {
        sizeOfGrid = 100;
    } else if (sizeOfGrid < 12) {
        sizeOfGrid = 12;
    }
    gridState.gridSize = sizeOfGrid;
    
    const container = document.querySelector(".container");
    const gridElementSize = calculateGridElementSize(sizeOfGrid) + "px";

    // Number of Rows
    for (let i = 0; i < sizeOfGrid; i++) {
        // Number of Columns
        for (let j = 0; j < sizeOfGrid; j++) {

            // Create div grid element
            let newDiv = document.createElement("div");
            newDiv.classList.add("grid");
            newDiv.style.width = gridElementSize;
            newDiv.style.height = gridElementSize;

            // Add the new Div to the grid container
            container.appendChild(newDiv);
        }
    }

    // For every new grid that is created:
    // Display the size of the grid in text 
    displayGridSize(sizeOfGrid);
    // Listen for drawing on the grid
    drawOnGrid();
}

function removeGrid() {
    const oldGrid = document.querySelectorAll(".grid");
    oldGrid.forEach((div) => {
        div.remove();
    });
}

function drawOnGrid() {
    const grid = document.querySelectorAll(".grid");
    grid.forEach((div) => {
        div.addEventListener("mouseenter", function(e){
            if (gridState.color == "black") {
                e.target.style.backgroundColor = `rgb(0, 0, 0)`;
            } else if (gridState.color == "color") {
                e.target.style.backgroundColor = useRandomColors();
            } else if (gridState.color == "shader") {
                e.target.style.backgroundColor = useShader(e);
            } else if (gridState.color == "eraser") {
                e.target.style.backgroundColor = `rgb(255, 255, 255)`;
            } else if (gridState.color == "lightener") {
                e.target.style.backgroundColor = useLightener(e);
            }
        });
    });
}

function clearGridOnButtonClick() {
    const button = document.querySelector("#clear");
    button.addEventListener("click", () => {
        removeGrid();
        createGrid(gridState.gridSize);
    })
}

function changeGridSizeOnButtonClick() {
    const button = document.querySelector("#resize");
    button.addEventListener("click", (e) => {
        e.stopPropagation();
        // Get the new size from the slider
        const slider = document.querySelector("#sizeRange.slider");
        if (slider.value != gridState.gridSize) {
            if (confirm(`Erase everything and resize grid to ${slider.value}x${slider.value}?`)) {
                removeGrid();
                createGrid(slider.value);
            }
        }
    })
}

// HELPER FUNCTIONS: FOR GRID CREATION AND MANIPULATION //

function calculateGridElementSize(sizeOfGrid) {
    // Get size of the grid container, assume width and height are the same. Use parseInt to drop the px off
    const container = document.querySelector(".container");
    const containerSize = parseInt(getComputedStyle(container).width, 10);
    // Get size of the grid border - temporarily add it to the DOM and then remove it. use parseInt to drop the px off 
    const tempDiv = document.createElement("div")
    tempDiv.classList.add("grid");
    container.appendChild(tempDiv);
    const BORDER_SIZE = parseInt(getComputedStyle(tempDiv).borderWidth, 10);
    container.removeChild(tempDiv);

    // Need to subtract the 2 sides of the border from the total element size so that it fits properly
    const elementSize = (containerSize / sizeOfGrid) - (BORDER_SIZE * 2);
    return elementSize;
}


// FUNCTIONS: COLORIZATION OF GRID CELLS //

function useRandomColors() {

    const red = getRandomIntInclusive(0, 255);
    const green = getRandomIntInclusive(0, 255);
    const blue = getRandomIntInclusive(0, 255);

    // return the random color (and shading)
    return `rgb(${red}, ${green}, ${blue})`;
}

function useShader(e) {
    // Shade color darker than previous value with each pass (default 10%)
    const shadeAmount = gridState.shading;

    // get colors from grid div
    const colors = [window.getComputedStyle(e.target).getPropertyValue("background-color")];

    // Extract the current background color & apply to rgb variables
    const rgbArray = extractRGBValues(colors);
    const currentRed = rgbArray[0],
        currentGreen = rgbArray[1],
         currentBlue = rgbArray[2];

    // if already black, return
    if (currentRed == 0 && currentGreen == 0 && currentBlue == 0) {
        return `rgb(0, 0, 0)`;
    }
    const lessRed = Math.floor(currentRed * shadeAmount);
    const lessGreen = Math.floor(currentGreen * shadeAmount);
    const lessBlue = Math.floor(currentBlue * shadeAmount);

    const red = currentRed - lessRed;
    const green = currentGreen - lessGreen;
    const blue = currentBlue - lessBlue;

    // return the random color (and shading)
    return `rgb(${red}, ${green}, ${blue})`;
}

function useLightener(e) {
        // Shade color lighter than previous value with each pass (default 10%)
        const lightenAmount = gridState.lightening;

        // get colors from grid div
        const colors = [window.getComputedStyle(e.target).getPropertyValue("background-color")];
    
        // Extract the current background color & apply to rgb variables
        const rgbArray = extractRGBValues(colors);
        let currentRed = rgbArray[0],
            currentGreen = rgbArray[1],
             currentBlue = rgbArray[2];
    
        // if already white, return
        if (currentRed == 255 && currentGreen == 255 && currentBlue == 255) {
            return `rgb(255, 255, 255)`;
        } else if (currentRed == 0 && currentGreen == 0 && currentBlue == 0) {
            currentRed = 20;
            currentGreen = 20;
            currentBlue = 20;
        }
        const moreRed = Math.floor(currentRed * lightenAmount);
        const moreGreen = Math.floor(currentGreen * lightenAmount);
        const moreBlue = Math.floor(currentBlue * lightenAmount);
    
        const red = currentRed + moreRed;
        const green = currentGreen + moreGreen;
        const blue = currentBlue + moreBlue;
    
        // return the random color (and shading)
        return `rgb(${red}, ${green}, ${blue})`;
}

function changeColorOnButtonClick() {
    const buttons = document.querySelectorAll(".color-buttons");
    buttons.forEach((button) => {
        button.addEventListener("click", (e) => {
            if (e.target.id !== "clear") {
                gridState.color = e.target.id;
            }
        });
    });
}

function changeShadingOnButtonClick() {
    const button = document.querySelector("#shading-amount");

    button.addEventListener("click", (e) => {
        e.stopPropagation();
        do {
            gridState.shading = prompt("Enter new shader amount between 0 and 1\nEnter a decimal - Closer to 0 = less shading, closer to 1 = more shading\nMake sure to turn on shader")
        } while (gridState.shading <= 0 || gridState.shading >= 1);
    })
}

function changeLighteningOnButtonClick() {
    const button = document.querySelector("#lightening-amount");

    button.addEventListener("click", (e) => {
        e.stopPropagation();
        do {
            gridState.lightening = prompt("Enter new lightener amount between 0 and 1\nEnter a decimal - Closer to 0 = less lightening, closer to 1 = more lightening\nMake sure to turn on lightener")
        } while (gridState.lightening <= 0 || gridState.lightening >= 1);
    })
}


// HELPER FUNCTIONS: COLORIZATION //

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function extractRGBValues(rgbString) {
    rgbString = rgbString.toString();

    rgbString = rgbString.substring(rgbString.indexOf("(") + 1, rgbString.indexOf(")"));
    rgbColors = rgbString.split(",", 3);

    rgbColors[0] = parseInt(rgbColors[0]);
    rgbColors[1] = parseInt(rgbColors[1]);
    rgbColors[2] = parseInt(rgbColors[2]);

    return rgbColors;
}


// FUNCTIONS: DISPLAY TEXT TO PAGE //

function displayGridSize(size) {
    // Add text to display current grid size
    const sizeDisplay = document.querySelector("#size");
    sizeDisplay.textContent = " " + size + "x" + size;
}


function displaySliderText() {
    const shaderText = document.getElementById("shaderText");
    const lightenerText = document.getElementById("lightenerText");
    const sizeText = document.getElementById("sizeText");

    const sliders = document.querySelectorAll(".slider");
    sliders.forEach((slider) => {
        if (slider.id == "shaderRange") {
            shaderText.textContent = slider.value + '%';
            slider.oninput = function() {
                shaderText.textContent = this.value + '%';
            }
        }
        if (slider.id == "lightenerRange") {
            lightenerText.textContent = slider.value + '%';
            slider.oninput = function() {
                lightenerText.textContent = this.value + '%';
            }
        }
        if (slider.id == "sizeRange") {
            sizeText.textContent = slider.value + 'x' + slider.value;
            slider.oninput = function() {
                sizeText.textContent = this.value + 'x' + this.value;
            }
        }
    })
}

