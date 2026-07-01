from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import structlog

from app.config import settings
from app.services.ai_service import AICompletionError
from app.database import engine, Base
from app.routers import (
    auth, dashboard, jobs, candidates, interviews,
    employees, onboarding, performance, surveys,
    ai_agents, workflows, analytics,
)
from app.routers import settings as settings_router

log = structlog.get_logger()


@asynccontextmanager
async def lifespan(app: FastAPI):
    log.info("PeopleAI starting up", env=settings.APP_ENV)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    log.info("Database tables ready")
    yield
    await engine.dispose()
    log.info("PeopleAI shut down")


app = FastAPI(
    title="PeopleAI API",
    description="Enterprise HR Automation Platform powered by AI Agents",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.exception_handler(AICompletionError)
async def ai_completion_error_handler(request: Request, exc: AICompletionError):
    # Handled here (inside the CORS middleware) so the browser receives a clear
    # 502 with CORS headers instead of an opaque "No Access-Control-Allow-Origin" error.
    return JSONResponse(
        status_code=status.HTTP_502_BAD_GATEWAY,
        content={"detail": str(exc)},
    )


API = "/api/v1"

app.include_router(auth.router, prefix=f"{API}/auth", tags=["Authentication"])
app.include_router(dashboard.router, prefix=f"{API}/dashboard", tags=["Dashboard"])
app.include_router(jobs.router, prefix=f"{API}/jobs", tags=["Jobs"])
app.include_router(candidates.router, prefix=f"{API}/candidates", tags=["Candidates"])
app.include_router(interviews.router, prefix=f"{API}/interviews", tags=["Interviews"])
app.include_router(employees.router, prefix=f"{API}/employees", tags=["Employees"])
app.include_router(onboarding.router, prefix=f"{API}/onboarding", tags=["Onboarding"])
app.include_router(performance.router, prefix=f"{API}/performance", tags=["Performance"])
app.include_router(surveys.router, prefix=f"{API}/surveys", tags=["Surveys"])
app.include_router(ai_agents.router, prefix=f"{API}/ai-agents", tags=["AI Agents"])
app.include_router(workflows.router, prefix=f"{API}/workflows", tags=["Workflows"])
app.include_router(analytics.router, prefix=f"{API}/analytics", tags=["Analytics"])
app.include_router(settings_router.router, prefix=f"{API}/settings", tags=["Settings"])


@app.get("/health")
async def health():
    return {"status": "healthy", "app": settings.APP_NAME, "version": "1.0.0"}


@app.get("/")
async def root():
    return {"message": "PeopleAI API Swagger UI"}
