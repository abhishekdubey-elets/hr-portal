from typing import Optional, Dict, Any
from datetime import datetime
from pydantic import BaseModel
from app.models.interview import InterviewType, InterviewStatus


class InterviewBase(BaseModel):
    candidate_id: int
    job_id: int
    interviewer_id: Optional[int] = None
    scheduled_at: Optional[datetime] = None
    duration_minutes: int = 60
    type: InterviewType = InterviewType.TECHNICAL
    meeting_link: Optional[str] = None


class InterviewCreate(InterviewBase):
    pass


class InterviewUpdate(BaseModel):
    interviewer_id: Optional[int] = None
    scheduled_at: Optional[datetime] = None
    duration_minutes: Optional[int] = None
    status: Optional[InterviewStatus] = None
    meeting_link: Optional[str] = None
    notes: Optional[str] = None
    scorecard: Optional[Dict[str, Any]] = None
    overall_rating: Optional[int] = None
    recommendation: Optional[str] = None


class InterviewResponse(InterviewBase):
    id: int
    status: InterviewStatus
    question_kit: Dict[str, Any]
    scorecard: Dict[str, Any]
    notes: Optional[str]
    overall_rating: Optional[int]
    recommendation: Optional[str]
    completed_at: Optional[datetime]
    created_at: datetime

    model_config = {"from_attributes": True}


class GenerateKitRequest(BaseModel):
    job_id: int
    interview_type: InterviewType
    candidate_id: Optional[int] = None
    num_questions: int = 10


class GenerateKitResponse(BaseModel):
    interview_type: InterviewType
    questions: list
    scoring_rubric: Dict[str, Any]
    time_allocation: Dict[str, int]
