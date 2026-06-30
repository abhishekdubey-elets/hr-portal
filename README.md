# PeopleAI — Enterprise HR Automation Platform

> Hire smarter. Grow faster. Powered by AI Agents.

---

## Project Structure

```
hr/
├── backend/          FastAPI Python backend
│   ├── main.py       FastAPI app entrypoint
│   ├── app/
│   │   ├── models/   SQLAlchemy ORM models (12 tables)
│   │   ├── schemas/  Pydantic schemas
│   │   ├── routers/  API route handlers (13 routers)
│   │   ├── services/ AI services (JD, Resume, Interview, etc.)
│   │   └── core/     JWT auth, permissions
│   ├── migrations/   Alembic schema migrations
│   └── docker-compose.yml
└── frontend/         Next.js 14 React frontend
    ├── src/
    │   ├── app/      App Router pages
    │   ├── components/  UI + layout components
    │   ├── lib/      API client + utilities
    │   └── types/    TypeScript interfaces
    └── package.json
```

---

## Quick Start

### Backend

```bash
cd backend
cp .env.example .env          # Fill in your API keys

# Option 1: Docker (recommended)
docker-compose up -d          # Starts: API (8000), PostgreSQL, Redis

# Option 2: Local
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

API docs: http://localhost:8000/api/docs

### Frontend

```bash
cd frontend
cp .env.local.example .env.local
npm install
npm run dev                   # http://localhost:3000
```

---

## API Endpoints

| Module | Endpoints |
|--------|-----------|
| Auth | POST /auth/register, /auth/login, /auth/refresh, GET /auth/me |
| Dashboard | GET /dashboard/summary, /dashboard/hiring-funnel |
| Jobs | CRUD /jobs + POST /jobs/{id}/generate-jd |
| Candidates | CRUD /candidates + POST /candidates/screen-resume |
| Interviews | CRUD /interviews + POST /interviews/{id}/generate-kit |
| Employees | CRUD /employees |
| Onboarding | POST /onboarding/generate, GET /onboarding/{employee_id} |
| Performance | CRUD /performance + POST /performance/{id}/generate-summary |
| Surveys | CRUD /surveys + POST /surveys/{id}/analyze |
| AI Agents | GET /ai-agents, GET /ai-agents/{id}/logs |
| Workflows | CRUD /workflows + POST /workflows/{id}/run |
| Analytics | GET /analytics/hiring-trends, /offer-conversion, /time-to-hire, /retention |
| Settings | GET/PATCH /settings/organization, /settings/ai-config |

---

## AI Agents

| Agent | Model | Capability |
|-------|-------|-----------|
| JD Generator | GPT-4o | 5 JD format variants (professional, LinkedIn, Indeed, short, internal) |
| Resume Screener | GPT-4o | PDF/DOCX text extraction + skill match scoring + pros/cons/red flags |
| Interview Kit Builder | Claude Sonnet | Behavioral, technical, scenario questions + scorecard rubric |
| Onboarding Planner | GPT-4o | Personalized 30/60/90 day task plans |
| Performance Analyzer | Claude Sonnet | Multi-source feedback aggregation + AI summary |
| Pulse Survey Analyzer | GPT-4o | Sentiment, burnout detection, theme extraction |
| Skills Gap Mapper | GPT-4o | Current vs required skills comparison + learning paths |

---

## Tech Stack

**Backend:** FastAPI · SQLAlchemy (async) · PostgreSQL + pgvector · Redis · Alembic · Celery  
**AI:** OpenAI GPT-4o · Anthropic Claude Sonnet · Tenacity retry logic  
**Frontend:** Next.js 14 · TypeScript · TailwindCSS · Recharts · Framer Motion · Zustand  
**Auth:** JWT (HS256) · bcrypt password hashing · role-based permissions  
**Storage:** S3-compatible object storage for resumes  
**DevOps:** Docker Compose · Vercel (frontend) · Railway/AWS (backend)

---

## User Roles

| Role | Access |
|------|--------|
| Super Admin | Full platform access + billing + audit |
| HR Admin | All modules, all employees, settings |
| Recruiter | Recruitment pipeline, candidates, JDs |
| Hiring Manager | Own job openings, interview kits |
| Department Manager | Team performance, onboarding |
| Employee | Own profile, self-review, surveys |

---

## Environment Variables

Set these in `backend/.env`:
- `OPENAI_API_KEY` — OpenAI API key for JD generation and screening
- `ANTHROPIC_API_KEY` — Anthropic key for interview kits and performance
- `DATABASE_URL` — PostgreSQL connection string
- `JWT_SECRET_KEY` — Random 32+ char secret for JWT signing

---

## Deployment

### Vercel (Frontend)
```bash
cd frontend && vercel --prod
```

### Railway (Backend)
```bash
# Push to GitHub, connect Railway, set env vars
railway up
```

### Full Docker
```bash
cd backend
docker-compose up -d --build
```
