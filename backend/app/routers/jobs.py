from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
import logging

from app.database import get_db
from app.models.job import Job, JobStatus
from app.models.user import User
from app.schemas.job import (
    JobCreate,
    JobUpdate,
    JobResponse,
    GenerateJDRequest,
    GenerateJDResponse,
    GenerateJDPreviewRequest,
    GenerateJDPreviewResponse,
)
from app.dependencies import get_current_user
from app.services.jd_generator import generate_job_descriptions

router = APIRouter()
logger = logging.getLogger(__name__)


@router.post("/generate-jd-preview", response_model=GenerateJDPreviewResponse)
async def generate_jd_preview(request: GenerateJDPreviewRequest):
    job_data = {
        "title": request.title,
        "department": request.department,
        "employment_type": "Full-time",
        "experience_level": request.level or "Mid",
        "location": request.location,
        "is_remote": bool(request.location and request.location.lower() == "remote"),
        "salary_min": float(request.salary_min) if request.salary_min is not None else None,
        "salary_max": float(request.salary_max) if request.salary_max is not None else None,
        "currency": "USD",
        "description": "",
        "requirements": request.requirements,
        "benefits": "",
        "skills_required": [],
    }

    additional_context = f"Preferred tone: {request.tone or 'professional'}."
    versions = await generate_job_descriptions(job_data, additional_context)
    return GenerateJDPreviewResponse(versions=versions)


@router.get("/", response_model=List[JobResponse])
async def list_jobs(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    status: Optional[JobStatus] = None,
    department: Optional[str] = None,
    search: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    query = select(Job).where(Job.org_id == current_user.org_id)
    if status:
        query = query.where(Job.status == status)
    if department:
        query = query.where(Job.department == department)
    if search:
        query = query.where(Job.title.ilike(f"%{search}%"))
    query = query.offset(skip).limit(limit).order_by(Job.created_at.desc())
    result = await db.execute(query)
    return result.scalars().all()


@router.post("/", response_model=JobResponse, status_code=status.HTTP_201_CREATED)
async def create_job(
    job_data: JobCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    job = Job(
        **job_data.model_dump(exclude={"org_id"}),
        org_id=current_user.org_id or job_data.org_id,
        created_by=current_user.id,
    )
    db.add(job)
    await db.flush()
    await db.refresh(job)
    return job


@router.get("/{job_id}", response_model=JobResponse)
async def get_job(
    job_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(Job).where(Job.id == job_id, Job.org_id == current_user.org_id))
    job = result.scalar_one_or_none()
    if not job:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job not found")
    return job


@router.put("/{job_id}", response_model=JobResponse)
async def update_job(
    job_id: int,
    job_data: JobUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(Job).where(Job.id == job_id, Job.org_id == current_user.org_id))
    job = result.scalar_one_or_none()
    if not job:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job not found")
    for key, value in job_data.model_dump(exclude_unset=True).items():
        setattr(job, key, value)
    await db.flush()
    await db.refresh(job)
    return job


@router.delete("/{job_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_job(
    job_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(Job).where(Job.id == job_id, Job.org_id == current_user.org_id))
    job = result.scalar_one_or_none()
    if not job:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job not found")
    await db.delete(job)


@router.post("/{job_id}/generate-jd", response_model=GenerateJDResponse)
async def generate_jd(
    job_id: int,
    request: GenerateJDRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(Job).where(Job.id == job_id, Job.org_id == current_user.org_id))
    job = result.scalar_one_or_none()
    if not job:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job not found")

    job_data = {
        "title": job.title,
        "department": job.department,
        "employment_type": job.employment_type.value if job.employment_type else "",
        "experience_level": job.experience_level.value if job.experience_level else "",
        "location": job.location,
        "is_remote": job.is_remote,
        "salary_min": float(job.salary_min) if job.salary_min else None,
        "salary_max": float(job.salary_max) if job.salary_max else None,
        "currency": job.currency,
        "description": job.description,
        "requirements": job.requirements,
        "benefits": job.benefits,
        "skills_required": job.skills_required or [],
    }

    versions = await generate_job_descriptions(job_data, request.additional_context)
    job.jd_versions = versions
    await db.flush()

    return GenerateJDResponse(job_id=job_id, versions=versions)
