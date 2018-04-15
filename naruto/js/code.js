
var canvas;
var ctx;

var pi_2 = Math.PI * 2;

var fixedDeltaTime = 0.01666666; // 60fps: 1 frame each 16.66666ms
var deltaTime = fixedDeltaTime;

var time = 0,
    FPS  = 0,
    frames    = 0,
    acumDelta = 0;

    var timer=0;

// images references
var playerImg,floorImg,mountain,cloudImg,obstacleImg,goalImg,ramenImg,liveImg;//Sprites
var jumpSound, endSound,mainTheme;//Sonidos
var floors = [];//Suelos
var ramens = [];//PowerUps
var obstacles = [];

var goal;//Final
var end = false;//Hemos terminado?

var camera;//camara
var player;//jugador
function Init ()
{
    // preparamos la variable para el refresco de la pantalla
    window.requestAnimationFrame = (function (evt) {
        return window.requestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function (callback) {
                window.setTimeout(callback, fixedDeltaTime * 1000);
            };
    }) ();

    canvas = document.getElementById("my_canvas");
    
    if (canvas.getContext)
    {
        ctx = canvas.getContext('2d');
        //Cargamos todos los elementos
        jumpSound = document.getElementById('sound_jump');
        endSound = document.getElementById('sound_end');
        mainTheme = document.getElementById('sound_theme');
        goalImg = new Image();
        goalImg.src= "./images/stand.png";
        liveImg = new Image();
        liveImg.src= "./images/health.png";
        ramenImg = new Image();
        ramenImg.src= "./images/ramen.png";
        mountain= new Image();
        mountain.src= "./images/mountains.png";
        cloudImg= new Image();
        cloudImg.src= "./images/cloud.png";
        obstacleImg= new Image();
        obstacleImg.src="./images/ob.png";

        floorImg = new Image();
        floorImg.src="./images/floor.png";
        //Cargamos Player
        playerImg = new Image();
        playerImg.src = "./images/naruto.png";
        playerImg.onload = Start();
        
        


    }
}

function Start ()
{
    // setup keyboard events
    SetupKeyboardEvents();

    // setup mouse events
    SetupMouseEvents();

    // initialize Box2D
    PreparePhysics(ctx);

//Inicamos el sonido
mainTheme.currentTime=0;
mainTheme.play();
    
//Iniciamos el timer

setInterval(function()
{
    this.timer++
},1000)
 // init background
    background.Start();
    //Player start
    player.Start();   
    //Camera Start
    camera = new Camera(player);
    camera.Start();  
    //Creamos el escenario
    CreatePath();    
    
    // first call to the game loop
    Loop();
}

function Loop ()
{
    requestAnimationFrame(Loop);

    var now = Date.now();
    deltaTime = now - time;
    if (deltaTime > 1000) // si el tiempo es mayor a 1 seg: se descarta
        deltaTime = 0;
    time = now;

    frames++;
    acumDelta += deltaTime;

    if (acumDelta > 1000)
    {
        FPS = frames;
        frames = 0;
        acumDelta -= 1000;
    }
    
    // transform the deltaTime from miliseconds to seconds
    deltaTime /= 1000;

    // Game logic -------------------
    Update();

    // Draw the game ----------------
    Draw();

    //
    input.postUpdate();
}

function Update ()
{
    input.update();

    player.Update(deltaTime);

    // update physics    
    world.Step(deltaTime, 8, 3);
    

    // player logic
    if (input.isKeyDown(KEY_SPACE))
    {  
        
        this.ChangeGravity();
    }

    if (input.isKeyPressed(KEY_LEFT))
        player.moveLeft = true;

    if (input.isKeyPressed(KEY_RIGHT))
        player.moveRight = true;
    if (input.isKeyPressed(KEY_ENTER) && (player.dead || player.win))//Si perdemos o ganamos y pulsamos enter refrescamos para empezar de nuevo
     {
        location.reload(true);
     }

     //Update de los ramens para comprobar si hay que borrar alguno
     for (var i = 0; i < ramens.length; i++){

        if(ramens[i].toDelete)
        {
            world.DestroyBody(ramens[i].body);
            ramens.splice(i,1);
        }
    }
    

    if(player.win)
    {
        //Sonido de victoria
        if(!this.end)
        {
            this.end=true;
            mainTheme.pause();
            endSound.currentTime = 0;
            endSound.play();
            
        }
        
    }
    camera.Update(deltaTime);

}

function Draw ()
{
    // clean the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    //En tiempo de juego
if(!player.dead && !player.win){
    // draw the background
    background.Draw(ctx);

    ctx.save();
    ctx.translate(-camera.position.x, -camera.position.y);


    // draw the world
    DrawWorld(world);

    
    //Draw Player

    player.Draw(ctx);
    //Pintamos el final
    goal.Draw(ctx);
   //Pintamos las plataformas
    for (var i = 0; i < floors.length; i++)
        floors[i].Draw(ctx);
     //Pintamos los obstaculos   
    for (var i = 0; i < obstacles.length; i++)
        obstacles[i].Draw(ctx);
    //Pintamos los PW
    for (var i = 0; i < ramens.length; i++)
        ramens[i].Draw(ctx);
    
           
   
    
    ctx.restore();

    
    // draw the FPS
    ctx.fillStyle = "#ff8300";
    ctx.font= "20px Permanent Marker";
    
    ctx.fillText('Score: ' + Math.round(player.score), 10, 50);//Pintamos la puntuación
    ctx.fillText('Lives', 10, 80);//Pintamos las vidas restantes
    //Barra de vida
     ctx.drawImage(this.liveImg,
                70,
                60,
                0.2 * scale*player.lives,20);
    // ctx.fillText('Lives: ' + player.lives, 10, 80);//Pintamos las vidas restantes
    ctx.fillText('Time: ' + this.timer, 10, 110);}//Pintamos el tiempo transcurrido
    else
    {
    
        ctx.fillStyle="black";
        ctx.font= "20px Comic Sans";
        ctx.fillStyle = "#ff8300";
        ctx.font= "80px Permanent Marker";
        //Pintamos el texto correspondiente
        if(player.dead)
            ctx.fillText('You died!', canvas.width/2-180, canvas.height/2);
        else
            ctx.fillText('Itadakimasu!', canvas.width/2-250, canvas.height/2);
        //Pintamos la puntuación final
        ctx.fillStyle = "white";
        ctx.font= "20px Permanent Marker";   
        var scoretmp= (player.score+(player.lives*100))
        ctx.fillText('Score: ' + Math.round(scoretmp),canvas.width/2-75, canvas.height/2+50);
        ctx.fillText('Press Enter to Restart',canvas.width/2-140, canvas.height/2+100);
    }
}



function DrawWorld (world)
{
    // Transform the canvas coordinates to cartesias coordinates
    ctx.save();
    ctx.translate(0, canvas.height);
    ctx.scale(1, -1);
    world.DrawDebugData();
    ctx.restore();
}

//Construimos el escenario
function CreatePath()
{
    var total=500;//Longitud
   for(var i= 0;i<20;++i)
   {
     var flortmp = NewFloor({x: 0, y: i*100,width:1.0, height:0.5});
                 flortmp.Start();
                 floors.push(flortmp);
   }

    for(var i= 0;i<total;++i)
    {
        if(i<3)
        {
             var flortmp = NewFloor({x: i*100, y: 0,width:0.5, height:0.2});
                 flortmp.Start();
                 floors.push(flortmp);
                 var flortmp = NewFloor({x: i*100, y: canvas.height,width:0.5, height:0.2});
                 flortmp.Start();
                 floors.push(flortmp);
        }else
        {
            // if( !i%2==0)
            // {
                var random= Math.round(Math.random() *6);
            console.log(random);
            switch(random)
            {
                case 0:
                var flortmp = NewFloor({x: i*100, y: canvas.height,width:0.5, height:0.2});
                    flortmp.Start();
                    floors.push(flortmp);
                break;
                case 1:
                   var flortmp = NewFloor({x: i*100, y: 0,width:0.5, height:0.7});
                    flortmp.Start();
                    floors.push(flortmp);
                    var obstacle = NewObstacle({x: i*100, y:80,width:0.4, height:0.1,inverse:1});
                    obstacle.Start();
                    obstacles.push(obstacle)
                    var flortmp = NewFloor({x: i*100, y: canvas.height,width:0.5, height:0.2});
                    flortmp.Start();
                    floors.push(flortmp);
                    break;
                default:
                    
                    var random= Math.round(Math.random() * 10);
                        if(random==1)
                        {
                            var ramen = NewRamen({x: i*100, y:50,width:0.2, height:0.2});
                            ramen.Start();
                            ramens.push(ramen);
                        }
                    var flortmp = NewFloor({x: i*100, y:0,width:0.5, height:0.2});
                    flortmp.Start();
                    floors.push(flortmp);
                    random= Math.round(Math.random() * 3);
                        console.log(random);
                        switch(random)
                        {
                            case 0:
                            
                            break;
                            case 1:
                               
                                var flortmp = NewFloor({x: i*100, y: canvas.height,width:0.5, height:0.7});
                                flortmp.Start();
                                floors.push(flortmp);

                                var obstacle = NewObstacle({x: i*100, y:canvas.height-80,width:0.4, height:0.1,inverse:-1});
                                obstacle.Start();
                                obstacles.push(obstacle)
                                break;
                                default:
                                var flortmp = NewFloor({x: i*100, y: canvas.height,width:0.5, height:0.2});
                                 flortmp.Start();
                                 floors.push(flortmp);
                                 break;
                        }


                    break;
                }       
           
                           
        }
        
            if(i==total-1)
            {
             goal = NewGoal({x: i*100.5, y:172,width:2, height:2});
             goal.Start();
            }
        
       

    }

     
                                

     

    
}

function ChangeGravity()
{
    if(player.canJump)
        {
            jumpSound.currentTime = 0;
            jumpSound.play();//Reproducimos el sonido
            player.reverse= player.reverse*(-1);//Giramos el personaje
            world.m_gravity.y=-world.m_gravity.y;//Invertimos la gravedad del mundo
        }
        
        console.log( world.m_gravity.y);
        player.canJump=false;
}

