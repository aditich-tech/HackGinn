package com.hackginn.service;

import com.hackginn.dto.BlueprintDto;
import com.hackginn.dto.GenerateRequest;
import com.hackginn.entity.Blueprint;
import com.hackginn.exception.ResourceNotFoundException;
import com.hackginn.exception.UnauthorizedException;
import com.hackginn.repository.BlueprintRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class IdeaService {

    private final BlueprintRepository blueprintRepository;
    private final GroqService groqService;
    private final Random random = new Random();

    private static final String[] VIBES = {
        "Focus on social impact and accessibility.",
        "Focus on a highly futuristic, high-tech approach.",
        "Focus on a minimalist, easy-to-implement prototype.",
        "Focus on gamification and user engagement.",
        "Focus on sustainability and environmental impact.",
        "Focus on cross-platform scalability and enterprise readiness.",
        "Focus on a unique, 'out-of-the-box' creative twist."
    };

    public BlueprintDto generateAndSave(GenerateRequest request, String userId) {
        String prompt = buildPrompt(request);
        return generateAndSaveFromPrompt(prompt, userId);
    }

    public BlueprintDto generateAndSaveFromPrompt(String prompt, String userId) {
        // Fix #5 — now GroqService is @Async, so we join() to wait for result synchronously in the service layer
        BlueprintDto dto = groqService.generateBlueprint(prompt).join();

        Blueprint entity = Blueprint.builder()
                .userId(userId)
                .title(dto.getTitle())
                .summary(dto.getSummary())
                .features(dto.getFeatures())
                .techStack(dto.getTechStack())
                .targetAudience(dto.getTargetAudience())
                .challenges(dto.getChallenges())
                .roadmap(dto.getRoadmap())
                .prd(dto.getPrd())
                .originalPrompt(prompt)
                .build();

        Blueprint saved = blueprintRepository.save(entity);
        dto.setId(saved.getId());
        dto.setCreatedAt(saved.getCreatedAt());
        dto.setUpdatedAt(saved.getUpdatedAt());

        return dto;
    }

    public BlueprintDto getById(Long id, String userId) {
        Blueprint entity = blueprintRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Blueprint not found with id: " + id));
        
        if (entity.getUserId() != null && !entity.getUserId().equals(userId)) {
             // Fix #7 — use 403 Forbidden mapping
             throw new UnauthorizedException("Unauthorized access to Blueprint");
        }
        return toDto(entity);
    }

    public List<BlueprintDto> getAllByUser(String userId) {
        if (userId == null) return List.of();
        return blueprintRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(this::toDto)
                .toList();
    }

    public BlueprintDto update(Long id, BlueprintDto updates, String userId) {
        Blueprint entity = blueprintRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Blueprint not found with id: " + id));

        if (entity.getUserId() != null && !entity.getUserId().equals(userId)) {
             // Fix #7 — use 403 Forbidden mapping
             throw new UnauthorizedException("Unauthorized access to Blueprint");
        }

        if (updates.getTitle() != null)          entity.setTitle(updates.getTitle());
        if (updates.getSummary() != null)        entity.setSummary(updates.getSummary());
        if (updates.getFeatures() != null)       entity.setFeatures(updates.getFeatures());
        if (updates.getTechStack() != null)      entity.setTechStack(updates.getTechStack());
        if (updates.getTargetAudience() != null) entity.setTargetAudience(updates.getTargetAudience());
        if (updates.getChallenges() != null)     entity.setChallenges(updates.getChallenges());
        if (updates.getRoadmap() != null)        entity.setRoadmap(updates.getRoadmap());
        if (updates.getPrd() != null)            entity.setPrd(updates.getPrd());

        return toDto(blueprintRepository.save(entity));
    }

    private BlueprintDto toDto(Blueprint e) {
        return BlueprintDto.builder()
                .id(e.getId())
                .title(e.getTitle())
                .summary(e.getSummary())
                .features(e.getFeatures())
                .techStack(e.getTechStack())
                .targetAudience(e.getTargetAudience())
                .challenges(e.getChallenges())
                .roadmap(e.getRoadmap())
                .prd(e.getPrd())
                .createdAt(e.getCreatedAt())
                .updatedAt(e.getUpdatedAt())
                .build();
    }

    private String buildPrompt(GenerateRequest req) {
        String randomVibe = VIBES[random.nextInt(VIBES.length)];
        return String.format("""
                Generate a unique hackathon project blueprint with these parameters:
                - Team Size: %d
                - Skill Level: %s
                - Project Type: %s
                - Platform/Architecture: %s
                - Target Market: %s
                - Tech Stack: %s
                - Domain: %s
                - Hackathon Duration: %s hours
                - Constraints / Theme: %s
 
                CREATIVITY HINT: %s
                """,
                req.getTeamSize(),
                req.getSkillLevel(),
                req.getProjectType() != null ? req.getProjectType() : "Software",
                req.getPlatform() != null ? req.getPlatform() : "Flexible / Any",
                req.getTargetMarket() != null ? req.getTargetMarket() : "Any Market",
                req.getTechStack() != null ? String.join(", ", req.getTechStack()) : "flexible",
                req.getDomain() != null ? req.getDomain() : "general",
                req.getHackathonHours() != null ? req.getHackathonHours() : "24",
                req.getConstraints() != null ? req.getConstraints() : "none",
                randomVibe
        );
    }
}
