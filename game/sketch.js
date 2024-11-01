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
  pixelDensity(5);
  console.log(width,height,banner.width);

}

function draw() {
  console.log(gameTurn);
  noSmooth();
  //checkPlayerLocation();
  //console.log(round(random(0,2)));
  checkGameState();
  image(background,0,0,width,height);
  drawMap();
  drawPlayers();
  checkGameTurn();
  if (frameCount % 30 === 0) {
    //buffer player movements every 15 frames to 'fake' low framerate (it takes 30 frames to change player positions)
    moveEntities();
  }
}

function checkGameTurn() {
  //player movement turn
  if (gameTurn === 0) {
    checkInput();
  }
  else if (gameTurn === 1) {
    checkPlayerLocation();
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

function changeGameTurn(turnChange) {
  gameTurn = turnChange;
}

function checkPlayerLocation() {
  //enemy looks where player is and attempts to move towards them
  //console.log(distanceX,distanceY);
  let distanceX = enemyX-playerX;
  let distanceY = enemyY-playerY;
  let moveDirectionX;
  let moveDirectionY;
  if (distanceX > 0) {
    console.log("left");
    moveDirectionX = "left";
  }
  if (distanceX < 0) {
    console.log("right");
    moveDirectionX = "right";
  }
  if (distanceX === 0) {
    console.log("center")
    moveDirectionX = "none";
  }
  if (distanceY > 0) {
    console.log("above");
    moveDirectionY = "left";
  }
  if (distanceY < 0) {
    console.log("below");
    moveDirectionY = "right";
  }
  if (distanceY === 0) {
    console.log("center")
    moveDirectionY = "none";
  }
  moveTowardsPlayer(moveDirectionX,moveDirectionY);
}

function moveTowardsPlayer(moveDirectionX,moveDirectionY) {
  if (random(round(0,2)) !== 1) {
    console.log(moveDirectionX)
    //enemy is more likely to move sideways, since map is larger horizontally
    if (moveDirectionX === 'left') {
      console.log("here");
      if (grid[enemyY][enemyX-1] === 0) {
        enemyX--;
        changeGameTurn(2);
      }
    }
    if (moveDirectionX === 'right') {
      console.log("here2");
      if (grid[enemyY][enemyX+1] === 0) {
        enemyX++;
        changeGameTurn(2);
      }
    }
    changeGameTurn(0);
  }
  else {
    console("raer")
    if (moveDirectionY === 'above') {
      console.log("here");
      if (grid[enemyY-1][enemyX] === 0) {
        enemyY--;
        changeGameTurn(2);
      }
    }
    if (moveDirectionY === 'below') {
      console.log("here2");
      if (grid[enemyY+1][enemyX] === 0) {
        enemyY++;
        changeGameTurn(2);
      }
    }
  }
}

function moveEntities() {
  if (playerMoveRequest !== "none" && gameTurn === 0) {
    if (playerMoveRequest === "right") {
      if (grid[playerY][playerX+1] === 0) {
        playerX++;
        playerMoveRequest = "none";
        changeGameTurn(1);
      }
    }
    if (playerMoveRequest === "left") {
      if (grid[playerY][playerX-1] === 0) {
        playerX--;
        playerMoveRequest = "none";
        changeGameTurn(1);
      }
    }
    if (playerMoveRequest === "up") {
      if (grid[playerY-1][playerX] === 0) {
        playerY--;
        playerMoveRequest = "none";
        changeGameTurn(1);
      }
    }
    if (playerMoveRequest === "down") {
      if (grid[playerY+1][playerX] === 0) {
        playerY++;
        playerMoveRequest = "none";
        changeGameTurn(1);
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
        //noSmooth();
        image(tile,x,y,width/16,width/16);
      }
      if (grid[arrayY][arrayX] === 2) {
        //noSmooth();
        image(breakableTile,x,y,width/16,width/16);
      }
    }
  }
}

function drawPlayers() {
  image(cannon,1+playerX*width/16-1,1+playerY*width/16-1,width/16,width/16);
  image(enemyCannon,1+enemyX*width/16-1,1+enemyY*width/16-1,width/16,width/16);
}