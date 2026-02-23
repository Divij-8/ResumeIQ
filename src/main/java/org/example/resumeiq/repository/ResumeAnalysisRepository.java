package org.example.resumeiq.repository;
import org.example.resumeiq.entity.ResumeAnalysis;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
@Repository
public interface ResumeAnalysisRepository extends JpaRepository<ResumeAnalysis, Long> {
}
