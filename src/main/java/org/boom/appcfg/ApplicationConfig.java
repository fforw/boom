package org.boom.appcfg;

import org.boom.level.LevelCreator;
import org.boom.msg.ApplicationMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.ImportResource;
import org.springframework.web.servlet.view.InternalResourceViewResolver;
import org.svenson.ClassNameBasedTypeMapper;
import org.svenson.JSON;
import org.svenson.JSONConfig;
import org.svenson.JSONParser;
import org.svenson.converter.DateConverter;
import org.svenson.converter.DefaultTypeConverterRepository;
import org.svenson.matcher.SubtypeMatcher;

@Configuration
@ImportResource({"data-access.xml","security.xml"})
public class ApplicationConfig
{
    private static Logger log = LoggerFactory.getLogger(ApplicationConfig.class);
    
    @Bean
    public InternalResourceViewResolver viewResolver()
    {
        log.info("resolver");
        
        InternalResourceViewResolver resolver = new InternalResourceViewResolver();
        resolver.setPrefix("/WEB-INF/views/");
        resolver.setSuffix(".jsp");
        return resolver;
    }
    
    /**
     * Set up JSON config with a sub type matcher that enables a full JSON / Java object transformation circle.
     * 
     * All messages must extend {@link ApplicationMessage}
     * 
     * We set up "type" as type-deciding property field, where the value of "type" corresponds with the
     * simple Java implementation name inside the package of {@link ApplicationMessage}.  
     * @return
     */
    @Bean
    @Qualifier("message")
    public JSONConfig jsonConfig()
    {
        JSONParser parser = new JSONParser();

        DefaultTypeConverterRepository typeConverterRepository = new DefaultTypeConverterRepository();
        typeConverterRepository.addTypeConverter(new DateConverter());
   
        ClassNameBasedTypeMapper typeMapper = new ClassNameBasedTypeMapper();
        typeMapper.setBasePackage(ApplicationMessage.class.getPackage().getName());
        typeMapper.setEnforcedBaseType(ApplicationMessage.class);
        typeMapper.setDiscriminatorField("type");
        
        typeMapper.setPathMatcher(new SubtypeMatcher(ApplicationMessage.class));
        parser.setTypeMapper(typeMapper);
        parser.setTypeConverterRepository(typeConverterRepository);

        JSON json = new JSON();
        json.setTypeConverterRepository(typeConverterRepository);

        return new JSONConfig(json, parser);
    }
    
    @Bean
    public LevelCreator levelCreator()
    {
        return new LevelCreator(21,18);
    }
    
}
