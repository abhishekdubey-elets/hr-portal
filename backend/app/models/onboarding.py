from datetime import datetime, timezone
from sqlalchemy import Column, Integer, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.database import Base


class OnboardingPlan(Base):
    __tablename__ = "onboarding_plans"

    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("employees.id", ondelete="CASCADE"), nullable=False)
    plan = Column(JSON, default=dict, nullable=False)
    progress = Column(JSON, default=dict, nullable=False)
    is_completed = Column(Integer, default=0, nullable=False)
    completed_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)

    employee = relationship("Employee", back_populates="onboarding_plans")
