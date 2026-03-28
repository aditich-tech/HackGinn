package com.hackginn.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.List;

@Data
public class GenerateRequest {

    @Min(1) @Max(10)
    private int teamSize = 1;

    @NotBlank(message = "Skill level is required")
    private String skillLevel;

    private List<String> techStack;

    private String domain;

    private String constraints;

    private String projectType; // Hardware, Software, Hybrid

    private String platform; // e.g. Web App, Mobile, ML Model, IoT

    private String targetMarket; // e.g. SaaS, B2B, B2C

    private Integer hackathonHours;
}
