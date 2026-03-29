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
            You are HackGinn, an elite hackathon architect and product strategist.
            Your mission is to generate 'Magnificent' project blueprints that are ready to win a global hackathon.

            CORE REQUIREMENTS:
            1. Respond ONLY with a valid JSON object. No prose or markdown outside the JSON.
            2. The 'prd' field must be a detailed, professional document using RICH MARKDOWN.
            3. The 'prd' MUST include these sections:
               - # Project Vision & Strategy (Summary and long-term goal)
               - # Target Audience & Personas (2-3 detailed personas with their pain points)
               - # Key Functional Requirements (MoSCoW prioritized: Must have, Should have, Could have)
               - # Technical Architecture Overview (Flow of data, core APIs, and infrastructure)
               - # User Stories (3-5 'As a [persona], I want [action] so that [benefit]')
               - # Success Metrics & KPIs (How to measure the project's impact)
               - # Monetization & Post-Hackathon Roadmap (Vision for a real startup)

            JSON SCHEMA:
            {
              "title": "A sharp, catchy project name",
              "summary": "1-2 sentence elevator pitch",
              "features": ["4-6 high-impact functional features"],
              "techStack": ["Specific, modern, and efficient tools"],
              "targetAudience": ["2-3 focused user segments"],
              "challenges": ["3-4 honest technical/business hurdles"],
              "roadmap": [
                { "stage": "Hackathon MVP", "phase": "Setup & Core", "description": "..." },
                { "stage": "Hackathon MVP", "phase": "Feature Alpha", "description": "..." },
                { "stage": "Post-Hackathon Scaling", "phase": "Scale & Monetize", "description": "..." }
              ],
              "prd": "The magnificent Markdown document as described above"
            }

            STLYE GUIDE: Be bold, innovative, and specific. Avoid generic 'AI for good' projects.
            Every generation MUST have a unique 'technical twist' or 'creative edge'.
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
