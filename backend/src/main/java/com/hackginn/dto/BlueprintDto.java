package com.hackginn.dto;

import com.hackginn.entity.Milestone;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class BlueprintDto {
    private Long id;
    private String title;
    private String summary;
    private List<String> features;
    private List<String> techStack;
    private List<String> targetAudience;
    private List<String> challenges;
    private List<Milestone> roadmap;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
