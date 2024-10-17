// Amazeing Maze
// Adam S
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

let img;
let cube1 = {};
let cube2 = {};
let world = [];
let maze = [];
let turningLeft = false;
let turningRight = false;
let leftTurns = 0;
let rightTurns = 0;
let moving = false;
let moves = 0;

const TURN_DEGREES = 90;
const TURN_SPEED = 2.5;
const MOVE_SPEED = 25;
const MOVE_TIMES = 1000 / MOVE_SPEED;

const MAZE_SIZE = 10;

const FRAMERATE = 60;

let cam;

function preload() {

  img = loadImage("background.png");

}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  cam = createCamera();
  cam.setPosition(0, 0, 0);
  cam.lookAt(0, 0, -20);
  frameRate(FRAMERATE);
  //generateMaze();
  world = generateMaze();
  console.log(world);

}

function draw() {
  orbitControl();
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
  if (moves <= MOVE_TIMES - 1) {
    console.log(moves);
    cam.move(0,0,-MOVE_SPEED);
    moves++;
  }
  else {
    moves = 0;
    moving = false;
  }
}

function checkInput() {
  if (keyIsPressed) {
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
  for (let obj in world) {
    let object = world[obj];
    let size = object.size;

    resetMatrix();

    rotateX(radians(object.angleX));
    rotateY(radians(object.angleY));
    rotateZ(radians(object.angleZ));

    translate(object.x,object.y,object.z);

    texture(img);

    if (world[obj].shape === "plane") {

      plane(size);

    }
  }

}

function generateMaze() {

  let maze = [];
  let height = 0;
  
  ground = {

    size: 100000,
    x: 0,
    y: 0,
    z: -500,
    angleX: 90,
    angleY: 0,
    angleZ: 0,
    objectTexture: img,
    shape: "plane",
  
  };

  maze.push(ground);

  for (let times = 0; times < 15; times++) {

    let object = {
      size: 1000,
      x: round(random(-2,2)) * 1000,
      y: 0,//round(random(-2,2)) * 1000,
      z: -1000,
      angleX: 0,
      angleY: 0,
      angleZ: 0,
      objectTexture: img,
      shape: "plane",
    };
    maze.push(object);
  };

  for (let times = 0; times < 15; times++) {

    let object = {
      size: 1000,
      x: round(random(-2,2)) * 1000 - 500,
      y: 0,//round(random(-2,2)) * 1000,
      z: 1500,
      angleX: 0,
      angleY: 90,
      angleZ: 0,
      objectTexture: img,
      shape: "plane",
    };
    maze.push(object);
  };

  console.log(maze);
  return maze;
}