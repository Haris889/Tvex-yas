var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage; /*brownGroundImage;*/
var ground1;

var cloudsGroup, cloudImage;
//var bqqsGroup, obstacle2;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

/*var groundSpeed = 200; // Set the speed of the ground in pixels per second
var lastTime = 0; // Keep track of the last time update*/

var jumpSound;
var scoreGain;
var gameOverSound;
var score=0;

var gameOver, restart;



function preload(){
  trex_running =   loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");

  jumpSound = loadSound("mixkit-fast-sword-whoosh-2792.wav");//"mixkit-short-wind-swoosh-1461.wav");
  scoreGain = loadSound("scoregain.wav");
  gameOverSound = loadSound("GameOver.mp3");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  trex = createSprite(50,180,20,50);
  
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 0.5;
  
  /*brownGroundImage = createImage(groundImage.width, groundImage.height);
  brownGroundImage.loadPixels();
  for (var x = 0; x < brownGroundImage.width; x++) {
    for (var y = 0; y < brownGroundImage.height; y++) {
      if (x < 20) { // Change the width of the brown color as per your requirement
        brownGroundImage.set(x, y, color(165, 42, 42)); // Set the color to brown
      } else {
        var index = (x + y * brownGroundImage.width) * 4;
        brownGroundImage.pixels[index] = groundImage.pixels[index];
        brownGroundImage.pixels[index + 1] = groundImage.pixels[index + 1];
        brownGroundImage.pixels[index + 2] = groundImage.pixels[index + 2];
        brownGroundImage.pixels[index + 3] = groundImage.pixels[index + 3];
      }
    }
  }
  brownGroundImage.updatePixels();*/

  ground = createSprite(200,175,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.velocityX =  -(6 + 3*score/100); //-(groundSpeed/60*frameRate());     
  ground.depth = trex.depth - 10;
 

  /*ground1 = createSprite(200, 180, 400, 20);
 ground1.shapeColor = color(165, 42, 42);
 ground1.x = ground.width / 2;
ground1.velocityX = -(6 + 3*score/100);*/



  gameOver = createSprite(300,100);
  gameOver.addImage(gameOverImg);
  //gameOver.depth = cloud.depth + 10;
  
  restart = createSprite(300,140);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.2;

  gameOver.visible = false;
  restart.visible = false;
  
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  
  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  //bqqsGroup = new Group();

  trex.setCollider("rectangle",0,0,trex.width,trex.height);
  trex.debug = true
  
  score = 0;
}

function draw() {
  //trex.debug = true;
  /*var now = millis();
  var elapsed = (now - lastTime) / 1000; // Convert milliseconds to seconds
  lastTime = now;

  // Calculate the distance to move the T-Rex and the ground based on the elapsed time and the groundSpeed variable
  var distance = elapsed * groundSpeed;

  // Move the T-Rex and the ground based on the distance variable
  trex.position.x += distance;
  ground.position.x += distance;

  // Reset the position of the ground if it goes offscreen
  if (ground.position.x < -ground.width/2) {
    ground.position.x += ground.width;
  }*/
 
  background(135,206,235);
  

  fill("blue");
  textFont("Brush Script MT")
  textSize(50);
  text("Score:   "+ score, 500,50);
  
  /*fill("gold");
  textFont("Brush Script MT")*/
  
  if (gameState===PLAY){
    score = score + Math.round(frameRate() / 60);//getFrameRate()/60);
    //ground.velocityX = -(5 + 4*score/100);
    ground.velocityX = -8;
    if (ground.x < 0){
      ground.x = ground.width/2;
    }

    if(mouseIsPressed && trex.y >=159) {
      trex.velocityY = -20;
      jumpSound.play();
    }
    trex.velocityY = trex.velocityY + 1.47;

       if (keyDown("DOWN_ARROW")) {
         trex.scale = 0.3;
       } else {
         trex.scale = 0.5;
       }
      
    
      // trex.velocityY = trex.velocityY - 0.8
  
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    if (score >= 500 && score % 500 === 0) {
    // play the sound effect
    scoreGain.play();
    scoreGain.volume = 0.5;
      
  }
    trex.collide(invisibleGround);
    spawnClouds();
    spawnObstacles();
    //spawnQqqs();
    
   /* if (score > 0 && score % 100 === 0){
      //checkPointSound.play();
      groundSpeed += 50; // Increase the speed of the ground every 100 points
      ground.velocityX = -(groundSpeed/60*frameRate()); // Update the velocity of the ground
    }*/
  
    if(obstaclesGroup.isTouching(trex)){
        gameState = END;
        gameOverSound.play();
    }
  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    trex.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    //bqqsGroup.setVelocityXEach(0);
    
    //change the trex animation
    trex.changeAnimation("collided",trex_collided);
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
   // bqqsGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(restart)) {
      reset();
    }
  }
  
  
  drawSprites();
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(600,120,40,10);
    cloud.y = Math.round(random(70,100));
    cloud.addImage(cloudImage);
    cloud.scale = 0.18;
    cloud.velocityX = -3; //-(groundSpeed/60*frameRate()); 
    
     //assign lifetime to the variable
    cloud.lifetime = 200;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    gameOver.depth = cloud.depth + 10;
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
}

 /* function spawnQqqs() {
    if (frameCount % 90 === 0) {
      var Qqq = createSprite(600,165,10,40);
     /* Qqq.y = Math.round(random(1,5));
      Qqq.addImage(obstacle2);*/
      var randw = Math.round(random(1,8));
 /*   switch(randw) {
      case 1: Qqq.addImage(obstacle2);
              break;
      default: break;
   }
     
      Qqq.scale = 0.2;
      Qqq.velocityX = -(6 + 3*score/98);
      
       //assign lifetime to the variable
      Qqq.lifetime = 200;

      bqqsGroup.add(Qqq);
      
    







  }
  
  } */

function spawnObstacles() {
  if(frameCount % 55 === 0) {
    var obstacle = createSprite(600,165,10,40);
    //obstacle.debug = true;
    obstacle.velocityX = -(6 + 3*score/100);
    
    //generate random obstacles
    var rand = Math.round(random(1,5));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              obstacle.scale = 0.28;
              break;
      case 2: obstacle.addImage(obstacle2);
              obstacle.scale = 0.25;
              break;
      case 3: obstacle.addImage(obstacle3);
             obstacle.scale = 0.27;
              break;
      case 4: obstacle.addImage(obstacle4);
              obstacle.scale = 0.135;
              obstacle.depth = trex.depth - 10;
              break;
      case 5: obstacle.addImage(obstacle5);
              obstacle.scale = 0.135;
              obstacle.depth = trex.depth - 10;
              break;
      case 6: obstacle.addImage(obstacle6);
              obstacle.scale = 0.130;
              obstacle.depth = trex.depth - 10;
              break;
      default: break;
   }
    
    //assign scale and lifetime to the obstacle 
    //obstacle2.scale = 0.3;          
  
 //   obstacle.scale = 0.3;
   
    obstacle.lifetime = 300;
    //add each obstacle to the group
    restart.depth = obstacle.depth + 10;
    obstacle.depth = ground.depth + 10;
    obstaclesGroup.add(obstacle);
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  //QqqsGroup.destroyEach();
  
  trex.changeAnimation("running",trex_running);
  
 
  
  score = 0;
  groundSpeed = 500;
  //ground.velocityX = -(groundSpeed/60*frameRate()); */ //Reset the velocity of the// ground

}
