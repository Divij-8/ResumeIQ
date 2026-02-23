package org.example.resumeiq.dto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ResumeRequest {
    private String resumeText;
    private Long jobRoleId;
}
