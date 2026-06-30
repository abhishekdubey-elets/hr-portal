import enum
from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Enum as SAEnum, JSON
from sqlalchemy.orm import relationship
from app.database import Base


class ReviewStatus(str, enum.Enum):
    DRAFT = "draft"
    SELF_REVIEW = "self_review"
    PEER_REVIEW = "peer_review"
    MANAGER_REVIEW = "manager_review"
    COMPLETED = "completed"
    ACKNOWLEDGED = "acknowledged"


class PerformanceReview(Base):
    __tablename__ = "performance_reviews"

    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("employees.id", ondelete="CASCADE"), nullable=False)
    reviewer_id = Column(Integer, ForeignKey("employees.id", ondelete="SET NULL"), nullable=True)
    period = Column(String(50), nullable=False)
    period_start = Column(DateTime(timezone=True), nullable=True)
    period_end = Column(DateTime(timezone=True), nullable=True)
    self_review = Column(JSON, default=dict, nullable=False)
    manager_review = Column(JSON, default=dict, nullable=False)
    peer_reviews = Column(JSON, default=list, nullable=False)
    ai_summary = Column(JSON, default=dict, nullable=False)
    goals = Column(JSON, default=list, nullable=False)
    overall_rating = Column(Integer, nullable=True)
    status = Column(SAEnum(ReviewStatus), default=ReviewStatus.DRAFT, nullable=False)
    due_date = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)

    employee = relationship("Employee", back_populates="performance_reviews", foreign_keys=[employee_id])
    reviewer = relationship("Employee", foreign_keys=[reviewer_id])
