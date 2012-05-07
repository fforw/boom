(function($)
{

var spellFrames = null;    
var blastFrames = null;
    
function easeInOutQuart(t, b, c, d)
{
    t /= d / 2;
    if (t < 1)
    {
        return c / 2 * t * t * t * t + b;
    }
    t -= 2;
    return -c / 2 * (t * t * t * t - 2) + b;
} 

this.Spell = Class.extend({
init:
    function(x, y, xs, ys, xe, ye, tx, ty,strength,scale, blast)
    {
        this.xs = Math.floor(xs);
        this.ys = Math.floor(ys);
        this.xe = Math.ceil(xe);
        this.ye = Math.ceil(ye);
        this.w = this.xe - this.xs;
        this.h = this.ye - this.ys;
        
        console.debug("xs/ys = %s,%s",this.xs,this.ys);
        console.debug("xe/ye = %s,%s",this.xe,this.ye);
        console.debug("w/h = %s,%s",this.w,this.h);
        
        this.blast = blast;
    
        this.tx = tx;
        this.ty = ty;
        this.scale = scale;
        this.size = Math.round(64 * scale);
        this.halfSize = Math.round(32 * scale);
        
        this.x = Math.round(x + this.halfSize);
        this.y = Math.round(y + this.halfSize);
        
        this.strength = strength || 2;
        this.delay = 2000;

        this.step = Math.floor(Math.random() * spellFrames.length);
        
        this.birth = new Date().getTime();
        this.time = this.birth;
        this.destroyed = false;

        this.buffer = document.createElement("canvas");
        this.buffer.width = this.w;
        this.buffer.height = this.h;
        this.ignited = false;
        
        Application.register(this);
    },
draw:
    function(delta)
    {
        var ctx = this.buffer.getContext("2d");
        var tw = backgroundSet.tileWidth;
        var yStep = YSTEP * this.scale;

        if (this.ignited)
        {
            this.step = (this.step - 1) & 15;
            var blast = this.blast;
            var size = this.size;
            var halfSize = this.halfSize;
            
            ctx.drawImage(blastFrames[this.step     ], 0, 0, 64, 64, Math.floor(this.brx - halfSize), Math.floor(this.bry - halfSize), size, size);
            ctx.drawImage(blastFrames[this.step + 16], 0, 0, 64, 64, Math.floor(this.bdx - halfSize), Math.floor(this.bdy - halfSize), size, size);
            ctx.drawImage(blastFrames[this.step + 32], 0, 0, 64, 64, Math.floor(this.blx - halfSize), Math.floor(this.bly - halfSize), size, size);
            ctx.drawImage(blastFrames[this.step + 48], 0, 0, 64, 64, Math.floor(this.bux - halfSize), Math.floor(this.buy - halfSize), size, size);
            
            var speed = 16 * this.scale * (delta/20);

            var rmax = this.x + blast.br.len * tw  - this.size;
            var rdone = this.brx >= rmax;
            if (!rdone)
            {
                this.brx += speed;
            }
            else
            {
                this.brx = rmax;
            }
            
            var dmax = this.y + blast.bd.len * yStep - this.size;
            var ddone = this.bdy >= dmax;
            if (!ddone)
            {
                this.bdy += speed;
            }
            else
            {
                this.bdy = dmax;
            }
            
            var lmin = this.x - blast.bl.len * tw;
            var ldone = this.blx <= lmin;
            if (!ldone)
            {
                this.blx -= speed;
            }
            else
            {
                this.blx = lmin;
            }
            
            var umin = this.y - blast.bu.len * yStep;
            var udone = this.buy <= umin;
            if (!udone)
            {
                this.buy -= speed;
            }
            else
            {
                this.buy = umin;
            }
            
            
            if (rdone && ddone && ldone && udone && !this.destroyed)
            {
                this.destroyed = true;
                triggerGameEvent("spellDestroy", this);
            }
        }
        else
        {
            this.step++;
            var len = spellFrames.length;
            if (this.step >= len)
            {
                this.step -= len;
            }

            if (this.time - this.birth > this.delay)
            {
                this.ignited = true;
                this.brx = this.x;
                this.bry = this.y;
                this.bdx = this.x;
                this.bdy = this.y;
                this.blx = this.x;
                this.bly = this.y;
                this.bux = this.x;
                this.buy = this.y;
                this.step = 0;
            }

            var rampUp = (this.time - this.birth) / this.delay;
            if (rampUp > 1)
            {
                rampUp = 1;
            }

            var scale = this.size;
            var age = this.time - this.birth;
            if (age < this.delay)
            {
                scale = Math.round(easeInOutQuart(age, this.size / 4, this.size, this.delay)); 
            }
            var half = Math.round(scale / 2);
            
            var x = this.x - half;
            var y = this.y - half;
            ctx.drawImage(spellFrames[this.step], 0, 0, 64, 64, x, y, scale, scale);
        }
        
        
        this.time += delta;
    },
createFrames:
    function()
    {
        spellFrames = drawSpellFrames();
        blastFrames = drawFireballFrames();
    }
});
        
})(jQuery);
