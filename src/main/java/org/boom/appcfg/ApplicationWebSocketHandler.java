package org.boom.appcfg;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

import org.boom.level.GameRoom;
import org.boom.level.LevelCreator;
import org.boom.msg.ApplicationMessage;
import org.boom.msg.InitLevel;
import org.boom.msg.JoinRoom;
import org.boom.msg.RequestNewLevel;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.svenson.JSONConfig;
import org.webbitserver.BaseWebSocketHandler;
import org.webbitserver.WebSocketConnection;

@Component
public class ApplicationWebSocketHandler
    extends BaseWebSocketHandler
    implements InitializingBean
{
    private static Logger log = LoggerFactory.getLogger(ApplicationWebSocketHandler.class);

    private Map<WebSocketConnection, String> connections = new HashMap<WebSocketConnection, String>();

    private JSONConfig jsonConfig;

    private LevelCreator levelCreator;

    private ConcurrentMap<String, GameRoom> rooms = new ConcurrentHashMap<String, GameRoom>();


    @Autowired
    public void setJsonConfig(JSONConfig jsonConfig)
    {
        this.jsonConfig = jsonConfig;
    }


    @Autowired
    public void setLevelCreator(LevelCreator levelCreator)
    {
        this.levelCreator = levelCreator;
    }


    @Override
    public void onOpen(WebSocketConnection connection) throws Exception
    {
        connections.put(connection, "none");
    }


    @Override
    public void onMessage(WebSocketConnection connection, final String msgIn) throws Exception
    {
        ApplicationMessage msg = jsonConfig.getJsonParser().parse(ApplicationMessage.class, msgIn);
        log.info("Message: {}", msg);
        
        if (msg instanceof RequestNewLevel)
        {
            RequestNewLevel request = (RequestNewLevel)msg;
            GameRoom room = rooms.get(request.getRoom());
            
            if (room != null)
            {
                room.createNewLevel();
                broadcast(room.getName(), new InitLevel(room));
            }
        }
        else if (msg instanceof JoinRoom)
        {
            JoinRoom join = (JoinRoom)msg;
            GameRoom room = rooms.get(join.getName());
            room.join(connection);
            
            if (room != null)
            {
                connections.put(connection, room.getName());
                connection.send(getApplicationMessageJSON(new InitLevel(room)));
            }
        }
    }


    private void broadcast(String room, ApplicationMessage message)
    {

        String json = getApplicationMessageJSON(message);
        for (Map.Entry<WebSocketConnection, String> e : connections.entrySet())
        {
            String name = e.getValue();
            if (name.equals(room))
            {
                WebSocketConnection connection = e.getKey();
                connection.send(json);
            }
        }
    }


    private String getApplicationMessageJSON(ApplicationMessage message)
    {
        return jsonConfig.getJsonGenerator().forValue(message);
    }
    

    @Override
    public void onClose(WebSocketConnection connection) throws Exception
    {
        String name = connections.get(connection);
        if (name != null)
        {
            GameRoom room = rooms.get(name);
            room.leave(connection);
        }
        connections.remove(connection);
    }


    @Override
    public void afterPropertiesSet() throws Exception
    {
        registerRoom(new GameRoom("test", levelCreator));
    }


    private void registerRoom(GameRoom gameRoom)
    {
        rooms.put(gameRoom.getName(), gameRoom);
    }
}
