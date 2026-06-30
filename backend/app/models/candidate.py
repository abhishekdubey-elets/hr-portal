import enum
from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Enum as SAEnum, JSON, Text, Numeric
from sqlalchemy.orm import relationship
from app.database import Base


class CandidateStage(str, enum.Enum):
    APPLIED = "applied"
    SCREENING = "screening"
    INTERVIEW = "interview"
    OFFER = "offer"
    HIRED = "hired"
    REJECTED = "rejected"
    WITHDRAWN = "withdrawn"


class Candidate(Base):
    __tablename__ = "candidates"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), nullable=False, index=True)
    phone = Column(String(50), nullable=True)
    resume_url = Column(String(1000), nullable=True)
    resume_text = Column(Text, nullable=True)
    linkedin_url = Column(String(500), nullable=True)
    portfolio_url = Column(String(500), nullable=True)
    current_company = Column(String(255), nullable=True)
    current_title = Column(String(255), nullable=True)
    years_experience = Column(Numeric(4, 1), nullable=True)
    location = Column(String(255), nullable=True)
    job_id = Column(Integer, ForeignKey("jobs.id", ondelete="CASCADE"), nullable=False)
    stage = Column(SAEnum(CandidateStage), default=CandidateStage.APPLIED, nullable=False)
    ai_score = Column(JSON, default=dict, nullable=False)
    pros = Column(JSON, default=list, nullable=False)
    cons = Column(JSON, default=list, nullable=False)
    red_flags = Column(JSON, default=list, nullable=False)
    skills = Column(JSON, default=list, nullable=False)
    notes = Column(Text, nullable=True)
    source = Column(String(100), nullable=True)
    screened_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)

    job = relationship("Job", back_populates="candidates")
    interviews = relationship("Interview", back_populates="candidate")
