// Project Title
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

let canvas;
const FRAMERATE = 2;

let debug = false;
const pathfindingTurnRandom = true;

let tile;
let breakableTile;
let background;
let banner;
let cannon;
let enemyCannon;
let bomb;
let nuke;
let aimImage;
let gameState = "game1";
let bombs = [];
let playerMoveRequest;
let enemyMovementDirection;

//0 is player's turn, 1 is player aiming, 2 is enemy's turn, 3 is enemy's aiming
let gameTurn = 0;

let playerHealth = 3;
let enemyHealth = 3;
let playerAmmo = [1,1,2];
let enemyAmmo = [1,0,0];
let isPlayerStats = true;
let bannerX = -1152;
let playerX = 1;
let playerY = 1;
//enemy starts at 14,9
let enemyX = 14;
let enemyY = 9;
let aimDirection = 'east';
let aimSquareVisible;
let enemyMovements;
let enemyMoveMode = 'default';

let pathfindingTileList = [];
let pathfindingNodeList = [];

// let grid = [[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
//           ];
//test grid that is completely empty
//let grid = [[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]];
//0 is open space, 1 is wall, 2 is destructable wall
let grid = [[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[1,0,0,0,2,0,0,1,1,0,0,2,0,0,0,1],[1,0,1,0,1,1,0,1,1,0,1,1,0,1,0,1],[1,0,1,0,1,0,0,0,0,0,0,1,0,1,0,1],[1,0,0,0,1,0,1,1,1,1,0,1,0,0,0,1],[1,2,1,0,0,0,2,0,0,2,0,0,0,1,2,1],[1,0,0,0,1,0,1,1,1,1,0,1,0,0,0,1],[1,0,1,0,1,0,0,0,0,0,0,1,0,1,0,1],[1,0,1,0,1,1,0,1,1,0,1,1,0,1,0,1],[1,0,0,0,2,0,0,1,1,0,0,2,0,0,0,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],];

function preload() {
  tile = loadImage('wall.png');
  breakableTile = loadImage('destroyable_wall.png');
  background = loadImage('background.png');
  banner = loadImage('banner.png');
  cannon = loadImage('player.png');
  enemyCannon = loadImage('enemy.png');
  bomb = loadImage('bomb.png');
  nuke = loadImage('nuke.png');
  aimImage = loadImage('aim.png');
  //bannerX = -banner.width*0;
}

function setup() {
  canvas = createCanvas(windowHeight/3*4, windowHeight);
  //shake left and right when bomb's explosion 'ticks'
  canvas.position((windowWidth-width)/2,0);
  pixelDensity(5);
  console.log("Window Size:",width,height);

}

function draw() {
  noSmooth();
  //checkPlayerLocation();
  if (!debug) {
    image(background,0,0,width,height);
  }
  else {
    //remove background to show pathfinding clearer
    fill(100);
    rect(0,0,width,height);
    drawPathfindingTiles();
  }
  drawMap();
  drawPlayers();
  checkGameState();
  checkGameTurn();
  if (frameCount % 30 === 0) {
    //buffer player movements every 15 frames to 'fake' low framerate (it takes 30 frames to change player positions)
    moveEntities();
  }
  if (gameTurn === 1) {
    drawAimSquare();
  }
}

function checkGameTurn() {
  //processes what functions need to be run during what turn
  //turn 0 is player movement, 1 is player shooting, 2 is enemy movement, 3 is enemy shooting
  //player movement turn
  if (gameTurn === 0) {
    checkInput();
    isPlayerStats = true;
  }
  //enemy movement turn
  else if (gameTurn === 1) {
    checkInput();
  }
  else if (gameTurn === 2) {
    moveBombs();
  }
  else if (gameTurn === 3) {
    checkPlayerLocation();
    isPlayerStats = false;
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
    drawHealth();
    drawAmmo();
  }
}

function changeGameTurn(turnChange) {
  //changes turn to turnChange although turns should always just be increasing by one
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
  initMoveTowardsPlayer();
  //moveTowardsPlayer(moveDirectionX,moveDirectionY,'none',enemyMoveMode);
}

function initMoveTowardsPlayer() {
  //pathfinding does not function as i wanted it to, it's very lazy and moves randomly every chance it gets
  //but it does cover every single place possible eventually, so it works to find the player's location
  //the orange square at the center of the enemy is the only 'node', which were intended to be checkpoints where the pathfinding
  //can search multiple directions, and the yellow squares, or 'tiles' would move straight until more than 1 direction is open
  //I could have made this work but I wrote it lazily and would need to redo it and I don't have the time for that
  let originNeighborSpaces = fromPositionCheckOpenTiles(enemyX,enemyY);
  let originNode = {
    x: enemyX,
    y: enemyY,
    N: originNeighborSpaces[0],
    E: originNeighborSpaces[1],
    S: originNeighborSpaces[2],
    W: originNeighborSpaces[3],
  };
  let nodeDirection = returnRandomDirection(originNode);
  pathfindingTileList = [];
  pathfindingNodeList = [originNode];
  //pathfinding tiles nodes are sorted left to right based on order of first to last
  //console.log(originNode, nodeDirection, directionsToNumber(originNode));
  if (dist(playerX,playerY,enemyX,enemyY) > 1) {
    moveTowardsPlayer(nodeDirection,pathfindingNodeList[0],false,false);
  }
}

function moveTowardsPlayer(nodeDirection,currentTile,pathingTileIsNode,firstNode) {
  //pathingTileIsNode is true if current tile is an orange node, a checkpoint where the pathfinding checks all four directions
  let tileOpenDirections = fromPositionCheckOpenTiles(currentTile.x,currentTile.y,true);
  //if enemy found player
  if (playerX === currentTile.x && playerY === currentTile.y && (pathfindingTileList.length < round(dist(playerX,playerY,enemyX,enemyY)) + 25 || dist(playerX,playerY,enemyX,enemyY) > 7)) {
    enemyX = pathfindingTileList[0].x;
    enemyY = pathfindingTileList[0].y;
    changeGameTurn(3);
    return;
  }
  //to prevent crashing limit the amount of tiles (lazy fix)
  if (pathfindingTileList.length < 100) {
    if (!tileOpenDirections[0] && nodeDirection === "north") {
      let originNeighborSpaces = fromPositionCheckOpenTiles(currentTile.x,currentTile.y,true);
      let node = {
        x: currentTile.x,
        y: currentTile.y,
        N: originNeighborSpaces[0],
        E: originNeighborSpaces[1],
        S: originNeighborSpaces[2],
        W: originNeighborSpaces[3],
      };
      pathfindingTileList.pop();
      pathfindingNodeList.push(node);
      moveTowardsPlayer(returnRandomDirection(node),node,false,false);
    }
    if (!tileOpenDirections[1] && nodeDirection === "east") {
      let originNeighborSpaces = fromPositionCheckOpenTiles(currentTile.x,currentTile.y,true);
      let node = {
        x: currentTile.x,
        y: currentTile.y,
        N: originNeighborSpaces[0],
        E: originNeighborSpaces[1],
        S: originNeighborSpaces[2],
        W: originNeighborSpaces[3],
      };
      pathfindingTileList.pop();
      pathfindingNodeList.push(node);
      moveTowardsPlayer(returnRandomDirection(node),node,false,false);
    }
    if (!tileOpenDirections[2] && nodeDirection === "south") {
      let originNeighborSpaces = fromPositionCheckOpenTiles(currentTile.x,currentTile.y,true);
      let node = {
        x: currentTile.x,
        y: currentTile.y,
        N: originNeighborSpaces[0],
        E: originNeighborSpaces[1],
        S: originNeighborSpaces[2],
        W: originNeighborSpaces[3],
      };
      pathfindingTileList.pop();
      pathfindingNodeList.push(node);
      moveTowardsPlayer(returnRandomDirection(node),node,false,false);
    }
    if (!tileOpenDirections[3] && nodeDirection === "west") {
      let originNeighborSpaces = fromPositionCheckOpenTiles(currentTile.x,currentTile.y,true);
      let node = {
        x: currentTile.x,
        y: currentTile.y,
        N: originNeighborSpaces[0],
        E: originNeighborSpaces[1],
        S: originNeighborSpaces[2],
        W: originNeighborSpaces[3],
      };
      pathfindingTileList.pop();
      pathfindingNodeList.push(node);
      moveTowardsPlayer(returnRandomDirection(node),node,false,false);
    }
  }
  if (!pathingTileIsNode && pathfindingTileList.length < 100) {
    //console.log(tileDirectionNumber);
    //if current tile is NOT a checkpoint node
    if (nodeDirection === 'north' && grid[currentTile.y-1][currentTile.x] === 0) {
      for (let tile in pathfindingTileList) {
        tile = pathfindingTileList[tile];
        if (currentTile.y-1 === tile.y) {
          break;
        }
      }
      let originNeighborSpaces = fromPositionCheckOpenTiles(currentTile.x,currentTile.y-1,true);
      let node = {
        x: currentTile.x,
        y: currentTile.y-1,
        N: originNeighborSpaces[0],
        E: originNeighborSpaces[1],
        S: originNeighborSpaces[2],
        W: originNeighborSpaces[3],
      };
      pathfindingTileList.push(node);
      moveTowardsPlayer(returnRandomDirection(node),node, false);
      //console.log(pathfindingTileList[0]);
    }
    if (nodeDirection === 'south' && grid[currentTile.y+1][currentTile.x] === 0) {
      for (let tile in pathfindingTileList) {
        tile = pathfindingTileList[tile];
        if (currentTile.y+1 === tile.y) {
          break;
        }
      }
      let originNeighborSpaces = fromPositionCheckOpenTiles(currentTile.x,currentTile.y+1,true);
      let node = {
        x: currentTile.x,
        y: currentTile.y+1,
        N: originNeighborSpaces[0],
        E: originNeighborSpaces[1],
        S: originNeighborSpaces[2],
        W: originNeighborSpaces[3],
      };
      pathfindingTileList.push(node);
      moveTowardsPlayer(returnRandomDirection(node),node, false);
      //console.log(pathfindingTileList[0]);
    }
    if (nodeDirection === 'east' && grid[currentTile.y][currentTile.x+1] === 0) {
      for (let tile in pathfindingTileList) {
        tile = pathfindingTileList[tile];
        if (currentTile.x+1 === tile.y) {
          break;
        }
      }
      let originNeighborSpaces = fromPositionCheckOpenTiles(currentTile.x+1,currentTile.y,true);
      let node = {
        x: currentTile.x+1,
        y: currentTile.y,
        N: originNeighborSpaces[0],
        E: originNeighborSpaces[1],
        S: originNeighborSpaces[2],
        W: originNeighborSpaces[3],
      };
      pathfindingTileList.push(node);
      moveTowardsPlayer(returnRandomDirection(node),node, false);
      //console.log(pathfindingTileList[0]);
    }
    if (nodeDirection === 'west' && grid[currentTile.y][currentTile.x-1] === 0) {
      for (let tile in pathfindingTileList) {
        tile = pathfindingTileList[tile];
        if (currentTile.x-1 === tile.y) {
          break;
        }
      }
      let originNeighborSpaces = fromPositionCheckOpenTiles(currentTile.x-1,currentTile.y,true);
      let node = {
        x: currentTile.x-1,
        y: currentTile.y,
        N: originNeighborSpaces[0],
        E: originNeighborSpaces[1],
        S: originNeighborSpaces[2],
        W: originNeighborSpaces[3],
      };
      pathfindingTileList.push(node);
      moveTowardsPlayer(returnRandomDirection(node),node, false);
      //console.log(pathfindingTileList[0]);
    }
  }
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

function directionsToNumber(node) {
  //returns a number from 0 to 4 depending on how many open directions are found
  let directionCount = 0;
  //add 1 to directionCount if space is open
  if (node.N === true) {
    directionCount++;
  }
  if (node.E === true) {
    directionCount++;
  }
  if (node.S === true) {
    directionCount++;
  }
  if (node.W === true) {
    directionCount++;
  }
  return directionCount;
}

function fromPositionCheckOpenTiles(x,y,checkNearbyNodes) {
  checkNearbyNodes = false;
  //true = open
  //return an array that checks what directions have an open space around the enemy
  let leftOpen = false;
  let rightOpen = false;
  let upOpen = false;
  let downOpen = false;
  //check right
  if (grid[y][x+1] === 0) {
    rightOpen = true;
  }
  //if checkNearbyNodes is true, count nodes as closed tiles that can't be moved to
  if (checkNearbyNodes) {
    // for (let node in pathfindingNodeList) {
    //   node = pathfindingNodeList[node];
    //   if (node.x === x+1) {
    //     rightOpen = false;
    //     //console.log("right blocked node");
    //     break;
    //   }
    // }
    for (let node in pathfindingTileList) {
      node = pathfindingTileList[node];
      if (node.x === x+1) {
        rightOpen = false;
        //console.log("left blocked tile");
      }
    }
  }
  // check left
  if (grid[y][x-1] === 0) {
    leftOpen = true;
  }
  if (checkNearbyNodes) {
    // for (let node in pathfindingNodeList) {
    //   node = pathfindingNodeList[node];
    //   if (node.x === x-1) {
    //     leftOpen = false;
    //     //console.log("left blocked node");
    //     break;
    //   }
    // }
    for (let node in pathfindingTileList) {
      node = pathfindingTileList[node];
      if (node.x === x-1) {
        leftOpen = false;
        //console.log("right blocked tile");
      }
    }
  }
  //check above
  if (grid[y-1][x] === 0) {
    upOpen = true;
  }
  if (checkNearbyNodes) {
    // for (let node in pathfindingNodeList) {
    //   node = pathfindingNodeList[node];
    //   if (node.y === y-1) {
    //     upOpen = false;
    //     break;
    //   }
    // }
    for (let node in pathfindingTileList) {
      node = pathfindingTileList[node];
      if (node.y === y-1) {
        upOpen = false;
      }
    }
  }
  //check below
  if (grid[y+1][x] === 0) {
    downOpen = true;
  }
  if (checkNearbyNodes) {
    // for (let node in pathfindingNodeList) {
    //   node = pathfindingNodeList[node];
    //   if (node.y === y+1) {
    //     downOpen = false;
    //     break;
    //   }
    // }
    for (let node in pathfindingTileList) {
      node = pathfindingTileList[node];
      if (node.y === y+1) {
        downOpen = false;
      }
    }
  }
  let directionList = [upOpen,rightOpen,downOpen,leftOpen];
  //return directions in order of north,east,south,west 
  return directionList;
}

function drawPathfindingTiles() {
  //draw pathing tiles, orange are checkpoint nodes, yellow are straight lines of tiles
  //they are transparent because I noticed the tiles could spawn on top of eachother, making them transparent shows how many tiles overlap
  for (let node in pathfindingNodeList) {
    node = pathfindingNodeList[node];
    fill(255,115,0,100);
    noStroke();
    square(1+node.x*width/16-1,1+node.y*width/16-1,width/16);
  }
  for (let tile in pathfindingTileList) {
    tile = pathfindingTileList[tile];
    //console.log(tile);
    fill(225,225,0,70);
    noStroke();
    square(1+tile.x*width/16-1,1+tile.y*width/16-1,width/16);
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
  if (keyIsPressed && gameTurn === 0) {
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
  if (keyIsPressed && gameTurn === 1) {
    if (keyIsDown(RIGHT_ARROW) && aimDirection !== 'east') {
      aimDirection = 'east';
      aimSquareVisible = true;
    };
    if (keyIsDown(LEFT_ARROW) && aimDirection !== 'west') {
      aimDirection = 'west';
      aimSquareVisible = true;
    };
    if (keyIsDown(UP_ARROW) && aimDirection !== 'north') {
      aimDirection = 'north';
      aimSquareVisible = true;
    };
    if (keyIsDown(DOWN_ARROW) && aimDirection !== 'south') {
      aimDirection = 'south';
      aimSquareVisible = true;
    };
    if (keyIsDown(ENTER)) {
      spawnBomb(aimDirection, true);
      changeGameTurn(2);
    };
  }
}

function spawnBomb(bombMoveDirection, isPlayerBomb) {
  console.log('bomb');
  let bombType;
  if (isPlayerBomb) {
    //bomb type 0 is bomb, bomb type 1 is nuke
    if (playerAmmo[0] === 1) {
      bombType = 0
    }
    if (playerAmmo[0] === 2) {
      bombType = 1
    }
    let bomb = {
      x: playerX,
      y: playerY,
      bombMoveDirection: bombMoveDirection,
      type: 0
    };
    bombs.push(bomb);
  }
}

function moveBombs() {
  for (let bomb in bombs) {
    bomb = bombs[bomb];
    if (bomb.bombMoveDirection === 'north') {
      if (grid[bomb.y+1][bomb.x] === 0) {
        
        bomb.y++;
        playerMoveRequest = "none";
        changeGameTurn(1);
      }
    }
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

function drawHealth() {
  //draw cannons at bottom on screen based on player health
  if (playerHealth === 1) {
    image(cannon,1+6*width/16-1,1+11*width/16-1,width/16,width/16);
  }
  if (playerHealth === 2) {
    image(cannon,1+6*width/16-1,1+11*width/16-1,width/16,width/16);
    image(cannon,1+7*width/16-1,1+11*width/16-1,width/16,width/16);
  }
  if (playerHealth === 3) {
    image(cannon,1+6*width/16-1,1+11*width/16-1,width/16,width/16);
    image(cannon,1+7*width/16-1,1+11*width/16-1,width/16,width/16);
    image(cannon,1+8*width/16-1,1+11*width/16-1,width/16,width/16);
  }
}

function drawAmmo() {
  //draw bombs at bottom on screen based on player ammo count
  if (playerAmmo[0] === 1) {
    image(bomb,1+13*width/16-1,1+11*width/16-1,width/16,width/16);
  }
  if (playerAmmo[1] === 1) {
    image(bomb,1+14*width/16-1,1+11*width/16-1,width/16,width/16);
  }
  if (playerAmmo[2] === 1) {
    image(bomb,1+15*width/16-1,1+11*width/16-1,width/16,width/16);
  }

  if (playerAmmo[0] === 2) {
    image(nuke,1+13*width/16-1,1+11*width/16-1,width/16,width/16);
  }
  if (playerAmmo[1] === 2) {
    image(nuke,1+14*width/16-1,1+11*width/16-1,width/16,width/16);
  }
  if (playerAmmo[2] === 2) {
    image(nuke,1+15*width/16-1,1+11*width/16-1,width/16,width/16);
  }
}

function drawAimSquare() {
  if (frameCount % 20  === 0) {
    aimSquareVisible = !aimSquareVisible;
    noStroke();
    fill(255,110,0);
  }
  if (aimSquareVisible) {
    noStroke();
    fill(255,110,0);
    if (aimDirection === 'north') {
      image(aimImage,1+playerX*width/16-1,1+(playerY-1)*width/16-1,width/16,width/16);
    }
    if (aimDirection === 'south') {
      image(aimImage,1+playerX*width/16-1,1+(playerY+1)*width/16-1,width/16,width/16);
    }
    if (aimDirection === 'east') {
      image(aimImage,1+(playerX+1)*width/16-1,1+playerY*width/16-1,width/16,width/16);
    }
    if (aimDirection === 'west') {
      image(aimImage,1+(playerX-1)*width/16-1,1+playerY*width/16-1,width/16,width/16);
    }
  }
}