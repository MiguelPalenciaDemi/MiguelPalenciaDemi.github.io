
var background = {

    // fondo cielo
    layer0: {
        position: {x: 0, y: 0},

        Draw: function (ctx) {
            var bgGrd = ctx.createLinearGradient(0, 0, 0, canvas.height);
            bgGrd.addColorStop(0, "#38393a");
            bgGrd.addColorStop(1, "#75777a");
            ctx.fillStyle = bgGrd;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
    },

    // estrellas
    layer1: {
        position: {x: 0, y: 0},
        img: null,
        speed: 0.04,
        clouds: [],

        Start: function () {
            this.img = cloudImg;
            // creamos un numero determinado de estrellas con posiciones y radio aleatorios

            for(var i =0;i<50;++i)
            {
                this.clouds.push({
                    position: {
                        x: i*1024,
                        y: 0
                    },
                    
                });
            }
            
        },

        Draw: function (ctx) {
            for (let i = 0; i < this.clouds.length; i++)
            {
                ctx.drawImage(this.img, this.clouds[i].position.x - (camera.position.x * this.speed),
                canvas.height - this.img.height - (camera.position.y * this.speed));
                
            }
        }
    },

    // montaña
    layer2: {
        position: {x: 0, y: 0},
        speed: 0.08,
        img: null,

        Start: function () {
            this.img = mountain;
        },

        Draw: function (ctx) {
            ctx.drawImage(this.img,
                 - (camera.position.x * this.speed),
                canvas.height - this.img.height - (camera.position.y * this.speed));
        }
    },

    layer3: {
        position: {x: 0, y: 0},
        speed: 0.4,

        Draw: function (ctx) {
            
        }
    },

    layers : null,

    // inicializamos el array de capas del fondo
    Start: function () {
        this.layers = new Array(this.layer0, this.layer1, this.layer2, this.layer3);
        for (let i = 0; i < this.layers.length; i++)
        {
            if (typeof(this.layers[i].Start) !== 'undefined')
                this.layers[i].Start();
        }
    },

    Draw: function (ctx) {
        for (let i = 0; i < this.layers.length; i++)
            this.layers[i].Draw(ctx);
    }

};
