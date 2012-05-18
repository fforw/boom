package org.boom.level;

public class PlayerState
{
    private PlayerSlot slot;

    public PlayerState(PlayerSlot slot)
    {
        this.slot = slot;
    }
    
    public PlayerSlot getSlot()
    {
        return slot;
    }

}
