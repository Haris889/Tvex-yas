var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage; /*brownGroundImage;*/
var ground1;

var cloudsGroup, cloudImage;
//var bqqsGroup, obstacle2;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var jumpSound;
var scoreGain;
var gameOverSound;
var score=0;
//var lastJump = 0;
//var currentTime;
var canJump = true;
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
  
  var canvasX = (windowWidth - 600) / 2;
  var canvasY = (windowHeight - 200) / 2;
  canvas.position(canvasX, canvasY);
  resizeCanvas(600, 200);
  
  trex = createSprite(50,180,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 0.5;


  ground = createSprite(200,175,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.velocityX =  -(6 + 3*score/100); //-(groundSpeed/60*frameRate());     
  ground.depth = trex.depth - 10;

  gameOver = createSprite(300,100);
  gameOver.addImage(gameOverImg);
 
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

  trex.setCollider("rectangle",0,0,trex.width,trex.height);
  trex.debug = true
  
  score = 0;
}

function draw() {//*
 
  background(135,206,235);

  fill("blue");
  textFont("Brush Script MT")
  textSize(50);
  text("Score:   "+ score, 500,50);
  
  /*fill("gold");
  textFont("Brush Script MT")*/
  
  if (gameState===PLAY){
    if (frameCount % 6 === 0) {
      score++;
    }
    //score = score +   // Math.round(frameRate() / 60);//getFrameRate()/60);
    //ground.velocityX = -(5 + 4*score/100);
    ground.velocityX = -(6 + 3 * score / 100); //-8;
    if (ground.x < 0){
      ground.x = ground.width/2;
    }

    if (trex.collide(invisibleGround)) {
      canJump = true; // Reset canJump when the trex lands on the ground
    }
  
    if(touches.length > 0 || keyDown("UP_ARROW") && canJump){//trex.y >=159) {
      if (canJump) {
      trex.velocityY = -20;
      jumpSound.play();
      canJump = false;
    }
  }
    trex.velocityY = trex.velocityY + 1.5;

       if (keyDown("DOWN_ARROW")) {
         trex.scale = 0.3;
       } else {
         trex.scale = 0.5;
       }
      
    
      // trex.velocityY = trex.velocityY + 0.8
  
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
    //spwanQQs()
  
    if(obstaclesGroup.isTouching(trex)){
        gameState = END;
        gameOverSound.play();
        //trex.velocityY = 0;
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
  
   if (touches.length > 0 || mousePressedOver(restart)) {
    reset();
    touches = [];
    
   /*if(mousePressedOver(restart)) {
      reset();
      
   // }*/
    //touches = [];
  
  }
}
  drawSprites();

}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 40 === 0) {
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


function spawnObstacles() {
  if(frameCount % 55 === 0) {
    var obstacle = createSprite(600,155,10,40);
    //obstacle.debug = true;
    obstacle.velocityX = -(6 + 3*score/100);
    
    //generate random obstacles
    var rand = Math.round(random(1,5));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              obstacle.scale = 0.23;
              break;
      case 2: obstacle.addImage(obstacle2);
              obstacle.scale = 0.24;
              break;
      case 3: obstacle.addImage(obstacle3);
             obstacle.scale = 0.24;
              break;
      case 4: obstacle.addImage(obstacle4);
              obstacle.scale = 0.125;
              obstacle.depth = trex.depth - 10;
              break;
      case 5: obstacle.addImage(obstacle5);
              obstacle.scale = 0.125;
              obstacle.depth = trex.depth - 10;
              break;
      case 6: obstacle.addImage(obstacle6);
              obstacle.scale = 0.125;
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

