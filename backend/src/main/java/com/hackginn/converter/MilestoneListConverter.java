package com.hackginn.converter;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.hackginn.entity.Milestone;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

import java.util.List;

@Converter
public class MilestoneListConverter implements AttributeConverter<List<Milestone>, String> {

    private static final ObjectMapper mapper = new ObjectMapper();

    @Override
    public String convertToDatabaseColumn(List<Milestone> milestones) {
        try {
            return milestones == null ? "[]" : mapper.writeValueAsString(milestones);
        } catch (Exception e) {
            throw new RuntimeException("Failed to convert milestones to JSON", e);
        }
    }

    @Override
    public List<Milestone> convertToEntityAttribute(String json) {
        try {
            return json == null ? List.of() : mapper.readValue(json, new TypeReference<>() {});
        } catch (Exception e) {
            throw new RuntimeException("Failed to convert JSON to milestones", e);
        }
    }
}
