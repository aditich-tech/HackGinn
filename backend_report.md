# HackGinn Backend — Complete API Reference & Architecture Report
 
## 1. Project Overview
 
HackGinn is an AI-powered hackathon idea generator. The backend is a Spring Boot REST API that accepts user parameters (project type, platform, market, tech stack, domain, constraints), sends them to the Groq Cloud LLM API, and returns a structured project blueprint. Blueprints are persisted in MySQL linking to authenticated Firebase users, and can be exported securely as PDF or DOCX blobs.
 
---
 
## 2. Technology Stack
 
| Layer              | Technology                          | Version   |
|--------------------|-------------------------------------|-----------|
| Language           | Java                                | 17        |
| Framework          | Spring Boot                         | 3.2.5     |
| Security           | Spring Security OAuth2              | 3.2.5     |
| HTTP Client        | Spring WebFlux (WebClient)          | 3.2.5     |
| ORM                | Spring Data JPA + Hibernate         | 3.2.5     |
| Database           | MySQL                               | 8.x       |
| AI Provider        | Groq Cloud API                      | REST      |
| LLM Model          | llama-3.3-70b-versatile             | —         |
| PDF Export         | OpenPDF                             | 1.3.43    |
| DOCX Export        | Apache POI (poi-ooxml)              | 5.2.5     |
| Environment Vars   | dotenv-java                         | 3.0.0     |
| Validation         | Spring Boot Starter Validation      | 3.2.5     |
 
---
 
## 3. Project Package Structure
 
```
com.hackginn
├── HackGinnApplication.java          
├── config/
│   ├── WebClientConfig.java          
│   └── SecurityConfig.java           # Configures global CORS & JWT Firebase OAuth2 validation
├── controller/
│   ├── IdeaController.java           # Secured endpoints mapping JWT token UIDs
│   └── UploadController.java         
├── converter/
│   ├── StringListConverter.java      
│   └── MilestoneListConverter.java   
├── dto/
│   ├── GenerateRequest.java          # Includes projectType, platform, targetMarket properties
│   ├── UploadTextRequest.java        
│   └── BlueprintDto.java             
├── entity/
│   ├── Blueprint.java                # JPA Entity includes user_id column tracking Firebase creators
│   └── Milestone.java                # JSON embedded POJO
├── exception/
│   ├── ResourceNotFoundException.java
│   └── GlobalExceptionHandler.java   
├── repository/
│   └── BlueprintRepository.java      # Includes findByUserIdOrderByCreatedAtDesc
└── service/
    ├── GroqService.java              
    ├── IdeaService.java              # Validates Ownership of fetched and updated Blueprints
    └── ExportService.java            
```
 
---
 
## 4. Environment Configuration
 
### application.properties
```properties
server.port=8080
 
spring.datasource.url=${DB_URL}
spring.datasource.username=${DB_USERNAME}
spring.datasource.password=${DB_PASSWORD}
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
 
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect
 
groq.api.key=${GROQ_API_KEY}
groq.model=llama-3.3-70b-versatile
 
spring.security.oauth2.resourceserver.jwt.issuer-uri=https://securetoken.google.com/brdfy-39245
```
 
---
 
## 5. Database Schema
 
### Table: blueprints
 
| Column         | Type         | Constraints              | Description                                  |
|----------------|--------------|--------------------------|----------------------------------------------|
| id             | BIGINT       | PK, AUTO_INCREMENT       | Unique blueprint identifier                  |
| user_id        | VARCHAR(255) | nullable                 | Maps to the creator's Firebase UID           |
| title          | VARCHAR(255) | NOT NULL                 | Project name                                 |
| summary        | TEXT         | nullable                 | Elevator pitch                               |
| features       | JSON         | nullable                 | List of core features                        |
| tech_stack     | JSON         | nullable                 | List of tools/frameworks                     |
| target_audience| JSON         | nullable                 | List of user personas                        |
| challenges     | JSON         | nullable                 | List of risks                                |
| roadmap        | JSON         | nullable                 | List of Milestone objects (split into MVP/Scaling) |
| original_prompt| TEXT         | nullable                 | The raw user input                           |
| created_at     | DATETIME     | NOT NULL                 | Timestamps                                   |
| updated_at     | DATETIME     | nullable                 | Timestamps                                   |
 
---
 
## 6. REST API Endpoints
 
**Base URL:** `http://localhost:8080/api`
**Security:** All `/api/**` endpoints require an `Authorization: Bearer <Firebase JWT Token>` except where explicitly opened.
 
### 6.1 POST /api/generate
**Purpose:** Generate a hackathon project blueprint via Groq AI. Links automatically to requesting User UID via Bearer Token.
**Request Body Structure:**
```json
{
  "projectType": "Software",
  "platform": "Web App",
  "targetMarket": "B2B SaaS",
  "skillLevel": "Intermediate",
  "techStack": ["React", "Spring Boot"]
}
```
**Success Response:** `200 OK` (BlueprintDto object mapping)
 
### 6.2 GET /api/ideas/me
**Purpose:** Fetch the list of historical blueprints generated by the currently logged-in user.
**Auth:** Requires valid Firebase Token.
**Response:** `List<BlueprintDto>`
 
### 6.3 GET /api/ideas/{id}
**Purpose:** Fetch a single blueprint details.
**Security:** Returns `401/403` if requested ID doesn't belong to requesting user JWT.
 
### 6.4 GET /api/ideas/{id}/pdf & /docx
**Purpose:** Generate secure Blob binary streams for Export. 
**Output:** Binary byte stream parsed via native fetch or Axios.
 
---
 
## 7. Groq AI Integration
The system prompt strictly instructs Groq to output JSON arrays with a uniquely structured `roadmap` payload enforcing a split structure (`Hackathon MVP` vs `Post-Hackathon Scaling`). No timeframe mapping variables are injected natively, forcing purely logical architectural milestones.
 
---
 
## 8. Security Details (NEW)
1. **OAuth2 Resource Server:** Validates JWT signature keys automatically on every single request against Firebase servers.
2. **CORS:** Only `http://localhost:5173` is permitted explicitly by `SecurityConfig.java`.
3. **Identity Tracking:** `IdeaService` strictly checks if `blueprint.getUserId().equals(jwt.getSubject())` prior to processing *update, fetch, or export* logic to prevent ID-guessing data leaks.