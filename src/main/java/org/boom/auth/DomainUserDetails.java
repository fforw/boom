package org.boom.auth;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import org.boom.domain.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.GrantedAuthorityImpl;
import org.springframework.security.core.userdetails.UserDetails;

public class DomainUserDetails
    implements UserDetails
{

    private static final long serialVersionUID = 6561798403963863336L;

    private Collection<GrantedAuthority> authorities;
    private String password;
    private String name;
    private boolean locked;


    public DomainUserDetails(User user)
    {
        name = user.getName();
        password = user.getPassword();
        locked = user.isLocked();
        authorities = authorities(user.getRolesAsList());
        
    }


    private Collection<GrantedAuthority> authorities(List<String> rolesAsList)
    {
        
        List<GrantedAuthority> auths = new ArrayList<GrantedAuthority>();
        for (String name : rolesAsList)
        {
            auths.add(new GrantedAuthorityImpl(name));
        }
        
        return auths;
    }


    @Override
    public Collection<GrantedAuthority> getAuthorities()
    {
        return authorities;
    }


    @Override
    public String getPassword()
    {
        return password;
    }


    @Override
    public String getUsername()
    {
        return name;
    }


    @Override
    public boolean isAccountNonExpired()
    {
        return true;
    }


    @Override
    public boolean isAccountNonLocked()
    {
        return true;
    }


    @Override
    public boolean isCredentialsNonExpired()
    {
        return true;
    }


    @Override
    public boolean isEnabled()
    {
        return !locked;
    }
    
}
