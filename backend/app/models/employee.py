import enum
from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Enum as SAEnum, JSON, Date, Numeric
from sqlalchemy.orm import relationship
from app.database import Base


class EmployeeStatus(str, enum.Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"
    ON_LEAVE = "on_leave"
    TERMINATED = "terminated"
    PROBATION = "probation"


class Employee(Base):
    __tablename__ = "employees"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, unique=True)
    employee_number = Column(String(50), unique=True, nullable=False)
    department = Column(String(100), nullable=True)
    designation = Column(String(255), nullable=True)
    manager_id = Column(Integer, ForeignKey("employees.id", ondelete="SET NULL"), nullable=True)
    hire_date = Column(Date, nullable=True)
    probation_end_date = Column(Date, nullable=True)
    skills = Column(JSON, default=list, nullable=False)
    salary = Column(Numeric(12, 2), nullable=True)
    currency = Column(String(10), default="USD", nullable=False)
    status = Column(SAEnum(EmployeeStatus), default=EmployeeStatus.PROBATION, nullable=False)
    work_location = Column(String(255), nullable=True)
    work_type = Column(String(50), default="office", nullable=False)
    org_id = Column(Integer, ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False)
    metadata_ = Column("metadata", JSON, default=dict, nullable=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)

    user = relationship("User", back_populates="employee")
    organization = relationship("Organization", back_populates="employees")
    manager = relationship("Employee", remote_side=[id], foreign_keys=[manager_id])
    reports = relationship("Employee", foreign_keys=[manager_id])
    onboarding_plans = relationship("OnboardingPlan", back_populates="employee")
    performance_reviews = relationship("PerformanceReview", back_populates="employee", foreign_keys="PerformanceReview.employee_id")
