package com.hackginn.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class WebClientConfig {

    @Value("${groq.api.url}")
    private String groqBaseUrl;

    @Bean
    public WebClient groqWebClient() {
        return WebClient.builder()
                .baseUrl(groqBaseUrl)
                .codecs(config -> config.defaultCodecs().maxInMemorySize(2 * 1024 * 1024))
                .build();
    }
}
