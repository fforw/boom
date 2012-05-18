package org.boom.level;

import org.svenson.JSONable;
import org.svenson.StringBuilderSink;

/**
 * Encapsulates a two-dimension tile field of arbitrary width and height. The blocks are kept
 * in a single array in rows of tiles.  
 * @author fforw at gmx dot de
 *
 */
public class Level
    implements JSONable
{
    private int height;
    private int width;
    private Block[] level;

    public Level(int width, int height)
    {
        this.width = width;
        this.height = height;
        
        initLevel();
    }

    private void initLevel()
    {
        int size = this.width * this.height;
        this.level = new Block[ size];
        
        for (int i=0; i < size; i++)
        {
            level[i] = Block.EMPTY;
        }
    }

    public void set(int x, int y, Block block)
    {
        validateCoord(x, y);
        
        level[y * width + x] = block;
    }

    private void validateCoord(int x, int y)
    {
        if (x < 0 || x >= width || y < 0 || y >= height)
        {
            throw new IllegalArgumentException(x + ", " + y + " is not a valid coordinate in " + this);
        }
    }

    
    public Block get(int x, int y)
    {
        validateCoord(x, y);
        return level[y * width + x];
    }
    
    @Override
    public String toString()
    {
        return super.toString() + ": width=" + width + ", height=" + height;
    }

    @Override
    public String toJSON()
    {
        StringBuilderSink sink = new StringBuilderSink();
        
        sink.append("{\"width\":");
        sink.append(width);
        sink.append(",\"height\":");
        sink.append(height);
        sink.append(",\"data\":[");
        for (int i=0; i < level.length; i++)
        {
            if (i > 0)
            {
                sink.append(",");
            }
            sink.append(level[i].ordinal());
        }
        sink.append("]}");
        return sink.getContent();
    }

}
