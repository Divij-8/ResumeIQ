# ResumeIQ — AI-Powered Resume Analyzer & Skill Gap Recommender

Full-stack application that analyzes resumes against job requirements and provides AI-powered skill gap recommendations using **Google Gemini**.

## Tech Stack

**Backend:** Java 21, Spring Boot 4.0.3, Spring Data JPA, MySQL, Lombok, Spring WebFlux (WebClient)  
**Frontend:** React 18, Tailwind CSS, Axios  
**AI:** Google Gemini 2.0 Flash (REST API)

## Features

- Keyword-based skill matching with percentage score
- Matched / missing skill breakdown
- Gemini AI analysis — professional summary, strengths, skill gap recommendations, and verdict
- 3 built-in job roles (Backend Developer, Data Engineer, Frontend Developer)
- Results persisted to MySQL

## Prerequisites

- Java 21+
- Node.js 16+ & npm
- MySQL running on `localhost:3306` (user: `root`, password: `root`)
- (Optional) Gemini API key from https://aistudio.google.com/app/apikey

## Setup & Run

### 1. Create the MySQL database

```bash
mysql -u root -proot -e "CREATE DATABASE IF NOT EXISTS resumeiq_db;"
```

### 2. Start the backend

```bash
# From project root
export GEMINI_API_KEY="your-gemini-api-key"   # optional — app works without it
./mvnw spring-boot:run
```

Backend runs on **http://localhost:8080**

### 3. Start the frontend

```bash
cd frontend
npm install    # first time only
npm start
```

Frontend runs on **http://localhost:3000**

## API Endpoints

| Method | URL | Description |
|--------|-----|-------------|
| GET | `/api/jobroles` | List all job roles |
| POST | `/api/analyze` | Analyze a resume |

**POST /api/analyze** request body:
```json
{ "resumeText": "your resume...", "jobRoleId": 1 }
```

## Project Structure

```
src/main/java/org/example/resumeiq/
├── entity/          JobRole, ResumeAnalysis
├── repository/      JPA repositories
├── dto/             ResumeRequest, ResumeResponse
├── service/         ResumeService, AIService (Gemini)
├── controller/      ResumeController
└── ResumeIqApplication.java

frontend/src/
├── api/axios.js
├── components/      ResumeUploadPage, ResultDashboard
├── App.js
└── index.js
```
