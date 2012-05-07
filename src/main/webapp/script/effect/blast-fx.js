(function(){

var TAU = Math.PI * 2;
var particles = [];

for (var i = 0; i < 4000; i++)
{
    particles[i] = {
            x: (Math.random() * 128) & 127,
            y: (Math.random() * 128) & 127,
            fadeOut: (Math.random() * 128) & 127
    };
}

function color(n)
{
    var col = yellowFirePalette[n & 63];
    
    return "rgba(" + Math.floor(col.r) + ", " + Math.floor(col.g) + ", " + Math.floor(col.b) + ", " + (col.a / 255.0) + ")";
}

var tmp = document.createElement("canvas");
tmp.width = 128;
tmp.height = 128;

function drawInTmp(offset)
{
    var ctx = tmp.getContext("2d");
    
    var width = 128;
    var height = 128;
    
    ctx.clearRect(0,0,width,height);
    var rSquared = 64 * 64;
    
    for (var i = 0, len = particles.length; i < len; i++)
    {
        var particle = particles[i];
        
        var x = (particle.x + offset) & 127;
        var y = particle.y;
        
        if (x > particle.fadeOut)
        {
            if (x > 64)
            {
                var p = (x - 64);
                var l = Math.sqrt(rSquared - p * p);
                
                y = 64 + ((y - 64) * l / 64);
            }
            
            var col = x > 120 ? "#fff" : color(x / 2);
            
            var w = Math.floor( x * x / ( 2048 + Math.random() * 2048)) + 2;
            ctx.fillStyle = col;
            ctx.fillRect(x - w,y, w,2);
        }
    }
}

function drawFrame(rotate)
{
    var frame = document.createElement("canvas");
    frame.width = 64;
    frame.height = 64;
    
    var ctx = frame.getContext("2d");
    
    ctx.clearRect(0,0,64,64);
    
    ctx.save();
    ctx.translate(32,32);
    ctx.rotate(TAU / 4 * rotate);
    ctx.translate(-32,-32);
    ctx.drawImage(tmp,0,0,128,128,0,0,64,64);
    ctx.restore();
    
    return frame;
}

this.drawFireballFrames = function()
{
    var frames = [];
    
    for (var i=0; i < 16; i++)
    {
        drawInTmp(i * 8);
        frames[i     ] = drawFrame(0);
        frames[i + 16] = drawFrame(1);
        frames[i + 32] = drawFrame(2);
        frames[i + 48] = drawFrame(3);
    }
    
    return frames;
};

})();
