// etch-a-sketch project
// Sept 9 2024
///////////////////////////////////////////////////
//
//  Use WASD to control the cursor and draw pictures.
//  Rapidly scroll the mouse wheel to slowly erase your masterpiece.
//  Click somewhere on the canvas to teleport the cursor there.
//
///////////////////////////////////////////////////

//canvas Width and Height
let w = 600;
let h = 600;

//starting position
let x = w/2;
let y = h/2;

let speed = 0;
let color = 0;
let cooldown = 0;
let bgColor = 220;

//first click ignores teleport, because you sometimes need to click the screen to be able to move in canvas
let firstClick = true;

function setup() {
  createCanvas(w, h);
  background(bgColor);
}

function draw() {
  //change speed every frame and check for input
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

function mouseWheel() { //learned on my own
  //scrolling puts white squares everywhere, slowly clearing the drawing.
  //place background colored square somewhere random with random size.
  let whiteSquareX = random(0, w + 1);
  let whiteSquareY = random(0, h + 1);
  stroke(bgColor);
  fill(bgColor);
  circle(whiteSquareX, whiteSquareY, random(5, 200));
}

function mousePressed() {

  if (firstClick === true) {
    firstClick = false;
  }
  else{
   //click anywhere on screen to move cursor to mouse position
   x = mouseX;
   y = mouseY;
  }
}
