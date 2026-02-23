package org.example.resumeiq.dto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ResumeResponse {
    private Double matchScore;
    private List<String> matchedSkills;
    private List<String> missingSkills;
    private String aiAnalysis;
}
