
//(function($){


// Perform login: Ask user for name, and send message to socket.
//function login() {
//    var defaultUsername = (window.localStorage && window.localStorage.username) || 'yourname';
//    var username = prompt('Choose a username', defaultUsername);
//    if (username) {
//        if (window.localStorage) { // store in browser localStorage, so we remember next next
//            window.localStorage.username = username;
//        }
//        send({action:'LOGIN', loginUsername:username});
//        document.getElementById('entry').focus();
//    } else {
//        ws.close();
//    }
//}

var level = [];
var heightMap = [];
var shadowsMap = [];
var levelImageData = null;

var ws;
var canvas,ctx,tileStep,ratio, width, height;


var TILES_PER_ROW = 21;
var TILE_ROWS = 19;

function tileOffset(x,y)
{
    return y * TILES_PER_ROW + x;
}

function getShadowTilesAt(x,y)
{
    var l = [];
    
    var off = tileOffset(x, y);
    
    var hTopLeft = 0;
    var hLeft = 0;
    var hBottomLeft = 0;
    var hTopRight = 0;
    var hRight = 0;
    var hBottomRight = 0;
    
    var hMid = heightMap[off];
    var hTop    = y > 0  ? heightMap[off - TILES_PER_ROW] : 0;
    var hBottom = y < 15 ? heightMap[off + TILES_PER_ROW] : 0;
    
    if (x > 0)
    {
        hTopLeft    =  y >  0 ? heightMap[off - TILES_PER_ROW - 1] : 0;
        hBottomLeft =  y < 15 ? heightMap[off + TILES_PER_ROW - 1] : 0;
        hLeft = heightMap[off - 1];
    }

    if (x < 15)
    {
        hTopRight    =  y >  0 ? heightMap[ off - TILES_PER_ROW + 1] : 0;
        hBottomRight =  y < 15 ? heightMap[ off + TILES_PER_ROW + 1] : 0;
        hRight =  heightMap[off + 1];
    }
    
    if (hBottomRight > hMid && hRight < hMid)
    {
        l.push(BLOCK_SHADOW_SOUTH_EAST);
    }
    
    if (hBottom > hMid && hBottom == 2)
    {
        l.push(BLOCK_SHADOW_SOUTH);
    }
    
    if (hBottomLeft > hMid && hLeft < hMid)
    {
        l.push(BLOCK_SHADOW_SOUTH_WEST);
    }

    if (hRight > hMid)
    {
        l.push(BLOCK_SHADOW_EAST);
    }

    if (hLeft > hMid)
    {
        l.push(BLOCK_SHADOW_WEST);
    }
    
    if (hTopRight > hMid && hTop <= hMid && hRight <= hMid)
    {
        l.push(BLOCK_SHADOW_NORTH_EAST);
    }
    
    if (hTop > hMid)
    {
        l.push(BLOCK_SHADOW_NORTH);
    }

    if (hTopLeft > hMid && hTop <= hMid && hLeft <= hMid)
    {
        l.push(BLOCK_SHADOW_NORTH_WEST);
    }
    
    if (hBottomLeft == hMid && hBottom < hMid)
    {
        l.push(BLOCK_SHADOW_SIDE_WEST);
    }
    
    //console.debug("shadows for %d,%d = %o", x,y, l);
    
    return l;
}


function blockHeight(block)
{
    if (block == BLOCK_EMPTY || block == BLOCK_ROCK || block == BLOCK_TREE_UGLY  || block == BLOCK_TREE_SHORT || block == BLOCK_TREE_TALL)
    {
        return 0;
    }
    else if (block  == BLOCK_STONE_BLOCK_TALL || block == BLOCK_WALL_BLOCK_TALL || block == BLOCK_WINDOW_TALL)
    {
        return 2;
    }
    else 
    {
        return 1;
    }
}

function getScaleRatio(w,h)
{
    console.debug("%s x %s",w,h);
    
    var ow = 101 * TILES_PER_ROW;
    var oh = 81 * (TILE_ROWS) + 171;
    console.debug("fullsize = %s x %s",ow,oh);
    
    var wRatio = w / ow;
    var hRatio = h / oh;
    
    return Math.min(wRatio, hRatio);
}

function setBlock(x,y,block)
{
    var off = tileOffset(x,y);
    level[off] = block;
    
    heightMap[off] = blockHeight(block);
}

function gap(opt)
{
    return opt ? Math.random() < 0.9 : true;
}

function obstacle()
{
    var v = Math.random();
    if (v < 0.333)
    {
        return BLOCK_ROCK;
    }
    else if (v < 0.666)
    {
        return BLOCK_TREE_TALL;
    }
    else 
    {
        return BLOCK_TREE_SHORT;
    }
    
}

function drawSquare(sx ,sy, w, h, block, randomGap)
{
    var ex = sx + w - 1;
    var ey = sy + h - 1;
    
    var g1x = -1;
    var g2x = -1;
    var g1y = -1;
    var g2y = -1;
    
    if (randomGap)
    {
        g1x = sx + Math.floor(Math.random() * ( ex - sx ));
        g2x = sx + Math.floor(Math.random() * ( ex - sx ));
        g1y = sy + Math.floor(Math.random() * ( ey - sy ));
        g2y = sy + Math.floor(Math.random() * ( ey - sy ));
    }

    
    for (var x = sx; x <= ex; x++)
    {
        if (x != g1x)
        {
            setBlock(x, sy,block);
        }
        else
        {
            if (Math.random() > 0.5)
            {
                setBlock(x, sy, obstacle());
            }
        }
        
        if (x != g2x)
        {
            setBlock(x, ey,block);
        }
        else
        {
            if (Math.random() > 0.5)
            {
                setBlock(x, ey, obstacle());
            }
        }
    }

    for (var y = sy; y <= ey; y++)
    {
        if (y != g1y)
        {
            setBlock(sx, y,block);
        }
        else
        {
            if (Math.random() > 0.5)
            {
                setBlock(sx, y, obstacle());
            }
        }
        if (y != g1y)
        {
            setBlock(ex, y,block);
        }
        else
        {
            if (Math.random() > 0.5)
            {
                setBlock(ex, y, obstacle());
            }
        }
    }
}


function drawBlocks(tileX,tileY, x,y)
{
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
}

var backgroundSet = null;

this.Application = {
init:
    function()
    {
        var url = 'ws://boom.localhost:9876/appsocket';

        console.debug(url);
        ws = new WebSocket(url);
        ws.onopen = Application.onOpen;
        ws.onclose = Application.disconnected;
        ws.onerror = Application.onerror;
        ws.onmessage = Application.onMessage;

        var $canvas = $("#teh_canvas");
        canvas = $canvas[0];

        Loader.load(["../../image/sheet.png","../../image/wizard-anim.png"], Application.onLoad);
    },
onLoad:
    function(images)
    {
        var $window = $(window);
        ratio = getScaleRatio($window.width() - 1, $window.height() - 35);
        
        console.debug("ratio = %s", ratio);
        
        backgroundSet = new TileSet(images[0], 101, 171, ratio);
        wizardSet = new TileSet(images[1], 101, 171, ratio);
        
        console.debug(backgroundSet);
        
        tileStep = Math.floor(81 * ratio);
        
        width = backgroundSet.scaledTileWidth * TILES_PER_ROW;
        height = (tileStep * TILE_ROWS) + backgroundSet.scaledTileWidth;
        
        var x = 0;
        var y = 0;
        var w = TILES_PER_ROW;
        var h = TILE_ROWS;
        
        do
        {
            drawSquare( x, y, w, h, x == 0 ? BLOCK_STONE_BLOCK_TALL : BLOCK_STONE_BLOCK , x > 0);
            x += 2;
            y += 2;
            w -= 4;
            h -= 4;
            
        } while ( w > 0 && h > 0 );
        
        
        var xmid = Math.floor(TILES_PER_ROW / 2) + 1;
        var ymid = Math.floor(TILE_ROWS / 2) + 1;
        var xmax = TILES_PER_ROW - 1;
        var ymax = TILE_ROWS - 1;
 
        setBlock(   0,    0, BLOCK_WALL_BLOCK_TALL); 
        setBlock(xmax,    0, BLOCK_WALL_BLOCK_TALL); 
        setBlock(   0, ymax, BLOCK_WALL_BLOCK_TALL); 
        setBlock(xmax, ymax, BLOCK_WALL_BLOCK_TALL);
        
        setBlock(xmid,    0, BLOCK_PAD); 
        setBlock( xmid, ymax, BLOCK_PAD); 
        setBlock(    0, ymid, BLOCK_PAD);
        setBlock( xmax, ymid, BLOCK_PAD); 

        canvas.width = width;
        canvas.height = height;
        
        $("#container").width(width);

        for (var i=0, len = TILE_ROWS * TILES_PER_ROW; i < len; i++)
        {
            heightMap[i] = heightMap[i] || 0;
        }
        
        for (var y=0; y < TILE_ROWS; y++)
        {
            for (var x=0; x < TILES_PER_ROW; x++)
            {
                shadowsMap[tileOffset(x,y)] = getShadowTilesAt(x,y);
            }
        }
        
        
        ctx = canvas.getContext('2d');
        ctx.fillStyle = "#aaa";
        ctx.fillRect(0,0, width, height);
    
        var yPos=0,xPos;
        for (var y=0; y < TILE_ROWS; y++)
        {
            xPos =0;
            for (var x=0; x < TILES_PER_ROW; x++)
            {
                drawBlocks(x,y, xPos, yPos);
                xPos += backgroundSet.scaledTileWidth;
            }
            yPos += tileStep;
        }
    
        levelImageData = ctx.getImageData(0,0,width,height);
    
        Application.mainLoop();
    },
    
mainLoop:
    function()
    {
        window.setTimeout( Application.mainLoop, 20);
    },
onOpen:
    function()
    {
        console.info("connected");
        send({"type":"Login"});
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
        var data = JSON.parse(e.data);
        console.debug("message: %o", data);
    }
};

// Send message to server over socket.
function send(outgoing) {
    ws.send(JSON.stringify(outgoing));
}

$(this.Application.init);
 

//})(jQuery);
