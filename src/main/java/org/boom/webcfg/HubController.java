package org.boom.webcfg;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class HubController 
{
    @RequestMapping("/home/")
    public String home()
    {
        return "home";
    }
    
    @RequestMapping("/login/")
    public String login()
    {
        return "login";
    }

}
