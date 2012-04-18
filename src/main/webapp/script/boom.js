(function($){


// Perform login: Ask user for name, and send message to socket.
//function login() {
//    var defaultUsername = (window.localStorage && window.localStorage.username) || 'yourname';
//    var username = prompt('Choose a username', defaultUsername);
//    if (username) {
//        if (window.localStorage) { // store in browser localStorage, so we remember next next
//            window.localStorage.username = username;
//        }
//        send({action:'LOGIN', loginUsername:username});
//        document.getElementById('entry').focus();
//    } else {
//        ws.close();
//    }
//}

var ws;

var start;

this.Application = {
init:
    function()
    {
        var url = 'ws://boom.localhost:9876/appsocket';

        console.debug(url);
        ws = new WebSocket(url);
        ws.onopen = Application.onOpen;
        ws.onclose = Application.disconnected;
        ws.onerror = Application.onerror;
        ws.onmessage = Application.onMessage;
        
    },
onOpen:
    function()
    {
        console.info("connected");
        
        send({"type":"Login"});
      
        start = new Date().getTime();
    
    },
onClose:
    function()
    {
        console.info("disconnected");
    },
onError:
    function()
    {
        console.error(e);
    },
onMessage:
    function(e)
    {
        var data = JSON.parse(e.data);
        if (data.type = "Test")
        {
            //console.debug(data.count);
            if (data.count++  < 100)
            {
                send(data);
            }
            else
            {
                console.debug("diff: %s", (new Date().getTime() - start));
            }
            
        }
        else
        {
            console.debug("message: %o", data);
        }
    }
};

// Send message to server over socket.
function send(outgoing) {
    ws.send(JSON.stringify(outgoing));
}

$(this.Application.init);
    
})(jQuery);
