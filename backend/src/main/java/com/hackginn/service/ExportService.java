package com.hackginn.service;

import com.hackginn.dto.BlueprintDto;
import com.hackginn.entity.Milestone;
import com.lowagie.text.Document;
import com.lowagie.text.DocumentException;
import com.lowagie.text.Font;
import com.lowagie.text.Paragraph;
import com.lowagie.text.pdf.PdfWriter;
import lombok.RequiredArgsConstructor;
import org.apache.poi.xwpf.usermodel.ParagraphAlignment;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.apache.poi.xwpf.usermodel.XWPFParagraph;
import org.apache.poi.xwpf.usermodel.XWPFRun;
import org.springframework.stereotype.Service;

import java.awt.*;
import java.io.OutputStream;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ExportService {

    private final IdeaService ideaService;

    public void exportPdf(Long id, OutputStream out, String userId) {
        BlueprintDto dto = ideaService.getById(id, userId);
        Document doc = new Document();
        try {
            PdfWriter.getInstance(doc, out);
            doc.open();

            Font titleFont   = new Font(Font.HELVETICA, 22, Font.BOLD,   Color.decode("#1a1a2e"));
            Font headingFont = new Font(Font.HELVETICA, 14, Font.BOLD,   Color.decode("#4f46e5"));
            Font bodyFont    = new Font(Font.HELVETICA, 11, Font.NORMAL, Color.BLACK);

            doc.add(new Paragraph(dto.getTitle(), titleFont));
            doc.add(new Paragraph("\n"));
            doc.add(new Paragraph(dto.getSummary(), bodyFont));
            doc.add(new Paragraph("\n"));

            addPdfSection(doc, "Features",          dto.getFeatures(),       headingFont, bodyFont);
            addPdfSection(doc, "Tech Stack",         dto.getTechStack(),      headingFont, bodyFont);
            addPdfSection(doc, "Target Audience",    dto.getTargetAudience(), headingFont, bodyFont);
            addPdfSection(doc, "Challenges & Risks", dto.getChallenges(),     headingFont, bodyFont);

            doc.add(new Paragraph("Roadmap", headingFont));
            for (Milestone m : dto.getRoadmap()) {
                doc.add(new Paragraph(
                        "• [" + m.getStage() + "] " + m.getPhase() + ": " + m.getDescription(),
                        bodyFont
                ));
            }

            doc.add(new Paragraph("\n"));
            doc.add(new Paragraph("Product Requirement Document (PRD)", headingFont));
            addPrdToPdf(doc, dto.getPrd(), headingFont, bodyFont);

        } catch (Exception e) {
            throw new RuntimeException("PDF generation failed", e);
        } finally {
            doc.close();
        }
    }

    public void exportDocx(Long id, OutputStream out, String userId) {
        BlueprintDto dto = ideaService.getById(id, userId);
        try (XWPFDocument docx = new XWPFDocument()) {

            XWPFParagraph title = docx.createParagraph();
            title.setAlignment(ParagraphAlignment.CENTER);
            XWPFRun titleRun = title.createRun();
            titleRun.setText(dto.getTitle());
            titleRun.setBold(true);
            titleRun.setFontSize(24);

            addDocxParagraph(docx, "Summary", dto.getSummary());
            addDocxList(docx, "Features",          dto.getFeatures());
            addDocxList(docx, "Tech Stack",         dto.getTechStack());
            addDocxList(docx, "Target Audience",    dto.getTargetAudience());
            addDocxList(docx, "Challenges & Risks", dto.getChallenges());

            XWPFParagraph roadmapHeading = docx.createParagraph();
            XWPFRun rh = roadmapHeading.createRun();
            rh.setText("Roadmap");
            rh.setBold(true);
            rh.setFontSize(14);

            for (Milestone m : dto.getRoadmap()) {
                XWPFParagraph p = docx.createParagraph();
                p.createRun().setText("• [" + m.getStage() + "] " + m.getPhase() + ": " + m.getDescription());
            }

            addPrdToDocx(docx, dto.getPrd());

            docx.write(out);
        } catch (Exception e) {
            throw new RuntimeException("DOCX generation failed", e);
        }
    }

    private void addPrdToPdf(Document doc, String prd, Font headingFont, Font bodyFont) throws DocumentException {
        if (prd == null) return;
        String[] lines = prd.split("\n");
        for (String line : lines) {
            if (line.trim().startsWith("#")) {
                String clean = line.replace("#", "").trim();
                doc.add(new Paragraph(clean, headingFont));
            } else if (!line.trim().isEmpty()) {
                doc.add(new Paragraph(line.trim(), bodyFont));
            }
        }
    }

    private void addPrdToDocx(XWPFDocument doc, String prd) {
        if (prd == null) return;
        
        XWPFParagraph h = doc.createParagraph();
        XWPFRun hr = h.createRun();
        hr.setText("Product Requirement Document (PRD)");
        hr.setBold(true);
        hr.setFontSize(14);

        String[] lines = prd.split("\n");
        for (String line : lines) {
            XWPFParagraph p = doc.createParagraph();
            XWPFRun run = p.createRun();
            if (line.trim().startsWith("#")) {
                run.setText(line.replace("#", "").trim());
                run.setBold(true);
                run.setFontSize(12);
            } else {
                run.setText(line.trim());
            }
        }
    }

    private void addPdfSection(Document doc, String heading, List<String> items,
                               Font headingFont, Font bodyFont) throws DocumentException {
        doc.add(new Paragraph(heading, headingFont));
        for (String item : items) {
            doc.add(new Paragraph("• " + item, bodyFont));
        }
        doc.add(new Paragraph("\n"));
    }

    private void addDocxParagraph(XWPFDocument doc, String heading, String content) {
        XWPFParagraph h = doc.createParagraph();
        XWPFRun hr = h.createRun();
        hr.setText(heading);
        hr.setBold(true);
        hr.setFontSize(13);
        doc.createParagraph().createRun().setText(content);
    }

    private void addDocxList(XWPFDocument doc, String heading, List<String> items) {
        XWPFParagraph h = doc.createParagraph();
        XWPFRun hr = h.createRun();
        hr.setText(heading);
        hr.setBold(true);
        hr.setFontSize(13);
        for (String item : items) {
            doc.createParagraph().createRun().setText("• " + item);
        }
    }
}
