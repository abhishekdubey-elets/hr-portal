from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from datetime import datetime, timezone
import logging

from app.database import get_db
from app.models.workflow import Workflow, WorkflowStatus
from app.models.user import User
from app.schemas.workflow import WorkflowCreate, WorkflowUpdate, WorkflowResponse, WorkflowRunResponse
from app.dependencies import get_current_user
from app.services.workflow_service import workflow_engine

router = APIRouter()
logger = logging.getLogger(__name__)


@router.get("/", response_model=List[WorkflowResponse])
async def list_workflows(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    status: Optional[WorkflowStatus] = None,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    query = select(Workflow).where(Workflow.org_id == current_user.org_id)
    if status:
        query = query.where(Workflow.status == status)
    query = query.offset(skip).limit(limit).order_by(Workflow.created_at.desc())
    result = await db.execute(query)
    return result.scalars().all()


@router.post("/", response_model=WorkflowResponse, status_code=status.HTTP_201_CREATED)
async def create_workflow(
    workflow_data: WorkflowCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    workflow = Workflow(
        **workflow_data.model_dump(),
        created_by=current_user.id,
    )
    db.add(workflow)
    await db.flush()
    await db.refresh(workflow)
    return workflow


@router.get("/{workflow_id}", response_model=WorkflowResponse)
async def get_workflow(
    workflow_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Workflow).where(Workflow.id == workflow_id, Workflow.org_id == current_user.org_id)
    )
    workflow = result.scalar_one_or_none()
    if not workflow:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Workflow not found")
    return workflow


@router.put("/{workflow_id}", response_model=WorkflowResponse)
async def update_workflow(
    workflow_id: int,
    workflow_data: WorkflowUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Workflow).where(Workflow.id == workflow_id, Workflow.org_id == current_user.org_id)
    )
    workflow = result.scalar_one_or_none()
    if not workflow:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Workflow not found")
    for key, value in workflow_data.model_dump(exclude_unset=True).items():
        setattr(workflow, key, value)
    await db.flush()
    await db.refresh(workflow)
    return workflow


@router.delete("/{workflow_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_workflow(
    workflow_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Workflow).where(Workflow.id == workflow_id, Workflow.org_id == current_user.org_id)
    )
    workflow = result.scalar_one_or_none()
    if not workflow:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Workflow not found")
    await db.delete(workflow)


@router.post("/{workflow_id}/run", response_model=WorkflowRunResponse)
async def run_workflow(
    workflow_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Workflow).where(Workflow.id == workflow_id, Workflow.org_id == current_user.org_id)
    )
    workflow = result.scalar_one_or_none()
    if not workflow:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Workflow not found")

    if workflow.status != WorkflowStatus.ACTIVE:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Workflow is not active")

    run_result = await workflow_engine.run_workflow(
        workflow_id=workflow_id,
        definition=workflow.definition or {},
    )

    workflow.runs_count = (workflow.runs_count or 0) + 1
    workflow.last_run = datetime.now(timezone.utc)
    workflow.last_run_status = run_result.get("status", "unknown")
    if run_result.get("status") == "completed":
        workflow.success_count = (workflow.success_count or 0) + 1
    else:
        workflow.failure_count = (workflow.failure_count or 0) + 1
    await db.flush()

    return WorkflowRunResponse(
        workflow_id=workflow_id,
        run_id=run_result["run_id"],
        status=run_result["status"],
        started_at=datetime.now(timezone.utc),
        message=f"Workflow executed with status: {run_result['status']}",
    )
