package org.boom;

import java.util.HashSet;
import java.util.Set;

import org.boom.msg.ApplicationMessage;
import org.boom.msg.Login;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.svenson.JSONConfig;
import org.webbitserver.BaseWebSocketHandler;
import org.webbitserver.WebSocketConnection;

public class ApplicationWebSocketHandler
    extends BaseWebSocketHandler
{
    private static Logger log = LoggerFactory.getLogger(ApplicationWebSocketHandler.class);
    
    private Set<WebSocketConnection> connections = new HashSet<WebSocketConnection>();
    private JSONConfig jsonConfig;

    public ApplicationWebSocketHandler(JSONConfig jsonConfig)
    {
        this.jsonConfig = jsonConfig;
    }
    
    
    @Override
    public void onOpen(WebSocketConnection connection) throws Exception
    {
        connections.add(connection);
    }


    @Override
    public void onMessage(WebSocketConnection connection, final String msgIn) throws Exception
    {
        ApplicationMessage msg = jsonConfig.getJsonParser().parse(ApplicationMessage.class, msgIn);
        log.info("Message: {}", msg);
        
        if (msg instanceof Login)
        {
        }
        
    }


    // private void broadcast(Outgoing outgoing) {
    // String jsonStr = this.json.toJson(outgoing);
    // for (WebSocketConnection connection : connections) {
    // if (connection.data(USERNAME_KEY) != null) { // only broadcast to those
    // who have completed login
    // connection.send(jsonStr);
    // }
    // }
    // }

    @Override
    public void onClose(WebSocketConnection connection) throws Exception
    {
    }
}
