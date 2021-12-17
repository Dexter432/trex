var JOGAR = 1;
var ENCERRAR = 0;
var estadoJogo = JOGAR;
var restart,restartimage,gameover,gameoverimage
var trex, trex_correndo, trex_colidiu;
var solo, soloinvisivel, imagemdosolo;

var nuvem, grupodenuvens, imagemdanuvem;
var grupodeobstaculos, obstaculo1, obstaculo2, obstaculo3, obstaculo4, obstaculo5, obstaculo6;

var pontuacao;
var jump,fail,chekpoint

function preload(){
  trex_correndo = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_colidiu = loadAnimation("trex_collided.png");
  
  imagemdosolo = loadImage("ground2.png");
  
  imagemdanuvem = loadImage("cloud.png");
  
  obstaculo1 = loadImage("obstacle1.png");
  obstaculo2 = loadImage("obstacle2.png");
  obstaculo3 = loadImage("obstacle3.png");
  obstaculo4 = loadImage("obstacle4.png");
  obstaculo5 = loadImage("obstacle5.png");
  obstaculo6 = loadImage("obstacle6.png");
  gameover = loadImage("gameOver.png");
  restart  = loadImage("restart.png");
  jump = loadSound("jump.mp3");
  fail = loadSound("die.mp3");
  chekpoint=loadSound("checkPoint.mp3");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  trex = createSprite(width/20,height-40,20,50);
  trex.addAnimation("running", trex_correndo);
  trex.addAnimation("collided" , trex_colidiu)
  trex.scale = 0.5;
  
  solo = createSprite(200,height-10,width,20);
  solo.addImage("ground",imagemdosolo);
  //solo.x = solo.width /2;
 
  
  soloinvisivel = createSprite(200,height-5,width,10);
  soloinvisivel.visible = false;
   
  //criar grupos de obstáculos e de nuvens
  grupodeobstaculos = createGroup();
  grupodenuvens = createGroup();
  
  console.log("Oi" + 5);
   
  trex.setCollider("circle",0,0,40);
  trex.debug = true
  
  //trex.setCollider("rectangle",60,0,100,250,90);
  pontuacao = 0;
  gameoverimage = createSprite(width/2,height/2)
  gameoverimage.addImage(gameover)
  gameoverimage.scale=0.50
  restartimage = createSprite(width/2,height/2+50)
  restartimage.addImage(restart)
  restartimage.scale=0.60
}

function draw() {
  background(180);
  //exibindo pontuação
  text("Pontuação: "+ pontuacao, width-140,50);
    
  console.log("isto é ",estadoJogo)
  
  
  if(estadoJogo === JOGAR){
    //mover o solo
    solo.velocityX = -(4+pontuacao/100);
    //marcando pontuação
    pontuacao = pontuacao + Math.round(frameCount/60);
    gameoverimage.visible=false
    restartimage.visible=false
    if (solo.x < 0){
      solo.x = solo.width/2;
    }
    if(pontuacao>0 && pontuacao % 100 === 0){
      chekpoint.play()
    }
    //saltar quando a tecla de espaço é pressionada
    if(touches.lenght>0||keyDown("space")&& trex.y >= height-80) {
       trex.velocityY = -13;
      console.log("pulo")
      jump.play()
      touches=[]
  }
  
    //adicionar gravidade
    trex.velocityY = trex.velocityY + 0.8
   console.log(trex.y)
    //gerar as nuvens
    gerarNuvens();
  
    //gerar obstáculos no solo
    gerarObstaculos();
    
    if(grupodeobstaculos.isTouching(trex)){
      fail.play()
        estadoJogo = ENCERRAR;
      //trex.velocityY = -13;
    }
  }
     else if (estadoJogo === ENCERRAR) {
      solo.velocityX = 0;
      trex.changeAnimation("collided" , trex_colidiu)
      grupodeobstaculos.setLifetimeEach(-1)
     grupodeobstaculos.setVelocityXEach(0);
     grupodenuvens.setVelocityXEach(0);
     grupodenuvens.setLifetimeEach(-1) 
     trex.velocityY =0;  
        gameoverimage.visible=true
    restartimage.visible=true
     if(mousePressedOver(restartimage)){
       console.log("restart")
       reinicio()
     } 
   }
  
  
  //evita que o Trex caia no solo
  trex.collide(soloinvisivel);

  
  console.log("num sei")
  drawSprites();
}

function reinicio(){
 estadoJogo =JOGAR;
 grupodenuvens.destroyEach()
 grupodeobstaculos.destroyEach()
 pontuacao=0 
   gameoverimage.visible=false
    restartimage.visible=false
  trex.changeAnimation("running", trex_correndo)
}
function gerarObstaculos(){
 if (frameCount % 60 === 0){
   var obstaculo = createSprite(width,height-30,10,40);
  obstaculo.velocityX =-4;
    //gerar obstáculos aleatórios
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstaculo.addImage(obstaculo1);
              break;
      case 2: obstaculo.addImage(obstaculo2);
              break;
      case 3: obstaculo.addImage(obstaculo3);
              break;
      case 4: obstaculo.addImage(obstaculo4);
              break;
      case 5: obstaculo.addImage(obstaculo5);
              break;
      case 6: obstaculo.addImage(obstaculo6);
              break;
      default: break;
    }
   
    //atribuir escala e tempo de duração ao obstáculo         
    obstaculo.scale = 0.5;
    obstaculo.lifetime = width/50;
   
    //adicionar cada obstáculo ao grupo
    grupodeobstaculos.add(obstaculo);
 }
}

function gerarNuvens() {
  //escreva o código aqui para gerar as nuvens 
  if (frameCount % 60 === 0) {
    nuvem = createSprite(width,100,40,10);
    nuvem.y = Math.round(random(10,60));
    nuvem.addImage(imagemdanuvem);
    nuvem.scale = 0.5;
    nuvem.velocityX = -3;
    
     //atribuir tempo de duração à variável
    nuvem.lifetime = width/100;
    
    //ajustando a profundidade
    nuvem.depth = trex.depth;
    trex.depth = trex.depth + 1;
        
    //adiciondo nuvem ao grupo
   grupodenuvens.add(nuvem);
  }
}

