function Camera (player)
{
    this.player = player;
    this.offset = {x: 0, y: 0};
    this.position = {x: 0, y: 0};
    this.minX = 0;
    this.maxX = 800;
    this.minY = 0;
}

Camera.prototype.Start = function ()
{
    this.offset.x = this.player.position.x;
    this.offset.y = 400;
}

Camera.prototype.Update = function (deltaTime)
{
    this.position.x = this.player.position.x - this.offset.x;
        
}
