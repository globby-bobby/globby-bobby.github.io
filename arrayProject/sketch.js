// Project Title
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"
let img;
let cube1 = {};
let world = [];

function preload() {

  img = loadImage("background.png");

}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  cube1 = {

    size: 25,
    x: 100,
    y: 100,
    z: 100,
    angleX: 0,
    angleY: 0,
    angleZ: 0,
    objectTexture: img,
    shape: "plane",
  
  };
  cube2 = {

    size: 25,
    x: 200,
    y: 100,
    z: 100,
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
  //rotateZ();
  rotateX(radians(45));
 // box(100,100);
  texture(img);
  //sphere(100);
  drawWorld();
}

function drawWorld() {
  for (const obj in world) {
    let object = world[obj];

    rotateX(object.angleX);
    rotateY(object.angleY);
    rotateZ(object.angleZ);

    translate(object.x,object.y,object.z);

    if (world[obj].shape === "plane") {

      box(object.size,object.size);

    }
  }

}