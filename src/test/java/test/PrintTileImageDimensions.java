package test;

import java.awt.image.BufferedImage;
import java.awt.image.WritableRaster;
import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import javax.imageio.ImageIO;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.svenson.JSON;

import test.PrintTileImageDimensions.Direction;

public class PrintTileImageDimensions
{
    private static Logger log = LoggerFactory.getLogger(PrintTileImageDimensions.class);
    
    public static void main(String[] args) throws IOException
    {
        BufferedImage img = ImageIO.read(new File("./src/main/webapp/image/wizard-anim.png"));
        
        final int tileWidth = 101;
        final int tileHeight = 171;
        
        int type = img.getType();
        if (type != BufferedImage.TYPE_4BYTE_ABGR)
        {
            throw new IllegalStateException("Image is not TYPE_4BYTE_ABGR");
        }
        
        WritableRaster raster = img.getRaster();
        
        log.info("raster is {}x{}", raster.getWidth(), raster.getHeight());

        StringBuilder sb = new StringBuilder();
        
        List<Dimensions> dims = new ArrayList<Dimensions>();
        for (int y=0; y < raster.getHeight(); y += tileHeight)
        {
            for (int x=0; x < raster.getWidth(); x += tileWidth)
            {
                
                log.info("x,y = {},{}", x,y);
                int minX = scan(raster,x,y, Direction.LEFT, tileWidth, tileHeight);
                int minY = scan(raster,x,y, Direction.UP, tileWidth, tileHeight);
                int maxX = scan(raster,x,y, Direction.RIGHT, tileWidth, tileHeight);
                int maxY = scan(raster,x,y, Direction.DOWN, tileWidth, tileHeight);
                
                dims.add(new Dimensions(minX,minY,maxX,maxY));
                if (log.isInfoEnabled())
                {
                    log.info("Non-alpha image AABB: {},{} to {},{}", new Object[] {minX,minY,maxX,maxY});
                }
            }
        }
        
        log.info("Info:\nvar wizardAABB = {}", JSON.defaultJSON().forValue(dims));
    }

    private static int scan(WritableRaster raster, int tileX, int tileY, Direction dir, int tileWidth, int tileHeight)
    {
            int startX = dir.dx == 0 ? (dir.getNext().dx > 0 ? 0 : tileWidth - 1) : (dir.dx < 0 ? 0 : tileWidth - 1);  
            int startY = dir.dy == 0 ? (dir.getNext().dy > 0 ? 0 : tileHeight - 1) : (dir.dy < 0 ? 0 : tileHeight - 1);  

            int scanLength= dir.dx != 0 ? tileWidth : tileHeight; 
            int lineLength = dir.dx != 0 ? tileHeight : tileWidth; 

            log.info("{},{} to {},{}, line moves {},{}", new Object[] { startX, startY, startX + (lineLength - 1)* dir.getNext().dx, startY + (lineLength - 1)* dir.getNext().dy, dir.getOpposite().dx, dir.getOpposite().dy});  


            int numBands = raster.getSampleModel().getNumBands();
            log.info("Number of Bands: {}", numBands);
            int[] abgr = new int[numBands];

            scanLoop:
                for (int i=0; i < scanLength; i++)
                {
                    int x = startX;
                    int y = startY;
                    for (int j=0; j < lineLength; j++)
                    {
                        try
                        {
                        raster.getPixel(tileX + x, tileY + y, abgr);
                        }
                        catch(Exception e)
                        {
                            throw new RuntimeException("Error at " + (tileX + x) + ", " + ( tileY + y) + " j = " + j + " / " + lineLength, e);
                        }

                        if (abgr[3] != 0)
                        {
                            log.info("Alpha is {} at {},{} => out", new Object[]{Arrays.toString(abgr), x, y});
                            break scanLoop;
                        }

                        x += dir.getNext().dx;
                        y += dir.getNext().dy;
                    }
                    startX += dir.getOpposite().dx;
                    startY += dir.getOpposite().dy;
                }

            return dir.dx != 0 ? startX : startY;
    }
    
    enum Direction
    {
        LEFT(-1,0),
        DOWN(0,1),
        RIGHT(1,0),
        UP(0,-1);
        
        public final int dx;
        public final int dy;

        private Direction(int dx, int dy)
        {
            this.dx = dx;
            this.dy = dy;
        }
        
        public Direction getNext()
        {
            return Direction.values()[(this.ordinal() + 1) & 3];
        }

        public Direction getOpposite()
        {
            return Direction.values()[(this.ordinal() + 2) & 3];
        }
    }
    
}
