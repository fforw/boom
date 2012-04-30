(function()
{

var TAU = Math.PI * 2;

var backCtx, backBuffer, screen,texture,txo = 0,tyo = 0, txo2 = 0, tyo2 = 0,txo3=0;
var colors,colors2,colors3;

function setPixel(off, r,g,b,a)
{
    var data = screen.data;
    
    a = a / 255.0;
    if (a > 1)
    {
        a = 1;
    }
    
    data[off    ] = Math.round(data[off    ] * (1 - a) + r * a);
    data[off + 1] = Math.round(data[off + 1] * (1 - a) + g * a);
    data[off + 2] = Math.round(data[off + 2] * (1 - a) + b * a);
    data[off + 3] = 255;
    
}

var cutoff = 96;

function drawSphere(txOff,tyOff, bg, palette, radius)
{
    var data = screen.data;
    var dl = data.length;
    var scanWidth = 256 * 4;
    var rSquared = radius * radius;

    var dy = -radius;
    for (var yOff = (64 - radius) * scanWidth; dy < radius; yOff += scanWidth)
    {
        var l = Math.round(Math.sqrt(rSquared - dy * dy));
        //console.debug(dx);
        for (var dx = 64 - l, max = 64 + l; dx < max; dx++)
        {
            var xOff = dx*4;
            var y = (64 + dy);
            var x = Math.acos((dx - 64) / l) * 128 / Math.PI; 
            
            var col = texture[((y + tyOff) & 255) * 256 + ((x + txOff) & 255)];
            
            if (col >= cutoff)
            {
                var color = palette[Math.round(col - cutoff)];
                setPixel(yOff + xOff, color.r, color.g, color.b, color.a);
            }
        }
        dy++;
    }
}
function drawFrame()
{
    var data = screen.data;
    for (var i=0; i < data.length; i+=4)
    {
        data[i] = 160;
        data[i+1] = 160;
        data[i+2] = 160;
        data[i+3] = 0;
    }

    drawSphere(txo2,tyo2, true, colors, 64);
    drawSphere(txo3,0, false, colors3, 48);
    drawSphere(txo,tyo, false, colors2, 64);
    
    //backCtx.clearRect(0,0,256,256);
    backCtx.putImageData(screen, 0, 0);

    var canvas = document.createElement("canvas");
    canvas.width = 64;
    canvas.height = 64;
    
    canvas.getContext("2d").drawImage(backBuffer, 0, 0, 128,128, 0,0, 64,64);
    
    txo -= 2;
    tyo += 4;
    txo2 += 2;
    tyo2 -= 4;

    txo3 += 4;
    
    return canvas;
}

this.createSpellFrames = function()
{
    var a0 = 0; 
    var a1 = TAU / 4;
    var a2 = TAU / 2; 
    var a3 = 3 * TAU / 4; 

    var xa0 = TAU / 128;
    var xa1 = TAU / 64;
    var xa2 = TAU / 256;
    var xa3 = TAU / 64;

    var ya0 = TAU / 128;
    var ya1 = TAU / 256;
    var ya2 = TAU / 128;
    var ya3 = TAU / 64;
    
    
    texture = [];
    var offset = 0;
    for (var y = -128; y < 128; y++)
    {
        for (var x = -128; x < 128; x++)
        {
            texture[offset++] = 128 + ( Math.sin(a0) + Math.sin(a1) + Math.sin(a2) + Math.sin(a3) ) * 32;
            
            a0 += xa0;
            a1 += xa1;
            a2 += xa2;
            a3 += xa3;
        }

        a0 += ya0 - xa0 * 256;
        a1 += ya1 - xa1 * 256;
        a2 += ya2 - xa2 * 256;
        a3 += ya3 - xa3 * 256;
    }

    colors = palette(
            new VectorRGBA(  0,  0,128,  0),
            new VectorRGBA(128,  0, 64,255),
            new VectorRGBA(192,  0,  0,255),
            new VectorRGBA(256, 64,  0,255),
            256 - cutoff);
    
    colors2 = palette(
            new VectorRGBA(255,  0,  0,  0),
            new VectorRGBA(255,153,  0,255),
            new VectorRGBA(255,204, 64,255),
            new VectorRGBA(255,255,192,255),
            256 - cutoff);

    colors3 = palette(
            new VectorRGBA(255, 204,   0,  0),
            new VectorRGBA(255, 255,   0,  128),
            new VectorRGBA(255, 255, 255,  255),
            new VectorRGBA(255, 255, 255,  255),
            256 - cutoff);

    backBuffer = document.createElement("canvas");
    backBuffer.width = 128;
    backBuffer.height = 128;
    
    backCtx = backBuffer.getContext("2d");
    screen = backCtx.createImageData(256,256);
    
    var canvasses = [];
    for (var i = 0; i < 64 ; i++)
    {
        canvasses[i] = drawFrame();
    }
    
    return canvasses;
};

})();