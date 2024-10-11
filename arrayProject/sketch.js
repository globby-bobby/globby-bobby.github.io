// Project Title
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"
let img;
let cube1 = {};
let cube2 = {};
let world = [];
let turningLeft = false;
let turningRight = false;
let leftTurns = 0;
let rightTurns = 0;

let TURN_DEGREES = 10;

let cam;

function preload() {

  img = loadImage("background.png");

}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  cam = createCamera();
  cam.setPosition(0, -0, 100);
  cam.lookAt(0, 0, -20);
  frameRate(30);

  cube1 = {

    size: 25,
    x: 0,
    y: 0,
    z: 0,
    angleX: 0,
    angleY: 0,
    angleZ: 0,
    objectTexture: img,
    shape: "plane",
  
  };
  cube2 = {

    size: 25,
    x: 0,
    y: 0,
    z: -20,
    angleX: 0,
    angleY: 0,
    angleZ: 0,
    objectTexture: img,
    shape: "plane",
  
  };
  
  world.push(cube1);
  world.push(cube2);
}

function draw() {
  
  orbitControl();

  background(200);
  noStroke();

  texture(img);

  if (turningLeft || turningRight) {
    
    turnCamera()
  }

  checkInput();
  drawWorld();
  box();
  //console.log(frameCount%30);
}

function turnCamera() {
  if (turningLeft && leftTurns < TURN_DEGREES) {
    leftTurns++;
    cam.pan(radians(1),0,0);
  }
  if (turningRight && rightTurns < TURN_DEGREES) {
    rightTurns++;
    cam.pan(radians(-1),0,0);
  }
  if (leftTurns > TURN_DEGREES) {
    leftTurns = 0;
    turningLeft = false;
    turningRight = false;
  }
  if (rightTurns > TURN_DEGREES) {
    rightTurns = 0;
    turningRight = false;
    turningLeft = false;
  }
}

function checkInput() {
  if (keyIsPressed) {
    console.log(turningLeft);
    if (keyIsDown(LEFT_ARROW) === true && !turningRight && !turningLeft) {
      turningLeft = true;
      
    }

    if (keyIsDown(RIGHT_ARROW) === true && !turningRight && !turningLeft) {
      turningRight = true;
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

    rotateX(object.angleX);
    rotateY(object.angleY);
    rotateZ(object.angleZ);

    translate(object.x,object.y,object.z);

    if (world[obj].shape === "plane") {

      box(size,size);

    }
  }

}