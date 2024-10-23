
let noiseNum;
let time = 0;
let imageSize = 8;

function setup() {
  createCanvas(700, 700);
  //noLoop();
}

function draw() {
  noStroke();
  background(220);
  for (let x = 0; x < width; x += imageSize){
    //level += 0.05;
    for (let y = -10; y < height; y += imageSize){
      console.log(noiseNum);
      noiseNum = noise(x/500,y/500, frameCount/100);
      square(x,y,imageSize);
      fill(noiseNum*150);
    
    }
    

  }
  

}
