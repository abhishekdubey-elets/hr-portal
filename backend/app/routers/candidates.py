from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query, UploadFile, File, Form
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
import logging
from datetime import datetime, timezone

from app.database import get_db
from app.models.candidate import Candidate, CandidateStage
from app.models.job import Job
from app.models.user import User
from app.schemas.candidate import CandidateCreate, CandidateUpdate, CandidateResponse, ScreenResumeResponse
from app.dependencies import get_current_user
from app.services.resume_screener import extract_resume_text, screen_resume

router = APIRouter()
logger = logging.getLogger(__name__)


@router.get("/", response_model=List[CandidateResponse])
async def list_candidates(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    job_id: Optional[int] = None,
    stage: Optional[CandidateStage] = None,
    search: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    query = select(Candidate).join(Job).where(Job.org_id == current_user.org_id)
    if job_id:
        query = query.where(Candidate.job_id == job_id)
    if stage:
        query = query.where(Candidate.stage == stage)
    if search:
        query = query.where(Candidate.name.ilike(f"%{search}%") | Candidate.email.ilike(f"%{search}%"))
    query = query.offset(skip).limit(limit).order_by(Candidate.created_at.desc())
    result = await db.execute(query)
    return result.scalars().all()


@router.post("/", response_model=CandidateResponse, status_code=status.HTTP_201_CREATED)
async def create_candidate(
    candidate_data: CandidateCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    job_result = await db.execute(select(Job).where(Job.id == candidate_data.job_id, Job.org_id == current_user.org_id))
    if not job_result.scalar_one_or_none():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job not found")

    candidate = Candidate(**candidate_data.model_dump())
    db.add(candidate)
    await db.flush()
    await db.refresh(candidate)
    return candidate


@router.get("/{candidate_id}", response_model=CandidateResponse)
async def get_candidate(
    candidate_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Candidate).join(Job).where(Candidate.id == candidate_id, Job.org_id == current_user.org_id)
    )
    candidate = result.scalar_one_or_none()
    if not candidate:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Candidate not found")
    return candidate


@router.put("/{candidate_id}", response_model=CandidateResponse)
async def update_candidate(
    candidate_id: int,
    candidate_data: CandidateUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Candidate).join(Job).where(Candidate.id == candidate_id, Job.org_id == current_user.org_id)
    )
    candidate = result.scalar_one_or_none()
    if not candidate:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Candidate not found")
    for key, value in candidate_data.model_dump(exclude_unset=True).items():
        setattr(candidate, key, value)
    await db.flush()
    await db.refresh(candidate)
    return candidate


@router.delete("/{candidate_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_candidate(
    candidate_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Candidate).join(Job).where(Candidate.id == candidate_id, Job.org_id == current_user.org_id)
    )
    candidate = result.scalar_one_or_none()
    if not candidate:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Candidate not found")
    await db.delete(candidate)


@router.post("/screen-resume", response_model=ScreenResumeResponse)
async def screen_resume_endpoint(
    job_id: int = Form(...),
    candidate_id: Optional[int] = Form(None),
    resume: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    job_result = await db.execute(select(Job).where(Job.id == job_id, Job.org_id == current_user.org_id))
    job = job_result.scalar_one_or_none()
    if not job:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job not found")

    content = await resume.read()
    content_type = resume.content_type or "application/pdf"
    resume_text = await extract_resume_text(content, content_type)

    if not resume_text:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Could not extract text from resume")

    job_data = {
        "title": job.title,
        "skills_required": job.skills_required or [],
        "experience_level": job.experience_level.value if job.experience_level else "",
        "requirements": job.requirements or "",
        "description": job.description or "",
    }

    analysis = await screen_resume(resume_text, job_data)

    if candidate_id:
        cand_result = await db.execute(select(Candidate).where(Candidate.id == candidate_id))
        candidate = cand_result.scalar_one_or_none()
        if candidate:
            candidate.resume_text = resume_text
            candidate.ai_score = analysis.get("ai_score", {})
            candidate.pros = analysis.get("pros", [])
            candidate.cons = analysis.get("cons", [])
            candidate.red_flags = analysis.get("red_flags", [])
            candidate.skills = analysis.get("skills", [])
            candidate.screened_at = datetime.now(timezone.utc)
            await db.flush()

    return ScreenResumeResponse(
        candidate_id=candidate_id or 0,
        ai_score=analysis.get("ai_score", {}),
        pros=analysis.get("pros", []),
        cons=analysis.get("cons", []),
        red_flags=analysis.get("red_flags", []),
        skills=analysis.get("skills", []),
        summary=analysis.get("summary", ""),
        recommendation=analysis.get("recommendation", "maybe"),
    )
