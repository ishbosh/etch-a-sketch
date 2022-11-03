// Create a 16x16 grid of square divs
    // Given GRID_SIZE, create GRID_SIZE number of rows of with GRID_SIZE number of div elements in each row.
    // Assign class of grid to each div element
    // Calculate height and width of each div grid element by dividing the total container size by number of grid elements

// Insert divs into main div container
    // insert all div elements with class of grid into div with class of container

// Add a Hover effect to the grid divs to change the color on mouseover, leaving a pixelated trail
    // Add event listener to each div element with class of grid to listen for mouseover
    // Change background color of the div mouse has entered when mouse enters each div

// Add a button to the top of the screen that will send a popup asking for the number of squares per side for a new grid. Max 100. Fit to same total space.
    // Add button to HTML file to create new grid
    // Use prompt to request new grid size, set limit between 16 - 100
    // Limit the original div container size so they fit into the same space.

const DEFAULT_SIZE = 16;

createGrid(DEFAULT_SIZE);
changeGridSize();

function createGrid(sizeOfGrid) {
    //Limit size of grid
    if (sizeOfGrid > 100) {
        sizeOfGrid = 100;
    } else if (sizeOfGrid < 16) {
        sizeOfGrid = 16;
    }

    // Grab the container
    const container = document.querySelector(".container");

    // Calculate size of each grid element
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

    displayGridSize(sizeOfGrid);
    drawOnGrid();
}

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


// Create a draw function
function drawOnGrid() {
    // Listen for mouse enter on each grid square, change color to black on mouse enter (and then stop listening to that square?)
    const grid = document.querySelectorAll(".grid");

    grid.forEach((div) => {
        // Random Colors
        useRandomColors(div);
    });
}


function useBlack(div) {
    div.addEventListener("mouseenter", function(e){
        e.target.style.backgroundColor = `#000`;
    })
}

function useRandomColors(div) {
    div.addEventListener("mouseenter", function(e){
        // get colors from grid div
        colors = [window.getComputedStyle(e.target).getPropertyValue("background-color")];
        // Extract the current background color & apply to rgb variables
        let rgbArray = extractRGBValues(colors);
        let red = rgbArray[0],
            green = rgbArray[1],
            blue = rgbArray[2];

        // if already black, return
        if (red == 0 && green == 0 && blue == 0) {
            return;
        }

        // Change Colors using the rgb variables
        rgbArray = randomColorToBlack(red, green, blue);
        // Assign the changed colors to rgb variables
        red = rgbArray[0],
        green = rgbArray[1],
        blue = rgbArray[2];

        // draw color to grid div
        e.target.style.backgroundColor = `rgb(${red}, ${green}, ${blue})`;
    });
}

function changeGridSize() {
    // Select button element
    const button = document.querySelector(".button");

    // Listen for click and prompt new size on click
    button.addEventListener("click", (e) => {
        e.stopPropagation();
        const newSize = prompt("ERASE & CREATE NEW GRID\nEnter size between 16 and 100:");
        removeGrid();
        createGrid(newSize);
    })
}


// remove old grid from the page
function removeGrid() {
    const oldGrid = document.querySelectorAll(".grid");

    oldGrid.forEach((div) => {
        div.remove();
    });
}

// Change text display for grid size
function displayGridSize(size) {
    // Add text to display current grid size
    const sizeDisplay = document.querySelector("#size");
    sizeDisplay.textContent = " " + size;
}

function randomColorToBlack(currentRed, currentGreen, currentBlue) {
    const lessRed = Math.floor(currentRed * .25);
    const lessGreen = Math.floor(currentGreen * .25);
    const lessBlue = Math.floor(currentBlue * .25);

    if (currentRed == 255 && currentGreen == 255 && currentBlue == 255) {
        const red = getRandomIntInclusive(0, 255);
        const green = getRandomIntInclusive(0, 255);
        const blue = getRandomIntInclusive(0, 255);
        return [red, green, blue];
    } else {
        const red = currentRed - lessRed;
        const green = currentGreen - lessGreen;
        const blue = currentBlue - lessBlue;
        return [red, green, blue];
    }
}

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