var gameCanvas = document.getElementById('game-main');
var gameCtx = gameCanvas.getContext('2d');
var GAME_WIDTH = gameCanvas.width;
var GAME_HEIGHT = gameCanvas.height;
var ELEMENT_SIZE = 20;


var map = generateMap(Math.floor(GAME_WIDTH / ELEMENT_SIZE), Math.floor(GAME_HEIGHT / ELEMENT_SIZE));


function gameLoop() {
  gameCtx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
  drawMap();
  player.draw();
  player.move();
  playerControls();
  setTimeout(gameLoop, 1000 / 30); // 30 FPS
}


function drawMap() {
  gameCtx.fillStyle = 'black';
  for (i = 0; i < map.length; i++) {
    for (j = 0; j < map[0].length; j ++) {
      if (map[i][j] == 1) {
        gameCtx.fillRect(i*ELEMENT_SIZE, j*ELEMENT_SIZE, ELEMENT_SIZE, ELEMENT_SIZE);
      }
    }
  }
}


function generateMap(width, height) {
  var map = new Array(width);
  for (i = 0; i < width; i++) {
    map[i] = new Array(height);
    for (j = 0; j < height; j++) {
      if (i == 0 || i == width-1 || j == 0 || j == height-1) map[i][j] = 1;
      else map[i][j] = 0;
    }
  }
  return map;
}


var player = {
  posX: 50,
  posY: 50,
  speed: 10,
  dirX: 0, // -1 for left, 1 for right, 0 if not moving
  dirY: 0, // -1 for down, 1 for up
  draw: function() {
    gameCtx.fillStyle = 'blue';
    gameCtx.fillRect(this.posX, this.posY, ELEMENT_SIZE, ELEMENT_SIZE);
  },
  move: function() {
    var newX = this.posX + this.speed * this.dirX;
    var newY = this.posY + this.speed * this.dirY;
    if (collision(newX, newY)) return;

    this.posX = newX;
    this.posY = newY;
  }
}

function playerControls() {
  $(document).keydown(function(key) {
      switch (key.which) {
        case 37: //left
          player.dirX = -1;
          break;
        case 39: //right
          player.dirX = 1;
          break;
        case 38: // up
          player.dirY = -1;
          break;
        case 40: // down
          player.dirY = 1;
          break;
        default: return;
      }
    key.preventDefault();
  });

    $(document).keyup(function(key) {
      if (key.which == 37 || key.which == 39) player.dirX = 0;
      if (key.which == 38 || key.which == 40) player.dirY = 0;
    });
}


function collision(x, y) {
  if (x < 0 ||
        x >= GAME_WIDTH ||
        y < 0 ||
        y >= GAME_HEIGHT) {
          return true;
        }
  return map[Math.floor(x/ELEMENT_SIZE)][Math.floor(y/ELEMENT_SIZE)] != 0;

}


gameLoop();
