package com.hackginn.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.hackginn.dto.BlueprintDto;
import com.hackginn.entity.Milestone;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;

@Service
@RequiredArgsConstructor
@Slf4j
public class GroqService {

    private final WebClient groqWebClient;
    private final ObjectMapper objectMapper;

    @Value("${groq.api.key}")
    private String apiKey;

    @Value("${groq.model}")
    private String model;

    @PostConstruct
    public void validateConfig() {
        if (apiKey == null || apiKey.trim().isEmpty() || apiKey.contains("${")) {
            log.error("GROQ_API_KEY is not configured! App will fail on LLM calls.");
        }
    }

    private static final String SYSTEM_PROMPT = """
            You are HackGinn, an expert hackathon mentor.
            Your job is to generate detailed, feasible project blueprints for hackathons.

            RULES:
            - Respond ONLY with a valid JSON object. No explanation, no markdown, no backticks.
            - The JSON must strictly follow this schema:
            {
              "title": "string",
              "summary": "string (elevator pitch, 2-3 sentences)",
              "features": ["string", "string", "string"],
              "techStack": ["string", "string"],
              "targetAudience": ["string", "string"],
              "challenges": ["string", "string"],
              "roadmap": [
                { "stage": "string", "phase": "string", "description": "string" }
              ],
              "prd": "string (Detailed Product Requirement Document: Overview, Personas, Functional Requirements, Success Metrics)"
            }
            - features: 4-6 core features
            - techStack: specific tools and frameworks
            - targetAudience: 2-3 user personas
            - challenges: 3-4 technical or business risks
            - roadmap: MUST be split strictly into two stages: 'Hackathon MVP' (what can be built during the event) and 'Post-Hackathon Scaling' (future vision). Provide 2-3 phases for each stage. Do not include timeframes.
 
            Be unpredictable and innovative. Do not suggest common or generic hackathon projects.
            Every generation MUST explore a unique angle or creative twist on the problem domain.
            """;

    @Async("groqTaskExecutor")
    public CompletableFuture<BlueprintDto> generateBlueprint(String userPrompt) {
        Map<String, Object> requestBody = Map.of(
                "model", model,
                "messages", List.of(
                        Map.of("role", "system", "content", SYSTEM_PROMPT),
                        Map.of("role", "user", "content", userPrompt)
                ),
                "max_tokens", 2048,
                "temperature", 1.0
        );

        try {
            log.info("Sending request to Groq API with prompt length: {}", userPrompt.length());
            String rawResponse = groqWebClient.post()
                    .uri("/chat/completions")
                    .header("Authorization", "Bearer " + apiKey)
                    .header("Content-Type", "application/json")
                    .bodyValue(requestBody)
                    .retrieve()
                    .onStatus(status -> status.is4xxClientError() || status.is5xxServerError(), response -> 
                        response.bodyToMono(String.class).flatMap(body -> {
                            log.error("Groq API error! Status: {}, Body: {}", response.statusCode(), body);
                            return Mono.error(org.springframework.web.reactive.function.client.WebClientResponseException.create(
                                response.statusCode().value(), 
                                "Groq API error", 
                                response.headers().asHttpHeaders(), 
                                body.getBytes(), 
                                java.nio.charset.StandardCharsets.UTF_8));
                        })
                    )
                    .bodyToMono(String.class)
                    .block();

            log.info("Successfully received response from Groq API");
            return CompletableFuture.completedFuture(parseGroqResponse(rawResponse));
        } catch (Exception e) {
            log.error("Critical error during Groq API call: {} - {}", e.getClass().getSimpleName(), e.getMessage());
            // Re-throw to be caught by GlobalExceptionHandler
            throw new RuntimeException("AI generation failed: " + e.getMessage(), e);
        }
    }

    public String extractThemeData(String rawText) {
        String prompt = """
                Extract the key hackathon parameters from this text and return a clean JSON with:
                { "domain": "string", "constraints": "string", "suggestedTechStack": ["string"] }

                Text: """ + rawText;

        Map<String, Object> requestBody = Map.of(
                "model", model,
                "messages", List.of(Map.of("role", "user", "content", prompt)),
                "max_tokens", 512
        );

        String rawResponse = groqWebClient.post()
                .uri("/chat/completions")
                .header("Authorization", "Bearer " + apiKey)
                .header("Content-Type", "application/json")
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(String.class)
                .block();

        try {
            JsonNode root = objectMapper.readTree(rawResponse);
            return root.path("choices").get(0).path("message").path("content").asText();
        } catch (Exception e) {
            log.error("Failed to parse theme extraction response", e);
            throw new RuntimeException("Failed to extract theme data from Groq response");
        }
    }

    private BlueprintDto parseGroqResponse(String rawResponse) {
        try {
            JsonNode root = objectMapper.readTree(rawResponse);
            String content = root.path("choices").get(0).path("message").path("content").asText();

            // Fix #12 — Robustly extract JSON block even if LLM adds prose
            int start = content.indexOf('{');
            int end = content.lastIndexOf('}');
            if (start == -1 || end == -1) {
                log.error("No valid JSON object found in Groq response: {}", content);
                throw new RuntimeException("AI response did not contain a valid JSON blueprint");
            }
            content = content.substring(start, end + 1);

            // Strip any accidental markdown fences (redundant after substring but safe)
            content = content.replaceAll("```json", "").replaceAll("```", "").trim();

            JsonNode blueprint = objectMapper.readTree(content);

            List<Milestone> roadmap = new ArrayList<>();
            blueprint.path("roadmap").forEach(m -> roadmap.add(new Milestone(
                    m.path("stage").asText(),
                    m.path("phase").asText(),
                    m.path("description").asText()
            )));

            return BlueprintDto.builder()
                    .title(blueprint.path("title").asText())
                    .summary(blueprint.path("summary").asText())
                    .features(readStringList(blueprint, "features"))
                    .techStack(readStringList(blueprint, "techStack"))
                    .targetAudience(readStringList(blueprint, "targetAudience"))
                    .challenges(readStringList(blueprint, "challenges"))
                    .roadmap(roadmap)
                    .prd(blueprint.path("prd").asText())
                    .build();

        } catch (Exception e) {
            log.error("Failed to parse Groq blueprint response. Error: {}", e.getMessage());
            // Fix #12 — Scrub raw response from client-facing exception message for security/cleanliness
            throw new RuntimeException("Failed to parse AI response into a valid project blueprint");
        }
    }

    private List<String> readStringList(JsonNode node, String field) {
        List<String> result = new ArrayList<>();
        node.path(field).forEach(item -> result.add(item.asText()));
        return result;
    }
}
