// Project Title
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

let canvas;
const FRAMERATE = 2;

let tile;
let breakableTile;
let background;
let banner;
let cannon;
let enemyCannon;
let gameState = "game1";
let bombs = [];
let playerMoveRequest;

//0 is player's turn, 1 is player aiming, 2 is bot's turn, 3 is bot's aiming
let gameTurn = 0;

let playerHealth = 3;
let enemyHealth = 3;
let playerAmmo = [1,0,0];
let enemyAmmo = [1,0,0];
let bannerX = -1152;
let playerX = 1;
let playerY = 1;
let enemyX = 14;
let enemyY = 9;

// let grid = [[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
//             [1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1],
//             [1,0,1,0,1,1,0,1,1,0,1,1,0,1,0,1],
//             [1,0,1,0,1,0,0,0,0,0,0,1,0,1,0,1],
//             [1,0,0,0,1,0,1,1,1,1,0,1,0,0,0,1],
//             [1,1,1,0,0,0,1,1,1,1,0,0,0,1,1,1],
//             [1,0,0,0,1,0,1,1,1,1,0,1,0,0,0,1],
//             [1,0,1,0,1,0,0,0,0,0,0,1,0,1,0,1],
//             [1,0,1,0,1,1,0,1,1,0,1,1,0,1,0,1],
//             [1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1],
//             [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
//           ];

let grid = [[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[1,0,0,0,2,0,0,1,1,0,0,2,0,0,0,1],[1,0,1,0,1,1,0,1,1,0,1,1,0,1,0,1],[1,0,1,0,1,0,0,0,0,0,0,1,0,1,0,1],[1,0,0,0,1,0,1,1,1,1,0,1,0,0,0,1],[1,2,1,0,0,0,2,0,0,2,0,0,0,1,2,1],[1,0,0,0,1,0,1,1,1,1,0,1,0,0,0,1],[1,0,1,0,1,0,0,0,0,0,0,1,0,1,0,1],[1,0,1,0,1,1,0,1,1,0,1,1,0,1,0,1],[1,0,0,0,2,0,0,1,1,0,0,2,0,0,0,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],];

function preload() {
  tile = loadImage('wall.png');
  breakableTile = loadImage('destroyable_wall.png');
  background = loadImage('background.png');
  banner = loadImage('banner.png');
  cannon = loadImage('player.png');
  enemyCannon = loadImage('enemy.png');
  //bannerX = -banner.width*2;
}

function setup() {
  canvas = createCanvas(windowHeight/3*4, windowHeight);
  //shake left and right when bomb's explosion 'ticks'
  canvas.position((windowWidth-width)/2,0);
  console.log(width,height,banner.width);

}

function draw() {
  //console.log(playerX,playerY,grid[playerY][playerX]);
  noSmooth();
  findPlayerLocation();
  checkGameState();
  checkInput();
  image(background,0,0,width,height);
  drawMap();
  drawPlayers();
  if (frameCount % 30 === 0) {
    moveEntities();
  }
}

function checkGameState() {
  if (gameState === "logo") {
  }
  if (gameState === "menu") {
    moveBanner();
  }
  if (gameState === "game1") {

  }
}

function changeGameState() {

}

function findPlayerLocation() {
  let distanceX = enemyX-playerX;
  let distanceY = enemyY-playerY;
  console.log(distanceX,distanceY);
}

function moveEntities() {
  if (playerMoveRequest !== "none" && gameTurn === 0) {
    if (playerMoveRequest === "right") {
      if (grid[playerY][playerX+1] === 0) {
        playerX++;
        playerMoveRequest = "none";
        changeGameState();
      }
    }
    if (playerMoveRequest === "left") {
      if (grid[playerY][playerX-1] === 0) {
        playerX--;
        playerMoveRequest = "none";
        changeGameState();
      }
    }
    if (playerMoveRequest === "up") {
      if (grid[playerY-1][playerX] === 0) {
        playerY--;
        playerMoveRequest = "none";
        changeGameState();
      }
    }
    if (playerMoveRequest === "down") {
      if (grid[playerY+1][playerX] === 0) {
        playerY++;
        playerMoveRequest = "none";
        changeGameState();
      }
    }
  }
}

function checkInput() {
  if (keyIsPressed) {
    if (keyIsDown(RIGHT_ARROW)) {
      playerMoveRequest = "right";
    };
    if (keyIsDown(LEFT_ARROW)) {
      playerMoveRequest = "left";
    };
    if (keyIsDown(UP_ARROW)) {
      playerMoveRequest = "up";
    };
    if (keyIsDown(DOWN_ARROW)) {
      playerMoveRequest = "down";
    };
  }
}

function moveBanner() {
  image(banner,bannerX,0,width*2,width/16);
  if (frameCount % 30 === 0) {
    if (round(bannerX) === 0) {
      bannerX = -1152;
    }
    bannerX += banner.width/8 + 8;
  }
}

function drawMap() {
  let arrayX = -1;
  let arrayY = -1;
  for (let y = 0; y < height-height/8; y += width/16) {
    arrayX = -1;
    arrayY++;
    for (let x = 0; x < width; x += width/16) {
      arrayX++;
      if (grid[arrayY][arrayX] === 1) {
        noSmooth();
        image(tile,x,y,width/16,width/16);
      }
      if (grid[arrayY][arrayX] === 2) {
        noSmooth();
        image(breakableTile,x,y,width/16,width/16);
      }
    }
  }
}

function drawPlayers() {
  image(cannon,1+playerX*width/16-1,1+playerY*width/16-1,width/16,width/16);
  image(enemyCannon,1+enemyX*width/16-1,1+enemyY*width/16-1,width/16,width/16);
}