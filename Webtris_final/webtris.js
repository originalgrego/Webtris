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
// The size of our board in pixels.
var BOARD_WIDTH_PIXELS = 12 * 8;
var BOARD_HEIGHT_PIXELS = 22 * 8;

// Offsets used to center the board in the canvas.
var BOARD_X_OFFSET_PIXELS = (200 - BOARD_WIDTH_PIXELS) / 2;
var BOARD_Y_OFFSET_PIXELS = (300 - BOARD_HEIGHT_PIXELS) / 2;

// Our base speed for forcefully moving the player piece down.
var BASE_FRAMES_PER_DROP = 60;

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
var pieces = [
  // Our square shape and its rotations (which are identical).
  [
    [
      [1, 1],
      [1, 1]
    ]
  ],
  // Left Zig shape, and its rotation.
  [
    [
      [0, 0, 0],
      [1, 1, 0],
      [0, 1, 1]
    ],
    [
      [0, 1, 0],
      [1, 1, 0],
      [1, 0, 0]
    ]
  ],
  // Right Zig shape and its rotation.
  [
    [
      [0, 0, 0],
      [0, 1, 1],
      [1, 1, 0]
    ],
    [
      [0, 1, 0],
      [0, 1, 1],
      [0, 0, 1]
    ]
  ],
  // Straight shape and its rotation.
  [
    [
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 1, 0, 0]
    ],
    [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0]
    ]
  ],
  // "T" shape and its rotations.
  [
    [
      [0, 1, 0],
      [1, 1, 1],
      [0, 0, 0]
    ],
    [
      [0, 1, 0],
      [0, 1, 1],
      [0, 1, 0]
    ],
    [
      [0, 0, 0],
      [1, 1, 1],
      [0, 1, 0]
    ],
    [
      [0, 1, 0],
      [1, 1, 0],
      [0, 1, 0]
    ]
  ],
  // Left "L" shape and its rotations.
  [
    [
      [0, 1, 0],
      [0, 1, 0],
      [1, 1, 0]
    ],
    [
      [1, 0, 0],
      [1, 1, 1],
      [0, 0, 0]
    ],
    [
      [0, 1, 1],
      [0, 1, 0],
      [0, 1, 0]
    ],
    [
      [0, 0, 0],
      [1, 1, 1],
      [0, 0, 1]
    ]
  ],
  // Right "L" shape and its rotations.
  [
    [
      [0, 1, 0],
      [0, 1, 0],
      [0, 1, 1]
    ],
    [
      [0, 0, 0],
      [1, 1, 1],
      [1, 0, 0]
    ],
    [
      [1, 1, 0],
      [0, 1, 0],
      [0, 1, 0]
    ],
    [
      [0, 0, 1],
      [1, 1, 1],
      [0, 0, 0]
    ]
  ]
];

// A reference to the canvas we use to draw the game.
var canvas = null;
// A reference to the current board's information: a multidimensional array where a wall is represented by
// 2, a player piece by 1, an empty spot by 0, and the "game over" zone by -1.
var board = null;
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
// The index in the array that identifies our active playing piece - either a square,
// left/right zig zag, straight, "T" shape, or left/right "L" shapes.
var playerPieceIndex = 0;
// A way to reference our piece without the confusion of a multidimensional array.
var playerPieceRef = null; 
// The active playing piece's rotation index.
var playerPieceRotation = 0;
// The score.
var score = 0;
// Stores the total number of lines removed by the player.
var totalLinesRemoved = 0;
// Used to keep count of each pieces occurence, so we can show statistics.
var pieceCount = [0, 0, 0, 0, 0, 0, 0];
// The number of frames since the last time we forced the players piece to drop.
var frameCount = 0;
// The number of pixels to vertically offset the players piece to make it appear as if it is slowly dropping. Updated each frame based 
// on the current framesPerDrop.
var smoothScrollingValue = 0;
// The current number of frames per forceful drop of the players piece. Updated whenever the player scores ten lines to slowly increase 
// the game difficulty.
var framesPerDrop = BASE_FRAMES_PER_DROP;

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
  // Reset our completed lines count.
  totalLinesRemoved = 0;
  // Zero out our score.
  score = 0;
  // Reset our piece counts.
  pieceCount = [0, 0, 0, 0, 0, 0, 0];
  // Create and assign a new board.
  board = getNewBoard();
  // Assign a new random piece to the player.
  assignRandomPieceToPlayer();
  // Reset our gameOver flag.
  gameOver = false;
  // Update the drop speed.
  updateFramesPerDrop();
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
    if (playerKeyPress != 0) {
      newGame();
    }
  }

  drawGame();
}

/**
 * Figure out what key was pressed, and move the piece. This method uses deltas for the player movements/rotations so that the delta can
 * be used in a "what if" scenario for determining if a player move is valid.
 */
function handleInput() {
  var xDelta = 0;
  var yDelta = 0;
  var rotationDelta = 0;

  // Force our player piece down a position if enough time has passed.
  if (frameCount > framesPerDrop) {
    yDelta ++;
    frameCount = 0;
  }
  frameCount ++;

  if (playerKeyPress == KEY_PRESS_LEFT) { // If the player presses left, store a left movement in xDelta.
    xDelta --;
  }
  else if (playerKeyPress == KEY_PRESS_RIGHT) { // If the player presses right, store a right movement in xDelta.
    xDelta ++;
  }
  else if (playerKeyPress == KEY_PRESS_DOWN) { // If the player presses down, store a down movement in YDelta.
    yDelta ++;
  }
  else if (playerKeyPress == KEY_PRESS_Z) { // If the player presses Z, rotate counter clockwise.
    rotationDelta --;
  }
  else if (playerKeyPress == KEY_PRESS_X) { // If the player presses X, rotate clockwise.
    rotationDelta ++;
  }
  // We don't do anything for other key presses, including "up" because they
  // aren't a part of our game play.

  // Reset our key press so that new user input may be easily identified in the next frame.
  playerKeyPress = 0;

  // If the player or the drop rate caused a positive change in the y index check if the move causes a collision. If that
  // move was the end of the game we are done, otherwise apply the piece to the board, remove lines from the board (if any)
  // and assign the player a new piece.
  if (yDelta != 0 && checkCollision(playerXIndex, playerYIndex + yDelta, playerPieceRotation)) {
    checkGameOver(playerXIndex, playerYIndex);
    if (gameOver) {
      return;
    }
    // Apply the piece to the board.
    applyPlayerPieceToBoard(playerXIndex, playerYIndex);
    // See if any lines were made by the piece's placement and remove completed lines.
    checkForLines();
    // Assign a new piece to the player.
    assignRandomPieceToPlayer();
    // Reset our delta, it has already been consumed.
    yDelta = 0;
  }
  else { // Handle rotatation and left/right movement. 
    if (rotationDelta != 0) {
      // Wrap the rotation index if it goes past the piece's rotation array limits (0 to array length - 1).
      var rotationCount = pieces[playerPieceIndex].length;
      var newRotation = playerPieceRotation + rotationDelta;
      if (newRotation < 0) {
        newRotation = rotationCount - 1;
      }
      else if (newRotation > rotationCount - 1) {
        newRotation = 0;
      }

      // See if our rotation creates a collision, if not, we can update our rotation.
      if (!checkCollision(playerXIndex, playerYIndex + yDelta, newRotation)) {
        playerPieceRotation = newRotation;
		playerPieceRef = pieces[playerPieceIndex][playerPieceRotation];
      }
    }

    // If we can't move left/right because of a collision, reset our xDelta.
    if (xDelta != 0 && checkCollision(playerXIndex + xDelta, playerYIndex, playerPieceRotation)) {
      xDelta = 0;
    }
  }

  // Update the smooth scrolling value based on the current frameCount and framesPerDrop.
  smoothScrollingValue = Math.floor(frameCount * 8 / framesPerDrop);
  if (yDelta != 0) {
    frameCount = 0;
    smoothScrollingValue = 0;
  }
  else if (checkCollision(playerXIndex, playerYIndex + 1, playerPieceRotation)) {
    smoothScrollingValue = 0;
  }

  // Finally, if any x or y deltas still remain (they weren't used through placing a piece or ignored due to collision) 
  // then apply them to the player's position.
  playerXIndex += xDelta;
  playerYIndex += yDelta;

}

/**
 * Assign a random piece to the player and reset player position.
 */
function assignRandomPieceToPlayer() {
  // Place the new piece at the top, middle of the board.
  playerXIndex = 5;
  playerYIndex = 0;
  // Randomly pick a piece out of our saved pieces array.
  playerPieceIndex = Math.floor(pieces.length * Math.random());
  // Update our count of each piece.
  pieceCount[playerPieceIndex] ++;
  // Reset the rotation.
  playerPieceRotation = 0;
  playerPieceRef = pieces[playerPieceIndex][playerPieceRotation];
}

/**
 * Update the drop rate based on the number of lines that have been removed, slowly increases the challenge every 10 lines.
 */
function updateFramesPerDrop() {
  framesPerDrop = Math.floor(BASE_FRAMES_PER_DROP - 10 * (Math.floor(totalLinesRemoved / 10)));
}

/**
 * Draw the game by filling the background and board area with solid colors, then drawing the board, player piece, scores 
 * and piece totals. Also handles drawing the "game over" text.
 */
function drawGame() {
  // Set the background color of the canvas and fill the canvas.
  canvas.fillStyle = "black";
  canvas.fillRect(0, 0, 200, 300);

  // Set the board background color to blue and fill the area the board encompasses.
  canvas.fillStyle = "blue";
  canvas.fillRect(BOARD_X_OFFSET_PIXELS, 16 + BOARD_Y_OFFSET_PIXELS, BOARD_WIDTH_PIXELS, BOARD_HEIGHT_PIXELS);
  canvas.fillRect(BOARD_X_OFFSET_PIXELS + 24, BOARD_Y_OFFSET_PIXELS, BOARD_WIDTH_PIXELS - 48, BOARD_HEIGHT_PIXELS);

  // Draw the board.
  drawArray(board, 0, 0);

  // Draw our current, active piece in its proper place.
  // We draw it here because it hasn't been permanently placed on the board.
  drawArray(playerPieceRef, playerXIndex, playerYIndex);

  // Draw the score and line count messages.
  canvas.fillStyle = "white";
  canvas.font = "15px Arial";
  canvas.fillText("Score: " + score, 10, 20);
  canvas.fillText("Lines: " + totalLinesRemoved, 10, 40);

  // Draw our statistics for pieces.
  drawEachPiece();

  // If we hit a game over, show a game over message.
  if (gameOver) {
    canvas.fillStyle = "red";
    canvas.font = "30px Arial";
    canvas.fillText("GAME OVER", 10, 150);
  }
}

/*
 * Draws a two dimensional array such as the board or a piece.
 */
function drawArray(drawArray, xOffset, yOffset) {
  for (var x = 0; x < drawArray[0].length; x ++) {
    for (var y = 0; y < drawArray.length; y ++) {
      var value = drawArray[y][x];
      if (value > 0) {
        var image;
        if (value == 1) {
          image = pieceImage;
        }
		else {
          image = boardImage;
        }
        canvas.drawImage(image, BOARD_X_OFFSET_PIXELS + (x + xOffset) * 8, BOARD_Y_OFFSET_PIXELS + (y + yOffset) * 8);
      }
    }
  }
}

/**
 * Check to see if completed lines exist, if so remove them and update scores and drop rate.
 */
function checkForLines() {
  // Variable to store the number of lines removed for score calculation.
  var linesRemoved = 0;
  for (var y = board.length - 1; y >= 0; y --) {
    // Keep track of how many blocks are in this row; 0 to start.
    var blockCount = 0;
    for (var x = 0; x < board[0].length; x ++) {
      var value = board[y][x];
      if (value == 1) {
        blockCount ++;
      }
    }
    // If we have a total of 10 blocks in a row, we have a line!
    if (blockCount == 10) {
      for (var removeY = y; removeY >= 4; removeY --) {
        for (var x = 0; x < board[0].length; x ++) {
          // Remove the line from our board, and shift every other piece down.
          board[removeY][x] = board[removeY - 1][x];
        }
      }
      y ++;
      linesRemoved ++;
    }
  }

  // Update our score, total lines, and drop rate.
  score += Math.pow(linesRemoved, 2) * 100;
  totalLinesRemoved += linesRemoved;
  updateFramesPerDrop();
}

/**
 * Check if there is a collision between the player's piece at a position on the board, returns true if a collision occurred.
 */
function checkCollision(playerXPosition, playerYPosition, playerRotation) {
  var playerRotatedPiece = pieces[playerPieceIndex][playerRotation];
  for (var x = 0; x < playerRotatedPiece[0].length; x ++) {
    for (var y = 0; y < playerRotatedPiece.length; y ++) {
      var value = playerRotatedPiece[y][x];
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
  for (var x = 0; x < playerPieceRef[0].length; x ++) {
    for (var y = 0; y < playerPieceRef.length; y ++) {
      var value = playerPieceRef[y][x];
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
  var playerRotatedPiece = pieces[playerPieceIndex][playerPieceRotation];
  for (var x = 0; x < playerRotatedPiece[0].length; x ++) {
    for (var y = 0; y < playerRotatedPiece.length; y ++) {
      var value = playerRotatedPiece[y][x];
      if (value > 0 && board[playerYPosition + y][playerXPosition + x] == -1) {
        gameOver = true;
      }
    }
  }
}

/**
 * Draw our statistics around the board.
 */
function drawEachPiece() {
  var y = 0;
  var x = 0;
  // For each piece
  for (var piece = 0; piece < pieces.length; piece ++) {
    // Draw the first rotation of the piece
    var rotatedPiece = pieces[piece][0];
    for (var xIndex = 0; xIndex < rotatedPiece[0].length; xIndex ++) {
      for (var yIndex = 0; yIndex < rotatedPiece.length; yIndex ++) {
        var value = rotatedPiece[yIndex][xIndex];
        if (value > 0) {
          canvas.drawImage(pieceImage, 10 + x + xIndex * 8, 140 + y + yIndex * 8);
        }
      }
    }

    // Display the count for this piece.
    canvas.fillStyle = "white";
    canvas.font = "10px Arial";
    canvas.fillText(""+ pieceCount[piece], 35 + x, 145 + y);

	// Get our next piece's position on the canvas ready.
    y += 40;
    if (y > 150) {
      y = 0;
      x += 150;
    }
  }
}

/**
 * This leftover function is for debugging the array structure of player pieces.
 *
 * This function prints all of the pieces and their rotations on the screen
 * to check for proper array structure.
 */
function drawAllPieces() {
  var y = 0;
  // Grab each piece.
  for (var piece = 0; piece < pieces.length; piece ++) {
    var x = 0;
    // Grab each rotation.
    for (var rotation = 0; rotation < pieces[piece].length; rotation ++) {
      var rotatedPiece = pieces[piece][rotation];
      for (var xIndex = 0; xIndex < rotatedPiece[0].length; xIndex ++) {
        for (var yIndex = 0; yIndex < rotatedPiece.length; yIndex ++) {
          var value = rotatedPiece[yIndex][xIndex];
          if (value > 0) {
            canvas.drawImage(pieceImage, 20 + x + xIndex * 8, 200 + y + yIndex * 8);
          }
        }
      }
      x += 50;
    }
    y += 50;
  }
}