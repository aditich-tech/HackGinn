package com.hackginn.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;
import java.util.concurrent.Executor;

@Configuration
public class WebClientConfig {

    @Value("${groq.api.url}")
    private String groqBaseUrl;

    @Bean
    public WebClient groqWebClient() {
        org.springframework.http.client.reactive.ReactorClientHttpConnector connector = 
            new org.springframework.http.client.reactive.ReactorClientHttpConnector(
                reactor.netty.http.client.HttpClient.create()
                    .option(io.netty.channel.ChannelOption.CONNECT_TIMEOUT_MILLIS, 30000)
                    .responseTimeout(java.time.Duration.ofSeconds(60))
                    .secure(sslContextSpec -> {
                        try {
                            io.netty.handler.ssl.SslContext sslContext = io.netty.handler.ssl.SslContextBuilder.forClient()
                                .sslProvider(io.netty.handler.ssl.SslProvider.JDK)
                                .build();
                            sslContextSpec.sslContext(sslContext);
                        } catch (javax.net.ssl.SSLException e) {
                            throw new RuntimeException("Failed to initialize JDK SSL context", e);
                        }
                    })
                    .doOnConnected(conn -> 
                        conn.addHandlerLast(new io.netty.handler.timeout.ReadTimeoutHandler(60, java.util.concurrent.TimeUnit.SECONDS))
                            .addHandlerLast(new io.netty.handler.timeout.WriteTimeoutHandler(60, java.util.concurrent.TimeUnit.SECONDS)))
            );

        return WebClient.builder()
                .baseUrl(groqBaseUrl)
                .clientConnector(connector)
                .codecs(config -> config.defaultCodecs().maxInMemorySize(5 * 1024 * 1024))
                .build();
    }

    @Bean(name = "groqTaskExecutor")
    public Executor groqTaskExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(5);
        executor.setMaxPoolSize(10);
        executor.setQueueCapacity(100);
        executor.setThreadNamePrefix("GroqThread-");
        executor.initialize();
        return executor;
    }
}
