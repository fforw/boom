    
this.TileSet = Class.extend({
init:
    function($image,tileWidth,tileHeight,scale)
    {
        console.debug("$image = %x", $image, $image.width(), $image.height());
    
        this.$image = $image;
        this.originalTileWidth = tileWidth;
        this.originaltileHeight = tileHeight;
        this.tileWidth = Math.floor(this.originalTileWidth * scale);
        this.tileHeight = Math.floor(this.originaltileHeight * scale);
        this.scale = scale;
        
        this.tilesPerRow = Math.floor($image[0].width / this.originalTileWidth); 
        this.rows = Math.floor($image[0].height / this.originaltileHeight); 
    },
draw:
    function(ctx,block,x,y)
    {
        var tileY = Math.floor(block / this.tilesPerRow);
        var tileX = block % this.tilesPerRow;
    
        var tw = this.originalTileWidth;
        var th = this.originaltileHeight;
        
        ctx.drawImage(this.$image[0], tileX * tw, tileY * th, tw, th, x, y, this.tileWidth, this.tileHeight);
    }
});    
    
