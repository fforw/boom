var TILES_PER_ROW = 21;
var TILE_ROWS = 18;
var YSTEP = 80; 

var UPDATE_ROWS_PER_FRAME = 4;

var gameObjects = [];
var level, room;

var heightMap = [];
var shadowsMap = [];
var levelImageData = null;
var copy = null;
var copy2 = null;
var copyCtx = null;
var tmp = null;
var updateCounter = 0 ;
var updatedUntil = updateCounter;

var spellFrames;


var ws;
var canvas,ctx, width, height,yStep,yCorrect;

var player;



function drawBlocks(ctx,tileX,tileY, x,y)
{
    if (tileX < 0 || tileY < 0)
    {
        return;
    }
    
    var off = tileOffset(tileX, tileY);
    var block = level[off];
    
    if (block != null)
    {
        backgroundSet.draw(ctx,block,x,y);
    }
    
    
    var shadows = shadowsMap[off];
    
    for (var i=0, len = shadows.length; i < len; i++)
    {
        var block = shadows[i];
        if (block != null)
        {
            backgroundSet.draw(ctx,block,x,y);
        }
}

//    if (DEBUG)
//    {
//        var tw = backgroundSet.tileWidth;
//        var th = backgroundSet.tileHeight;
//        
//        if (tileX & 1)
//        {
//            ctx.strokeStyle = debugColors[tileY & 3];
//            ctx.globalAlpha = 0.1;
//            ctx.moveTo(x,y + th);
//            ctx.lineTo(x,y);
//            ctx.lineTo(x+tw,y);
//            ctx.stroke();
//            ctx.globalAlpha = 1;
//        }
//    }
}

var backgroundSet = null;

var lastLoopTime;

function restorePlayer(player)
{
    var px = player.x;
    var py = player.y;
    var tileSet = player.tileSet;
    var tw = tileSet.tileWidth;
    var th = tileSet.tileHeight;
    
    if (py < 0)
    {
        th += py;
        py = 0;
    }

    if (px < 0)
    {
        tw -= px;
        px = 0;
    }
    
    ctx.drawImage(copy, px, py, tw, th, px, py, tw, th);
}

function validatePlayer(x,y,dx,dy) 
{
    var scale = backgroundSet.scale;
    var tw = backgroundSet.tileWidth;
    x += dx;
    y += dy;
    
    if (dx > 0)
    {
        x += 90 * scale;
    }
    else
    {
        x += 10 * scale;
    }
    
    var tileX = Math.floor(x / tw);
    var tileY = Math.floor((y + yCorrect)/ yStep) ;
    
    if (tileX < 0 || tileX >= TILES_PER_ROW || tileY < 0  || tileY >= TILE_ROWS)
    {
        return false;
    }
    
    var block = level[tileY * TILES_PER_ROW + tileX];
    return !block || block == BLOCK_PAD;
}

function getBlastInfo(tx,ty,dx,dy,strength)
{
    var cnt = 0;
    var block = BLOCK_EMPTY;
    
    while ( strength > 0)
    {
        block = level[ tileOffset(tx,ty)];
        
        if (block != BLOCK_EMPTY)
        {
            break;
        }
        
        cnt++;
        tx += dx;
        ty += dy;
        strength--;
    }
    
    var proof = blastProof(block);

    var faded = strength == 0;
    
    if (block != BLOCK_EMPTY && proof && !faded)
    {
        cnt -= dx != 0 ? 1 : 0.5;
    }
    
    var blast = { len: cnt, x: tx, y: ty, proof: proof, faded: faded};
    //console.debug(blast);
    return blast;
}

var blastDirections = {
        "bu": {dx:  0, dy: -1},
        "bd": {dx:  0, dy: 1},
        "bl": {dx: -1, dy: 0},
        "br": {dx:  1, dy: 0}
    };

var jobs = [];
var fullUpdate = true;
        
function onSpellCast(ev, cast)
{
    var scale = backgroundSet.scale;
    var tw = backgroundSet.tileWidth;
    
    var tx = Math.floor((cast.x + tw / 2) / tw);
    var ty = Math.floor(cast.y / yStep) + 1;

    var blast = {};
    for (var name in blastDirections)
    {
        var dir = blastDirections[name];
        info = getBlastInfo( tx, ty, dir.dx, dir.dy, cast.power);
        blast[name] = info;
    }
    
    // x,y screen offset
    var x = Math.floor(tx * tw + 20 * scale);
    var y = Math.floor(ty * yStep + 80 * scale);

    var size = Math.round(64*scale);
    var halfSize = Math.round(32*scale);
    
    // xs,ys to xe,ye = the full maximum area of the blast
    var xs = x - blast.bl.len * tw - halfSize;
    var ys = y - blast.bu.len * yStep - halfSize;
    var xe = x + blast.br.len * tw +  size + halfSize;
    var ye = y + blast.bd.len * yStep + size + halfSize;
    
    var coveringBlocks = [];
    for (var i = 1; i < blast.bl.len; i++)
    {
        var curTx = tx - i;
        var curTy = ty + 1;
        
        var block = level[tileOffset(curTx,curTy)];
        if (block != BLOCK_EMPTY)
        {
            coveringBlocks.push({tx: curTx, ty: curTy, block: block});
        }
    }

    // extra block on the right to fully cover explosion
    for (var i = 1; i <= blast.br.len; i++)
    {
        var curTx = tx + i;
        var curTy = ty + 1;
        
        var block = level[tileOffset(curTx,curTy)];
        if (block != BLOCK_EMPTY)
        {
            coveringBlocks.push({tx: curTx, ty: curTy, block: block});
        }
    }
    
    if (!blast.bd.faded)
    {
        var curTy = Math.round(ty + blast.bd.len);
        var block = level[tileOffset(tx,curTy)];
        
        if (block != BLOCK_EMPTY)
        {
            coveringBlocks.push({ tx: tx, ty: curTy, block: block});
        }
    }

    var isUpdate = false;
    for (var name in blastDirections)
    {
        info = blast[name];
        
        if (!info.faded && !info.proof)
        {
            setBlock(info.x,info.y, BLOCK_EMPTY);
            updateCounter++;
            isUpdate = true;
        }
    }
    blast.updateCounter = updateCounter;

    if (!isUpdate)
    {
        // lower update check counter to force update
        updatedUntil--;
    }
    
    var spell = new Spell( x - xs, y - ys, xs, ys, xe, ye, tx, ty, cast.power, scale, blast);
    spell.coveringBlocks = coveringBlocks;
    
    console.debug("Spell on %s,%s. Covering Blocks = %o", tx,ty,coveringBlocks);
}

function onSpellDestroy(ev, spell)
{
    console.debug("onSpellDestroy, spell = %o", spell);
    
    var newJobs = [];
    for (var i = 0, len = jobs.length; i < len; i++)
    {
        var job = jobs[i];
        if (job.counter == spell.blast.updateCounter)
        {
            copy = job.buffer;
            fullUpdate = true;
        }
        else
        {
            newJobs.push(jobs);
        }
    }
    
    jobs = newJobs;

    removeGameObject(spell);
}

function removeGameObject(gameObject)
{
    var idx = gameObject.index;
    gameObjects.splice(idx,1);
    
    for (var i = idx, len = gameObjects.length; i < len; i++)
    {
        gameObjects[i].index = i;
    }
}

function drawLevel(ctx,minY,maxY)
{
    minY = minY || 0;
    maxY = maxY || TILE_ROWS;

    //console.debug("drawLevel %s to %s", minY, maxY);
    
    var xPos;
    var yPos = minY * yStep;
    var tw = backgroundSet.tileWidth;
    for (var y = minY; y < maxY; y++)
    {
        xPos = 0;
        for (var x=0; x < TILES_PER_ROW; x++)
        {
            drawBlocks( ctx, x, y, xPos, yPos);
            xPos += tw;
        }
        yPos += yStep;
    }
    
}

function createBackBuffer()
{
    var buffer = document.createElement("canvas");
    buffer.width = canvas.width;
    buffer.height = canvas.height;
    var bufferCtx = buffer.getContext('2d');
    bufferCtx.fillStyle = "#aaa";
    bufferCtx.fillRect(0,0, width, height);
    
    return buffer;
}

function initHeightMap()
{
    for (var i=0, len = TILE_ROWS * TILES_PER_ROW; i < len; i++)
    {
        heightMap[i] = blockHeight(level[i]) || 0;
    }
}

function initShadowsMap()
{
    var off = 0;
    for (var y=0; y < TILE_ROWS; y++)
    {
        for (var x=0; x < TILES_PER_ROW; x++)
        {
            shadowsMap[off] = getShadowTilesAt(x,y);
            off++;
        }
    }
}

var UpdateJob = Class.extend({
init:
    function(ctx, counter, buffer)
    {
        this.buffer = buffer;
        this.counter = counter;
        this.pos = 0;
        this.done = false;
        this.ctx = ctx;
    },
run:
    function()
    {
        if (this.pos < TILE_ROWS)
        {
            var ctx = this.buffer.getContext("2d");
            
            var start = this.pos;
            var end = this.pos + UPDATE_ROWS_PER_FRAME;
            if (end >= TILE_ROWS)
            {
                end = TILE_ROWS;
            }
            
            drawLevel(ctx, start, end );
            this.pos = end;
        }
    }
});

var Application = {
init:
    function()
    {
        var $canvas = $("#teh_canvas");
        canvas = $canvas[0];

        Spell.prototype.createFrames();
        
        $doc.bind("spellCast", onSpellCast)
            .bind("spellDestroy", onSpellDestroy);
        
        $("#newLevel").click(function(){
            send({type:"RequestNewLevel", "room" : room});
        });
        
        Loader.load(["../../image/sheet.png","../../image/wizard-anim.png"], Application.onLoad);
    },
onLoad:
    function(images)
    {
        var $window = $(window);
        
        var widthAdjust = 2;
        var topHeight = $("#top").height() + 20;
        
        var scaledToWidth = ($window.width() - widthAdjust) / (101 * TILES_PER_ROW);
        var scaledToHeight = ($window.height() - topHeight) / (YSTEP * (TILE_ROWS - 1) + 171);
        
        var scale = Math.min(scaledToWidth, scaledToHeight);
        
        Application.scale = scale;

        backgroundSet = new TileSet(images[0], 101, 171, scale);
        backgroundSet.emptyBlock = BLOCK_EMPTY;
        wizardSet = new TileSet(images[1], 101, 171, scale);
        //wizardSet.aabb = wizardAABB; 
        
        //console.debug(backgroundSet);
        
        yStep = Math.round(YSTEP * scale);
        
        Application.yStep = yStep;
        
        width = backgroundSet.tileWidth * TILES_PER_ROW;
        height = (yStep * (TILE_ROWS - 1)) + backgroundSet.tileHeight;

        canvas.width = width;
        canvas.height = height;
        
        $("#container").width(width);
        
        var url = 'ws://boom.localhost:9876/appsocket';

        ws = new WebSocket(url);
        ws.onopen = Application.onOpen;
        ws.onclose = Application.disconnected;
        ws.onerror = Application.onerror;
        ws.onmessage = Application.onMessage;
    },
onNewLevel: 
    function()
    {
        initHeightMap();
        initShadowsMap();
        
        player = new Player(new KeyBasedControl({
            CONTROL_ATTACK : 32, 
            CONTROL_UP : 38, 
            CONTROL_DOWN : 40, 
            CONTROL_LEFT : 37, 
            CONTROL_RIGHT : 39  
        }), wizardSet, backgroundSet.tileWidth, yStep / 2);
        
        var tileSet = player.tileSet;
        yCorrect = Math.floor((YSTEP/2) * tileSet.scale);
        
        ctx = canvas.getContext('2d');

        tmp = document.createElement("canvas");
        tmp.width = backgroundSet.tileWidth; 
        tmp.height = backgroundSet.tileHeight; 

        copy = createBackBuffer();
        copyCtx = copy.getContext('2d');

        drawLevel(copyCtx);
        
        lastLoopTime = new Date().getTime() - 1;
        Application.mainLoop();
    },
register:
    function(gameObject)
    {
        gameObject.index = gameObjects.length;
        gameObjects.push(gameObject);
    },
mainLoop:
    function()
    {
        var now = new Date().getTime();
        var delta = now - lastLoopTime;
        lastLoopTime = now;
        
        if (fullUpdate)
        {
            // draw background copy into level
            ctx.drawImage(copy,0,0);
            fullUpdate = false;
        }
        else
        {
            restorePlayer(player);
        }

        for (var i=0, len = gameObjects.length; i < len; i++)
        {
            var go = gameObjects[i]; 

            if (go.buffer && go.coveringBlocks)
            {
                var x = go.xs;
                var y = go.ys;
                var w = go.w;
                var h = go.h;
                
                if (x < 0)
                {
                    w += x;
                    x = 0
                }
                if (y < 0)
                {
                    h += y;
                    y = 0
                }
                
                //console.debug(copy, x,y,w,h,x,y,w,h);
                ctx.drawImage(copy, x,y,w,h,x,y,w,h);
            }
        }
        for (var i=0, len = gameObjects.length; i < len; i++)
        {
            var go = gameObjects[i]; 

            if (go.buffer && go.coveringBlocks)
            {
                //console.debug(go);
                var goCtx = go.buffer.getContext("2d");
                goCtx.clearRect(0,0,go.w,go.h);
                goCtx.globalCompositeOperation = "source-over";
                go.draw(delta);
                goCtx.globalCompositeOperation = "destination-out";
                
                for (var j = 0, jmax = go.coveringBlocks.length; j < jmax; j++)
                {
                    var cover = go.coveringBlocks[j];
                    if (cover.block != BLOCK_EMPTY)
                    {
                        var offsetX = Math.floor(cover.tx * backgroundSet.tileWidth - go.xs);
                        var offsetY = Math.floor(cover.ty * yStep - go.ys);
                        backgroundSet.draw(goCtx, cover.block, offsetX, offsetY);
                    }
                }
                
                ctx.drawImage(go.buffer, go.xs, go.ys);
            }
        }
        
        var tw = backgroundSet.tileWidth;
        var th = backgroundSet.tileHeight;
        
        player.move(delta, validatePlayer);

        var tileX = Math.floor(player.x / tw);
        var tileY = Math.floor((player.y + yCorrect)/ yStep) + 1 ;
        
        var tmpCtx = tmp.getContext("2d");
        tmpCtx.clearRect(0,0, tw,th); 
        
        tmpCtx.globalCompositeOperation = "source-over";
        player.draw(tmpCtx);
        tmpCtx.globalCompositeOperation = "destination-out";
        
        var block = level[tileOffset(tileX,tileY)];
        var offsetX = Math.round(player.x - (tileX * tw)); 
        var offsetY = Math.round(player.y - (tileY * yStep)); 
        backgroundSet.draw(tmpCtx, block, -offsetX, -offsetY);

        if (tileX < TILES_PER_ROW - 1)
        {
            var block = level[tileY * TILES_PER_ROW + tileX + 1];
            if (block != BLOCK_EMPTY)
            {
                backgroundSet.draw(tmpCtx, block, -offsetX + tw, -offsetY);
            }
        }
        
        ctx.drawImage(tmp, player.x, player.y);
        
        for (var i = 0, len = jobs.length; i < len; i++)
        {
            jobs[i].run();
        }
        
        if (updateCounter > updatedUntil)
        {
            jobs.push(new UpdateJob(ctx, updateCounter, createBackBuffer()));
            updatedUntil = updateCounter;

            initShadowsMap();
        }
        
        requestAnimationFrame(Application.mainLoop);
    },
onOpen:
    function()
    {
        console.info("connected");
        send({
            type:"JoinRoom",
            name:"test"
        });
    },
onClose:
    function()
    {
        console.info("disconnected");
    },
onError:
    function()
    {
        console.error(e);
    },
onMessage:
    function(e)
    {
        var msg = JSON.parse(e.data);
        console.debug("message: %o", msg);
        
        switch(msg.type)
        {
            case "InitLevel":
                room = msg.room;
                level = msg.level.data;
                Application.onNewLevel();
                break;
        }
    }
};

// Send message to server over socket.
function send(outgoing) {
    ws.send(JSON.stringify(outgoing));
}

this.Application = Application;

$(Application.init);
 

console.debug("end");
//})(jQuery);
