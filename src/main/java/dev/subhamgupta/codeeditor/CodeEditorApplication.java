package dev.subhamgupta.codeeditor;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling
@SpringBootApplication
@EnableAsync
@EnableCaching
public class CodeEditorApplication {

    public static void main(String[] args) {
        SpringApplication.run(CodeEditorApplication.class, args);
    }

}
