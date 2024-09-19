// etch-a-sketch project
// Sept 9 2024

let speed = 0;
let x = 300;
let y = 300;
let color = 0;
let cooldown = 0;
let w = 600;
let h = 600;
let bgColor = 220;

function setup() {
  createCanvas(w, h);
  background(bgColor);
}

function draw() {
  speed = (randomGaussian(3, 1) * random(-20, 200)) / 500;
  checkInput();
}

function checkInput() {
  if (keyIsPressed && cooldown === 0) {
    //if keyIsPressed and pen isn't stalled
    if (keyIsDown(87)) {
      // move with wasd
      if (y > 0 + 2) {
        //w
        y -= speed;
      }
    }
    if (keyIsDown(83)) {
      //s
      if (y < h - 2) {
        y += speed;
      }
    }
    if (keyIsDown(65)) {
      //a
      if (x > 0 + 2) {
        x -= speed;
      }
    }
    if (keyIsDown(68)) {
      //d
      if (x < w - 2) {
        x += speed;
      }
    }

    
  }
  stroke(color);
  fill(color);
  circle(x, y, 2);
}

function mouseWheel() {
  //scrolling puts white squares everywhere, slowly clearing the drawing.
  //place background colored square randomly with random size.
  let whiteSquareX = random(0, w + 1);
  let whiteSquareY = random(0, h + 1);
  stroke(bgColor);
  fill(bgColor);
  circle(whiteSquareX, whiteSquareY, random(5, 200));
}
