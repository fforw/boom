(function($)
{
    
var ctx,screen;

var gxo=0,gyo=0;
var gxo2=0,gyo2=0;

function mainLoop()
{
    var data = screen.data;
    var dl = data.length;
    var scanWidth = 256 * 4;
    var rSquared = 128 * 128;
    
    
    var dy = -128;
    for (var yOff = 0; yOff < dl; yOff += scanWidth)
    {
        var l = Math.round(Math.sqrt(rSquared - dy * dy));
        
        var xss = 128 / l;
        //console.debug(dx);
        for (var dx = 128 - l, max = 128 + l,xs = -64; dx < max; dx++, xs += xss)
        {
            var xOff = dx*4;
            var y = (128 + dy);
            var x = xs; 
            
            var col = 128 + (Math.cos((gxo+x)/19) + Math.sin((gyo+y)/21) + Math.sin((gyo2+x)/17) + Math.cos((gxo2+y)/13)) * 32;
            
            data[yOff + xOff] = col;
            data[yOff + xOff + 1] = col * 0.8;
            data[yOff + xOff + 2] = 0;
            data[yOff + xOff + 3] = col < 128 ? 0 : 255;
        }
        dy++;
    }
    
    gxo += 2;
    gyo -= 4;
    gxo2 += 2;
    gyo2 -= 4;
    
    ctx.fillRect(0,0,256,256);
    ctx.putImageData(screen, 0, 0);
    
    window.setTimeout(mainLoop, 20);
}

$(function(){
    var canvas = $("#teh_canvas")[0];
    canvas.width = 256;
    canvas.height = 256;
    
    ctx = canvas.getContext("2d");
    ctx.fillStyle = "#aaa";
    
    ctx.fillRect(0,0,256,256);

    screen = ctx.createImageData(256,256);
    
    var data = screen.data;
    for (var i=0; i < data.length; i+=4)
    {
        data[i] = 160;
        data[i+1] = 160;
        data[i+2] = 160;
        data[i+3] = 255;
    }
    
    mainLoop();
});

})(jQuery);