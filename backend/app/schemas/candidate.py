from typing import Optional, List, Dict, Any
from datetime import datetime
from decimal import Decimal
from pydantic import BaseModel, EmailStr
from app.models.candidate import CandidateStage


class CandidateBase(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    linkedin_url: Optional[str] = None
    portfolio_url: Optional[str] = None
    current_company: Optional[str] = None
    current_title: Optional[str] = None
    years_experience: Optional[Decimal] = None
    location: Optional[str] = None
    source: Optional[str] = None


class CandidateCreate(CandidateBase):
    job_id: int


class CandidateUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    stage: Optional[CandidateStage] = None
    notes: Optional[str] = None
    current_company: Optional[str] = None
    current_title: Optional[str] = None


class CandidateResponse(CandidateBase):
    id: int
    job_id: int
    stage: CandidateStage
    resume_url: Optional[str]
    ai_score: Dict[str, Any]
    pros: List[str]
    cons: List[str]
    red_flags: List[str]
    skills: List[str]
    notes: Optional[str]
    screened_at: Optional[datetime]
    created_at: datetime

    model_config = {"from_attributes": True}


class ScreenResumeResponse(BaseModel):
    candidate_id: int
    ai_score: Dict[str, Any]
    pros: List[str]
    cons: List[str]
    red_flags: List[str]
    skills: List[str]
    summary: str
    recommendation: str


class ScreenResumePreviewResponse(BaseModel):
    name: str = ""
    email: str = ""
    location: str = ""
    current_company: str = ""
    current_title: str = ""
    years_experience: float = 0
    ai_score: Dict[str, Any]
    pros: List[str]
    cons: List[str]
    red_flags: List[str]
    skills: List[str]
    summary: str = ""
    recommendation: str = "maybe"
