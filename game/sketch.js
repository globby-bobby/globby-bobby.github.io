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
let enemyMovementDirection;

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
let enemyMovements;
let enemyMoveMode = 'default';
let enemyTurnsUntiSwitch = 5;

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
  noSmooth();
  //checkPlayerLocation();
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
  //processes what functions need to be run during what turn
  //turn 0 is player movement, 1 is player shooting, 2 is enemy movement, 3 is enemy shooting
  //player movement turn
  if (gameTurn === 0) {
    checkInput();
  }
  //enemy movement turn
  else if (gameTurn === 1) {
    checkPlayerLocation();
  }
  else if (gameTurn === 2) {
    gameTurn = 0;
  }
}

function checkGameState() {
  //checks the game state, not turn state, runs functions for things like moving the banner and displaying the world
  if (gameState === "logo") {
  }
  if (gameState === "menu") {
    moveBanner();
  }
  if (gameState === "game1") {

  }
}

function changeGameTurn(turnChange) {
  //changes turn to turnChange although turns should always just be increasing by one
  if (turnChange === 2) {
    enemyTurnsUntiSwitch++;
  }
  gameTurn = turnChange;
}

function checkPlayerLocation() {
  //enemy looks where player is and attempts to move towards them
  //console.log(distanceX,distanceY);
  let distanceX = enemyX-playerX;
  let distanceY = enemyY-playerY;
  let moveDirectionX;
  let moveDirectionY;
  enemyMovements = 0;
  if (distanceX > 0) {
    //console.log("left");
    moveDirectionX = "left";
  }
  if (distanceX < 0) {
    //console.log("right");
    moveDirectionX = "right";
  }
  if (distanceX === 0) {
    //console.log("center");
    moveDirectionX = "none";
  }
  if (distanceY > 0) {
    //console.log("above");
    moveDirectionY = "above";
  }
  if (distanceY < 0) {
    //console.log("below");
    moveDirectionY = "below";
  }
  if (distanceY === 0) {
    //console.log("center");
    moveDirectionY = "none";
  }
  moveTowardsPlayer2(moveDirectionX,moveDirectionY);
  //moveTowardsPlayer(moveDirectionX,moveDirectionY,'none',enemyMoveMode);
}

function moveTowardsPlayer2(moveDirectionX,moveDirectionY,mode) {
  //stem theoretical path off of enemy position
  //add node when changing directions
  //move towards player until stuck, return to last node with a different direction
  //return to last node if node exhausts all directions
  let originNeighborSpaces = positionCheckOpenTiles(enemyX,enemyY);
  let originNode = {
    x: enemyX,
    y: enemyY,
    N: originNeighborSpaces[0],
    E: originNeighborSpaces[1],
    S: originNeighborSpaces[2],
    W: originNeighborSpaces[3],
  };
  let nodeDirection = returnRandomDirection(originNode);
  let pathfindingTileList = [];
  let pathfindingNodeList = [originNode];
  console.log(originNode, nodeDirection);

}

function returnRandomDirection(node) {
  let openSpaceArray =[];
  //if space is open, add that direction to openSpaceArray in a random position
  if (node.N === true) {
    openSpaceArray.splice((openSpaceArray.length+1) * Math.random() | 0, 0, "north");
  }
  if (node.E === true) {
    openSpaceArray.splice((openSpaceArray.length+1) * Math.random() | 0, 0, "east");
  }
  if (node.S === true) {
    openSpaceArray.splice((openSpaceArray.length+1) * Math.random() | 0, 0, "south");
  }
  if (node.W === true) {
    openSpaceArray.splice((openSpaceArray.length+1) * Math.random() | 0, 0, "west");
  }
  //return the first direction in the list, which is random
  return openSpaceArray[0];
}

function positionCheckOpenTiles(x,y) {
  //return an array that checks what directions have an open space around the enemy
  let leftOpen = false;
  let rightOpen = false;
  let upOpen = false;
  let downOpen = false;
  //check right
  if (grid[y][x+1] === 0) {
    rightOpen = true;
  }
  // check left
  if (grid[y][x-1] === 0) {
    leftOpen = true;
  }
  //check above
  if (grid[y-1][x] === 0) {
    upOpen = true;
  }
  //check below
  if (grid[y+1][x] === 0) {
    downOpen = true;
  }
  let directionList = [upOpen,rightOpen,downOpen,leftOpen];
  //return directions in order of north,east,south,west
  return directionList;
}

function moveTowardsPlayer(moveDirectionX,moveDirectionY,preference,mode) {
  enemyMovements++;
  console.log(enemyMovements);
  if (enemyMovements === 5) {
    //if enemy gets stuck, move randomly (lazy solution)
    moveTowardsPlayer(moveDirectionX,moveDirectionY,'random');
  }
  // if (enemyMoveMode === 'default');
  if (round(random(0,1)) !== 1 || preference === 'horizontal') {
    //console.log(moveDirectionX);
    if (moveDirectionX === 'left') {
      console.log('left');
      if (grid[enemyY][enemyX-1] === 0) {
        enemyX--;
        changeGameTurn(2);
      }
      else {
        moveTowardsPlayer(moveDirectionX,moveDirectionY,'vertical');
      }
    }
    if (moveDirectionX === 'right') {
      console.log('right');
      if (grid[enemyY][enemyX+1] === 0) {
        enemyX++;
        changeGameTurn(2);
      }
      else {
        moveTowardsPlayer(moveDirectionX,moveDirectionY,'vertical');
      }
    }
    if (moveDirectionX === 'center') {
      //if on the same X level as player, retry function with a prefrence of moving horizontally
      //this actually works, even though I thought it would stick the enemy in a loop of never moving
      console.log('retry X');
      moveTowardsPlayer(moveDirectionX,moveDirectionY,'horizontal');
    }
    //changeGameTurn(0);
  }
  else if (preference === 'random' || round(random(0,16)) === 16) {
    let randomEnemyMoveDirection = round(random(0,3));
    if (randomEnemyMoveDirection === 0) {
      if (grid[enemyY][enemyX-1] === 0) {
        enemyX--;
        changeGameTurn(2);
      }
      else {
        moveTowardsPlayer(moveDirectionX,moveDirectionY,'random');
      }
    }
    if (randomEnemyMoveDirection === 1) {
      if (grid[enemyY][enemyX+1] === 0) {
        enemyX++;
        changeGameTurn(2);
      }
      else {
        moveTowardsPlayer(moveDirectionX,moveDirectionY,'random');
      }
    }
    if (randomEnemyMoveDirection === 2) {
      if (grid[enemyY-1][enemyX] === 0) {
        enemyY--;
        changeGameTurn(2);
      }
      else {
        moveTowardsPlayer(moveDirectionX,moveDirectionY,'random');
      }
      if (randomEnemyMoveDirection === 2) {
        if (grid[enemyY+1][enemyX] === 0) {
          enemyY++;
          changeGameTurn(2);
        }
        else {
          moveTowardsPlayer(moveDirectionX,moveDirectionY,'random');
        }
      }
    }
  }
  else {
    if (moveDirectionY === 'above') {
      console.log('up');
      if (grid[enemyY-1][enemyX] === 0) {
        enemyY--;
        changeGameTurn(2);
      }
      else {
        if (enemyMovements > 4) {
          if (grid[enemyY+1][enemyX] === 0) {
            enemyY++;
            changeGameTurn(2);
          }
        }
        moveTowardsPlayer(moveDirectionX,moveDirectionY,'horizontal');
      }
    }
    if (moveDirectionY === 'below') {
      console.log('down');
      if (grid[enemyY+1][enemyX] === 0) {
        enemyY++;
        changeGameTurn(2);
      }
      else {
        moveTowardsPlayer(moveDirectionX,moveDirectionY,'horizontal');
      }
      if (moveDirectionY === 'center') {
        //if on the same Y level as player, retry function with a prefrence of moving vertically
        console.log('retry Y');
        moveTowardsPlayer(moveDirectionX,moveDirectionY,'vertical');
      }
    }
    //changeGameTurn(0);
  }
}

function moveEntities() {
  //if successful, move the player and end their turn
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
  //check the input for the player
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
  //move the banner one tile over and reset it when it moves far enough
  image(banner,bannerX,0,width*2,width/16);
  if (frameCount % 30 === 0) {
    if (round(bannerX) === 0) {
      bannerX = -1152;
    }
    bannerX += banner.width/8 + 8;
  }
}

function drawMap() {
  //draw the square tiles around the map and shove them in a list
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
  //draw the cannon characters using weird specific numbers that somehow work
  image(cannon,1+playerX*width/16-1,1+playerY*width/16-1,width/16,width/16);
  image(enemyCannon,1+enemyX*width/16-1,1+enemyY*width/16-1,width/16,width/16);
}