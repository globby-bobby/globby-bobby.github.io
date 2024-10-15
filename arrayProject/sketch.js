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

let TURN_DEGREES = 90;
let TURN_SPEED = 5;

let MAZE_SIZE = 10;

let cam;

function preload() {

  img = loadImage("background.png");

}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  cam = createCamera();
  cam.setPosition(0, -0, 0);
  cam.lookAt(0, 0, -20);
  frameRate(30);

  generateMaze();

  cube1 = {

    size: 1000,
    x: 0,
    y: 0,
    z: -500,
    angleX: 0,
    angleY: 0,
    angleZ: 0,
    objectTexture: img,
    shape: "plane",
  
  };
  cube2 = {

    size: 1000,
    x: 0,
    y: 0,
    z: 1000,
    angleX: 0,
    angleY: 0,
    angleZ: 0,
    objectTexture: img,
    shape: "plane",
  
  };
  cube3 = {

    size: 1000,
    x: 500,
    y: 0,
    z: -500,
    angleX: 0,
    angleY: 90,
    angleZ: 0,
    objectTexture: img,
    shape: "plane",
  
  };
  cube4 = {

    size: 1000,
    x: 0,
    y: 0,
    z: 1000,
    angleX: 0,
    angleY: 0,
    angleZ: 0,
    objectTexture: img,
    shape: "plane",
  
  };
  
  world.push(cube1);
  world.push(cube2);
  world.push(cube3);
  world.push(cube4);
}

function draw() {
  orbitControl();
  background(0);
  noStroke();

  if (turningLeft || turningRight) {
    turnCamera();
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

function checkInput() {
  if (keyIsPressed) {
    console.log(turningLeft);
    if (keyIsDown(LEFT_ARROW) === true && !turningRight && !turningLeft) {
      turningLeft = true;
      turningRight = false;
    }

    if (keyIsDown(RIGHT_ARROW) === true && !turningRight && !turningLeft) {
      turningRight = true;
      turningLeft = false;
    }

    if (keyIsDown(UP_ARROW) === true) {
      cam.move(0,0,-10);
    }

    if (keyIsDown(DOWN_ARROW) === true) {
      
    }
  }
}

function drawWorld() {
  for (const obj in world) {
    let object = world[obj];
    let size = object.size;

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

  //return list


}