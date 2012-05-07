// palette quadric bezier function and assorted helpers

function clamp(gun)
{
    return gun < 0 ? 0 : gun > 255 ? 255 : gun;
}
    
function hex(n)
{
    var s = Math.floor(n).toString(16);
    
    if (s.length == 2)
    {
        return s;
    }
    else
    {
        return "0" + s;
    }
}

function color(r,g,b)
{
    r = clamp(r);
    g = clamp(g);
    b = clamp(b);
    
    return "#" + hex(r) + hex(g) + hex(b);
}

var VectorRGBA = Class.extend({
init:
    function(r,g,b,a)
    {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    },
add:
    function(r,g,b,a)
    {
        if (r instanceof VectorRGBA)
        {
            g = r.g;
            b = r.b;
            a = r.a;
            r = r.r;
        }
        
        this.r += r;
        this.g += g;
        this.b += b;
        this.a += a;
        
        return this;
    },
substract:
    function(r,g,b,a)
    {
        if (r instanceof VectorRGBA)
        {
            g = r.g;
            b = r.b;
            a = r.a;
            r = r.r;
        }
        
        this.r -= r;
        this.g -= g;
        this.b -= b;
        this.a -= a;
        
        return this;
    },
scale:
    function(s)
    {
        this.r *= s;
        this.g *= s;
        this.b *= s;
        this.a *= s;
        return this;
    },
clone:
    function()
    {
        return new VectorRGBA(this.r, this.g, this.b, this.a);
    },
toString:
    function()
    {
        return "VectorRGBA( " + this.r + ", " + this.g + ", " + this.b + ", " + this.a + ")";
    }
});

function bezierPoint(pt0, pt1, t)
{
    return pt1.clone().substract(pt0).scale(t).add(pt0);
}

function palette(p0,p1,p2,p3, length)
{
    length--;
    
    var palette = [];
    for (var i = 0; i <= length; i++)
    {
        var pos = i / length;
        
        var q0 = bezierPoint(p0,p1,pos);
        var q1 = bezierPoint(p1,p2,pos);
        var q2 = bezierPoint(p2,p3,pos);

        var r0 = bezierPoint(q0,q1,pos);
        var r1 = bezierPoint(q1,q2,pos);
        
        var v = bezierPoint(r0,r1,pos);
        palette.push(v);
    }
    
    return palette;
}
