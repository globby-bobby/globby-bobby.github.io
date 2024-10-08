// Project Title
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"
let image;

function preload() {

  img = loadImage("background.png");

}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  //debugMode();
}

function draw() {
  
  orbitControl();

  background(200);
  noStroke();
  //rotateZ();
  rotateX(radians(45));
  box(100,100);
  texture(img);
  //sphere(100);
}