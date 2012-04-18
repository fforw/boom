package org.boom.domain;

import java.util.ArrayList;
import java.util.List;
import java.util.TimeZone;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Transient;

import org.boom.Util;
import org.synyx.hades.domain.AbstractPersistable;


@Entity
@Table(name = "boomuser")
public class User
{
    private Long id;

    private String name, password;

    private String roles;

    private Boolean locked = Boolean.FALSE;

    private transient List<String> roleList;

    private TimeZone timeZone = TimeZone.getDefault();

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    public Long getId()
    {
        return id;
    }

    @Column(unique = true)
    public String getName()
    {
        return name;
    }

    @Column
    public String getPassword()
    {
        return password;
    }

    @Column
    public String getRoles()
    {
        return roles;
    }

    public void setId(Long id)
    {
        this.id = id;
    }

    public void setName(String name)
    {
        this.name = name;
    }

    public void setPassword(String password)
    {
        this.password = password;
    }

    public void setRoles(String roles)
    {
        this.roles = roles;
        this.roleList = null;
    }

    @Transient
    public List<String> getRolesAsList()
    {
        if (roleList == null)
        {            
            roleList = Util.split(roles, ",");
        }
        return roleList;
    }


    public void setRolesFromList(List<String> roleList)
    {
        this.roleList = new ArrayList<String>(roleList);
        this.roles = Util.join(roleList, ",");

    }

    @Column
    public String getTimeZone()
    {
        return timeZone.getID();
    }

    public void setTimeZone(String id)
    {
        if (id == null)
        {
            this.timeZone = TimeZone.getDefault();
        }
        else
        {
            this.timeZone = TimeZone.getTimeZone(id);
        }
    }

    public void getTimeZoneObject(TimeZone timeZone)
    {
        this.timeZone = timeZone;
    }

    @Transient
    public TimeZone getTimeZoneObject()
    {
        return timeZone;
    }

    @Column
    public Boolean isLocked()
    {
        return locked;
    }

    public void setLocked(Boolean locked)
    {
        this.locked = locked;
    }

}
