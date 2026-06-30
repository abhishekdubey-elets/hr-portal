from typing import List, Optional, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel
import logging

from app.database import get_db
from app.models.onboarding import OnboardingPlan
from app.models.employee import Employee
from app.models.user import User
from app.models.organization import Organization
from app.dependencies import get_current_user
from app.services.onboarding_service import generate_onboarding_plan

router = APIRouter()
logger = logging.getLogger(__name__)


class OnboardingPlanResponse(BaseModel):
    id: int
    employee_id: int
    plan: Dict[str, Any]
    progress: Dict[str, Any]
    is_completed: bool
    model_config = {"from_attributes": True}


class GeneratePlanRequest(BaseModel):
    employee_id: int
    additional_context: Optional[str] = None


@router.post("/generate-plan", response_model=OnboardingPlanResponse)
async def generate_plan(
    request: GeneratePlanRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    emp_result = await db.execute(
        select(Employee).where(Employee.id == request.employee_id, Employee.org_id == current_user.org_id)
    )
    employee = emp_result.scalar_one_or_none()
    if not employee:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Employee not found")

    user_result = await db.execute(select(User).where(User.id == employee.user_id))
    user = user_result.scalar_one_or_none()

    org_result = await db.execute(select(Organization).where(Organization.id == current_user.org_id))
    org = org_result.scalar_one_or_none()

    employee_data = {
        "name": user.full_name if user else "Employee",
        "designation": employee.designation or "",
        "department": employee.department or "",
        "skills": employee.skills or [],
        "work_type": employee.work_type or "office",
        "manager_name": None,
    }

    if employee.manager_id:
        mgr_result = await db.execute(select(Employee).where(Employee.id == employee.manager_id))
        mgr = mgr_result.scalar_one_or_none()
        if mgr:
            mgr_user_result = await db.execute(select(User).where(User.id == mgr.user_id))
            mgr_user = mgr_user_result.scalar_one_or_none()
            if mgr_user:
                employee_data["manager_name"] = mgr_user.full_name

    org_data = {"name": org.name if org else "", "industry": org.industry if org else ""}

    plan = await generate_onboarding_plan(employee_data, org_data)

    onboarding = OnboardingPlan(
        employee_id=request.employee_id,
        plan=plan,
        progress={"day_30": 0, "day_60": 0, "day_90": 0},
    )
    db.add(onboarding)
    await db.flush()
    await db.refresh(onboarding)
    return onboarding


@router.get("/{employee_id}", response_model=List[OnboardingPlanResponse])
async def get_employee_onboarding(
    employee_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(OnboardingPlan).where(OnboardingPlan.employee_id == employee_id)
    )
    return result.scalars().all()


@router.put("/{plan_id}/progress")
async def update_progress(
    plan_id: int,
    progress: Dict[str, Any],
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(OnboardingPlan).where(OnboardingPlan.id == plan_id))
    plan = result.scalar_one_or_none()
    if not plan:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Onboarding plan not found")
    plan.progress = progress
    await db.flush()
    return {"message": "Progress updated", "progress": progress}
