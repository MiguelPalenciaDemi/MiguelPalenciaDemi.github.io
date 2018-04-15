
function newButton (options)
{
    return {
        

        width: "50px",
        height: "50px",
        position: {x: options.x, y: options.y},
        action:options.action;

        Start: function () {
            
        },

        Update: function (deltaTime) {
            
        },

        Draw: function (ctx) {
           

            ctx.save();

            ctx.translate(posX, posY);
            ctx.scale(this.imgScale, this.imgScale);

            ctx.drawImage(this.img,
                this.width ,
                -this.height,
                this.width , this.height);

            ctx.restore();
        }

        CheckClick: function(clickX,clickY)
        {
            if(clickX>this.position.x && clickX>this.position.x + this.width &&
                clickY>this.position.y && clickY<this.position.y+this.height)
            {
                if (action=="jump")
                 {
                    
                 }
            }
        }
    }
}
