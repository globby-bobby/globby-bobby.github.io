// Project Title
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

let canvas;

let tile;

function preload() {
  tile = loadImage('wall.png');
}

function setup() {
  canvas = createCanvas(windowHeight/3*4, windowHeight);
  canvas.position((windowWidth-width)/2,0);
  console.log(width,height);

}

function draw() {
  background(0,50,0);
  for (let x = 0; x < width; x += width/16) {
    for (let y = 0; y < height-height/8; y += width/16) {
      image(tile,x,y,width/16,width/16);
    }
  }
}
