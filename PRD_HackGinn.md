# Product Requirement Document (PRD): **HackGinn**

**Version**: 1.0  
**Status**: Draft  
**Project Owner**: @USER  
**AI Architect**: Antigravity

---

## 1. Product Overview
**HackGinn** is an AI-powered "Hackathon Project Co-Pilot" designed to eliminate the initial 2–6 hours of friction typically found at the start of any hackathon. By providing personalized, feasible, and high-impact project ideas with an immediate development roadmap, it ensures teams can start coding and building within minutes of the competition's commencement.

## 2. Problem Statement
Hackathon participants often face three major hurdles:
1.  **Idea Paralysis**: Spending hours brainstorming generic ideas that lack unique value.
2.  **Feasibility Gap**: Choosing ideas that are too ambitious for the 24-48 hour timeframe or misaligned with the team's actual skill levels.
3.  **Lack of Direction**: Even with a good idea, teams often struggle to break it down into an actionable technical roadmap, leading to poor execution and missed deadlines.

## 3. Goals and Objectives
-   **Speed to Execution**: Reduce the time from "Start" to "First Commit" to under 10 minutes.
-   **Personalization**: Generate ideas that specifically leverage the team's stack (e.g., MERN, Python/FastAPI, or Flutter).
-   **Comprehensive Blueprinting**: Every idea must come with a clear tech stack, architectural diagram, and a phased development roadmap.
-   **Professional Presentation**: Standardize the output into reviewable dashboards and downloadable documents (PDF/DOCX).

## 4. Target Audience
-   **Hackathon Participants**: Students, software engineers, and designers.
-   **Hackathon Organizers**: Seeking tools to provide participants with more structure and support.
-   **Indie Hackers**: Developers looking for high-feasibility side-project inspiration.

---

## 5. Key Features & Functionality

### 5.1 Personalized Idea Engine
-   **Dynamic Inputs**: Users provide team size, skill levels (Beginner, Intermediate, Advanced, Vibe Coder), and preferred tech stack.
-   **Constraint Integration**: Users can upload hackathon rulebooks or specific themes (e.g., "AI for Social Good") to bias the AI.
-   **Groq-Powered Synthesis**: High-speed LLM processing to generate 3-5 distinct, viable project concepts.

### 5.2 Implementation Roadmap
-   **Functional Requirements**: Immediate breakdown of features needed ("What to build").
-   **Technical Decisions**: Recommended architecture, database schemas, and API design.
-   **Risk Assessment**: Identification of "Hard Parts" and potential time-sinks.
-   **Phased Timeline**: A 12 / 24 / 48-hour schedule tailored to the project complexity.

### 5.3 Interactive Dashboard (Brdify UI)
-   **Multi-Tab Review**: Ability to flip between Summary, Features, Architecture, Team Roles, and Timeline.
-   **Manual Refinement**: Inline editing for users to tweak the AI's suggestions and make them their own.
-   **Export Engine**: Instant generation of PDF and DOCX blueprints.

---

## 6. Technical Stack
-   **Frontend**: React 18, Vite, TypeScript, Lucide React (Icons), Firebase Auth.
-   **Backend**: Java 17 + Spring Boot 3 + MySQL.
-   **AI Integration**: Groq Cloud API (Llama 3 Models).
-   **Infrastructure**: Dotenv for environment management.

## 7. User Flow
1.  **Onboarding**: User logs in/signs up via Firebase.
2.  **Input Phase**: User fills out the HackGinn dashboard (Skills, Theme, Stack).
3.  **Synthesis**: AI processes inputs and provides a list of refined project ideas.
4.  **Selection**: User selects an idea and views the full Blueprint.
5.  **Refinement**: User edits specific features or timelines on the dashboard.
6.  **Export**: User downloads the PDF roadmap to share with the team and mentors.

---

## 8. Success Metrics
-   **Time-to-Idea**: < 30 seconds for initial generation.
-   **Blueprint Quality**: > 80% user satisfaction with the provided roadmap.
-   **Export Volume**: Number of PDF/DOCX blueprints generated per hackathon event.

## 9. Future Roadmap
-   **GitHub/Vercel One-Click Deploy**: Automatically scaffold the repo and deploy a "Hello World" boilerplate based on the tech stack.
-   **Mentor Mode**: A shareable public link for mentors to view the project progress and roadmap.
-   **Real-time Collaboration**: Syncing the dashboard across all team members' screens.
