package org.boom.level;

import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

import org.boom.msg.ApplicationMessage;
import org.boom.msg.InitLevel;
import org.webbitserver.WebSocketConnection;

/**
 * A game room is a place where the game happen. Players join the game by name.
 * 
 * @author fforw at gmx dot de
 *
 */
public class GameRoom
{
    private String name;
    
    private RoomState state;
    
    private PlayerState[] slots = new PlayerState[4];
    
    private Level level;

    private LevelCreator levelCreator;
    
    private ConcurrentMap<WebSocketConnection, PlayerState> states = new ConcurrentHashMap<WebSocketConnection, PlayerState>();
    
    public GameRoom(String name, LevelCreator levelCreator)
    {
        this.name = name;
        this.levelCreator = levelCreator;
        this.state = RoomState.INACTIVE;
        createNewLevel();
    }

    public void createNewLevel()
    {
        this.level = this.levelCreator.createLevel();
    }
    
    public String getName()
    {
        return name;
    }

    public Level getLevel()
    {
        return level;
    }

    public synchronized void join(WebSocketConnection connection)
    {
        PlayerState state = null;
        for (int i = 0; i < slots.length; i++)
        {
            if (slots[i] == null)
            {
                state = new PlayerState(PlayerSlot.values()[i]);
                slots[i] = state;
                return;
            }
        }
        
        if (state == null)
        {
            state = new PlayerState(PlayerSlot.OBSERVER );
        }
        states.put(connection, state);
    }
    
    public synchronized void leave(WebSocketConnection connection)
    {
        PlayerState state = states.get(connection);
        PlayerSlot slot = state.getSlot();
        if (slot != PlayerSlot.OBSERVER)
        {
            slots[slot.ordinal()] = null;
        }
        states.remove(connection);
    }
}
