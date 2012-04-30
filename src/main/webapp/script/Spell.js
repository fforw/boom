(function($)
{
    
var spellFrames = null;    

var $doc = $(document);

this.Spell = Class.extend({
    init:
        function(x, y, delay, strength)
        {
            this.x = x;
            this.y = y;
            this.delay = delay || 2000;
            this.strength = strength || 2;
            this.step = Math.floor(Math.random() * spellFrames.length);
            
            this.birth = new Date().getTime();
            this.time = this.birth;
            
            Application.register(this);
        },
    draw:
        function(ctx, delta)
        {
            var appScale = Application.scale;
            var tw = backgroundSet.tileWidth;
            var yStep = YSTEP * appScale;
            var blast = this.blast;
            if (blast)
            {
                var h = yStep * blast.bu;
                var hScale = Math.floor(h);
                var scale = Math.floor(appScale * 64 );
                ctx.drawImage(spellFrames[this.step], 0, 0, 64, 64, this.x, this.y - h + yStep , scale, hScale);
                
                h = yStep * blast.bd;
                var hScale = Math.floor(h);
                var scale = Math.floor(appScale * 64 );
                ctx.drawImage(spellFrames[this.step], 0, 0, 64, 64, this.x, this.y, scale, hScale);
                
                var w = tw * blast.bl;
                var wScale = Math.floor(w);
                var scale = Math.floor(appScale * 64 );
                ctx.drawImage(spellFrames[this.step], 0, 0, 64, 64, this.x - w + tw, this.y , wScale, scale);

                w = tw * blast.br;
                var wScale = Math.floor(w);
                var scale = Math.floor(appScale * 64 );
                ctx.drawImage(spellFrames[this.step], 0, 0, 64, 64, this.x, this.y, wScale, scale);
            }
            else
            {
                if (this.time - this.birth > this.delay)
                {
                    this.ignite();
                }
                
            }
            var scale = Math.floor(appScale * 64);
            ctx.drawImage(spellFrames[this.step], 0, 0, 64, 64, this.x, this.y, scale, scale);
            
            this.time += delta;
            
            
            
            this.step++;
            var len = spellFrames.length;
            if (this.step >= len)
            {
                this.step -= len;
            }
        },
    createFrames:
        function()
        {
            spellFrames = createSpellFrames();        
        },
    ignite:
        function()
        {
            $doc.trigger("spellIgnite", this);
        }
    });
        
})(jQuery);
