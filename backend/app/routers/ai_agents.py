from typing import List, Dict, Any, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from datetime import datetime, timezone
import logging

from app.models.user import User
from app.dependencies import get_current_user

router = APIRouter()
logger = logging.getLogger(__name__)

AGENT_CONFIGS = [
    {
        "id": "jd_generator",
        "name": "JD Generator",
        "description": "Generates compelling job descriptions in multiple formats",
        "category": "recruitment",
        "status": "active",
        "capabilities": ["Generate JDs", "Multiple formats", "SEO optimized"],
        "avg_time_seconds": 15,
        "runs_today": 0,
    },
    {
        "id": "resume_screener",
        "name": "Resume Screener",
        "description": "AI-powered resume screening with detailed scoring",
        "category": "recruitment",
        "status": "active",
        "capabilities": ["Skills matching", "Experience scoring", "Red flag detection"],
        "avg_time_seconds": 20,
        "runs_today": 0,
    },
    {
        "id": "interview_builder",
        "name": "Interview Kit Builder",
        "description": "Creates role-specific interview questions and rubrics",
        "category": "recruitment",
        "status": "active",
        "capabilities": ["Technical questions", "Behavioral questions", "Scoring rubrics"],
        "avg_time_seconds": 18,
        "runs_today": 0,
    },
    {
        "id": "onboarding_planner",
        "name": "Onboarding Planner",
        "description": "Generates personalized 30/60/90 day onboarding plans",
        "category": "onboarding",
        "status": "active",
        "capabilities": ["30/60/90 plans", "Task generation", "Resource recommendations"],
        "avg_time_seconds": 22,
        "runs_today": 0,
    },
    {
        "id": "performance_analyzer",
        "name": "Performance Analyzer",
        "description": "Synthesizes multi-source feedback into actionable insights",
        "category": "performance",
        "status": "active",
        "capabilities": ["360 analysis", "Trend detection", "Development recommendations"],
        "avg_time_seconds": 25,
        "runs_today": 0,
    },
    {
        "id": "survey_analyzer",
        "name": "Survey Analyzer",
        "description": "Analyzes employee surveys with sentiment analysis",
        "category": "engagement",
        "status": "active",
        "capabilities": ["Sentiment analysis", "Theme extraction", "Action items"],
        "avg_time_seconds": 20,
        "runs_today": 0,
    },
]

AGENT_LOGS = []


class RunAgentRequest(BaseModel):
    agent_id: str
    input_data: Dict[str, Any]


@router.get("/", response_model=List[Dict[str, Any]])
async def list_agents(current_user: User = Depends(get_current_user)):
    return AGENT_CONFIGS


@router.get("/logs", response_model=List[Dict[str, Any]])
async def get_agent_logs(
    agent_id: Optional[str] = None,
    limit: int = 50,
    current_user: User = Depends(get_current_user),
):
    logs = AGENT_LOGS
    if agent_id:
        logs = [l for l in logs if l.get("agent_id") == agent_id]
    return logs[-limit:]


@router.get("/{agent_id}", response_model=Dict[str, Any])
async def get_agent(agent_id: str, current_user: User = Depends(get_current_user)):
    agent = next((a for a in AGENT_CONFIGS if a["id"] == agent_id), None)
    if not agent:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Agent not found")
    return agent


@router.post("/run")
async def run_agent(
    request: RunAgentRequest,
    current_user: User = Depends(get_current_user),
):
    agent = next((a for a in AGENT_CONFIGS if a["id"] == request.agent_id), None)
    if not agent:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Agent not found")

    log_entry = {
        "id": len(AGENT_LOGS) + 1,
        "agent_id": request.agent_id,
        "agent_name": agent["name"],
        "user_id": current_user.id,
        "input_data": request.input_data,
        "status": "running",
        "started_at": datetime.now(timezone.utc).isoformat(),
    }
    AGENT_LOGS.append(log_entry)

    return {
        "message": f"Agent '{agent['name']}' triggered",
        "agent_id": request.agent_id,
        "log_id": log_entry["id"],
        "status": "running",
        "note": "Use the specific endpoint for this agent type for full functionality",
    }
