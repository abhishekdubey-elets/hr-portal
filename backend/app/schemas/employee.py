from typing import Optional, List, Dict, Any
from datetime import datetime, date
from decimal import Decimal
from pydantic import BaseModel
from app.models.employee import EmployeeStatus


class EmployeeBase(BaseModel):
    employee_number: str
    department: Optional[str] = None
    designation: Optional[str] = None
    manager_id: Optional[int] = None
    hire_date: Optional[date] = None
    skills: List[str] = []
    salary: Optional[Decimal] = None
    currency: str = "USD"
    work_location: Optional[str] = None
    work_type: str = "office"


class EmployeeCreate(EmployeeBase):
    user_id: int
    org_id: int


class EmployeeUpdate(BaseModel):
    department: Optional[str] = None
    designation: Optional[str] = None
    manager_id: Optional[int] = None
    skills: Optional[List[str]] = None
    salary: Optional[Decimal] = None
    status: Optional[EmployeeStatus] = None
    work_location: Optional[str] = None
    work_type: Optional[str] = None


class EmployeeResponse(EmployeeBase):
    id: int
    user_id: int
    org_id: int
    status: EmployeeStatus
    probation_end_date: Optional[date]
    created_at: datetime

    model_config = {"from_attributes": True}
