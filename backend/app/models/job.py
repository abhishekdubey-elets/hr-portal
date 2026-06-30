import enum
from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Enum as SAEnum, Numeric, JSON, Text
from sqlalchemy.orm import relationship
from app.database import Base


class JobStatus(str, enum.Enum):
    DRAFT = "draft"
    OPEN = "open"
    PAUSED = "paused"
    CLOSED = "closed"


class EmploymentType(str, enum.Enum):
    FULL_TIME = "full_time"
    PART_TIME = "part_time"
    CONTRACT = "contract"
    INTERNSHIP = "internship"
    FREELANCE = "freelance"


class ExperienceLevel(str, enum.Enum):
    ENTRY = "entry"
    MID = "mid"
    SENIOR = "senior"
    LEAD = "lead"
    EXECUTIVE = "executive"


class Job(Base):
    __tablename__ = "jobs"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    department = Column(String(100), nullable=True)
    employment_type = Column(SAEnum(EmploymentType), default=EmploymentType.FULL_TIME, nullable=False)
    experience_level = Column(SAEnum(ExperienceLevel), default=ExperienceLevel.MID, nullable=False)
    location = Column(String(255), nullable=True)
    is_remote = Column(Integer, default=0, nullable=False)
    salary_min = Column(Numeric(12, 2), nullable=True)
    salary_max = Column(Numeric(12, 2), nullable=True)
    currency = Column(String(10), default="USD", nullable=False)
    status = Column(SAEnum(JobStatus), default=JobStatus.DRAFT, nullable=False)
    description = Column(Text, nullable=True)
    requirements = Column(Text, nullable=True)
    benefits = Column(Text, nullable=True)
    jd_versions = Column(JSON, default=dict, nullable=False)
    skills_required = Column(JSON, default=list, nullable=False)
    org_id = Column(Integer, ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False)
    created_by = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)
    closed_at = Column(DateTime(timezone=True), nullable=True)

    organization = relationship("Organization", back_populates="jobs")
    creator = relationship("User", foreign_keys=[created_by])
    candidates = relationship("Candidate", back_populates="job")
    interviews = relationship("Interview", back_populates="job")
