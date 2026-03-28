package com.hackginn.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Milestone {
    private String stage; // "Hackathon MVP" or "Post-Hackathon Scaling"
    private String phase;
    private String description;
}
