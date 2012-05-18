package org.boom.msg;

public class RequestNewLevel
    extends ApplicationMessage
{
    private String room;
    
    public String getRoom()
    {
        return room;
    }
    
    public void setRoom(String room)
    {
        this.room = room;
    }

}
