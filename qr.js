// script.js
const canvas = document.getElementById('mazeCanvas');
const ctx = canvas.getContext('2d');
const messageBox = document.getElementById('messageBox');

// Game constants
const CELL_SIZE = 30; // Size of each cell in pixels
const MAZE_COLS = 15; // Number of columns in the maze
const MAZE_ROWS = 15; // Number of rows in the maze

// Define colors
const WALL_COLOR = '#4682b4'; // Steel blue for walls
const PATH_COLOR = '#f0f8ff'; // Alice blue for paths
const BORDER_COLOR = '#2c3e50'; // Dark border for cells

// Maze representation (1 = wall, 0 = path)
// This is a simple maze. More complex mazes can be generated algorithmically.
const maze = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,1,0,0,0,0,0,0,0,0,0,1],
    [1,1,1,0,1,0,1,1,1,1,1,1,0,1,1],
    [1,0,0,0,0,0,1,0,0,0,0,1,0,0,1],
    [1,0,1,1,1,1,1,0,1,1,0,1,1,0,1],
    [1,0,0,0,0,0,0,0,1,0,0,0,1,0,1],
    [1,1,1,1,1,1,1,0,1,0,1,0,1,0,1],
    [1,0,0,0,0,0,0,0,0,0,1,0,0,0,1],
    [1,0,1,1,1,1,1,1,1,1,1,1,1,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];

// Adjust MAZE_ROWS and MAZE_COLS based on the actual maze array dimensions
const actualMazeRows = maze.length;
const actualMazeCols = maze[0].length;

// Player and Glacier positions (0-indexed)
let playerX = 1; // Starting X position
let playerY = 1; // Starting Y position

const glacierX = actualMazeCols - 2; // Glacier X position (second to last column)
const glacierY = actualMazeRows - 2; // Glacier Y position (second to last row)

let gameWon = false;

// Function to resize canvas based on container and redraw
function resizeCanvas() {
    // Set canvas dimensions based on maze size
    canvas.width = actualMazeCols * CELL_SIZE;
    canvas.height = actualMazeRows * CELL_SIZE;
    drawMaze(); // Redraw maze after resizing
}

// Function to draw the maze
function drawMaze() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas

    for (let row = 0; row < actualMazeRows; row++) {
        for (let col = 0; col < actualMazeCols; col++) {
            const x = col * CELL_SIZE;
            const y = row * CELL_SIZE;

            // Draw cell background
            ctx.fillStyle = maze[row][col] === 1 ? WALL_COLOR : PATH_COLOR;
            ctx.fillRect(x, y, CELL_SIZE, CELL_SIZE);

            // Draw cell border
            ctx.strokeStyle = BORDER_COLOR;
            ctx.lineWidth = 1;
            ctx.strokeRect(x, y, CELL_SIZE, CELL_SIZE);
        }
    }

    // Draw Glacier (goal) as text
    ctx.fillStyle = '#005f73'; // Darker blue for text
    ctx.font = `${CELL_SIZE * 0.6}px Inter`; // Adjust font size relative to cell size
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('glacier', glacierX * CELL_SIZE + CELL_SIZE / 2, glacierY * CELL_SIZE + CELL_SIZE / 2);


    // Draw Polar Bear (player) as emoji
    ctx.font = `${CELL_SIZE * 0.8}px sans-serif`; // Emoji font size
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🐻‍❄️', playerX * CELL_SIZE + CELL_SIZE / 2, playerY * CELL_SIZE + CELL_SIZE / 2);
}

// Function to move the player
function movePlayer(dx, dy) {
    if (gameWon) return; // Don't allow movement if game is won

    const newPlayerX = playerX + dx;
    const newPlayerY = playerY + dy;

    // Check boundaries
    if (newPlayerX >= 0 && newPlayerX < actualMazeCols &&
        newPlayerY >= 0 && newPlayerY < actualMazeRows) {
        // Check if the new position is a wall
        if (maze[newPlayerY][newPlayerX] === 0) {
            playerX = newPlayerX;
            playerY = newPlayerY;
            drawMaze(); // Redraw after movement

            // Check for win condition
            if (playerX === glacierX && playerY === glacierY) {
                gameWon = true;
                showMessage("Oh no, My home has melted away\n\"Remember! ice melts quickly but the change is profound\"", "success");
            }
        }
    }
}

// Function to display messages
function showMessage(msg, type) {
    messageBox.innerHTML = msg.replace(/\n/g, '<br>'); // Use innerHTML to allow line breaks
    messageBox.className = 'message-box show'; // Reset classes
    if (type === "success") {
        messageBox.classList.add('bg-green-100', 'text-green-800');
    } else if (type === "error") {
        messageBox.classList.add('bg-red-100', 'text-red-800');
    }
}

// Event Listeners for on-screen arrow buttons
document.getElementById('up').addEventListener('click', () => movePlayer(0, -1));
document.getElementById('down').addEventListener('click', () => movePlayer(0, 1));
document.getElementById('left').addEventListener('click', () => movePlayer(-1, 0));
document.getElementById('right').addEventListener('click', () => movePlayer(1, 0));

// Event Listener for keyboard controls
document.addEventListener('keydown', (e) => {
    if (gameWon) return;
    switch (e.key) {
        case 'ArrowUp':
            movePlayer(0, -1);
            break;
        case 'ArrowDown':
            movePlayer(0, 1);
            break;
        case 'ArrowLeft':
            movePlayer(-1, 0);
            break;
        case 'ArrowRight':
            movePlayer(1, 0);
            break;
    }
});

// Initialize game on window load
window.onload = function() {
    resizeCanvas(); // Set initial canvas size and draw maze
    window.addEventListener('resize', resizeCanvas); // Add resize listener
};
