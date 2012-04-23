    
this.TileSet = Class.extend({
init:
    function($image,tileWidth,tileHeight,scale)
    {
        console.debug("$image = %x", $image, $image.width(), $image.height());
    
        this.$image = $image;
        this.tileWidth = tileWidth;
        this.tileHeight = tileHeight;
        this.scaledTileWidth = Math.floor(this.tileWidth * scale);
        this.scaledTileHeight = Math.floor(this.tileHeight * scale);
        
        this.tilesPerRow = Math.floor($image[0].width / this.tileWidth); 
        this.rows = Math.floor($image[0].height / this.tileHeight); 
    },
draw:
    function(ctx,block,x,y)
    {
        var tileY = Math.floor(block / this.tilesPerRow);
        var tileX = block % this.tilesPerRow;
    
        var tw = this.tileWidth;
        var th = this.tileHeight;
        
        ctx.drawImage(this.$image[0], tileX * tw, tileY * th, tw, th, x, y, this.scaledTileWidth, this.scaledTileHeight);
    }
});    
    
