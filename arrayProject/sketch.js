// Amazeing Maze
// Adam S
// 2024/10/23
//
// Planes are 1000x1000 in size leading to poor render distance as everything is actually really, really large
//
// Extra for Experts:
// Used WEBGL render for three-dimensional world
// Used images for textures
// Used createCamera() and other camera related functionalities
// Used pixelDensity() to optimize project by drawing less pixels
//
//--------------------------------------------------
//
//  Maze Navigation 'Game'
//  Use WASD to move through the maze (s doesn't do anything)
//  There is no collision because it would take too long (I'm stumped)
//  There is no exit since the maze doesn't use any complex algorithm but just places walls randomly
//
//--------------------------------------------------

let img;
let img2;
let img3;
let world = [];
let maze = [];
//let wallPositionArray0 = [];
//let wallPositionArray90 = [];
let turningLeft = false;
let turningRight = false;
let leftTurns = 0;
let rightTurns = 0;
let moving = false;
let moves = 0;
let direction;
let forwardX;
let forwardY;

const TURN_DEGREES = 90;
const TURN_SPEED = 2.5;
const MOVE_SPEED = 25;
const MOVE_TIMES = 1000 / MOVE_SPEED;
//must be odd
let mazeSize;
//i called it lazymaze because it rhymes, and because it just places walls at random.
let LAZYMAZE_WALL_COUNT;

const FRAMERATE = 60;
const FREECAM = true;
const PIXEL_DENSITY = 0.5;

let cam;

let finalImage;

function preload() {
  img = loadImage("background.png");
  img2 = loadImage("background2.png");
  img3 = loadImage("background3.png");
}

function setup() {
  createCanvas(windowWidth,windowHeight, WEBGL);
  pixelDensity(PIXEL_DENSITY);
  //randomize maze size and make sure number is odd by adding 1 if number is even
  mazeSize = round(random(7,22))
  if (mazeSize % 2 === 0) {
    mazeSize++;
  }
  LAZYMAZE_WALL_COUNT = round(mazeSize*(mazeSize/1.5));
  //create Graphics object used to render window at a smaller resolution, then upscaled to show the final image on screen, for optimization
  //create camera and position it at origin
  cam = createCamera();
  cam.setPosition(0, 0, 0);
  //something to do with camera's field of view that makes turning feel better
  cam.perspective(70);
  cam.lookAt(0, 0, -20);
  //set framerate
  frameRate(FRAMERATE);
  //create world
  world = generateMaze();
}

function draw() {
  if (FREECAM) {
    orbitControl();
  }
  background(0);
  noStroke();
  if (turningLeft || turningRight) {
    turnCamera();
  }
  if (moving) {
    moveCamera();
  }
  checkInput();
  drawWorld();
}

function turnCamera() {
  //check if the camera is still being told to turn for both directions
  if (leftTurns > TURN_DEGREES - 1) {
    leftTurns = 0;
    turningLeft = false;
    turningRight = false;
  }
  if (rightTurns > TURN_DEGREES - 1) {
    rightTurns = 0;
    turningRight = false;
    turningLeft = false;
  }
  //turn camera and increase counter until it reaches TURN_DEGREES
  if (turningLeft && leftTurns < TURN_DEGREES) {
    leftTurns += TURN_SPEED;
    cam.pan(radians(TURN_SPEED),0,0);
  }
  if (turningRight && rightTurns < TURN_DEGREES) {
    rightTurns += TURN_SPEED;
    cam.pan(radians(-TURN_SPEED),0,0);
  }
}

function moveCamera() {
  //move camera by MOVE_SPEED and increase moves counter until it reaches MOVE_TIMES
  if (moves <= MOVE_TIMES - 1 ) {
    // old collision detection
    // if (frontIsBlocked()) {}
    // for (let item in world) {
    //   let target = world[item];
    //   if (target.x === round((cam.eyeX + MOVE_SPEED*MOVE_TIMES - 1000) / 4)) {

    //   }
    // }
    cam.move(0,0,-MOVE_SPEED);
    moves++;
  }
  else {
    //reset move counter and allow camera to move again
    moves = 0;
    moving = false;
  }
}

// old collision detection
//
// function frontIsBlocked() {
//   //player is moving along Y axis
//   if (round(cam.centerX - cam.eyeX) === 20 || round(cam.centerX - cam.eyeX) === -20) {
//     forwardY = round((cam.eyeY + MOVE_SPEED*MOVE_TIMES - 1000) / 100) * 200;
//     forwardX = round(cam.centerX / 100) * 100;
//     direction = "Y";
//   }
//   //moving along X axis
//   else{
//     forwardX = round((cam.eyeX + MOVE_SPEED*MOVE_TIMES - 1000) / 100) * 200;
//     forwardY = round(cam.eyeY / 100) * 100;
//     direction = "X";
//   }
//   console.log(direction);
//   for (let item in world) {
//     let target = world[item];
//     //console.log(target.x,forwardX,target.y,forwardY,target.x === round(forwardX),target === forwardY);
//     if (direction === "X") {
//       if (target.x === forwardX && target.y === forwardY) {
//         console.log("blocked");
//       }
//     }
//   }
// }

function checkInput() {
  if (keyIsPressed) {
    //optimize having to check for three keys every frame, this could have been done in draw()
    if (keyIsDown(LEFT_ARROW) === true && !turningRight && !turningLeft && !moving) {
      turningLeft = true;
      turningRight = false;
    }

    if (keyIsDown(RIGHT_ARROW) === true && !turningRight && !turningLeft && !moving) {
      turningRight = true;
      turningLeft = false;
    }

    if (keyIsDown(UP_ARROW) === true && !moving && !turningLeft && !turningRight) {
      moving = true;
    }
  }
}

function drawWorld() {
  //run for every object in world array and "create" it
  for (let obj in world) {
    let object = world[obj];
    let size = object.size;
    //since transformations are based on previous transformations, resetting the matrix allows individual position based on an origin
    resetMatrix();
    //read attributes from object such as rotation, position, texture, and shape
    rotateX(radians(object.angleX));
    rotateY(radians(object.angleY));
    rotateZ(radians(object.angleZ));

    translate(object.x,object.y,object.z);

    texture(img);
    //randomly flash different brightness of textures
    if (round(random(0,10000)) === 75) {
      texture(img2)
    }
    if (round(random(0,10000)) === 25) {
      texture(img2)
    }

    if (world[obj].shape === "plane") {

      plane(size);

    }
  }

}

function generateMaze() {
  //generate maze for player to navigate
  let maze = generateEdge();
  for (let times = 0; times < LAZYMAZE_WALL_COUNT; times++) {
    let object = {
      size: 1000,
      x: round(random(-mazeSize/2, mazeSize/2)) * 1000,
      y: 0,
      z: round(random(-mazeSize/2, mazeSize/2)) * 1000 - 500,
      angleX: 0,
      angleY: 0,
      angleZ: 0,
      objectTexture: img,
      shape: "plane",
    };
    maze.push(object);
  };
  
  for (let times = 0; times < LAZYMAZE_WALL_COUNT; times++) {
    let object = {
      size: 1000,
      x: round(random(-mazeSize/2, mazeSize/2)) * 1000,
      y: 0,
      z: round(random(-mazeSize/2, mazeSize/2)) * 1000 - 500,
      angleX: 0,
      angleY: 90,
      angleZ: 0,
      objectTexture: img,
      shape: "plane",
    };
    maze.push(object);
  };
  // old collision detection
  // for (let item in maze) {
  //   let target = maze[item];
  //   if (target.angleY === 0) {
  //     wallPositionArray0.push(target.x/4);
  //   }
  //   else{
  //     wallPositionArray90.push(target.x/4);
  //   }
  // }
  return maze;
}

function generateEdge() {
  let maze = [];
  //create top
  for (let times = (mazeSize - 1)/-2; times < (mazeSize + 1)/2; times++) {

    let object = {
      size: 1000,
      x: times * 1000,
      y: 0,
      z: mazeSize/2 * -1000,
      angleX: 0,
      angleY: 0,
      angleZ: 0,
      objectTexture: img,
      shape: "plane",
    };
    maze.push(object);
  };
  //create bottom
  for (let times = (mazeSize - 1)/-2; times < (mazeSize + 1)/2; times++) {

    let object = {
      size: 1000,
      x: times * 1000,
      y: 0,
      z: mazeSize/2 * 1000,
      angleX: 0,
      angleY: 0,
      angleZ: 0,
      objectTexture: img,
      shape: "plane",
    };
    maze.push(object);
  };
  //create left
  for (let times = (mazeSize - 1)/-2; times < (mazeSize + 1)/2; times++) {

    let object = {
      size: 1000,
      x: times * 1000,
      y: 0,
      z:  mazeSize/2 * -1000,
      angleX: 0,
      angleY: 90,
      angleZ: 0,
      objectTexture: img,
      shape: "plane",
    };
    maze.push(object);
  };
  //create right
  for (let times = (mazeSize - 1)/-2; times < (mazeSize + 1)/2; times++) {

    let object = {
      size: 1000,
      x: times * 1000,
      y: 0,
      z:  mazeSize/2 * 1000,
      angleX: 0,
      angleY: 90,
      angleZ: 0,
      objectTexture: img,
      shape: "plane",
    };
    maze.push(object);
  };
  //check object x position and add it to wallPositionArray based on if they have an y angle of 90 or not (old collision detection)
  // for (let item in maze) {
  //   let target = maze[item];
  //   if (target.angleY === 0) {
  //     wallPositionArray0.push(target.x/4);
  //   }
  //   else{
  //     wallPositionArray90.push(target.x/4);
  //   }
  // }
  // console.log(wallPositionArray0);
  // console.log(wallPositionArray90);
  return maze;

}