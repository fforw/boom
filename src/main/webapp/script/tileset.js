    
this.TileSet = Class.extend({
init:
    function($image,tileWidth,tileHeight,scale)
    {
        console.debug("$image = %x", $image, $image.width(), $image.height());
    
        this.originalTileWidth = tileWidth;
        this.originalTileHeight = tileHeight;
        this.tileWidth = Math.floor(this.originalTileWidth * scale);
        this.tileHeight = Math.floor(this.originalTileHeight * scale);
        this.scale = scale;
        
        var imageWidth = $image[0].width;
        var imageHeight = $image[0].height;
        this.tilesPerRow = Math.floor(imageWidth/ this.originalTileWidth); 
        this.rows = Math.floor( imageHeight / this.originalTileHeight); 
        
        this.canvas = document.createElement('canvas');
        
        var w = this.tileWidth * this.tilesPerRow;
        var h = this.tileHeight * this.rows;
        this.canvas.width = w;
        this.canvas.height = h;
        
        var ctx = this.canvas.getContext('2d');
        ctx.fillStyle = "rgba(0,0,0,0)";
        ctx.fillRect(0,0, width, height);
        
        ctx.drawImage($image[0], 0, 0, imageWidth, imageHeight, 0, 0, w, h);
        
    },
draw:
    function(ctx,block,x,y)
    {
        if (this.emptyBlock === block)
        {
            return;
        }
    
        var tileY = Math.floor(block / this.tilesPerRow);
        var tileX = block % this.tilesPerRow;
        
        var tw = this.tileWidth;
        var th = this.tileHeight;
        
        var tx = tileX * tw;
        var ty = tileY * th;
        
        ctx.drawImage(this.canvas, tx, ty, tw, th, x, y, tw, th);
    }
});    
    
