from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel
from typing import Dict, Any
import logging

from app.database import get_db
from app.models.performance import PerformanceReview, ReviewStatus
from app.models.employee import Employee
from app.models.user import User
from app.schemas.performance import PerformanceReviewCreate, PerformanceReviewUpdate, PerformanceReviewResponse
from app.dependencies import get_current_user
from app.services.performance_service import generate_performance_summary

router = APIRouter()
logger = logging.getLogger(__name__)


@router.get("/", response_model=List[PerformanceReviewResponse])
async def list_reviews(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    employee_id: Optional[int] = None,
    status: Optional[ReviewStatus] = None,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    query = select(PerformanceReview).join(Employee, PerformanceReview.employee_id == Employee.id).where(
        Employee.org_id == current_user.org_id
    )
    if employee_id:
        query = query.where(PerformanceReview.employee_id == employee_id)
    if status:
        query = query.where(PerformanceReview.status == status)
    query = query.offset(skip).limit(limit).order_by(PerformanceReview.created_at.desc())
    result = await db.execute(query)
    return result.scalars().all()


@router.post("/", response_model=PerformanceReviewResponse, status_code=status.HTTP_201_CREATED)
async def create_review(
    review_data: PerformanceReviewCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    review = PerformanceReview(**review_data.model_dump())
    db.add(review)
    await db.flush()
    await db.refresh(review)
    return review


@router.get("/{review_id}", response_model=PerformanceReviewResponse)
async def get_review(
    review_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(PerformanceReview).join(Employee, PerformanceReview.employee_id == Employee.id).where(
            PerformanceReview.id == review_id, Employee.org_id == current_user.org_id
        )
    )
    review = result.scalar_one_or_none()
    if not review:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Review not found")
    return review


@router.put("/{review_id}", response_model=PerformanceReviewResponse)
async def update_review(
    review_id: int,
    review_data: PerformanceReviewUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(PerformanceReview).join(Employee, PerformanceReview.employee_id == Employee.id).where(
            PerformanceReview.id == review_id, Employee.org_id == current_user.org_id
        )
    )
    review = result.scalar_one_or_none()
    if not review:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Review not found")
    for key, value in review_data.model_dump(exclude_unset=True).items():
        setattr(review, key, value)
    await db.flush()
    await db.refresh(review)
    return review


@router.post("/generate-review")
async def generate_ai_review(
    employee_id: int,
    review_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    emp_result = await db.execute(
        select(Employee).where(Employee.id == employee_id, Employee.org_id == current_user.org_id)
    )
    employee = emp_result.scalar_one_or_none()
    if not employee:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Employee not found")

    review_result = await db.execute(select(PerformanceReview).where(PerformanceReview.id == review_id))
    review = review_result.scalar_one_or_none()
    if not review:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Review not found")

    user_result = await db.execute(select(User).where(User.id == employee.user_id))
    user = user_result.scalar_one_or_none()

    employee_data = {
        "name": user.full_name if user else "Employee",
        "designation": employee.designation or "",
        "department": employee.department or "",
    }

    review_data = {
        "period": review.period,
        "self_review": review.self_review,
        "manager_review": review.manager_review,
        "peer_reviews": review.peer_reviews,
        "goals": review.goals,
    }

    ai_summary = await generate_performance_summary(employee_data, review_data)
    review.ai_summary = ai_summary
    review.status = ReviewStatus.COMPLETED
    await db.flush()

    return {"review_id": review_id, "ai_summary": ai_summary}
