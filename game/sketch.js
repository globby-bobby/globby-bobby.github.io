// Project Title
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

let canvas;

let tile;
let background;
let banner;
let gameState = "menu";

let bannerX = -1152;

function preload() {
  tile = loadImage('wall.png');
  background = loadImage('background.png');
  banner = loadImage('banner.png');
  //bannerX = -banner.width*2;
}

function setup() {
  canvas = createCanvas(windowHeight/3*4, windowHeight);
  canvas.position((windowWidth-width)/2,0);
  console.log(width,height,banner.width);

}

function draw() {
  noSmooth();
  image(background,0,0,width,height);
  checkGameState();
}

function checkGameState() {
  if (gameState === "logo") {
  }
  if (gameState === "menu") {
    moveBanner();
  }
  if (gameState === "game1") {
    
    for (let x = 0; x < width; x += width/16) {
      for (let y = 0; y < height-height/8; y += width/16) {
        image(tile,x,y,width/16,width/16);
      }
    }
  }
}

function moveBanner() {
  image(banner,bannerX,0,width*2,width/16);
  if (frameCount % 30 === 0) {
    if (round(bannerX) === 0) {
      bannerX = -1152;
    }
    bannerX += banner.width/8 + 8;
  }
}