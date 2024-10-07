
let noiseNum;
let time = 0;
let size = 8;

function setup() {
  createCanvas(500, 500);
  //noLoop();
}

function draw() {
  noStroke();
  background(220);
  for (let x = 0; x < width; x += size){
    //level += 0.05;
    for (let y = -5; y < height; y += size){
      console.log(noiseNum);
      noiseNum = noise(x/200,y/200, frameCount/50);
      square(x,y,size);
      fill(noiseNum*150);
    
    }
    

  }
  

}
