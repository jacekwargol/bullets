// TODO: add inheritance, width and height property for objects


var gameCanvas = document.getElementById('game-main');
var gameCtx = gameCanvas.getContext('2d');
var GAME_WIDTH = gameCanvas.width;
var GAME_HEIGHT = gameCanvas.height;
var ELEMENT_SIZE = 20;

window.addEventListener('mousemove', playerRotate);
window.addEventListener('click', playerShoot);

var map = generateMap(Math.floor(GAME_WIDTH / ELEMENT_SIZE), Math.floor(GAME_HEIGHT / ELEMENT_SIZE));
for(var i = 0; i < 29; i++) {
  map[5][i] = 1;
}


var enemies = [];
var maxNoEnemies = 2;
spawnEnemies(maxNoEnemies);

var bullets = [];


function gameLoop() {
  gameCtx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
  drawMap();
  if (player.alive) {
    handlePlayer();
    if (enemies.length == 0) {
      bullets = [];
      spawnEnemies(maxNoEnemies += 1);
    }
    handleEnemies();
    handleBullets();
  }
  else {
    drawGameOverScreen();
  }
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
  alive: true,
  x: 50,
  y: 50,
  speed: 10,
  dirX: 0, // -1 for left, 1 for right, 0 if not moving
  dirY: 0, // -1 for down, 1 for up
  rotation: 0,
  draw: function() {
    gameCtx.save();
    gameCtx.translate(this.x + ELEMENT_SIZE/2, this.y + ELEMENT_SIZE/2);
    gameCtx.rotate(this.rotation);
    gameCtx.fillStyle = 'black';
    gameCtx.fillRect(-ELEMENT_SIZE/2, -ELEMENT_SIZE/2+15, 30, 5);
    gameCtx.fillStyle = 'blue';
    gameCtx.fillRect(-ELEMENT_SIZE/2, -ELEMENT_SIZE/2, ELEMENT_SIZE, ELEMENT_SIZE);
    gameCtx.restore();
  },
  move: function() {
    var newX = this.x + this.speed * this.dirX;
    var newY = this.y + this.speed * this.dirY;
    if (borderCollision(newX, newY)) return;

    this.x = newX;
    this.y = newY;
  }
}

function playerRotate(e) {
  var pos = getMousePos(e);
  var posX = pos.x;
  var posY = pos.y;
  var angle = Math.atan2(posY - player.y, posX - player.x);
  player.rotation = angle;
}

function playerShoot(e) {
  bullets.push(spawnBullet(e));
}

function playerControls() {
  $(document).keydown(function(key) {
      switch (key.which) {
        case 37: // left arrow
        case 65: // a key
          player.dirX = -1;
          break;
        case 39: // right arrow
        case 68: // d key
          player.dirX = 1;
          break;
        case 38: // up arrow
        case 87: // w key
          player.dirY = -1;
          break;
        case 40: // down arrow
        case 83: // s key
          player.dirY = 1;
          break;
        default: return;
      }
    key.preventDefault();
  });

    $(document).keyup(function(key) {
      if (key.which == 37 || key.which == 39 || key.which == 65 || key.which == 68) {
        player.dirX = 0;
      }
      if (key.which == 38 || key.which == 40 || key.which == 87 || key.which == 83) {
        player.dirY = 0;
      }
    });
}

function handlePlayer() {
  player.draw();
  player.move();
  playerControls();
  playerEnemyOrBulletCollision();
}


function Bullet(x, y, velX, velY) {
  this.color = 'orange';
  this.x = x;
  this.y = y;
  this.speed = 15;
  this.velX = velX * this.speed;
  this.velY = velY * this.speed;
}
Bullet.prototype.draw = function() {
  gameCtx.save();
  gameCtx.fillStyle = 'orange';
  gameCtx.fillRect(this.x, this.y, 7, 7);
  gameCtx.restore();
}
Bullet.prototype.move = function() {
  var newX = this.x + this.velX;
  var newY = this.y + this.velY;
  if (borderCollision(newX, newY)) {
    this.velX *= -1;
    this.velY *= -1;
  }
  this.x = newX;
  this.y = newY;
}

function spawnBullet(e) {
  var dx = e.x - player.x;
  var dy = e.y - player.y;
  var mag = Math.sqrt(dx*dx + dy*dy);
  var velX = dx / mag;
  var velY = dy / mag;
  return new Bullet(player.x + 30, player.y+20, velX, velY);
}

function handleBullets() {
  bullets.forEach(function(bullet) {
    bullet.draw();
    bullet.move();
  });
}


function Enemy(x, y, dirX, dirY) {
  this.color =  'red';
  this.x = x;
  this.y = y;
  this.speed = 10;
  this.dirX = dirX;
  this.dirY = dirY;
}
Enemy.prototype.draw = function() {
    gameCtx.fillStyle = this.color;
    gameCtx.fillRect(this.x, this.y, ELEMENT_SIZE, ELEMENT_SIZE);
}
Enemy.prototype.move = function() {
    var newX = this.x + this.speed * this.dirX;
    var newY = this.y + this.speed * this.dirY;
    if (borderCollision(newX, newY)) {
      this.dirX *= -1;
      this.dirY *= -1;
    }
    this.x = newX;
    this.y = newY;
}

function generateEnemy() {
  var x = Math.floor(Math.random() * GAME_WIDTH - 30) + 30;
  var y = Math.floor(Math.random() * GAME_HEIGHT - 30) + 30;

  var directions = [-1, 0, 1];
  var dirX = randomChoice(directions);
  var dirY = randomChoice(directions);
  return new Enemy(x, y, dirX, dirY);
}

function spawnEnemies(noEnemies) {
  for(i = 0; i < noEnemies; i++) {
    enemies.push(generateEnemy());
  }
}

function handleEnemies() {
  enemies.forEach(function(enemy) {
    enemy.draw();
    enemy.move();
  });
  enemyBulletCollision();
}



function playerEnemyOrBulletCollision() {
  enemies.forEach(function(enemy) {
    if (objectCollision(player, enemy, ELEMENT_SIZE, ELEMENT_SIZE)) {
      player.alive = false;
    }
  });
  bullets.forEach(function(bullet) {
    if (objectCollision(player, bullet, ELEMENT_SIZE, 7)) {
      player.alive = false;
    }
  });
}
function enemyBulletCollision() {
  enemies.forEach(function(enemy, i) {
    bullets.forEach(function(bullet, j) {
      if (objectCollision(enemy, bullet, ELEMENT_SIZE, 7)) {
        enemies.splice(i, 1);
        bullets.splice(j, 1);
      }
    });
  });
}
function objectCollision(a, b, sizeA, sizeB) {
  return a.x < b.x + sizeB &&
a.x + sizeA > b.x &&
a.y < b.y + sizeB &&
a.y + sizeA > b.y
}
function borderCollision(x, y) {
  if (x < 0 ||
        x >= GAME_WIDTH ||
        y < 0 ||
        y >= GAME_HEIGHT) {
          return true;
        }
  return map[Math.floor(x/ELEMENT_SIZE)][Math.floor(y/ELEMENT_SIZE)] != 0;
}


function getMousePos(e) {
  var rect = gameCanvas.getBoundingClientRect();
  return {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top
  };
}


function randomChoice(choices) {
  return choices[Math.floor(Math.random() * choices.length)];
}


function drawGameOverScreen() {
  gameCtx.save();
  gameCtx.fillStyle = 'black';
  gameCtx.font = '70px Comic Sans';
  gameCtx.fillText("Game Over", 300, 200);
  gameCtx.restore();
}


gameLoop();
