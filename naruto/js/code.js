
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
var jumpSound, endSound,mainTheme,ramenSound,yohSound;//Sonidos
var floors = [];//Suelos
var ramens = [];//PowerUps
var newChunkObstacles = [];

var goal;//Final
var end = false;//Hemos terminado?
var isPlaying=false;//Estamos jugando ya?
var camera;//camara
var player;//jugador


// level info from json
var levelInfo;
var levelInfoEasy = levelInfo.easy_chunks;

var actualChunks = [];
var actualChunksObstacles = [];
var actualChunksRamens = [];
var numberOfChunksAlive = 3;
var chunksSize = 800;
var olderChunkPosition = 0;

//chunk counter
var chunckCounter = 0

var respawnX = 0;

var limit ;
var goalCreated = false;

var totalNumberChunks = 55;

function Init ()
{

    $('#play').click(function(){
        $('.Maintitle').css("display","none");
        $('.tutorial_container').css("display","flex");
       
        yohSound.currentTime=0;
        yohSound.play();
        // Start();
        mainTheme.currentTime=0;
        mainTheme.play();
    });

    $('#play2').click(function()
    { 
        $('.tutorial_container').css("display","none");
        yohSound.currentTime=0;
        yohSound.play();
        isPlaying=true;
    });
    
    window.screen.orientation.lock('landscape');
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
        ramenSound = document.getElementById('sound_ramen');
        yohSound = document.getElementById('sound_yoh');
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
        playerImg.src = "./images/animation.png";
        //playerImg.onload = ParseJsonLevel(levelInfo);
        playerImg.onload = Start();
        
        


    }
}

function LoadJsonLevel (levelPath)
{
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            ParseJsonLevel(this.responseText);
        }
    };
    xmlhttp.open("GET", levelPath, true);
    xmlhttp.send();
}

function ParseJsonLevel (levelStr)
{
    //levelInfo = JSON.parse(levelStr);

    // start the game loop
    Start();
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

    
//Iniciamos el timer

setInterval(function()
{
    if(isPlaying)
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
    if(isPlaying)
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
    
    
    if(input.clickPress)
    {
        moveMechanicsPhone(input.click.x);        
    }
   
//        moveMechanicsPhone(input.click.x);

   if (input.isKeyPressed(KEY_LEFT)){
       player.moveLeft = true;
       player.moving = true;
   }

   if (input.isKeyPressed(KEY_RIGHT)){
       player.moveRight = true;
       player.moving = true;
   }

   if(!input.isKeyPressed(KEY_RIGHT) && !input.isKeyPressed(KEY_LEFT) && !input.clickPress ){
    console.log("no estoy haciendo nada");
        player.moving = false;
   }

    if (input.isKeyPressed(KEY_ENTER) && (player.dead || player.win))//Si perdemos o ganamos y pulsamos enter refrescamos para empezar de nuevo
     {
        location.reload(true);
     }

     //Update de los ramens para comprobar si hay que borrar alguno
     for (let i = 0; i < actualChunksRamens.length; i++)
        for (let j = 0; j < actualChunksRamens[i].length; j++)
     {

        if(actualChunksRamens[i][j].toDelete)
        {
            world.DestroyBody(actualChunksRamens[i][j].body);
            actualChunksRamens[i].splice(j,1);
        }
    }


    if (camera.position.x - olderChunkPosition >= chunksSize)
    {
        if(chunckCounter<totalNumberChunks)
        {
            // create new chunk
        let newChunk = [];
        let newChunkObstacles = [];
        let newChunkRamens = [];

        // select the chunk randomly from the level.json
        let chunkToAdd = levelInfoEasy[Math.trunc(Math.random() * levelInfoEasy.length)];
        
        let j = 0;
        for (; j < chunkToAdd.platforms.length/2; j++)
        {
            if(chunkToAdd.platforms[j].width>0)
            {
                 let newFloor = NewFloor({
                x: chunkToAdd.platforms[j].x + olderChunkPosition + (chunksSize * numberOfChunksAlive),
                y: chunkToAdd.platforms[j].y,
                width: chunkToAdd.platforms[j].width,
                height: chunkToAdd.platforms[j].height
            });
            newFloor.Start();
            newChunk.push(newFloor);

            if(chunkToAdd.platforms[j].height == 0.7)
            {
                    var obstacle = NewObstacle({
                        x: chunkToAdd.platforms[j].x + olderChunkPosition + (chunksSize * numberOfChunksAlive),
                        y:chunkToAdd.platforms[j].y+80,
                        width:0.4,
                        height:0.1,
                        inverse:1
                    });
                    obstacle.Start();
                    newChunkObstacles.push(obstacle)
            }

            }
           
        }
        for (; j < chunkToAdd.platforms.length; j++)
        {
            if(chunkToAdd.platforms[j].width>0)
            {
                 let newFloor = NewFloor({
                x: chunkToAdd.platforms[j].x + olderChunkPosition + (chunksSize * numberOfChunksAlive),
                y: canvas.height,
                width: chunkToAdd.platforms[j].width,
                height: chunkToAdd.platforms[j].height
            });
            newFloor.Start();
            newChunk.push(newFloor);

            if(chunkToAdd.platforms[j].height == 0.7)
            {
                    var obstacle = NewObstacle({
                        x: chunkToAdd.platforms[j].x + olderChunkPosition + (chunksSize * numberOfChunksAlive),
                        y:canvas.height-80,
                        width:0.4,
                        height:0.1,
                        inverse: -1
                    });
                    obstacle.Start();
                    newChunkObstacles.push(obstacle)
            }

            }
        }

        for(let i = 0; i<chunkToAdd.ramens.length;++i)
        {
            if( Math.random() * (3)<=chunkToAdd.ramens.length)
            {
                let tmpRamen = chunkToAdd.ramens[Math.trunc(Math.random() * chunkToAdd.ramens.length)];
                var ramen = NewRamen({
                x: tmpRamen.x + olderChunkPosition + (chunksSize * numberOfChunksAlive),
                y:tmpRamen.y,
                width:tmpRamen.width,
                height:tmpRamen.height
                });
                ramen.Start();
                newChunkRamens.push(ramen);

                console.log(newChunkRamens.length);
            }

            

        }





        // add the new chunk to the active chunks
        actualChunks.push(newChunk);
        actualChunksObstacles.push(newChunkObstacles);
        actualChunksRamens.push(newChunkRamens);

        // delete the older chunk of the array
        for (let i = 0; i < actualChunks[0].length; i++)
            world.DestroyBody(actualChunks[0][i].body);
        actualChunks.shift();

        for (let i = 0; i < actualChunksObstacles[0].length; i++)
            world.DestroyBody(actualChunksObstacles[0][i].body);
        actualChunksObstacles.shift();

        for (let i = 0; i < actualChunksRamens[0].length; i++)
            world.DestroyBody(actualChunksRamens[0][i].body);
        actualChunksRamens.shift();


        olderChunkPosition += chunksSize;
        limit.body.SetPosition({x:(actualChunks[0][0].position.x-20)/scale, y:(canvas.height/2)/scale});
        limit.position.x= limit.body.GetPosition().x;
        ++chunckCounter;
        if(chunckCounter == totalNumberChunks)
        {
            
             goal = NewGoal({x: (olderChunkPosition + (chunksSize * numberOfChunksAlive))+150, y:172,width:2, height:2});
             goal.Start();
             goalCreated = true;
             console.log(goal);
             console.log(player);
             console.log("goal creada");
        }
        console.log(chunckCounter);
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

    
    //Draw Player and HUD
    if(isPlaying)
    {
        player.Draw(ctx);

    }
        
    //Pintamos el final
    if(goalCreated)
     goal.Draw(ctx);

    for (let i = 0; i < actualChunks.length; i++)
        for (let j = 0; j < actualChunks[i].length; j++)
            actualChunks[i][j].Draw(ctx);
   //Pintamos las plataformas
    // for (var i = 0; i < floors.length; i++)
        // floors[i].Draw(ctx);
     //Pintamos los obstaculos   
     for (let i = 0; i < actualChunksObstacles.length; i++)
        for (let j = 0; j < actualChunksObstacles[i].length; j++)
            actualChunksObstacles[i][j].Draw(ctx);

        //Pintamos los ramens   
     for (let i = 0; i < actualChunksRamens.length; i++)
        for (let j = 0; j < actualChunksRamens[i].length; j++)
            actualChunksRamens[i][j].Draw(ctx);
    
    //Pintamos los PW
    for (var i = 0; i < ramens.length; i++)
        ramens[i].Draw(ctx);
    
        limit.Draw(ctx);
   
    
    ctx.restore();

    
    // draw the FPS


        ctx.fillStyle = "#ff8300";
        ctx.font= "20px Permanent Marker";
        
        ctx.fillText('Score: ' + Math.round(player.score), 10, 50);//Pintamos la puntuación
        ctx.fillText('Lives', 10, 80);//Pintamos las vidas restantes
        // ctx.fillText('X '+limit.body.GetPosition().x, 10, 150);//Pintamos las vidas restantes
        // ctx.fillText('X '+limit.body.GetPosition().y, 90, 150);//Pintamos las vidas restantes
        // ctx.fillText('X '+player.position.x, 10, 180);//Pintamos las vidas restantes

        //Barra de vida
         ctx.drawImage(this.liveImg,
                    70,
                    60,
                    0.2 * scale*player.lives,20);
        // ctx.fillText('Lives: ' + player.lives, 10, 80);//Pintamos las vidas restantes
        ctx.fillText('Time: ' + this.timer, 10, 110);
        // ctx.fillText('total bodies: ' + world.GetBodyCount(), 10, 200);
    }//Pintamos el tiempo transcurrido
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

        let scoretmp=0; 
        if(player.lives<0)  
             scoretmp= (player.score);
        else
             scoretmp= (player.score+(player.lives*100));

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

console.log("estamos en el create path");

for (let i = 0; i < numberOfChunksAlive; i++)
    {
        let newChunk = [];
        let newChunkObstacles = [];
        let newChunkRamens = [];
        // select the chunk randomly from the level.json
        let chunkToAdd = levelInfoEasy[Math.trunc(Math.random() * levelInfoEasy.length)];
        
        let j = 0;
        for (; j < chunkToAdd.platforms.length/2; j++)
        {
            if(chunkToAdd.platforms[j].width > 0) 
            {

                let newFloor = NewFloor({
                x: chunkToAdd.platforms[j].x + (i * chunksSize),
                y: chunkToAdd.platforms[j].y,
                width: chunkToAdd.platforms[j].width,
                height: chunkToAdd.platforms[j].height
                });

                newFloor.Start();
                newChunk.push(newFloor);

                if(chunkToAdd.platforms[j].height == 0.7)
                {
                    
                    var obstacle = NewObstacle({
                        x: chunkToAdd.platforms[j].x + (i * chunksSize),
                        y:chunkToAdd.platforms[j].y+80,
                        width:0.4,
                        height:0.1,
                        inverse:1
                    });
                    obstacle.Start();
                    newChunkObstacles.push(obstacle)
                }

            }
        }
        for (; j < chunkToAdd.platforms.length; j++)
        {
            if(chunkToAdd.platforms[j].width > 0) 
            {

                let newFloor = NewFloor({
                x: chunkToAdd.platforms[j].x + (i * chunksSize),
                y:canvas.height,
                width: chunkToAdd.platforms[j].width,
                height: chunkToAdd.platforms[j].height
                });

                newFloor.Start();
                newChunk.push(newFloor);

                if(chunkToAdd.platforms[j].height == 0.7)
                {
                    var obstacle = NewObstacle({
                        x: chunkToAdd.platforms[j].x + (i * chunksSize),
                        y:canvas.height+80,
                        width:0.4,
                        height:0.1,
                        inverse:-1
                    });
                    obstacle.Start();
                    newChunkObstacles.push(obstacle)
                }

            }
            
        }

        //  for(let i = 0; i<chunkToAdd.ramens.length;++i)
        // {

        //     let tmpRamen = chunkToAdd.ramens[Math.trunc(Math.random() * chunkToAdd.ramens.length)];
        //     var ramen = NewRamen({
        //         x: tmpRamen.x  + (i * chunksSize),
        //         y:tmpRamen.y,
        //         width:tmpRamen.width,
        //         height:tmpRamen.height
        //      });
        //         ramen.Start();
        //         newChunkRamens.push(ramen);

        //         console.log(newChunkRamens.length);

        // }

        // add the new chunk to the active chunks
        actualChunks.push(newChunk);
        actualChunksObstacles.push(newChunkObstacles);
        actualChunksRamens.push(newChunkRamens);
        
        console.log(chunckCounter);
    }

    limit =  NewLimit({
                        x: -20,
                        y:canvas.height/2,
                        width:0.2,
                        height:2,
                        inverse:1
                    });
    limit.Start();





/*
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
*/
                                

     

    
}

function ChangeGravity()
{
    console.log("nos movemos");
    if(player.canJump)
        {
            jumpSound.currentTime = 0;
            jumpSound.play();//Reproducimos el sonido
            player.reverse= player.reverse*(-1);//Giramos el personaje
            world.m_gravity.y=-world.m_gravity.y;//Invertimos la gravedad del mundo
        }
        
        
        player.canJump=false;
}

function moveMechanicsPhone(clickX)
{
    if(clickX<(canvas.width/3))
    {
         player.moving = true;   
         player.moveLeft = true;
    }
    else if(clickX>(canvas.width/3) && clickX<(2*canvas.width/3))
    {
        ChangeGravity();
    }
    else if(clickX>(2*canvas.width/3))
    {
        player.moving = true;
        player.moveRight = true;
    }
    
}