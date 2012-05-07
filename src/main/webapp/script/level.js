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


var _proofTab = [];
_proofTab[BLOCK_STONE_BLOCK_TALL] = true;
_proofTab[BLOCK_STONE_BLOCK] = true;
_proofTab[BLOCK_WALL_BLOCK_TALL] = true;
_proofTab[BLOCK_WALL_BLOCK] = true;

function blastProof(block)
{
    return !!_proofTab[block];
}

var _heightTab = [];

_heightTab[BLOCK_EMPTY] = 0;
_heightTab[BLOCK_TREE_UGLY] = 0;
_heightTab[BLOCK_TREE_SHORT] = 0;
_heightTab[BLOCK_TREE_TALL] = 0;
_heightTab[BLOCK_PAD] = 0;

_heightTab[BLOCK_STONE_BLOCK_TALL] = 2;
_heightTab[BLOCK_WALL_BLOCK_TALL] = 2;
_heightTab[BLOCK_WALL_BLOCK_TALL] = 2;


function blockHeight(block)
{
    var h = _heightTab[block];
    return h === undefined ? 1 : h;
}


function setBlock(x,y,block)
{
    var off = tileOffset(x,y);
    level[off] = block || BLOCK_EMPTY;
    
    heightMap[off] = blockHeight(block);
}
