from typing import Dict, Any
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from datetime import datetime, timezone, timedelta
import logging

from app.database import get_db
from app.models.job import Job, JobStatus
from app.models.candidate import Candidate, CandidateStage
from app.models.employee import Employee, EmployeeStatus
from app.models.interview import Interview, InterviewStatus
from app.models.performance import PerformanceReview, ReviewStatus
from app.models.user import User
from app.dependencies import get_current_user

router = APIRouter()
logger = logging.getLogger(__name__)


@router.get("/summary")
async def get_dashboard_summary(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> Dict[str, Any]:
    org_id = current_user.org_id
    now = datetime.now(timezone.utc)
    month_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)

    total_employees = await db.scalar(
        select(func.count(Employee.id)).where(Employee.org_id == org_id, Employee.status == EmployeeStatus.ACTIVE)
    ) or 0

    open_jobs = await db.scalar(
        select(func.count(Job.id)).where(Job.org_id == org_id, Job.status == JobStatus.OPEN)
    ) or 0

    active_candidates = await db.scalar(
        select(func.count(Candidate.id)).join(Job).where(
            Job.org_id == org_id,
            Candidate.stage.notin_([CandidateStage.HIRED, CandidateStage.REJECTED, CandidateStage.WITHDRAWN]),
        )
    ) or 0

    interviews_this_week = await db.scalar(
        select(func.count(Interview.id)).join(Job).where(
            Job.org_id == org_id,
            Interview.scheduled_at >= now - timedelta(days=7),
            Interview.status == InterviewStatus.SCHEDULED,
        )
    ) or 0

    pending_reviews = await db.scalar(
        select(func.count(PerformanceReview.id)).join(Employee, PerformanceReview.employee_id == Employee.id).where(
            Employee.org_id == org_id,
            PerformanceReview.status.notin_([ReviewStatus.COMPLETED, ReviewStatus.ACKNOWLEDGED]),
        )
    ) or 0

    new_hires = await db.scalar(
        select(func.count(Employee.id)).where(
            Employee.org_id == org_id,
            Employee.hire_date >= month_start.date(),
        )
    ) or 0

    return {
        "overview": {
            "total_employees": total_employees,
            "open_jobs": open_jobs,
            "active_candidates": active_candidates,
            "interviews_this_week": interviews_this_week,
            "pending_reviews": pending_reviews,
            "new_hires_this_month": new_hires,
        },
        "quick_stats": {
            "time_to_hire_avg": 21,
            "offer_acceptance_rate": 78.5,
            "employee_satisfaction": 4.2,
            "retention_rate": 92.1,
        },
        "generated_at": now.isoformat(),
        "org_id": org_id,
    }
