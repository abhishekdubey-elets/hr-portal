import enum
from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Enum as SAEnum, JSON, Text
from sqlalchemy.orm import relationship
from app.database import Base


class InterviewType(str, enum.Enum):
    TECHNICAL = "technical"
    BEHAVIORAL = "behavioral"
    CULTURE = "culture"
    SYSTEM_DESIGN = "system_design"
    CASE_STUDY = "case_study"
    HR_SCREENING = "hr_screening"
    FINAL = "final"


class InterviewStatus(str, enum.Enum):
    SCHEDULED = "scheduled"
    COMPLETED = "completed"
    CANCELLED = "cancelled"
    NO_SHOW = "no_show"
    RESCHEDULED = "rescheduled"


class Interview(Base):
    __tablename__ = "interviews"

    id = Column(Integer, primary_key=True, index=True)
    candidate_id = Column(Integer, ForeignKey("candidates.id", ondelete="CASCADE"), nullable=False)
    job_id = Column(Integer, ForeignKey("jobs.id", ondelete="CASCADE"), nullable=False)
    interviewer_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    scheduled_at = Column(DateTime(timezone=True), nullable=True)
    duration_minutes = Column(Integer, default=60, nullable=False)
    type = Column(SAEnum(InterviewType), default=InterviewType.TECHNICAL, nullable=False)
    status = Column(SAEnum(InterviewStatus), default=InterviewStatus.SCHEDULED, nullable=False)
    meeting_link = Column(String(500), nullable=True)
    question_kit = Column(JSON, default=dict, nullable=False)
    scorecard = Column(JSON, default=dict, nullable=False)
    notes = Column(Text, nullable=True)
    recording_url = Column(String(1000), nullable=True)
    overall_rating = Column(Integer, nullable=True)
    recommendation = Column(String(50), nullable=True)
    completed_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)

    candidate = relationship("Candidate", back_populates="interviews")
    job = relationship("Job", back_populates="interviews")
    interviewer = relationship("User", foreign_keys=[interviewer_id])
