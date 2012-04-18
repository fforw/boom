package org.boom.appcfg;

import org.boom.auth.DomainUserDetails;
import org.boom.dao.UserDAO;
import org.boom.domain.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.security.authentication.dao.SaltSource;
import org.springframework.security.authentication.encoding.PasswordEncoder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

@Component("userDetailsService")
public class ApplicationUserService
    implements org.springframework.security.core.userdetails.UserDetailsService
    
{
    private static Logger log = LoggerFactory.getLogger(ApplicationUserService.class);
    
    @Autowired
    private UserDAO userDAO;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private SaltSource saltSource;
    
    @Override
    public UserDetails loadUserByUsername(String name) throws UsernameNotFoundException,
        DataAccessException
    {
        User user = userDAO.findByName(name);
        
        if (user == null)
        {
            user = new User();
            user.setName(name);
            user.setPassword("none");
            user.setRoles("ROLE_USER");
            
            userDAO.save(user);
        }
        
        DomainUserDetails details = new DomainUserDetails(user);
        log.info(passwordEncoder.encodePassword("admin", saltSource.getSalt(details)));
        return details;
    }

}
