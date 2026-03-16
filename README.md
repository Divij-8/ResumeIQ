# ResumeIQ — Resume Analyzer

<p align="center">
  <img src="https://img.shields.io/badge/Java-21-orange?style=for-the-badge&logo=openjdk" />
  <img src="https://img.shields.io/badge/Spring_Boot-3.x-brightgreen?style=for-the-badge&logo=springboot" />
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?style=for-the-badge&logo=tailwindcss" />
</p>

> Upload your resume, pick a job role, and get an instant analysis — match score and skill gaps — all in seconds.

---

## ✨ Features

- **Match Score** — Percentage score showing how well your resume aligns with the target role
- **Skill Gap Detection** — Clearly highlights which skills you have and which you're missing
- **Text Support** — Paste resume text directly
- **14 Job Roles** — Covers full stack, data, cloud, DevOps and systems tracks
- **Clean Dashboard** — Score ring, skill badges, and coverage breakdown

---

## 🧑‍💻 Tech Stack

| Layer | Technologies |
|---|---|
| **Backend** | Java 21, Spring Boot, Spring Data JPA, Lombok |
| **Frontend** | React 18, Tailwind CSS, Axios |
| **Database** | H2 in-memory (zero config — works out of the box) |

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

> **No database setup needed** — the app uses H2 in-memory database, everything runs out of the box.

---

### Local Development

#### 1. Clone the repository

```bash
git clone https://github.com/Divij-8/ResumeIQ.git
cd ResumeIQ
```

#### 2. Start the backend

```bash
./mvnw spring-boot:run
```

Backend runs on **http://localhost:8080**

#### 3. Start the frontend

```bash
cd frontend
npm install
npm start
```

Frontend runs on **http://localhost:3000**

---

## 🚀 Deploy to Render

### Prerequisites for Render
- A Render account (sign up at https://render.com)
- GitHub repository with this code

### Deployment Steps

1. **Push to GitHub**
   ```bash
   git push origin main
   ```

2. **Create a Web Service on Render**
   - Go to https://dashboard.render.com
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Configure:
     - **Name**: `resumeiq` (or your preferred name)
     - **Environment**: `Java 21`
     - **Build Command**: `./mvnw clean package -DskipTests`
     - **Start Command**: Already set in `Procfile`
     - **Plan**: Free tier works fine

3. **Deploy**
   - Click "Create Web Service"
   - Render will automatically build and deploy your app
   - Your app will be live at `https://resumeiq.onrender.com` (or similar)

4. **Update Frontend API URL** (if needed)
   - If your frontend is deployed separately, update `frontend/src/api/axios.js` to point to your Render backend URL
   - Or deploy frontend as a static site on Render

### Full Stack Deployment on Render

To deploy both backend and frontend together:

1. **Build the frontend** and include it in the JAR:
   ```bash
   cd frontend
   npm install
   npm run build
   cd ..
   ```

2. **The Spring Boot app will serve the built frontend** from the `src/main/resources/static/` directory

3. Push to GitHub and deploy as described above

## 📁 Project Structure

```
ResumeIQ/
├── src/main/java/org/example/resumeiq/
│   ├── ResumeIqApplication.java     # App entry point + job role seed data
│   ├── controller/                  # REST API endpoints
│   ├── dto/                         # Request / Response DTOs
│   ├── entity/                      # JPA entities (JobRole, ResumeAnalysis)
│   ├── repository/                  # Spring Data repositories
│   └── service/
│       └── ResumeService.java       # Skill matching logic
├── src/main/resources/
│   └── application.properties
├── Procfile                         # Render deployment config
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
  "missingSkills": ["Redis", "Microservices"]
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

<p align="center">Built with ❤️ using Spring Boot + React</p>
