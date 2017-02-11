var gameCanvas = document.getElementById('game-main');
var gameCtx = gameCanvas.getContext('2d');
var GAME_WIDTH = gameCanvas.width;
var GAME_HEIGHT = gameCanvas.height;
var ELEMENT_SIZE = 20;


var map = generateMap(Math.floor(GAME_WIDTH / ELEMENT_SIZE), Math.floor(GAME_HEIGHT / ELEMENT_SIZE));
function init() {
  drawMap();
}

function gameLoop() {
  draw();
  update();
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
  // map.forEach(function(row, i) {
  //   row.forEach(function(tile, j) {
  //     console.log(tile, i, j);
  //     // if (tile == 1) {
  //       gameCtx.fillRect(i*ELEMENT_SIZE, j*ELEMENT_SIZE, ELEMENT_SIZE, ELEMENT_SIZE);
  //     // }
  //   });
  // });
}


function generateMap(width, height) {
  var map = new Array(width);
  console.log(map.length);
  for (i = 0; i < width; i++) {
    map[i] = new Array(height);
    console.log(map[i].length);
    for (j = 0; j < height; j++) {
      if (i == 0 || i == width-1 || j == 0 || j == height-1) map[i][j] = 1;
      else map[i][j] = 0;
    }
  }
  return map;
}

init();
