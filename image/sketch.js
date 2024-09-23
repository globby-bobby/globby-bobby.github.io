// Image Demo, Sept 23, 2024

let picture;

function preload() {

  picture = loadImage("image.png");

}

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(220);
  image(picture,mouseX,mouseY);
}
