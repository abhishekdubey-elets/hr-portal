from typing import Optional, List, Dict, Any
from datetime import datetime
from pydantic import BaseModel
from app.models.performance import ReviewStatus


class PerformanceReviewBase(BaseModel):
    employee_id: int
    reviewer_id: Optional[int] = None
    period: str
    period_start: Optional[datetime] = None
    period_end: Optional[datetime] = None
    goals: List[Dict[str, Any]] = []


class PerformanceReviewCreate(PerformanceReviewBase):
    pass


class PerformanceReviewUpdate(BaseModel):
    self_review: Optional[Dict[str, Any]] = None
    manager_review: Optional[Dict[str, Any]] = None
    peer_reviews: Optional[List[Dict[str, Any]]] = None
    overall_rating: Optional[int] = None
    status: Optional[ReviewStatus] = None
    goals: Optional[List[Dict[str, Any]]] = None


class PerformanceReviewResponse(PerformanceReviewBase):
    id: int
    self_review: Dict[str, Any]
    manager_review: Dict[str, Any]
    peer_reviews: List[Dict[str, Any]]
    ai_summary: Dict[str, Any]
    overall_rating: Optional[int]
    status: ReviewStatus
    due_date: Optional[datetime]
    created_at: datetime

    model_config = {"from_attributes": True}
