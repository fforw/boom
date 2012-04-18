package org.boom.appcfg;

import org.boom.ApplicationWebSocketHandler;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.ApplicationListener;
import org.springframework.context.event.ApplicationContextEvent;
import org.springframework.context.event.ContextStoppedEvent;
import org.springframework.stereotype.Component;
import org.svenson.JSONConfig;
import org.webbitserver.WebServer;
import org.webbitserver.WebServers;

@Component
public class WebSocketServerFactory
    implements InitializingBean, ApplicationListener<ApplicationContextEvent>
{
    private static Logger log = LoggerFactory.getLogger(WebSocketServerFactory.class);

    private WebServer webServer;

    @Autowired
    @Qualifier("message")
    private JSONConfig config;

    @Override
    public void onApplicationEvent(ApplicationContextEvent event)
    {
        if (event instanceof ContextStoppedEvent)
        {
            webServer.stop();
        }
        else
        {
            log.info("Received {}", event);
        }
    }


    @Override
    public void afterPropertiesSet() throws Exception
    {
        log.info("Creating web socket server");

        webServer = WebServers.createWebServer(9876)
        // .add(new LoggingHandler(new
        // SimpleLogSink(ApplicationWebSocketHandler.USERNAME_KEY)))
            .add("/appsocket", new ApplicationWebSocketHandler(config))
            // .add(new
            // StaticFileHandler("./src/test/java/samples/chatroom/content"))
            .start().get();

    }
}
