from typing import Optional, List, Dict, Any
from datetime import datetime
from decimal import Decimal
from pydantic import BaseModel
from app.models.job import JobStatus, EmploymentType, ExperienceLevel


class JobBase(BaseModel):
    title: str
    department: Optional[str] = None
    employment_type: EmploymentType = EmploymentType.FULL_TIME
    experience_level: ExperienceLevel = ExperienceLevel.MID
    location: Optional[str] = None
    is_remote: bool = False
    salary_min: Optional[Decimal] = None
    salary_max: Optional[Decimal] = None
    currency: str = "USD"
    description: Optional[str] = None
    requirements: Optional[str] = None
    benefits: Optional[str] = None
    skills_required: List[str] = []


class JobCreate(JobBase):
    org_id: int


class JobUpdate(BaseModel):
    title: Optional[str] = None
    department: Optional[str] = None
    employment_type: Optional[EmploymentType] = None
    experience_level: Optional[ExperienceLevel] = None
    location: Optional[str] = None
    is_remote: Optional[bool] = None
    salary_min: Optional[Decimal] = None
    salary_max: Optional[Decimal] = None
    description: Optional[str] = None
    requirements: Optional[str] = None
    benefits: Optional[str] = None
    status: Optional[JobStatus] = None
    skills_required: Optional[List[str]] = None


class JobResponse(JobBase):
    id: int
    status: JobStatus
    jd_versions: Dict[str, Any]
    org_id: int
    created_by: Optional[int]
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class GenerateJDRequest(BaseModel):
    job_id: int
    additional_context: Optional[str] = None
    tone: Optional[str] = "professional"


class GenerateJDResponse(BaseModel):
    job_id: int
    versions: Dict[str, str]
