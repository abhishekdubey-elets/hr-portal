from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, DateTime, JSON
from sqlalchemy.orm import relationship
from app.database import Base


class Organization(Base):
    __tablename__ = "organizations"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    slug = Column(String(100), unique=True, index=True, nullable=False)
    plan = Column(String(50), default="starter", nullable=False)
    industry = Column(String(100), nullable=True)
    size = Column(String(50), nullable=True)
    logo_url = Column(String(500), nullable=True)
    website = Column(String(255), nullable=True)
    settings = Column(JSON, default=dict, nullable=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)

    users = relationship("User", back_populates="organization")
    jobs = relationship("Job", back_populates="organization")
    employees = relationship("Employee", back_populates="organization")
    surveys = relationship("Survey", back_populates="organization")
    workflows = relationship("Workflow", back_populates="organization")
