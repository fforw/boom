package org.boom.msg;

import org.boom.level.GameRoom;
import org.boom.level.Level;

public class InitLevel
    extends ApplicationMessage
{
    private Level level;
    private String room;

    public InitLevel(GameRoom gameRoom)
    {
        this.room = gameRoom.getName();
        this.level = gameRoom.getLevel();
    }
    
    public String getRoom()
    {
        return room;
    }
    
    public Level getLevel()
    {
        return level;
    }
}
