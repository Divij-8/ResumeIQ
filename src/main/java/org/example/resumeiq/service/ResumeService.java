package org.example.resumeiq.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.resumeiq.dto.ResumeRequest;
import org.example.resumeiq.dto.ResumeResponse;
import org.example.resumeiq.entity.JobRole;
import org.example.resumeiq.entity.ResumeAnalysis;
import org.example.resumeiq.repository.JobRoleRepository;
import org.example.resumeiq.repository.ResumeAnalysisRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ResumeService {

    private final JobRoleRepository jobRoleRepository;
    private final ResumeAnalysisRepository resumeAnalysisRepository;
    private final AIService aiService;

    @Transactional
    public ResumeResponse analyzeResume(ResumeRequest request) {
        // Fetch job role by ID
        JobRole jobRole = jobRoleRepository.findById(request.getJobRoleId())
                .orElseThrow(() -> new RuntimeException("Job role not found with id: " + request.getJobRoleId()));

        // Split required skills by comma
        List<String> requiredSkills = Arrays.stream(jobRole.getRequiredSkills().split(","))
                .map(String::trim)
                .collect(Collectors.toList());

        // Convert resume text to lowercase for case-insensitive matching
        String resumeTextLower = request.getResumeText().toLowerCase();

        List<String> matchedSkills = new ArrayList<>();
        List<String> missingSkills = new ArrayList<>();

        // For each required skill, check if it's in the resume
        for (String skill : requiredSkills) {
            if (resumeTextLower.contains(skill.toLowerCase())) {
                matchedSkills.add(skill);
            } else {
                missingSkills.add(skill);
            }
        }

        // Calculate match score
        double matchScore = requiredSkills.isEmpty() ? 0.0 :
                (matchedSkills.size() / (double) requiredSkills.size()) * 100.0;

        // AI-powered analysis via Gemini
        String aiAnalysis = null;
        try {
            aiAnalysis = aiService.analyzeResumeWithAI(
                    request.getResumeText(),
                    jobRole.getName(),
                    jobRole.getRequiredSkills(),
                    matchedSkills,
                    missingSkills,
                    matchScore
            );
        } catch (Exception e) {
            log.warn("AI analysis unavailable: {}", e.getMessage());
        }

        // Save resume analysis to database
        ResumeAnalysis analysis = new ResumeAnalysis();
        analysis.setJobRole(jobRole);
        analysis.setMatchScore(matchScore);
        analysis.setMatchedSkills(String.join(", ", matchedSkills));
        analysis.setMissingSkills(String.join(", ", missingSkills));
        resumeAnalysisRepository.save(analysis);

        // Return response
        return new ResumeResponse(matchScore, matchedSkills, missingSkills, aiAnalysis);
    }
}
