package org.example.resumeiq.entity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
@Entity
@Table(name = "resume_analyses")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ResumeAnalysis {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_role_id", nullable = false)
    private JobRole jobRole;
    @Column(nullable = false)
    private Double matchScore;
    @Column(length = 1000)
    private String matchedSkills;
    @Column(length = 1000)
    private String missingSkills;
    @Column(nullable = false)
    private LocalDateTime createdAt;
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
