package org.boom.level;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.is;

import org.junit.Test;


public class BlockTestCase
{
    @Test
    public void thatEmptyIsZero()
    {
        assertThat(Block.EMPTY.ordinal(), is(0));
    }
}
