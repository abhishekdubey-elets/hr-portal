from typing import Optional, Dict, Any
from datetime import datetime
from pydantic import BaseModel
from app.models.workflow import WorkflowStatus


class WorkflowBase(BaseModel):
    name: str
    description: Optional[str] = None
    trigger_type: Optional[str] = None
    trigger_config: Dict[str, Any] = {}
    definition: Dict[str, Any] = {}


class WorkflowCreate(WorkflowBase):
    org_id: int


class WorkflowUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    trigger_type: Optional[str] = None
    trigger_config: Optional[Dict[str, Any]] = None
    definition: Optional[Dict[str, Any]] = None
    status: Optional[WorkflowStatus] = None


class WorkflowResponse(WorkflowBase):
    id: int
    status: WorkflowStatus
    runs_count: int
    success_count: int
    failure_count: int
    last_run: Optional[datetime]
    last_run_status: Optional[str]
    org_id: int
    created_by: Optional[int]
    created_at: datetime

    model_config = {"from_attributes": True}


class WorkflowRunResponse(BaseModel):
    workflow_id: int
    run_id: str
    status: str
    started_at: datetime
    message: str
