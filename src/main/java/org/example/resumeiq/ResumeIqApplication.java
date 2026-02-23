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
            if (jobRoleRepository.count() == 0) {

                // 1. Full Stack Developer
                JobRole fullStack = new JobRole();
                fullStack.setName("Full Stack Developer");
                fullStack.setRequiredSkills("JavaScript, React, Node.js, Express, REST API, HTML, CSS, MySQL, MongoDB, Docker, Git");
                jobRoleRepository.save(fullStack);

                // 2. Backend Developer
                JobRole backendDev = new JobRole();
                backendDev.setName("Backend Developer");
                backendDev.setRequiredSkills("Java, Spring Boot, REST API, MySQL, Docker, Hibernate, Maven, JWT, Redis, Microservices");
                jobRoleRepository.save(backendDev);

                // 3. Frontend Developer
                JobRole frontendDev = new JobRole();
                frontendDev.setName("Frontend Developer");
                frontendDev.setRequiredSkills("JavaScript, React, HTML, CSS, Tailwind CSS, TypeScript, Redux, Webpack, REST API, Git");
                jobRoleRepository.save(frontendDev);

                // 4. Software Engineer
                JobRole softwareEngineer = new JobRole();
                softwareEngineer.setName("Software Engineer");
                softwareEngineer.setRequiredSkills("Java, Python, Data Structures, Algorithms, OOP, Git, REST API, SQL, Unit Testing, Design Patterns");
                jobRoleRepository.save(softwareEngineer);

                // 5. AI Researcher
                JobRole aiResearcher = new JobRole();
                aiResearcher.setName("AI Researcher");
                aiResearcher.setRequiredSkills("Python, PyTorch, TensorFlow, Machine Learning, Deep Learning, NLP, Computer Vision, Research, Statistics, Linear Algebra");
                jobRoleRepository.save(aiResearcher);

                // 6. Data Scientist
                JobRole dataScientist = new JobRole();
                dataScientist.setName("Data Scientist");
                dataScientist.setRequiredSkills("Python, Machine Learning, Pandas, NumPy, Scikit-learn, SQL, Statistics, Data Visualization, Jupyter, TensorFlow");
                jobRoleRepository.save(dataScientist);

                // 7. Data Analyst
                JobRole dataAnalyst = new JobRole();
                dataAnalyst.setName("Data Analyst");
                dataAnalyst.setRequiredSkills("SQL, Python, Excel, Tableau, Power BI, Statistics, Data Visualization, Pandas, ETL, Business Intelligence");
                jobRoleRepository.save(dataAnalyst);

                // 8. Data Engineer
                JobRole dataEngineer = new JobRole();
                dataEngineer.setName("Data Engineer");
                dataEngineer.setRequiredSkills("Python, SQL, Apache Spark, Kafka, Airflow, ETL, AWS, Data Warehousing, Hadoop, Scala");
                jobRoleRepository.save(dataEngineer);

                // 9. Platform Engineer
                JobRole platformEngineer = new JobRole();
                platformEngineer.setName("Platform Engineer");
                platformEngineer.setRequiredSkills("Kubernetes, Docker, Terraform, CI/CD, AWS, Linux, Python, Helm, Prometheus, Infrastructure as Code");
                jobRoleRepository.save(platformEngineer);

                // 10. API Developer
                JobRole apiDeveloper = new JobRole();
                apiDeveloper.setName("API Developer");
                apiDeveloper.setRequiredSkills("REST API, GraphQL, Node.js, Java, Spring Boot, OAuth, JWT, API Gateway, Swagger, Postman");
                jobRoleRepository.save(apiDeveloper);

                // 11. Cloud Engineer
                JobRole cloudEngineer = new JobRole();
                cloudEngineer.setName("Cloud Engineer");
                cloudEngineer.setRequiredSkills("AWS, Azure, GCP, Terraform, Docker, Kubernetes, CI/CD, Linux, Networking, IAM");
                jobRoleRepository.save(cloudEngineer);

                // 12. DevOps Engineer
                JobRole devOps = new JobRole();
                devOps.setName("DevOps Engineer");
                devOps.setRequiredSkills("Docker, Kubernetes, Jenkins, CI/CD, Terraform, AWS, Linux, Ansible, Git, Monitoring");
                jobRoleRepository.save(devOps);

                // 13. Site Reliability Engineer (SRE)
                JobRole sre = new JobRole();
                sre.setName("Site Reliability Engineer");
                sre.setRequiredSkills("Linux, Python, Kubernetes, Docker, Prometheus, Grafana, SLO, Incident Management, CI/CD, Terraform");
                jobRoleRepository.save(sre);

                // 14. Systems Engineer
                JobRole systemsEngineer = new JobRole();
                systemsEngineer.setName("Systems Engineer");
                systemsEngineer.setRequiredSkills("Linux, C, C++, Networking, TCP/IP, Shell Scripting, Docker, System Design, Embedded Systems, Debugging");
                jobRoleRepository.save(systemsEngineer);

                System.out.println("✅ 14 job roles initialized successfully!");
            }
        };
    }
}
