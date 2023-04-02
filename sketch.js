var balloon, balloonimage;
var bg, bgimage;
var obsTop, obsTopimg1, obsTopimg2;
var obsBtm, obsBtmimg1, obsBtmimg2, obsBtmimg3;
var BottomGround, TopGround, topObstacleGroup, bottomObstacleGroup, barGroup;
var PLAY = 1;
var END = 0;
var gameState = PLAY;
var jumpSound, dieSound;
var restart, restartImage, gameOverImage, gameOver;
var score = 0;
var backGroundImg;


function preload(){
    //adding assets to the game.
    balloonimage = loadAnimation("assets/balloon1.png","assets/balloon2.png","assets/balloon3.png");
    bgimage = loadImage("assets/bg.png");
    bgimage2 = loadImage("assets/bgImg2.jpg");
    obsTopimg1 = loadImage("assets/obsTop1.png");
    obsTopimg2 = loadImage("assets/obsTop2.png");
    obsBtmimg1 = loadImage("assets/obsBottom1.png");
    obsBtmimg2 = loadImage("assets/obsBottom2.png");
    obsBtmimg3 = loadImage("assets/obsBottom3.png");
    jumpSound = loadSound("assets/jump.mp3");
    dieSound = loadSound("assets/die.mp3");
    restartImage = loadImage("assets/restart.png");
    gameOverImage = loadImage("assets/gameOver.png");

}

function setup(){
    createCanvas(400,400);

    // creating the background.
    bg = createSprite(165,485,1,1);
    getBackgroundImg();
    
    // created the balloon and added the animation.
    balloon = createSprite(100,200,50,50);
    balloon.addAnimation("balloon",balloonimage);
    balloon.scale = 0.25;
    
    //creating the top and bottom ground.
    BottomGround = createSprite(200,390,400,20);
    TopGround = createSprite(200,10,400,20);

    // initailizing the groups 

    bottomObstacleGroup = new Group();
    topObstacleGroup = new Group();
    barGroup = new Group();

    //creating game over and restart sprites
    gameOver = createSprite(220, 200);
    gameOver.addImage(gameOverImage);
    gameOver.scale = 0.5;
    gameOver.visible = false;

    restart = createSprite(220, 240);
    restart.addImage(restartImage);
    restart.scale = 0.5;
    restart.visible = false;

    

}

function draw() {
    background("green");
    
    if(gameState === PLAY){
        // if you press the space key the balloon jumps
        if(keyDown("space")){
            balloon.velocityY = -5;
            jumpSound.play();
        }
        
        //adding gravity to the balloon by adding the positive value to the negative Y velocity
        balloon.velocityY = balloon.velocityY + 0.1;

        spawnObsTop();
        spawnBottomObstacles();
        bar();
        if(topObstacleGroup.isTouching(balloon) || balloon.isTouching(TopGround) || balloon.isTouching(BottomGround) || bottomObstacleGroup.isTouching(balloon)){
            gameState = END;
            dieSound.play();
        }
    }
    
    if(gameState === END){
        
        gameOver.visible = true;
        gameOver.depth = gameOver.depth + 1;

        restart.visible = true;
        restart.depth += 1;

        balloon.velocityX = 0;
        balloon.velocityY = 0;
        bottomObstacleGroup.setVelocityXEach(0);
        topObstacleGroup.setVelocityXEach(0);
        barGroup.setVelocityXEach(0);

        bottomObstacleGroup.setLifetimeEach(-1);
        topObstacleGroup.setLifetimeEach(-1);
        balloon.y = 200;

        if(mousePressedOver(restart)){
            reset();
        }

    }



    drawSprites(); 
    Score();   
}

function spawnObsTop(){
    if(frameCount % 60 === 0){

        obsTop = createSprite(400,65,50,50);
        obsTop.velocityX = -5
        obsTop.y = Math.round(random(1,100));
        obsTop.scale = 0.1
        var rand = Math.round(random(1,2));
        
        switch(rand){
            
            case 1:obsTop.addImage(obsTopimg1);
                    break;
            case 2:obsTop.addImage(obsTopimg2);
                    break;
            default:break;
                
        }
        obsTop.lifetime = 100;
        balloon.depth += 1;
        topObstacleGroup.add(obsTop);
    }

}

function bar(){
    
    if(frameCount% 60 === 0){
        var bar = createSprite(400,200,10,800);
        bar.velocityX = -6;
        bar.depth = balloon.depth;
        bar.lifetime = 70;
        bar.visible = false;
        barGroup.add(bar);
    }

}

function spawnBottomObstacles(){

    if(frameCount % 60 === 0){
        obsBtm = createSprite(400, 350, 40, 50);
        obsBtm.addImage(obsBtmimg1);
        obsBtm.scale = 0.07;
        obsBtm.velocityX = -4;
        var rand = Math.round(random(1,3));
        switch(rand){

            case 1:
                obsBtm.addImage(obsBtmimg1);
                break;
            
            case 2:
                obsBtm.addImage(obsBtmimg2);
                break;
            
            case 3:
                obsBtm.addImage(obsBtmimg3);
                break;

            default: break;

        }
        obsBtm.lifetime = 100;
        balloon.depth += 1;
        bottomObstacleGroup.add(obsBtm);
    }
    

}

function Score(){
    
    if(balloon.isTouching(barGroup)){
        score = score += 1;


    }
    textFont("algerian");
    textSize(30);
    fill("yellow");
    text("score: " + score, 275, 45);
}

function reset(){
    gameState = PLAY;
    restart.visible = false;
    gameOver.visible = false;
    topObstacleGroup.destoryEach();
    bottomObstacleGroup.destoryEach();
    score = 0;
}

async function getBackgroundImg(){
    var response = await fetch("https://worldtimeapi.org/api/timezone/America/Los_Angeles");
    var responseJSON = await response.json();
    var datetime = responseJSON.datetime;
    var hour = datetime.slice(11,13);
    if(hour >= 06 & hour < 19){
        bg.addImage(bgimage);
        bg.scale = 1.3;

    }else{
    bg.addImage(bgimage2);
    bg.scale = 1.5;
    bg.x = 200;
    bg.y = 200;
    
    }
}
