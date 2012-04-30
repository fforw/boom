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
            this.strength = strength || 1000;
            this.step = 0;
            
            this.birth = new Date().getTime();
            this.time = this.birth;
            
            Application.register(this);
        },
    draw:
        function(ctx, delta)
        {
            var scale = Math.floor(Application.scale * 64);
        
            ctx.drawImage(spellFrames[this.step], 0, 0, 64, 64, this.x, this.y, scale, scale);
            
            this.step++;
            var len = spellFrames.length;
            if (this.step >= len)
            {
                this.step -= len;
            }

            this.time += delta;
            
            if (this.time - this.birth > this.delay)
            {
                this.ignite();
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
