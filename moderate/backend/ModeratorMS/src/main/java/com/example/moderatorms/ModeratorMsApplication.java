package com.example.moderatorms;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.boot.autoconfigure.jmx.JmxAutoConfiguration;

@SpringBootApplication(exclude = {JmxAutoConfiguration.class, DataSourceAutoConfiguration.class})
public class ModeratorMsApplication {

    public static void main(String[] args) {
        SpringApplication.run(ModeratorMsApplication.class, args);
    }

}
