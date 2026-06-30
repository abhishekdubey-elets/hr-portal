from typing import Dict, Any, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel
import logging

from app.database import get_db
from app.models.organization import Organization
from app.models.user import User
from app.dependencies import get_current_user

router = APIRouter()
logger = logging.getLogger(__name__)


class OrgSettingsUpdate(BaseModel):
    name: Optional[str] = None
    industry: Optional[str] = None
    size: Optional[str] = None
    website: Optional[str] = None
    logo_url: Optional[str] = None
    settings: Optional[Dict[str, Any]] = None


@router.get("/organization")
async def get_org_settings(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> Dict[str, Any]:
    if not current_user.org_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No organization found")
    result = await db.execute(select(Organization).where(Organization.id == current_user.org_id))
    org = result.scalar_one_or_none()
    if not org:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Organization not found")
    return {
        "id": org.id,
        "name": org.name,
        "slug": org.slug,
        "plan": org.plan,
        "industry": org.industry,
        "size": org.size,
        "website": org.website,
        "logo_url": org.logo_url,
        "settings": org.settings,
        "created_at": org.created_at.isoformat(),
    }


@router.put("/organization")
async def update_org_settings(
    update_data: OrgSettingsUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> Dict[str, Any]:
    if not current_user.org_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No organization found")
    result = await db.execute(select(Organization).where(Organization.id == current_user.org_id))
    org = result.scalar_one_or_none()
    if not org:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Organization not found")
    for key, value in update_data.model_dump(exclude_unset=True).items():
        setattr(org, key, value)
    await db.flush()
    return {"message": "Organization settings updated", "org_id": org.id}


@router.get("/profile")
async def get_user_profile(current_user: User = Depends(get_current_user)) -> Dict[str, Any]:
    return {
        "id": current_user.id,
        "email": current_user.email,
        "full_name": current_user.full_name,
        "role": current_user.role.value,
        "org_id": current_user.org_id,
        "is_active": current_user.is_active,
        "avatar_url": current_user.avatar_url,
        "last_login": current_user.last_login.isoformat() if current_user.last_login else None,
    }


@router.get("/integrations")
async def get_integrations(current_user: User = Depends(get_current_user)) -> Dict[str, Any]:
    return {
        "available": [
            {"id": "slack", "name": "Slack", "status": "available", "description": "Get HR notifications in Slack"},
            {"id": "google_calendar", "name": "Google Calendar", "status": "available", "description": "Sync interviews to Google Calendar"},
            {"id": "greenhouse", "name": "Greenhouse ATS", "status": "coming_soon"},
            {"id": "workday", "name": "Workday", "status": "coming_soon"},
            {"id": "bamboohr", "name": "BambooHR", "status": "coming_soon"},
        ],
        "connected": [],
    }
