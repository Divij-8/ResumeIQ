package org.example.resumeiq.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.example.resumeiq.dto.ResumeRequest;
import org.example.resumeiq.dto.ResumeResponse;
import org.example.resumeiq.entity.JobRole;
import org.example.resumeiq.repository.JobRoleRepository;
import org.example.resumeiq.service.ResumeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
@Slf4j
public class ResumeController {

    private final ResumeService resumeService;
    private final JobRoleRepository jobRoleRepository;

    @PostMapping("/analyze")
    public ResponseEntity<ResumeResponse> analyzeResume(@RequestBody ResumeRequest request) {
        try {
            ResumeResponse response = resumeService.analyzeResume(request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping(value = "/upload", consumes = "multipart/form-data")
    public ResponseEntity<?> uploadPdf(
            @RequestParam("file") MultipartFile file,
            @RequestParam("jobRoleId") Long jobRoleId) {
        try {
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "No file uploaded"));
            }
            String contentType = file.getContentType();
            if (contentType == null || !contentType.equals("application/pdf")) {
                return ResponseEntity.badRequest().body(Map.of("error", "Only PDF files are supported"));
            }

            // Extract text from PDF using PDFBox 3.x
            String extractedText;
            try (PDDocument document = Loader.loadPDF(file.getBytes())) {
                PDFTextStripper stripper = new PDFTextStripper();
                extractedText = stripper.getText(document);
            }

            if (extractedText == null || extractedText.isBlank()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Could not extract text from PDF. Please ensure it is not a scanned image PDF."));
            }

            log.info("Extracted {} characters from PDF: {}", extractedText.length(), file.getOriginalFilename());

            ResumeRequest request = new ResumeRequest(extractedText, jobRoleId);
            ResumeResponse response = resumeService.analyzeResume(request);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Error processing PDF: {}", e.getMessage());
            return ResponseEntity.internalServerError().body(Map.of("error", "Failed to process PDF: " + e.getMessage()));
        }
    }

    @GetMapping("/jobroles")
    public ResponseEntity<List<JobRole>> getAllJobRoles() {
        List<JobRole> jobRoles = jobRoleRepository.findAll();
        return ResponseEntity.ok(jobRoles);
    }
}

