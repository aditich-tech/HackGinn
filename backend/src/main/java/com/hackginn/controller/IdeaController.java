package com.hackginn.controller;

import com.hackginn.dto.BlueprintDto;
import com.hackginn.dto.GenerateRequest;
import com.hackginn.service.ExportService;
import com.hackginn.service.IdeaService;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class IdeaController {

    private final IdeaService ideaService;
    private final ExportService exportService;

    @PostMapping("/generate")
    public ResponseEntity<BlueprintDto> generate(@Valid @RequestBody GenerateRequest request,
                                                 @AuthenticationPrincipal Jwt jwt) {
        String userId = jwt != null ? jwt.getSubject() : null;
        return ResponseEntity.ok(ideaService.generateAndSave(request, userId));
    }

    @GetMapping("/ideas/me")
    public ResponseEntity<?> getMyIdeas(@AuthenticationPrincipal Jwt jwt) {
        String userId = jwt != null ? jwt.getSubject() : null;
        if(userId == null) return ResponseEntity.status(401).build();
        return ResponseEntity.ok(ideaService.getAllByUser(userId));
    }
 
    @GetMapping("/ideas/{id}")
    public ResponseEntity<BlueprintDto> getById(@PathVariable Long id, @AuthenticationPrincipal Jwt jwt) {
        String userId = jwt != null ? jwt.getSubject() : null;
        return ResponseEntity.ok(ideaService.getById(id, userId));
    }

    @PutMapping("/ideas/{id}")
    public ResponseEntity<BlueprintDto> update(@PathVariable Long id,
                                               @RequestBody BlueprintDto updates,
                                               @AuthenticationPrincipal Jwt jwt) {
        String userId = jwt != null ? jwt.getSubject() : null;
        return ResponseEntity.ok(ideaService.update(id, updates, userId));
    }

    @GetMapping("/ideas/{id}/pdf")
    public void downloadPdf(@PathVariable Long id, HttpServletResponse response, @AuthenticationPrincipal Jwt jwt) throws IOException {
        String userId = jwt != null ? jwt.getSubject() : null;
        response.setContentType("application/pdf");
        response.setHeader("Content-Disposition", "attachment; filename=blueprint-" + id + ".pdf");
        exportService.exportPdf(id, response.getOutputStream(), userId);
    }

    @GetMapping("/ideas/{id}/docx")
    public void downloadDocx(@PathVariable Long id, HttpServletResponse response, @AuthenticationPrincipal Jwt jwt) throws IOException {
        String userId = jwt != null ? jwt.getSubject() : null;
        response.setContentType("application/vnd.openxmlformats-officedocument.wordprocessingml.document");
        response.setHeader("Content-Disposition", "attachment; filename=blueprint-" + id + ".docx");
        exportService.exportDocx(id, response.getOutputStream(), userId);
    }
}
