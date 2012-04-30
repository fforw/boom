//(function($){
    
var directions = {};

directions[CONTROL_UP] = {dx: 0, dy: -1, bank: 3};
directions[CONTROL_DOWN] = {dx: 0, dy:  1,bank: 2};
directions[CONTROL_LEFT] = {dx: -1, dy: 0, bank: 1};
directions[CONTROL_RIGHT] = {dx: 1, dy:  0, bank: 0};

var DIR_MASK = CONTROL_UP | CONTROL_DOWN | CONTROL_LEFT | CONTROL_RIGHT;

this.Player = Class.extend({
init:
    function(control, tileSet, x, y)
    {
        this.control = control;
        this.tileSet = tileSet;
        this.x = x;
        this.y = y;
        this.action = 0;
        this.dir = directions[CONTROL_RIGHT];
        this.walk = false;

        this.tmp = document.createElement("canvas");
        this.tmp.width = tileSet.tileWidth;
        this.tmp.height = tileSet.tileHeight;
        
        this.attackReleased = true;
    },
move:    
    function(delta, fnValidate)
    {
        var newAction = this.control.action;
        
        if (newAction != this.action)
        {
            this.action = newAction;
            
            if (newAction)
            {
                if (newAction & DIR_MASK)
                {
                    this.animStep = Math.random() > 0.5 ? 3 : 7;
                    
                    this.dir = directions[newAction & DIR_MASK] || this.dir;
                    this.walk = true;
                }
                
                if (newAction & CONTROL_ATTACK)
                {
                    if (this.attackReleased)
                    {
                        var scale = this.tileSet.scale;
                        var tw = this.tileSet.tileWidth;
                        
                        var tx = Math.floor((this.x + tw / 2) / tw) * tw;
                        var ty = Math.floor(this.y / Application.yStep) * Application.yStep;
                        
                        new Spell(Math.floor(tx + 20 * scale), Math.floor(ty + 150 * scale));
                        this.attackReleased = false;
                    }
                }
                else
                {
                    this.attackReleased = true;
                }
            }
            else
            {
                this.animStep = 2;
                this.walk = false;
            }
        }
        
        if (this.walk)
        {
            var speed = (this.dir.dx != 0 ? 15 : 12) / 80 * this.tileSet.scale;

            var deltaX = this.dir.dx * delta * speed;
            var deltaY = this.dir.dy * delta * speed;
            
            if (fnValidate(this.x,this.y,deltaX,deltaY))
            {
                this.x += deltaX;
                this.y += deltaY;
            }
            
            this.animStep = (this.animStep  + (1 / 80 * delta)) % 8; 
        }
        
    },
currentBlock:
    function()
    {
       return this.dir.bank * 8 + Math.floor(this.animStep);
    },
draw:    
    function(ctx)
    {
        this.tileSet.draw(ctx, this.currentBlock(), 0, 0);//Math.round(this.x), Math.round(this.y) );
    }
});
//})(jQuery);