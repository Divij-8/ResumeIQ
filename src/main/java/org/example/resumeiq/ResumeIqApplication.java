package org.example.resumeiq;

import lombok.RequiredArgsConstructor;
import org.example.resumeiq.entity.JobRole;
import org.example.resumeiq.repository.JobRoleRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
@RequiredArgsConstructor
public class ResumeIqApplication {

    public static void main(String[] args) {
        SpringApplication.run(ResumeIqApplication.class, args);
    }

    @Bean
    public CommandLineRunner initData(JobRoleRepository jobRoleRepository) {
        return args -> {
            // Check if data already exists
            if (jobRoleRepository.count() == 0) {
                // Backend Developer
                JobRole backendDev = new JobRole();
                backendDev.setName("Backend Developer");
                backendDev.setRequiredSkills("Java, Spring Boot, REST API, MySQL, Docker");
                jobRoleRepository.save(backendDev);

                // Data Engineer
                JobRole dataEngineer = new JobRole();
                dataEngineer.setName("Data Engineer");
                dataEngineer.setRequiredSkills("Python, SQL, Spark, Kafka, Airflow");
                jobRoleRepository.save(dataEngineer);

                // Frontend Developer
                JobRole frontendDev = new JobRole();
                frontendDev.setName("Frontend Developer");
                frontendDev.setRequiredSkills("JavaScript, React, HTML, CSS, Axios");
                jobRoleRepository.save(frontendDev);

                System.out.println("Initial job roles created successfully!");
            }
        };
    }
}
