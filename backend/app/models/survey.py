from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, JSON, Text
from sqlalchemy.orm import relationship
from app.database import Base


class Survey(Base):
    __tablename__ = "surveys"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    survey_type = Column(String(50), default="engagement", nullable=False)
    questions = Column(JSON, default=list, nullable=False)
    responses = Column(JSON, default=list, nullable=False)
    ai_analysis = Column(JSON, default=dict, nullable=False)
    is_anonymous = Column(Integer, default=1, nullable=False)
    status = Column(String(50), default="draft", nullable=False)
    target_audience = Column(JSON, default=dict, nullable=False)
    org_id = Column(Integer, ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False)
    created_by = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    starts_at = Column(DateTime(timezone=True), nullable=True)
    ends_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)

    organization = relationship("Organization", back_populates="surveys")
    creator = relationship("User", foreign_keys=[created_by])
