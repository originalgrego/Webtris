/**
 * A Tetris style game implemented in JavaScript using an HTML canvas for drawing. This is intended as a tool to teach game development
 * and computer science to the uninitiated.
 */

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

// We define the shape of our piece here. It is stored as a two dimensional array representing the piece in a specific rotation.
var piece = [[0, 1, 0],
             [0, 1, 0],
             [0, 1, 1]];

// A reference to the canvas we use to draw the game.
var canvas = null;
// Whether or not we have hit the Game Over state. Is either true or false.
var gameOver = false;
// The image for a player piece.
var pieceImage = null;
// The image for the board's wall piece.
var boardImage = null;
// Stores the key that was pressed.
var playerKeyPress = 0;
// The X position of our active playing piece, stored as an index into our board array, it starts in the middle of the board at position 5.
var playerXIndex = 5;
// The Y position of our active playing piece, stored as an index into our board array, it starts off at the top at position 0.
var playerYIndex = 0;
// The board's information: a multidimensional array where a wall is represented by 2, and an empty spot by 0.
var board = null;

/*
 * Draws a two dimensional array such as the board or a piece.
 */
function draw2DArray(drawArray, xPos, yPos) {
  for (var x = 0; x < drawArray[0].length; x++) {
    for (var y = 0; y < drawArray.length; y++) {
      var value = drawArray[y][x];
      if (value > 0) {
        var image;
        image = pieceImage;
        canvas.drawImage(image, (x + xPos) * 8, (y + yPos) * 8);
      }
    }
  }
}

/**
 * Check if there is a collision between the player's piece at a position on the board, returns true if a collision occurred.
 */
function checkCollision(playerXPosition, playerYPosition) {
  for (var x = 0; x < piece[0].length; x ++) {
    for (var y = 0; y < piece.length; y ++) {
      var value = piece[y][x];
      if (value > 0 && board[playerYPosition + y][playerXPosition + x] > 0) {
        return true;
      }
    }
  }
  return false;
}

/**
 * Add the new player piece to its spot on the board.
 */
function applyPlayerPieceToBoard(playerXPosition, playerYPosition) {
  for (var x = 0; x < piece[0].length; x++) {
    for (var y = 0; y < piece.length; y++) {
      var value = piece[y][x];
      if (value > 0) {
        board[playerYPosition + y][playerXPosition + x] = value;
      }
    }
  }
}

/**
 * Check to see if a piece overlaps with the game over zone; if it does it's game over.
 */
function checkGameOver(playerXPosition, playerYPosition) {
  for (var x = 0; x < piece[0].length; x++) {
    for (var y = 0; y < piece.length; y++) {
      var value = piece[y][x];
      if (value > 0 && board[playerYPosition + y][playerXPosition + x] == -1) {
        gameOver = true;
      }
    }
  }
}

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
  document.addEventListener('keydown', function (event) {
    playerKeyPress = event.keyCode;
  });

  // Setup a new game.
  newGame();
}

/**
 * We define the structure of the board in a method so a new one can be created whenever a new game begins. A constant for
 * the board's definition would require us to copy to a board array each time the game starts, creating a new instance of
 * the data is simpler.
 */
function getNewBoard() {
  return [
    [0, 0, 0, 2, 0, 0, 0, 0, 2, 0, 0, 0],
    [0, 0, 0, 2, 0, 0, 0, 0, 2, 0, 0, 0],
    [2, 2, 2, 2,-1,-1,-1,-1, 2, 2, 2, 2],
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
}

/**
 * Sets up a new game by initializing all of the game state variables.
 */
function newGame() {
  // Create and assign a new board.
  board = getNewBoard();
  // Reset our gameOver flag.
  gameOver = false;
}

/**
 * The heart of the game, the game loop calls methods to poll inputs, handle game state and draw the game.
 */
function gameLoop() {
  // If our game isn't over, figure out what the next move is.
  if (!gameOver) {
    handleInput();
  }
  else {
    // If our game is over, and our player wants to start a new one, load it up!
    if (keyPresses[KEY_PRESS_DOWN] || keyPresses[KEY_PRESS_Z] || keyPresses[KEY_PRESS_X]) {
      newGame();
    }
  }

  drawGame();
}

/**
 * Figure out what key was pressed, and move the piece.
 */
function handleInput() {
  var xDelta = 0;
  var yDelta = 0;



  if (xDelta != 0 || yDelta != 0) {

  }
}

/**
 * Draw the game by filling the background with a solid color, draw the player piece, then draw the board.
 */
function drawGame() {

}
