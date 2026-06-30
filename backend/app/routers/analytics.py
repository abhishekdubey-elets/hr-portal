from typing import Dict, Any, List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, case
from datetime import datetime, timezone, timedelta
import logging

from app.database import get_db
from app.models.job import Job, JobStatus
from app.models.candidate import Candidate, CandidateStage
from app.models.employee import Employee, EmployeeStatus
from app.models.interview import Interview
from app.models.performance import PerformanceReview
from app.models.user import User
from app.dependencies import get_current_user

router = APIRouter()
logger = logging.getLogger(__name__)


@router.get("/dashboard")
async def get_analytics_dashboard(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> Dict[str, Any]:
    org_id = current_user.org_id

    total_employees = await db.scalar(
        select(func.count(Employee.id)).where(Employee.org_id == org_id, Employee.status == EmployeeStatus.ACTIVE)
    ) or 0

    open_jobs = await db.scalar(
        select(func.count(Job.id)).where(Job.org_id == org_id, Job.status == JobStatus.OPEN)
    ) or 0

    total_candidates = await db.scalar(
        select(func.count(Candidate.id)).join(Job).where(Job.org_id == org_id)
    ) or 0

    hired_this_month = await db.scalar(
        select(func.count(Candidate.id)).join(Job).where(
            Job.org_id == org_id,
            Candidate.stage == CandidateStage.HIRED,
            Candidate.updated_at >= datetime.now(timezone.utc).replace(day=1),
        )
    ) or 0

    return {
        "total_employees": total_employees,
        "open_jobs": open_jobs,
        "total_candidates": total_candidates,
        "hired_this_month": hired_this_month,
        "generated_at": datetime.now(timezone.utc).isoformat(),
    }


@router.get("/hiring-funnel")
async def get_hiring_funnel(
    job_id: Optional[int] = None,
    days: int = Query(30, ge=1, le=365),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> Dict[str, Any]:
    since = datetime.now(timezone.utc) - timedelta(days=days)
    query = select(Candidate.stage, func.count(Candidate.id)).join(Job).where(
        Job.org_id == current_user.org_id,
        Candidate.created_at >= since,
    )
    if job_id:
        query = query.where(Candidate.job_id == job_id)
    query = query.group_by(Candidate.stage)
    result = await db.execute(query)
    rows = result.all()

    funnel = {stage.value: 0 for stage in CandidateStage}
    for stage, count in rows:
        funnel[stage.value] = count

    total = sum(funnel.values())
    conversion = {}
    stages_order = ["applied", "screening", "interview", "offer", "hired"]
    for i, stage in enumerate(stages_order[1:], 1):
        prev = funnel.get(stages_order[i-1], 0)
        curr = funnel.get(stage, 0)
        conversion[f"{stages_order[i-1]}_to_{stage}"] = round((curr / prev * 100) if prev > 0 else 0, 1)

    return {
        "period_days": days,
        "funnel": funnel,
        "total_candidates": total,
        "conversion_rates": conversion,
    }


@router.get("/time-to-hire")
async def get_time_to_hire(
    department: Optional[str] = None,
    days: int = Query(90, ge=1, le=365),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> Dict[str, Any]:
    since = datetime.now(timezone.utc) - timedelta(days=days)
    query = select(Candidate).join(Job).where(
        Job.org_id == current_user.org_id,
        Candidate.stage == CandidateStage.HIRED,
        Candidate.created_at >= since,
        Candidate.screened_at.isnot(None),
    )
    if department:
        query = query.where(Job.department == department)

    result = await db.execute(query)
    hired = result.scalars().all()

    if not hired:
        return {"avg_days": 0, "median_days": 0, "total_hires": 0, "period_days": days}

    time_to_hire_days = []
    for c in hired:
        if c.created_at and c.screened_at:
            delta = (c.screened_at - c.created_at).days
            time_to_hire_days.append(delta)

    if not time_to_hire_days:
        return {"avg_days": 0, "median_days": 0, "total_hires": len(hired), "period_days": days}

    sorted_days = sorted(time_to_hire_days)
    avg = sum(sorted_days) / len(sorted_days)
    mid = len(sorted_days) // 2
    median = sorted_days[mid] if len(sorted_days) % 2 != 0 else (sorted_days[mid-1] + sorted_days[mid]) / 2

    return {
        "avg_days": round(avg, 1),
        "median_days": round(median, 1),
        "min_days": min(sorted_days),
        "max_days": max(sorted_days),
        "total_hires": len(hired),
        "period_days": days,
    }


@router.get("/headcount")
async def get_headcount_trends(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> Dict[str, Any]:
    dept_result = await db.execute(
        select(Employee.department, func.count(Employee.id)).where(
            Employee.org_id == current_user.org_id,
            Employee.status == EmployeeStatus.ACTIVE,
        ).group_by(Employee.department)
    )
    by_department = {dept or "Unassigned": count for dept, count in dept_result.all()}

    status_result = await db.execute(
        select(Employee.status, func.count(Employee.id)).where(
            Employee.org_id == current_user.org_id
        ).group_by(Employee.status)
    )
    by_status = {status.value: count for status, count in status_result.all()}

    return {
        "by_department": by_department,
        "by_status": by_status,
        "total": sum(by_status.values()),
    }
