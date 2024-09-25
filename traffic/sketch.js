// Traffic Light Starter Code
// Your Name Here
// The Date Here

// GOAL: make a 'traffic light' simulator. For now, just have the light
// changing according to time. You may want to investigate the millis()
// function at https://p5js.org/reference/#/p5/millis

let time = 2000;
let state = "red";

function setup() {
  createCanvas(600, 600);
  background(255);
  fill(255);
  
}

function draw() {
  drawOutlineOfLights();
  checkState();
}

function drawOutlineOfLights() {
  //box
  rectMode(CENTER);
  fill(0);
  rect(width/2, height/2, 75, 200, 10);

}

function checkState() {
  fill(50);
  ellipse(width/2, height/2 - 65, 50, 50); //top
  ellipse(width/2, height/2, 50, 50); //middle
  ellipse(width/2, height/2 + 65, 50, 50); //bottom
  if (state === "green") {

    fill("green");
    ellipse(width/2, height/2 - 65, 50, 50);
    if (millis() >= time) {
      state = "yellow";
     time += 1500;
    }
  }
  else if (state === "yellow") {

    fill("yellow");
    ellipse(width/2, height/2, 50, 50);
    if (millis() >= time) {
      state = "red";
      time += 6000;
    }
  }
  else if (state === "red") {

    fill("red");
    ellipse(width/2, height/2 + 65, 50, 50);
    if (millis() >= time) {
      state = "green";
      time += 4000;
    }

  }

}