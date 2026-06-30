from typing import List, Optional, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel
import json
import logging

from app.database import get_db
from app.models.survey import Survey
from app.models.user import User
from app.dependencies import get_current_user
from app.services.ai_service import ai_service

router = APIRouter()
logger = logging.getLogger(__name__)


class SurveyCreate(BaseModel):
    title: str
    description: Optional[str] = None
    survey_type: str = "engagement"
    questions: List[Dict[str, Any]] = []
    is_anonymous: bool = True
    target_audience: Dict[str, Any] = {}


class SurveyResponse(BaseModel):
    id: int
    title: str
    description: Optional[str]
    survey_type: str
    questions: List[Dict[str, Any]]
    responses: List[Dict[str, Any]]
    ai_analysis: Dict[str, Any]
    is_anonymous: bool
    status: str
    org_id: int
    model_config = {"from_attributes": True}


@router.get("/", response_model=List[SurveyResponse])
async def list_surveys(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Survey).where(Survey.org_id == current_user.org_id).offset(skip).limit(limit).order_by(Survey.created_at.desc())
    )
    return result.scalars().all()


@router.post("/", response_model=SurveyResponse, status_code=status.HTTP_201_CREATED)
async def create_survey(
    survey_data: SurveyCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    survey = Survey(
        **survey_data.model_dump(),
        org_id=current_user.org_id,
        created_by=current_user.id,
        status="draft",
        responses=[],
        ai_analysis={},
    )
    db.add(survey)
    await db.flush()
    await db.refresh(survey)
    return survey


@router.get("/{survey_id}", response_model=SurveyResponse)
async def get_survey(
    survey_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(Survey).where(Survey.id == survey_id, Survey.org_id == current_user.org_id))
    survey = result.scalar_one_or_none()
    if not survey:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Survey not found")
    return survey


@router.post("/{survey_id}/analyze")
async def analyze_survey(
    survey_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(Survey).where(Survey.id == survey_id, Survey.org_id == current_user.org_id))
    survey = result.scalar_one_or_none()
    if not survey:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Survey not found")

    if not survey.responses:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No responses to analyze")

    system = "You are an expert HR analyst specializing in employee sentiment analysis and engagement surveys."
    prompt = f"""Analyze these survey responses and provide insights:

Survey: {survey.title}
Type: {survey.survey_type}
Questions: {json.dumps(survey.questions, indent=2)}
Responses: {json.dumps(survey.responses[:50], indent=2)}

Return a JSON analysis with:
{{
  "overall_sentiment": "positive|neutral|negative",
  "sentiment_score": <0-100>,
  "response_rate": <percentage>,
  "key_themes": ["theme 1", "theme 2"],
  "strengths": ["strength 1"],
  "concerns": ["concern 1"],
  "action_items": ["recommended action 1"],
  "question_analysis": {{"question": {{"avg_score": 0, "sentiment": ""}}}},
  "executive_summary": "Brief summary for leadership",
  "nps_score": <-100 to 100 or null>
}}"""

    response = await ai_service.complete(
        messages=[{"role": "user", "content": prompt}],
        system=system,
        provider="anthropic",
    )

    try:
        start = response.find("{")
        end = response.rfind("}") + 1
        analysis = json.loads(response[start:end])
    except Exception:
        analysis = {"overall_sentiment": "neutral", "executive_summary": response}

    survey.ai_analysis = analysis
    await db.flush()

    return {"survey_id": survey_id, "analysis": analysis}


@router.post("/{survey_id}/submit-response")
async def submit_response(
    survey_id: int,
    response_data: Dict[str, Any],
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(Survey).where(Survey.id == survey_id, Survey.org_id == current_user.org_id))
    survey = result.scalar_one_or_none()
    if not survey:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Survey not found")

    responses = list(survey.responses or [])
    responses.append(response_data)
    survey.responses = responses
    await db.flush()

    return {"message": "Response submitted", "total_responses": len(responses)}
