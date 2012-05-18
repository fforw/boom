package org.boom.level;

import java.util.Arrays;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Random;
import java.util.Set;

public class LevelCreator
{
    private int width;

    private int height;

    private Random random = new Random();

    private final static List<Block> OBSTACLES = Collections.unmodifiableList(Arrays.asList( Block.ROCK, Block.TREE_TALL, Block.TREE_SHORT, Block.DIRT_BLOCK, Block.GRASS_BLOCK, Block.DIRT_BLOCK, Block.GRASS_BLOCK));
    
    public LevelCreator(int width, int height)
    {
        if ((width & 1) == 0)
        {
            throw new IllegalArgumentException("Width must be odd, is " + width + ".");
        }
        if ((height & 1) != 0)
        {
            throw new IllegalArgumentException("Height must be even, is " + height + ".");
        }
        this.width = width;
        this.height = height;
    }


    public Level createLevel()
    {

        Level level = new Level(width, height);

        // draw outer wall, not closed down.              
        int maxX = width - 1;
        int maxY = height - 1;
        hline(level, 0, maxX, 0, Block.STONE_BLOCK_TALL);
        vline(level, 0, 0, maxY, Block.STONE_BLOCK_TALL);
        vline(level, maxX, 0, maxY, Block.STONE_BLOCK_TALL);

        level.set(0, 0, Block.WALL_BLOCK_TALL);
        level.set(maxX, 0, Block.WALL_BLOCK_TALL);

        // draw middle high stone every second block 
        for (int y = 2; y < maxY; y += 2)
        {
            for (int x = 2; x < maxX; x += 2)
            {
                level.set(x, y, Block.STONE_BLOCK);
            }
        }
        
        int halfWidth = width / 2;
        
        for (int y = 0; y < height; y ++)
        {
            for (int x = 0; x < width; x++)
            {
                Block block = level.get(x,y);
                if (block == Block.EMPTY)
                {
                    double d = getEdgeDistance(x,y);
                    
                    double chance = easeOutExpo(halfWidth - d,0.0,1.0, halfWidth);
                    
                    if (random.nextDouble() < chance)
                    {
                        level.set(x,y,randomObstacle());
                    }
                }
            }
        }
        
        level.set(1,1,Block.EMPTY);
        level.set(2,1,Block.EMPTY);
        level.set(1,2,Block.EMPTY);
        
        level.set(maxX - 1,1,Block.EMPTY);
        level.set(maxX - 2,1,Block.EMPTY);
        level.set(maxX - 1,2,Block.EMPTY);

        level.set(1, height - 1,Block.EMPTY);
        level.set(2, height - 1,Block.EMPTY);
        level.set(1, height - 2,Block.EMPTY);

        level.set(maxX - 1, height - 1,Block.EMPTY);
        level.set(maxX - 2, height - 1,Block.EMPTY);
        level.set(maxX - 1, height - 2,Block.EMPTY);

        return level;
    }


    private Block randomObstacle()
    {
        return OBSTACLES.get(random.nextInt(OBSTACLES.size()));
    }


    public static double easeOutExpo(double t, double b, double c, double d)
    {
        return c * (-Math.pow(2, -10 * t / d) + 1) + b;
    }
    
    
    private double getEdgeDistance(int x, int y)
    {
        int hw = width / 2;
        int hh = height / 2;

        int xref, yref;
        if (x < hw)
        {
            xref = 0;
        }
        else
        {
            xref = width - 1;
        }

        if (y < hh)
        {
            yref = 0;
        }
        else
        {
            yref = height - 1;
        }
        
        int dx = xref - x;
        int dy = yref - y;
        
        return Math.sqrt(dx*dx+dy*dy);
    }


    private void hline(Level level, int xs, int xe, int y, Block block)
    {
        for (int x = xs; x <= xe; x++)
        {
            level.set(x, y, block);
        }
    }


    private void vline(Level level, int x, int ys, int ye, Block block)
    {
        for (int y = ys; y <= ye; y++)
        {
            level.set(x, y, block);
        }
    }
}
