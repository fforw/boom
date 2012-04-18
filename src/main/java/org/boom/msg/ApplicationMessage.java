package org.boom.msg;

import org.svenson.JSONProperty;

/**
 * Abstract base class for all application messages. Provides the simple class
 * name of extending class as message name.
 *  
 * @author shelmberger
 *
 */
public abstract class ApplicationMessage
{
    /**
     * Discriminator field for JSON lookahead inspection.
     * @return
     */
    @JSONProperty(readOnly = true)
    public String getType()
    {
        return this.getClass().getSimpleName();
    }
}
