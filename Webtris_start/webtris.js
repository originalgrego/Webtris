/**
 * JavaScript functions for a Tetris game.
 */

/**
 * The check we make each frame to see our game status: game over or playing.
 */
function gameLoop() {
  handleInput();

  drawGame();
}

/**
 * Figure out what key was pressed, and move our piece.
 */
function handleInput() {
	
}

/**
 * Using our HTML5 canvas, we draw the images where they need to be based on our
 * storage variables,
 */
function drawGame() {
	
}

/**
 * These are our constant values.
 *
 * We add these as variables because they are used in multiples places in our code,
 * and if we want to update one value, we want all of our values to change as well.
 */
var KEY_PRESS_LEFT = 37;
var KEY_PRESS_RIGHT = 39;
var KEY_PRESS_DOWN = 40;
var KEY_PRESS_X = 88;
var KEY_PRESS_Z = 90;

/**
 * These are our game state storage variables.
 *
 * We can store values that change often, but are available in multiple places in
 * our code. As soon as these values change, we can use the updated values everywhere.
 */

// We define the shapes and positions of our pieces here.
var piece = [[0, 1, 0],
			 [0, 1, 0],
			 [0, 1, 1]];

// The canvas we use to draw our game.
var canvas = null;
// The image for all game pieces.
var pieceImage = null;
// The image for the board's wall pieces.
var boardImage = null;
// We keep track of which key was pressed.
var playerKeyPress = 0;
// The X position of our active playing piece - it starts in the middle as 5.
var playerXIndex = 0;
// The Y position of our active playing piece - it starts off at the top as 0.
var playerYIndex = 1;
// Our board's information: a multidimensional array where a wall is represented by
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
 * Set up our game.
 */
function onLoad() {
  window.setInterval(gameLoop, 16);

  // Get all of our game parts: the canvas, the board image, and the piece image.
  var canvasElement = document.getElementById("canvas");
  // We want the 2D representation of our canvas to draw.
  canvas = canvasElement.getContext("2d");
  pieceImage = document.getElementById("red_piece");
  boardImage = document.getElementById("gray_piece");

  // Every time we press a key, decide which key was pressed.
  document.addEventListener('keydown', function(event) {
    playerKeyPress = event.keyCode;
  });
}