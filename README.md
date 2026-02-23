# ResumeIQ — AI-Powered Resume Analyzer

<p align="center">
  <img src="https://img.shields.io/badge/Java-21-orange?style=for-the-badge&logo=openjdk" />
  <img src="https://img.shields.io/badge/Spring_Boot-3.x-brightgreen?style=for-the-badge&logo=springboot" />
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?style=for-the-badge&logo=tailwindcss" />
  <img src="https://img.shields.io/badge/Google_Gemini-AI-4285F4?style=for-the-badge&logo=google" />
</p>

> Upload your resume, pick a job role, and get an instant AI-powered analysis — match score, skill gaps, and a full professional summary — all in under 10 seconds.

---

## ✨ Features

- **AI-Powered Analysis** — Google Gemini generates a 5-point professional summary, key strengths, skill gap recommendations, and an overall verdict
- **Match Score** — Percentage score showing how well your resume aligns with the target role
- **Skill Gap Detection** — Clearly highlights which skills you have and which you're missing
- **PDF & Text Support** — Upload a PDF directly or paste resume text
- **14 Job Roles** — Covers full stack, data, AI, cloud, DevOps and systems tracks
- **Clean Dashboard** — Score ring, skill badges, coverage breakdown bar, and full AI report

---

## 🧑‍💻 Tech Stack

| Layer | Technologies |
|---|---|
| **Backend** | Java 21, Spring Boot, Spring Data JPA, Spring WebFlux (WebClient), Lombok |
| **Frontend** | React 18, Tailwind CSS, Axios |
| **Database** | H2 in-memory (zero config — works out of the box) |
| **AI** | Google Gemini 2.0 Flash (REST API) |
| **PDF Parsing** | Apache PDFBox |

---

## 🎯 Supported Job Roles (14)

| # | Role | Key Skills |
|---|---|---|
| 1 | Full Stack Developer | React, Node.js, Express, MySQL, MongoDB, Docker |
| 2 | Backend Developer | Java, Spring Boot, REST API, MySQL, Redis, Microservices |
| 3 | Frontend Developer | React, TypeScript, Tailwind CSS, Redux, Webpack |
| 4 | Software Engineer | Java, Python, DSA, OOP, Design Patterns, SQL |
| 5 | AI Researcher | PyTorch, TensorFlow, NLP, Deep Learning, Statistics |
| 6 | Data Scientist | Python, Scikit-learn, Pandas, ML, Jupyter, TensorFlow |
| 7 | Data Analyst | SQL, Tableau, Power BI, Excel, ETL, Business Intelligence |
| 8 | Data Engineer | Spark, Kafka, Airflow, Hadoop, AWS, Scala |
| 9 | Platform Engineer | Kubernetes, Terraform, Helm, Prometheus, IaC |
| 10 | API Developer | REST API, GraphQL, JWT, OAuth, Swagger, API Gateway |
| 11 | Cloud Engineer | AWS, Azure, GCP, Terraform, Kubernetes, IAM |
| 12 | DevOps Engineer | Docker, Kubernetes, Jenkins, CI/CD, Ansible, Terraform |
| 13 | Site Reliability Engineer | Prometheus, Grafana, SLO, Incident Management, Linux |
| 14 | Systems Engineer | C, C++, Linux, Networking, TCP/IP, Embedded Systems |

---

## 🚀 Getting Started

### Prerequisites

- Java 21+
- Node.js 18+ & npm
- A free Gemini API key → [Get one here](https://aistudio.google.com/app/apikey)

> **No database setup needed** — the app uses H2 in-memory database, everything runs out of the box.

---

### 1. Clone the repository

```bash
git clone https://github.com/Divij-8/ResumeIQ.git
cd ResumeIQ
```

### 2. Configure your Gemini API key

Open `src/main/resources/application.properties` and set:

```properties
gemini.api.key=YOUR_GEMINI_API_KEY_HERE
gemini.model=gemini-2.0-flash
```

### 3. Start the backend

```bash
./mvnw spring-boot:run
```

Backend runs on **http://localhost:8080**

### 4. Start the frontend

```bash
cd frontend
npm install
npm start
```

Frontend runs on **http://localhost:3000**

---

## 📁 Project Structure

```
ResumeIQ/
├── src/main/java/org/example/resumeiq/
│   ├── ResumeIqApplication.java     # App entry point + job role seed data
│   ├── config/                      # WebClient config
│   ├── controller/                  # REST API endpoints
│   ├── dto/                         # Request / Response DTOs
│   ├── entity/                      # JPA entities (JobRole, ResumeAnalysis)
│   ├── repository/                  # Spring Data repositories
│   └── service/
│       ├── ResumeService.java       # Skill matching logic
│       └── AIService.java           # Gemini AI integration
├── src/main/resources/
│   └── application.properties
└── frontend/
    └── src/components/
        ├── HomePage.js              # Landing page
        ├── LoginPage.js             # Login
        ├── SignUpPage.js            # Sign up
        ├── ResumeUploadPage.js      # Resume upload + job role selection
        └── ResultDashboard.js       # Analysis results dashboard
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/jobroles` | List all available job roles |
| `POST` | `/api/analyze` | Analyze resume text |
| `POST` | `/api/upload` | Analyze uploaded PDF resume |

### Example — Analyze resume text

```bash
curl -X POST http://localhost:8080/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"resumeText": "Java Spring Boot REST API MySQL...", "jobRoleId": 2}'
```

### Example response

```json
{
  "matchScore": 80.0,
  "matchedSkills": ["Java", "Spring Boot", "REST API", "MySQL"],
  "missingSkills": ["Redis", "Microservices"],
  "aiAnalysis": "The candidate demonstrates strong backend fundamentals..."
}
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m 'Add my feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a Pull Request

---

## 📄 License

MIT License — feel free to use, modify, and distribute.

---

<p align="center">Built with ❤️ using Spring Boot + React + Google Gemini AI</p>
