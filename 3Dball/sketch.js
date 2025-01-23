// 3D Bouncy Balls
// Adam S
// 2025/01/23
//
// Extra for Experts:
// - 3 Dimensional bouncy balls with more realistic physics (acceleration, bounce height, terminal velocity based on mass or size of the ball)

let ballArray = [];

const BOX_SIZE = 2000;

//bouncy ball class
class Ball {
  constructor(x,y,z) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.horizontalSpeed = random(-20,20);
    this.horizontalSpeedZ = random(-20,20);
    this.verticalSpeed = 5;
    this.radius = random(10,70);
    this.r = random(0,255);
    this.g = random(0,255);
    this.b = random(0,255);
    //max fall speed based on "mass" (size of ball)
    this.terminalVelocity = this.radius*4;
  }
  draw() {
    //translate has to be in draw() because sphere needs to be drawn right after
    fill(this.r,this.g,this.b);
    noStroke();
    translate(this.x, this.y, this.z);
    sphere(this.radius);
    resetMatrix();
  }
  move() {
    //change position based on speed or change in position on x,y,z axis
    this.x += this.horizontalSpeed;
    this.y += this.verticalSpeed;
    this.z += this.horizontalSpeedZ;
    //bounce off bottom based on radius (larger balls bounce higher)
    if (this.y >= BOX_SIZE/2 - this.radius) {
      this.verticalSpeed = random(-5,this.radius*-1);
    }
    //bounce off top
    if (this.y <= -BOX_SIZE/2 + this.radius) {
      this.verticalSpeed = random(5,this.radius*0.2);
    }
    //bounce off right
    if (this.x >= BOX_SIZE/2 - this.radius) {
      this.horizontalSpeed *= -1;
    }
    //bounce off left
    if (this.x <= -BOX_SIZE/2 + this.radius) {
      this.horizontalSpeed *= -1;
    }
    //bounce off front
    if (this.z >= BOX_SIZE/2 - this.radius) {
      this.horizontalSpeedZ *= -1;
    }
    //bounce off back
    if (this.z <= -BOX_SIZE/2 + this.radius) {
      this.horizontalSpeedZ *= -1;
    }
    //falling speed cannot go over terminal velocity
    if (this.verticalSpeed < this.terminalVelocity) {
      this.verticalSpeed += this.radius/100;
    }
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  //create 5 balls on start
  for (let i = 0; i < 5; i++) {
    let newBall = new Ball(0,0,0);
    ballArray.push(newBall);
  }
}

function draw() {
  //allow free look, give shading to balls
  lights();
  orbitControl();
  background(0);
  checkInput();

  //run move() and draw() for all balls in ballArray
  for (let ball of ballArray) {
    ball.move();
    ball.draw();
  }

  //disable shading and draw transparent cube
  noLights();
  strokeWeight(3);
  stroke(255);
  noFill();
  box(BOX_SIZE);
}

//create new ball when SPACE is pressed, or make one every 60th of a second if SPACE is held down
function checkInput() {
  if (keyIsDown(32)) {
    //can't easily spawn a ball on cursor in 3D space so default to center of cube
    let newBall = new Ball(0,0,0);
    ballArray.push(newBall);
  }
}