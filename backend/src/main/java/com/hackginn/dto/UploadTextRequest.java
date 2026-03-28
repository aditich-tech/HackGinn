package com.hackginn.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UploadTextRequest {

    @NotBlank(message = "Text content cannot be empty")
    private String content;
}
