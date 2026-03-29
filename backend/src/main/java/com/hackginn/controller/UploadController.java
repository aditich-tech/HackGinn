package com.hackginn.controller;

import com.hackginn.dto.BlueprintDto;
import com.hackginn.dto.UploadTextRequest;
import com.hackginn.service.IdeaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;



@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class UploadController {

    private final IdeaService ideaService;

    @PostMapping("/upload-text")
    public ResponseEntity<BlueprintDto> uploadText(@Valid @RequestBody UploadTextRequest request,
                                                 @AuthenticationPrincipal Jwt jwt) {
        String userId = jwt != null ? jwt.getSubject() : null;
        // Fix #2 — call generateAndSaveFromPrompt instead of extractThemeData for a full document
        BlueprintDto blueprint = ideaService.generateAndSaveFromPrompt(request.getContent(), userId);
        return ResponseEntity.ok(blueprint);
    }

    @PostMapping("/upload-file")
    public ResponseEntity<BlueprintDto> uploadFile(@RequestParam("file") org.springframework.web.multipart.MultipartFile file,
                                                 @AuthenticationPrincipal Jwt jwt) {
        String userId = jwt != null ? jwt.getSubject() : null;
        try {
            String content = new String(file.getBytes());
            BlueprintDto blueprint = ideaService.generateAndSaveFromPrompt(content, userId);
            return ResponseEntity.ok(blueprint);
        } catch (Exception e) {
            throw new RuntimeException("Failed to process file: " + e.getMessage());
        }
    }
}
