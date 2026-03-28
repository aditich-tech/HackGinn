package com.hackginn.controller;

import com.hackginn.dto.UploadTextRequest;
import com.hackginn.service.GroqService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.apache.poi.xwpf.extractor.XWPFWordExtractor;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.lowagie.text.pdf.PdfReader;
import com.lowagie.text.pdf.parser.PdfTextExtractor;

import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class UploadController {

    private final GroqService groqService;

    @PostMapping("/upload-text")
    public ResponseEntity<Map<String, String>> uploadText(@Valid @RequestBody UploadTextRequest request) {
        String extracted = groqService.extractThemeData(request.getContent());
        return ResponseEntity.ok(Map.of("extracted", extracted));
    }

    @PostMapping("/upload")
    public ResponseEntity<Map<String, String>> uploadFile(@RequestParam("file") MultipartFile file) throws IOException {
        String content = "";
        String filename = file.getOriginalFilename();

        if (filename == null) return ResponseEntity.badRequest().build();

        if (filename.endsWith(".txt")) {
            content = new String(file.getBytes());
        } else if (filename.endsWith(".pdf")) {
            try (PdfReader reader = new PdfReader(file.getInputStream())) {
                PdfTextExtractor extractor = new PdfTextExtractor(reader);
                StringBuilder sb = new StringBuilder();
                for (int i = 1; i <= reader.getNumberOfPages(); i++) {
                    sb.append(extractor.getTextFromPage(i));
                }
                content = sb.toString();
            }
        } else if (filename.endsWith(".docx")) {
            try (XWPFDocument doc = new XWPFDocument(file.getInputStream());
                 XWPFWordExtractor extractor = new XWPFWordExtractor(doc)) {
                content = extractor.getText();
            }
        }

        String extracted = groqService.extractThemeData(content);
        return ResponseEntity.ok(Map.of("extracted", extracted));
    }
}
