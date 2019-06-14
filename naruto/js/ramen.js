
function NewRamen (options)
{
    return {
        type: "ramen",

        width: options.width,
        height: options.height,
        position: {x: options.x, y: options.y},
        img: ramenImg,
        imgScale: 1,
        toDelete:false,
        
        physicsInfo: {
            density: 0.0001,
            fixedRotation: true,
            linearDamping: 8,
            type: b2Body.b2_kinematicBody,
            isSensor : true
        },

        body: null,

        Start: function () {
            this.body = CreateBox(world,
                this.position.x / scale, this.position.y / scale,
                this.width, this.height, this.physicsInfo);
            this.body.SetUserData(this);
        },

        Update: function (deltaTime) {
            
        },

        Draw: function (ctx) {
            var bodyPosition = this.body.GetPosition();
            var posX = bodyPosition.x * scale;
            var posY = Math.abs((bodyPosition.y * scale) - ctx.canvas.height);

            ctx.save();

            ctx.translate(posX-this.width/2, posY-this.height/2);
            ctx.scale(this.imgScale, this.imgScale);

            ctx.drawImage(this.img,
                -this.width * scale,
                -this.height * scale,
                this.width * scale * 2, this.height * scale * 2);

            ctx.restore();
        }
    }
}
