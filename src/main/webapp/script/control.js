var CONTROL_UP = 1;
var CONTROL_DOWN = 2;
var CONTROL_LEFT = 4;
var CONTROL_RIGHT = 8;
var CONTROL_ATTACK = 16;

var CONTROL_EXCLUSIVE_MASK = CONTROL_UP | CONTROL_DOWN | CONTROL_LEFT | CONTROL_RIGHT;

(function($)
{

var controls = [];    
    
var registered = false;    

function onKey(ev)
{
    for(var i = 0, len = controls.length; i < len; i++)
    {
        var ctrl = controls[i];
        if (ctrl.onKey)
        {
            ctrl.onKey(ev,this);
        }
    }
}

function combineActions(oldAction,action)
{
    return (action & CONTROL_EXCLUSIVE_MASK ? this.action & ~CONTROL_EXCLUSIVE_MASK : this.action) | action;
}

function registerEvents()
{
    if (!registered)
    {
        $(document).keyup(onKey).keydown(onKey);
        registered = true;
    }
}

this.KeyBasedControl = Class.extend({
init:
    function(config)
    {
        this.keyCodes = {};
        for (var k in config)
        {
            this.keyCodes[config[k]] = window[k];
        }
        
        controls.push(this);
        registerEvents();
    },
onKey:
    function(ev)
    {
        var action = this.keyCodes[ev.keyCode];
        
        if (action)
        {
            if (ev.type == "keydown")
            {
                this.action = combineActions(this.action, action);
            }
            else
            {
                this.action = this.action & ~action;
            }
        }
    }
});

})(jQuery);