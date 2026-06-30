from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
import logging

from app.database import get_db
from app.models.employee import Employee, EmployeeStatus
from app.models.user import User
from app.schemas.employee import EmployeeCreate, EmployeeUpdate, EmployeeResponse
from app.dependencies import get_current_user

router = APIRouter()
logger = logging.getLogger(__name__)


@router.get("/", response_model=List[EmployeeResponse])
async def list_employees(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    department: Optional[str] = None,
    status: Optional[EmployeeStatus] = None,
    search: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    query = select(Employee).where(Employee.org_id == current_user.org_id)
    if department:
        query = query.where(Employee.department == department)
    if status:
        query = query.where(Employee.status == status)
    query = query.offset(skip).limit(limit).order_by(Employee.created_at.desc())
    result = await db.execute(query)
    return result.scalars().all()


@router.post("/", response_model=EmployeeResponse, status_code=status.HTTP_201_CREATED)
async def create_employee(
    employee_data: EmployeeCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    existing = await db.execute(select(Employee).where(Employee.employee_number == employee_data.employee_number))
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Employee number already exists")

    employee = Employee(
        **employee_data.model_dump(),
        status=EmployeeStatus.PROBATION,
    )
    db.add(employee)
    await db.flush()
    await db.refresh(employee)
    return employee


@router.get("/{employee_id}", response_model=EmployeeResponse)
async def get_employee(
    employee_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Employee).where(Employee.id == employee_id, Employee.org_id == current_user.org_id)
    )
    employee = result.scalar_one_or_none()
    if not employee:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Employee not found")
    return employee


@router.put("/{employee_id}", response_model=EmployeeResponse)
async def update_employee(
    employee_id: int,
    employee_data: EmployeeUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Employee).where(Employee.id == employee_id, Employee.org_id == current_user.org_id)
    )
    employee = result.scalar_one_or_none()
    if not employee:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Employee not found")
    for key, value in employee_data.model_dump(exclude_unset=True).items():
        setattr(employee, key, value)
    await db.flush()
    await db.refresh(employee)
    return employee


@router.delete("/{employee_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_employee(
    employee_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Employee).where(Employee.id == employee_id, Employee.org_id == current_user.org_id)
    )
    employee = result.scalar_one_or_none()
    if not employee:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Employee not found")
    await db.delete(employee)


@router.get("/{employee_id}/reports", response_model=List[EmployeeResponse])
async def get_direct_reports(
    employee_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Employee).where(Employee.manager_id == employee_id, Employee.org_id == current_user.org_id)
    )
    return result.scalars().all()
