from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
import logging

from app.database import get_db
from app.models.interview import Interview
from app.models.candidate import Candidate
from app.models.job import Job
from app.models.user import User
from app.schemas.interview import InterviewCreate, InterviewUpdate, InterviewResponse, GenerateKitRequest, GenerateKitResponse
from app.dependencies import get_current_user
from app.services.interview_builder import generate_interview_kit

router = APIRouter()
logger = logging.getLogger(__name__)


@router.get("/", response_model=List[InterviewResponse])
async def list_interviews(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    candidate_id: Optional[int] = None,
    job_id: Optional[int] = None,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    query = select(Interview).join(Job).where(Job.org_id == current_user.org_id)
    if candidate_id:
        query = query.where(Interview.candidate_id == candidate_id)
    if job_id:
        query = query.where(Interview.job_id == job_id)
    query = query.offset(skip).limit(limit).order_by(Interview.created_at.desc())
    result = await db.execute(query)
    return result.scalars().all()


@router.post("/", response_model=InterviewResponse, status_code=status.HTTP_201_CREATED)
async def create_interview(
    interview_data: InterviewCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    interview = Interview(**interview_data.model_dump())
    db.add(interview)
    await db.flush()
    await db.refresh(interview)
    return interview


@router.get("/{interview_id}", response_model=InterviewResponse)
async def get_interview(
    interview_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Interview).join(Job).where(Interview.id == interview_id, Job.org_id == current_user.org_id)
    )
    interview = result.scalar_one_or_none()
    if not interview:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Interview not found")
    return interview


@router.put("/{interview_id}", response_model=InterviewResponse)
async def update_interview(
    interview_id: int,
    interview_data: InterviewUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Interview).join(Job).where(Interview.id == interview_id, Job.org_id == current_user.org_id)
    )
    interview = result.scalar_one_or_none()
    if not interview:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Interview not found")
    for key, value in interview_data.model_dump(exclude_unset=True).items():
        setattr(interview, key, value)
    await db.flush()
    await db.refresh(interview)
    return interview


@router.delete("/{interview_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_interview(
    interview_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Interview).join(Job).where(Interview.id == interview_id, Job.org_id == current_user.org_id)
    )
    interview = result.scalar_one_or_none()
    if not interview:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Interview not found")
    await db.delete(interview)


@router.post("/generate-kit", response_model=GenerateKitResponse)
async def generate_kit(
    request: GenerateKitRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    job_result = await db.execute(select(Job).where(Job.id == request.job_id, Job.org_id == current_user.org_id))
    job = job_result.scalar_one_or_none()
    if not job:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job not found")

    candidate_data = None
    if request.candidate_id:
        cand_result = await db.execute(select(Candidate).where(Candidate.id == request.candidate_id))
        candidate = cand_result.scalar_one_or_none()
        if candidate:
            candidate_data = {
                "name": candidate.name,
                "years_experience": float(candidate.years_experience) if candidate.years_experience else None,
                "skills": candidate.skills or [],
            }

    job_data = {
        "title": job.title,
        "skills_required": job.skills_required or [],
        "experience_level": job.experience_level.value if job.experience_level else "",
    }

    kit = await generate_interview_kit(job_data, request.interview_type.value, request.num_questions, candidate_data)

    return GenerateKitResponse(
        interview_type=request.interview_type,
        questions=kit.get("questions", []),
        scoring_rubric=kit.get("scoring_rubric", {}),
        time_allocation=kit.get("time_allocation", {}),
    )
