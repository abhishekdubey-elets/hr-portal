import enum
from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Enum as SAEnum, JSON, Text
from sqlalchemy.orm import relationship
from app.database import Base


class WorkflowStatus(str, enum.Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"
    DRAFT = "draft"
    ARCHIVED = "archived"


class Workflow(Base):
    __tablename__ = "workflows"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    trigger_type = Column(String(100), nullable=True)
    trigger_config = Column(JSON, default=dict, nullable=False)
    definition = Column(JSON, default=dict, nullable=False)
    status = Column(SAEnum(WorkflowStatus), default=WorkflowStatus.DRAFT, nullable=False)
    runs_count = Column(Integer, default=0, nullable=False)
    success_count = Column(Integer, default=0, nullable=False)
    failure_count = Column(Integer, default=0, nullable=False)
    last_run = Column(DateTime(timezone=True), nullable=True)
    last_run_status = Column(String(50), nullable=True)
    org_id = Column(Integer, ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False)
    created_by = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)

    organization = relationship("Organization", back_populates="workflows")
    creator = relationship("User", foreign_keys=[created_by])
