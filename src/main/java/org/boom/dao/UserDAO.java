package org.boom.dao;

import org.boom.domain.User;
import org.synyx.hades.dao.GenericDao;
import org.synyx.hades.dao.Param;
import org.synyx.hades.dao.Query;

public interface UserDAO extends GenericDao<User, String>
{
    @Query("from User u where u.name = :name")
    User findByName( @Param("name") String name );
}
