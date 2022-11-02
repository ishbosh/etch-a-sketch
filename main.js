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

function createGrid(sizeOfGrid) {
    // Grab the container
    const CONTAINER = document.querySelector(".container");

    // Calculate size of each grid element
    gridElementSize = calculateGridElementSize(sizeOfGrid);

    // Number of Rows
    for (let i = 0; i < sizeOfGrid; i++) {
        // Number of Columns
        for (let j = 0; j < sizeOfGrid; j++) {
            let newDiv = document.createElement("div");
            newDiv.classList.add("grid");
            CONTAINER.appendChild(newDiv);
        }
    }
}

function calculateGridElementSize(sizeOfGrid) {
    const CONTAINER_SIZE = 980; // Set size of the grid container
    const elementSize = CONTAINER_SIZE / sizeOfGrid;
    return elementSize;
}

createGrid(16);