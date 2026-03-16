package org.example.resumeiq.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.resumeiq.dto.ResumeRequest;
import org.example.resumeiq.dto.ResumeResponse;
import org.example.resumeiq.entity.JobRole;
import org.example.resumeiq.repository.JobRoleRepository;
import org.example.resumeiq.service.ResumeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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


    @GetMapping("/jobroles")
    public ResponseEntity<List<JobRole>> getAllJobRoles() {
        List<JobRole> jobRoles = jobRoleRepository.findAll();
        return ResponseEntity.ok(jobRoles);
    }
}

