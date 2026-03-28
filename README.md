# HackGinn: AI-Powered Hackathon Blueprint Generator

**HackGinn** is an intelligent, full-stack platform designed to help teams stop wasting hours brainstorming and start building immediately. By feeding in your team size, project type, technical skills, and target market, HackGinn leverages the **Groq Llama 3 API** to instantly generate feasible, highly-structured hackathon project blueprints. 

> [!TIP]
> **What does it do?** It generates ideas, builds a 2-stage execution roadmap (Hackathon MVP vs Scaling), anticipates technical challenges, defines target audiences, and allows you to export the entire generated plan as a polished PDF or DOCX file.

---

## Key Features

- **Smart Idea Context**: Tailor your hackathon generation by specifying `Project Type` (Software/Hardware), `Platform` (App, ML, IoT), and `Target Market` (B2B, B2C).
- **Two-Stage Roadmap Tracker**: Automatically splits deliverables into what must be done *during* the hackathon (Core MVP) versus what happens *after* (Post-Hackathon Scaling).
- **Firebase JWT Authentication**: Fully secured Spring Boot backend that automatically tracks and locks your saved generated ideas to your unique Google Firebase User ID.
- **Continuous Saving**: Edit AI-generated content (add challenges, tweak roadmap phases) and safely save it to your history.
- **Secure File Exports**: Export your active Hackathon BRD (Business Requirements Document) to PDF or DOCX natively via authenticated Blob streams.

---

## Technology Stack

### Backend Server (Java)
- **Framework**: Spring Boot 3.2.5 (Java 17)
- **Security**: Spring Security & OAuth2 Resource Server (Firebase JWT Decoding)
- **Database**: MySQL 8.x + Spring Data JPA
- **AI Integration**: Groq Cloud REST API
- **Document Exporters**: OpenPDF (PDF), Apache POI (DOCX)

### Frontend Client (React)
- **Framework**: React 18 + TypeScript (Vite)
- **Authentication**: Firebase Client SDK (Email/Password, Google OAuth)
- **State & Routing**: React Router DOM
- **API Client**: Axios (with auto-injecting Token Interceptors)
- **Styling**: Custom Neubrutalism Design System (Stark borders, Cyber cyan highlights)

---

## Architecture & Security Model

HackGinn uses a decoupled architecture:
1. **The React UI** handles user interactions and talks to **Google Firebase** to retrieve a secure, signed JWT Bearer Token upon login.
2. The UI intercepts all `axios` requests to attach `Authorization: Bearer <token>`.
3. The **Spring Boot Backend** catches all `/api/**` traffic through its `SecurityFilterChain`. It dynamically reaches out to Google's public JWK servers (`securetoken.google.com`) to mathematically verify the token signature without needing a separate auth database.
4. Extracted user UIDs are aggressively bound to the MySQL `blueprints` table to guarantee that endpoints like `GET /api/ideas/me` strictly return the requesting user's private data.

---

## Local Setup & Installation

### Prerequisites
- **Java 17+** & **Maven**
- **Node.js 18+**
- **MySQL Server** running locally
- **Firebase Project** (Web App Configured)
- **Groq API Key** (Get it free at [console.groq.com](https://console.groq.com/))

### 1. Database Setup
Create a local MySQL database for the backend:
```sql
CREATE DATABASE hackginn;
```

### 2. Frontend Environment Configuration
Navigate to `frontend/` and create a `.env` file:
```env
VITE_API_URL=http://localhost:8080/api

# Your Firebase Web Config
VITE_FIREBASE_API_KEY="AIzaSyCX-..."
VITE_FIREBASE_AUTH_DOMAIN="your-app.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="your-project-id"
VITE_FIREBASE_STORAGE_BUCKET="your-app.firebasestorage.app"
VITE_FIREBASE_MESSAGING_SENDER_ID="12345678"
VITE_FIREBASE_APP_ID="1:12345:web:abcdef"
```

### 3. Backend Environment Configuration
Navigate to `backend/` and create a `.env` file at the root of the Java module:
```env
DB_URL=jdbc:mysql://localhost:3306/hackginn?useSSL=false&serverTimezone=UTC
DB_USERNAME=root
DB_PASSWORD=your_mysql_password
GROQ_API_KEY=gsk_your_groq_api_key_here
```
*(Note: Spring's `application.properties` natively reads the Firebase Project configured in `SecurityConfig.java`. If you changed your Firebase app URL, update `spring.security.oauth2.resourceserver.jwt.issuer-uri` in `application.properties`!)*

### 4. Running the Stack

**Backend (Terminal 1):**
```bash
cd backend
mvn spring-boot:run
```
*Backend starts on `http://localhost:8080`. MySQL schema is automatically built on first boot.*

**Frontend (Terminal 2):**
```bash
cd frontend
npm install
npm run dev
```
*Frontend starts on `http://localhost:5173`. Open this in your browser.*

---

## Usage Flow
1. **Login/Register**: Authenticate using standard email or Google OAuth.
2. **Generate**: Use the "Personalized Generate" widget on the Hero screen to define your Hackathon parameters. 
3. **Execute**: The UI will load the Groq-generated blueprint into a multi-tab dashboard.
4. **Iterate**: Jump back and forth between "Technologies", "Target Audience", and "Roadmap".
5. **Print**: Click the **PDF** or **DOCX** download buttons to instantly compile your document natively from the server to your local machine!

---
*Built for the hackers, by the hackers.*
