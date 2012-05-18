package org.boom.msg;


public class JoinRoom
    extends ApplicationMessage
{
    private String name;
    
    public void setName(String name)
    {
        this.name = name;
    }
    
    public String getName()
    {
        return name;
    }
}
