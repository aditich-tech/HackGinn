# HackGinn Frontend — Architecture & Component Report
 
## 1. Project Overview
 
The frontend for HackGinn is a single-page React application that communicates with a Spring Boot Java backend and Firebase Authentication. It allows users to login, generate personalized Hackathon blueprints via a robust context-aware dashboard, and export those projects continuously safely through protected Blob intercepts.
 
---
 
## 2. Technology Stack
 
| Technology             | Usage                                      |
|------------------------|--------------------------------------------|
| React                  | UI Component Library (v18)                 |
| TypeScript             | Static typing & interfaces                 |
| Vite                   | Build tool & Dev Server                    |
| React Router DOM       | Client-side routing                        |
| Axios                  | API HTTP client (intercepts Bearer tokens) |
| Firebase Auth          | JWT generation, Google Login, Signup       |
| Lucide React           | SVG Icon library                           |
| Custom CSS             | "Brutalist" UI Design framework            |
 
---
 
## 3. Core Component Architecture
 
```
frontend
├── .env                              # Stores VITE_FIREBASE_* configs, API url
├── package.json        
├── vite.config.ts                    # Vite build configs
├── src/
│   ├── main.tsx                      # App Entry Point (wraps AuthProvider + Router)
│   ├── index.css                     # Global Brutalist UI styles (buttons, layout, grid)
│   ├── firebase.ts                   # Firebase initialization and auth exports
│   ├── App.tsx                       # Main layout: Dashboard sidebar, Hero Form, Tabs
│   ├── api/
│   │   └── api.ts                    # Axios configuration & Backend endpoints
│   ├── contexts/
│   │   └── AuthContext.tsx           # React Context providing Firebase currentUser state
│   ├── components/
│   │   └── AuthForm.css              # Custom scaling (zoom: 0.85) styling for Auth pages
│   └── pages/
│       ├── Login.tsx                 # Firebase Login & Google OAuth handling
│       └── Signup.tsx                # Firebase Registration handling
```
 
---
 
## 4. Routing Flow & Protection
 
The application utilizes `react-router-dom` to pivot users based on authentication status:
 
- `/` - The public landing page & Smart Idea Generator form.
- `/login` & `/signup` - Redux routes for non-authenticated users. (Redirects to dashboard if logged in).
- `/dashboard` - Wrapped in `<ProtectedRoute>`. Redirects strictly back to `/login` if `auth.currentUser` is null. Contains the multi-tab layout for viewing generated features, challenges, and roadmaps.
 
---
 
## 5. Security & API Client (`api.ts`)
 
A crucial aspect of the React frontend is the interaction with the protected Backend server:
 
### 5.1 The Axios Interceptor
Because the backend expects `Authorization: Bearer <token>` on all requests, `api.ts` implements a global request interceptor:
```typescript
axios.interceptors.request.use(async (config) => {
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```
 
### 5.2 Blob File Downloads
Standard `<a href="...">` anchor tags drop Authorization headers, causing Export failures against the Spring Security backend. Thus, the PDF and DOCX downloads are handled smoothly via headless Axios Blob fetching:
```typescript
export const downloadPdf = async (id: number, title: string) => {
  const response = await axios.get(`/ideas/${id}/pdf`, { responseType: 'blob' });
  const url = window.URL.createObjectURL(new Blob([response.data]));
  // Injects temporary <a> and clicks it programmatically
}
```
 
---
 
## 6. Smart Idea Generation Form (`App.tsx`)
 
The core generation is broken down into dynamic inputs ensuring high-quality context for the AI:
- `Project Type`: Software / Hardware / Hybrid.
- `Category/Platform`: Conditionally rendered input requesting the final platform style (e.g., 'Web App', 'SaaS', 'IoT Bracelet').
- `Target Market`: Captures audience vectors (B2B, B2C).
- `Domain` & `Constraints`: Provides thematic anchoring.
- `Tech Stack`: Provided as a comma-separated string, mapped internally to `string[]` for the API.
 
All inputs are piped synchronously into `api.ts -> generateIdea(inputs)`, updating the active Dashboard State (`activeBrd`) instantly.
 
---
 
## 7. UI/UX Design System (`index.css`)
 
HackGinn extensively employs *Neubrutalism*:
- **Shadows**: Defined by sharp, offset box-shadows (`var(--brutal-shadow)`).
- **Colors**: Dominated by Stark Borders, Cyber Cyan, and Cream colored base plates.
- **Micro-Animations**: Uses `translate(-3px, -3px)` and dynamic shadow adjustments on button `:hover` and `:active` triggers to provide tactile feedback.
- **Auth Page Zooming**: `.auth-split-wrapper` applies a global `zoom: 0.85;` specifically to create a dense, highly sophisticated Login/Signup view without clipping screens on smaller monitors.
