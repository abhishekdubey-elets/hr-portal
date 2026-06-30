from fastapi import Depends, HTTPException, status
from typing import List
import logging

from app.models.user import User, UserRole
from app.dependencies import get_current_user

logger = logging.getLogger(__name__)


def require_roles(*roles: UserRole):
    async def role_checker(current_user: User = Depends(get_current_user)) -> User:
        if current_user.role not in roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Insufficient permissions. Required roles: {[r.value for r in roles]}",
            )
        return current_user
    return role_checker


def require_super_admin():
    return require_roles(UserRole.SUPER_ADMIN)


def require_hr_admin():
    return require_roles(UserRole.SUPER_ADMIN, UserRole.HR_ADMIN)


def require_recruiter():
    return require_roles(UserRole.SUPER_ADMIN, UserRole.HR_ADMIN, UserRole.RECRUITER)


def require_hiring_manager():
    return require_roles(
        UserRole.SUPER_ADMIN, UserRole.HR_ADMIN, UserRole.RECRUITER, UserRole.HIRING_MANAGER
    )


def require_manager():
    return require_roles(
        UserRole.SUPER_ADMIN, UserRole.HR_ADMIN, UserRole.DEPT_MANAGER, UserRole.HIRING_MANAGER
    )


def same_org_required(current_user: User, resource_org_id: int) -> bool:
    if current_user.role == UserRole.SUPER_ADMIN:
        return True
    return current_user.org_id == resource_org_id