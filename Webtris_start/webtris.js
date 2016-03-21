/**
 * A Tetris style game implemented in JavaScript using an HTML canvas for drawing. This is intended as a tool to teach game development
 * and computer science to the uninitiated.
 */

/**
 * The heart of the game, the game loop calls methods to poll inputs, handle game state and draw the game.
 */
function gameLoop() {
  handleInput();

  drawGame();
}

/**
 * Figure out what key was pressed, and move the piece. This method uses deltas for the player movements/rotations so that the delta can
 * be used in a "what if" scenario for determining if a player move is valid.
 */
function handleInput() {
	
}

/**
 * Draw the game by filling the background and board area with solid colors, then drawing the board, player piece, scores 
 * and piece totals. Also handles drawing the "game over" text.
 */
function drawGame() {
	
}

/**
 * These are our constant values.
 *
 * Constants are a necessity to good programming as they allow later changes to be made system wide as long as the constant is used 
 * instead of "magic values/numbers" across the code.
 */

// ASCII key codes stored as constants for readability.
var KEY_PRESS_LEFT = 37;
var KEY_PRESS_RIGHT = 39;
var KEY_PRESS_DOWN = 40;
var KEY_PRESS_X = 88;
var KEY_PRESS_Z = 90;

/**
 * These are our game state variables. Variables are used to store pieces of data such as numbers, strings, boolean values, etc. 
 * A variable can be assigned a value, and the value may be changed via numerous operators: + - * / =.
 */

// We define the shapes and positions of our pieces here. They are stored as a multidimensional array where the structure goes: piece 
// type, rotation(s), then a two dimensional array representing the piece in a specific rotation.
var piece = [[0, 1, 0],
			 [0, 1, 0],
			 [0, 1, 1]];

// A reference to the canvas we use to draw the game.
var canvas = null;
// The image for a player piece.
var pieceImage = null;
// The image for the board's wall piece.
var boardImage = null;
// Stores the key that was pressed.
var playerKeyPress = 0;
// The X position of our active playing piece, stored as an index into our board array, it starts in the middle of the board at position 5.
var playerXIndex = 0;
// The Y position of our active playing piece, stored as an index into our board array, it starts off at the top at position 0.
var playerYIndex = 1;
// A reference to the current board's information: a multidimensional array where a wall is represented by
// 2, a player piece by 1, an empty spot by 0, and the "game over" zone by -1.
var board = [
    [2, 2, 2, 2, 0, 0, 0, 0, 2, 2, 2, 2],
    [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2]
  ];

/**
 * Sets up our game. Stores references to the piece/board images and canvas, sets up key listening, and starts our game loop.
 */
function onLoad() {
  window.setInterval(gameLoop, 16);

  // Get all of our game parts: the canvas, the board image, and the piece image.
  var canvasElement = document.getElementById("canvas");
  // We draw via the canvas's 2d context, so we store a reference for drawing.
  canvas = canvasElement.getContext("2d");
  pieceImage = document.getElementById("red_piece");
  boardImage = document.getElementById("gray_piece");

  // Every time a key is pressed, store it to be processed in the game loop.
  document.addEventListener('keydown', function(event) {
    playerKeyPress = event.keyCode;
  });
}
