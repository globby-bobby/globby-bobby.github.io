// Project Title
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

let canvas;
const FRAMERATE = 2;

let tile;
let background;
let banner;
let cannon;
let gameState = "game1";
let bombs = [];
let playerMoveRequest;

//0 is player's turn, 1 is player aiming, 2 is bot's turn, 3 is bot's aiming
let gameTurn = 0;

let bannerX = -1152;
let playerX = 1;
let playerY = 1;

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

let grid = [[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1],[1,0,1,0,1,1,0,1,1,0,1,1,0,1,0,1],[1,0,1,0,1,0,0,0,0,0,0,1,0,1,0,1],[1,0,0,0,1,0,1,1,1,1,0,1,0,0,0,1],[1,1,1,0,0,0,1,1,1,1,0,0,0,1,1,1],[1,0,0,0,1,0,1,1,1,1,0,1,0,0,0,1],[1,0,1,0,1,0,0,0,0,0,0,1,0,1,0,1],[1,0,1,0,1,1,0,1,1,0,1,1,0,1,0,1],[1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],];

function preload() {
  tile = loadImage('wall.png');
  background = loadImage('background.png');
  banner = loadImage('banner.png');
  cannon = loadImage('player.png');
  //bannerX = -banner.width*2;
}

function setup() {
  canvas = createCanvas(windowHeight/3*4, windowHeight);
  canvas.position((windowWidth-width)/2,0);
  console.log(width,height,banner.width);

}

function draw() {
  noSmooth();
  checkGameState();
  checkInput();
  image(background,0,0,width,height);
  drawMap();
  drawPlayer();
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

function moveEntities() {
  if (playerMoveRequest != "none" && gameTurn === 0) {
    if (playerMoveRequest === "right") {
      playerX++;
      gameTurn++;
      playerMoveRequest = "none";
    }
    if (playerMoveRequest === "left") {
      playerX--;
      gameTurn++;
      playerMoveRequest = "none";
    }
    if (playerMoveRequest === "up") {
      playerY--;
      gameTurn++;
      playerMoveRequest = "none";
    }
    if (playerMoveRequest === "down") {
      playerY++;
      gameTurn++;
      playerMoveRequest = "none";
    }
  }
}

function checkInput() {
  if (keyIsPressed) {
    if (keyIsDown(RIGHT_ARROW)) {
      playerMoveRequest = "right"
    };
    if (keyIsDown(LEFT_ARROW)) {
      playerMoveRequest = "left"
    };
    if (keyIsDown(UP_ARROW)) {
      playerMoveRequest = "up"
    };
    if (keyIsDown(DOWN_ARROW)) {
      playerMoveRequest = "down"
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
    }
  }
}

function drawPlayer() {
  image(cannon,(1+playerX*width/16)-1,(1+playerY*width/16)-1,width/16,width/16);
}