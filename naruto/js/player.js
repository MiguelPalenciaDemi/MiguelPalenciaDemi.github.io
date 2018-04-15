
var player = {
    position: {x: 200, y: 100},
    width: 0.24,
    height: 0.20,
    type:'player',
    isGoingLeft: false,
    score:0,
    lives:5,
    dead:false,
    win:false,
    


    // movement attr
    maxHorizontalVel: 8,
    maxVerticalVel: 4,
    jumpForce: 50,

    moveLeft: false,
    moveRight: false,
    moveUp: false,

    canJump: true,
    isTop:false,
    reverse:1,

    animation: {
        img: null,
        timePerFrame: 1/24,
        currentFrametime: 0,
        frameWidth: 49.25,
        frameHeight: 39,
        actualX: 0,
        actualY: 0,

        Update: function (deltaTime) {
            this.currentFrametime += deltaTime;
            if (this.currentFrametime >= this.timePerFrame)
            {
                // update the animation frame
                this.actualX += this.frameWidth;
                if (this.actualX > 148)
                {
                    this.actualX = 0;
                    
                }
                this.currentFrametime = 0.0;

            }
        },

        Draw: function (ctx) {
            ctx.drawImage(this.img, this.actualX, this.actualY,
                this.frameWidth, this.frameHeight,
                -this.frameWidth / 2, -this.frameHeight / 2,
                this.frameWidth, this.frameHeight); 
        }
    },

    physicsInfo: {
        density: 5,
        fixedRotation: false,
        linearDamping: 10 ,
        user_data: player,
        type: b2Body.b2_dynamicBody,
        restitution: 0,
        friction : 0

    },

    body: null,

    Start: function () {
        this.animation.img = playerImg;

        this.body = CreateBox(world,
            this.position.x / scale, this.position.y / scale,
            this.width, this.height, this.physicsInfo);

        this.body.SetUserData(this);
        this.score=0;
        //this.body.setFriction( 0 )
        //this.body.friction =   0.25f;
    },

    Update: function (deltaTime) {
        this.animation.Update(deltaTime);

        // movement
        if (this.moveRight)
        {
            this.ApplyVelocity(new b2Vec2(1, 0));
            this.moveRight = false;
            this.isGoingLeft = false;
            if (!this.dead&&!this.win)            
                 this.score+=0.01;
            

        }

        if (this.moveLeft)
        {
            this.ApplyVelocity(new b2Vec2(-1, 0));
            this.moveLeft = false;
            this.isGoingLeft = true;
            if (!this.dead &&!this.win)            
                 this.score-=0.010;
        }

        // jump
        if (this.moveUp)
        {
            this.ApplyVelocity(new b2Vec2(0, this.jumpForce));
            this.moveUp = false;
        }
        
        
        if(this.position.y>500)//Si nos caemos recolocamos y restamos una vida
        {
           
            this.body.SetPosition({x:2,y:0.2});
            bodyPosition= this.body.GetPosition();
            this.position.x= bodyPosition.x*scale;
            this.position.y= Math.abs((bodyPosition.y*scale)-canvas.height);
            
            this.lives--;

            if(this.lives<=0)            
               this.dead=true;
            else
                this.score=0;
           
        }

       
        var bodyPosition= this.body.GetPosition();
        this.position.x= bodyPosition.x*scale;
        this.position.y= Math.abs((bodyPosition.y*scale)-canvas.height);

        

        
    },

    Draw: function (ctx) {
        var bodyPosition = this.body.GetPosition();
        var posX = bodyPosition.x * scale;
        var posY = Math.abs((bodyPosition.y * scale) - ctx.canvas.height);

        ctx.save();

        ctx.translate(posX, posY);

        if (this.isGoingLeft)
             ctx.scale(-1, this.reverse);                
       
        else
            ctx.scale(1, this.reverse);
             

        this.animation.Draw(ctx);

        ctx.restore();
    },

    ApplyVelocity: function (vel) {
        var bodyVel = this.body.GetLinearVelocity();
        bodyVel.Add(vel);

        // horizontal movement cap
        if (Math.abs(bodyVel.x) > this.maxHorizontalVel)
            bodyVel.x = this.maxHorizontalVel * bodyVel.x / Math.abs(bodyVel.x);

        // vertical movement cap
        if (Math.abs(bodyVel.y) > this.maxVerticalVel)
            bodyVel.y = this.maxVerticalVel * bodyVel.y / Math.abs(bodyVel.y);

        this.body.SetLinearVelocity(bodyVel);
    },

    Jump: function () {
        if (Math.abs(this.body.GetLinearVelocity().y) > 0)
            return false;

        this.moveUp = true;
    },

    Hitted:function() 
    {
        this.score-=5;
        this.body.ApplyImpulse(new b2Vec2(2,40*this.reverse),this.body.GetPosition())
        this.isTop = true;
        this.canJump=true;
        // new b2Vec2(5, 20*this.reverse)
    }

}
