// Amazeing Maze
// Adam S
// Date
//
// Planes are 1000x1000 in size leading to poor render distance as everything is actually really, really large
//
// Extra for Experts:
// Used WEBGL render for three-dimensional world
// Used 'advanced algorithms' (like the maze gen)
// Used images for textures
// Used createCamera() and other camera related functionalities
//

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
//must be odd
const MAZE_SIZE = 30;

const FRAMERATE = 60;

let cam;

function preload() {

  img = loadImage("background.png");

}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  //create camera and position it at origin
  cam = createCamera();
  cam.setPosition(0, 0, 0);
  //cam.setPosition(0, -7000, 0);
  cam.lookAt(0, 0, -20);
  frameRate(FRAMERATE);
  //generateMaze();
  world = generateMaze();
  console.log(world);

}

function draw() {
  orbitControl();
  background(0);
  //noStroke();
  
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
  if (moves <= MOVE_TIMES - 1) {
    console.log(moves);
    cam.move(0,0,-MOVE_SPEED);
    moves++;
  }
  else {
    //reset move counter and allow camera to move again
    moves = 0;
    moving = false;
  }
}

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

    if (world[obj].shape === "plane") {

      plane(size);

    }
  }

}

function generateMaze() {
  //generate maze for player to navigate
  let maze = generateEdge();
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
  console.log(maze);
  return maze;
}

function generateEdge() {
  let maze = [];
  //create top
  for (let times = (MAZE_SIZE - 1)/-2; times < (MAZE_SIZE + 1)/2; times++) {

    let object = {
      size: 1000,
      x: times * 1000,
      y: 0,//round(random(-2,2)) * 1000,
      z: MAZE_SIZE/2 * -1000,
      angleX: 0,
      angleY: 0,
      angleZ: 0,
      objectTexture: img,
      shape: "plane",
    };
    maze.push(object);
  };
  //create bottom
  for (let times = (MAZE_SIZE - 1)/-2; times < (MAZE_SIZE + 1)/2; times++) {

    let object = {
      size: 1000,
      x: times * 1000,
      y: 0,//round(random(-2,2)) * 1000,
      z: MAZE_SIZE/2 * 1000,
      angleX: 0,
      angleY: 0,
      angleZ: 0,
      objectTexture: img,
      shape: "plane",
    };
    maze.push(object);
  };
  //create left
  for (let times = (MAZE_SIZE - 1)/-2; times < (MAZE_SIZE + 1)/2; times++) {

    let object = {
      size: 1000,
      x: times * 1000,
      y: 0,//round(random(-2,2)) * 1000,
      z:  MAZE_SIZE/2 * -1000,
      angleX: 0,
      angleY: 90,
      angleZ: 0,
      objectTexture: img,
      shape: "plane",
    };
    maze.push(object);
  };
  //create right
  for (let times = (MAZE_SIZE - 1)/-2; times < (MAZE_SIZE + 1)/2; times++) {

    let object = {
      size: 1000,
      x: times * 1000,
      y: 0,//round(random(-2,2)) * 1000,
      z:  MAZE_SIZE/2 * 1000,
      angleX: 0,
      angleY: 90,
      angleZ: 0,
      objectTexture: img,
      shape: "plane",
    };
    maze.push(object);
  };

  return maze;

}