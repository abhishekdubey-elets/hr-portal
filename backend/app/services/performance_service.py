import json
import logging
from typing import Dict, Any, List, Optional
from app.services.ai_service import ai_service

logger = logging.getLogger(__name__)

SYSTEM_PROMPT = """You are an expert HR analyst specializing in performance management. You synthesize multi-source feedback into balanced, actionable performance summaries that are fair, data-driven, and development-focused."""

PERFORMANCE_PROMPT = """Analyze all performance data and generate a comprehensive AI performance summary:

Employee: {employee_name}
Role: {designation}
Department: {department}
Review Period: {period}

Self Review:
{self_review}

Manager Review:
{manager_review}

Peer Reviews:
{peer_reviews}

Goals Progress:
{goals}

Generate a JSON performance summary:
{{
  "executive_summary": "3-4 sentence balanced overview",
  "key_strengths": ["strength 1", "strength 2", "strength 3"],
  "development_areas": ["area 1", "area 2"],
  "achievements": ["achievement 1", "achievement 2"],
  "impact_assessment": "Description of employee's overall impact",
  "leadership_assessment": "Assessment of leadership qualities",
  "collaboration_score": <1-10>,
  "technical_score": <1-10>,
  "communication_score": <1-10>,
  "initiative_score": <1-10>,
  "suggested_rating": "exceptional|exceeds|meets|needs_improvement|unsatisfactory",
  "growth_trajectory": "upward|stable|declining",
  "recommended_actions": [
    {{"action": "Action item", "owner": "employee|manager|hr", "timeline": "Q1 2025"}}
  ],
  "compensation_recommendation": "increase|maintain|review",
  "promotion_readiness": "ready|developing|not_ready",
  "key_themes": ["theme from feedback"],
  "sentiment_analysis": {{
    "self": "positive|neutral|negative",
    "manager": "positive|neutral|negative",
    "peers": "positive|neutral|negative"
  }}
}}"""


async def generate_performance_summary(
    employee_data: Dict[str, Any],
    review_data: Dict[str, Any],
) -> Dict[str, Any]:
    peer_reviews_text = ""
    for i, review in enumerate(review_data.get("peer_reviews", []), 1):
        peer_reviews_text += f"\nPeer {i}: {json.dumps(review, indent=2)}\n"

    prompt = PERFORMANCE_PROMPT.format(
        employee_name=employee_data.get("name", "Employee"),
        designation=employee_data.get("designation", ""),
        department=employee_data.get("department", ""),
        period=review_data.get("period", ""),
        self_review=json.dumps(review_data.get("self_review", {}), indent=2),
        manager_review=json.dumps(review_data.get("manager_review", {}), indent=2),
        peer_reviews=peer_reviews_text or "No peer reviews",
        goals=json.dumps(review_data.get("goals", []), indent=2),
    )

    response = await ai_service.complete(
        messages=[{"role": "user", "content": prompt}],
        system=SYSTEM_PROMPT,
        provider="anthropic",
    )

    try:
        start = response.find("{")
        end = response.rfind("}") + 1
        json_str = response[start:end]
        return json.loads(json_str)
    except Exception as e:
        logger.error(f"Failed to parse performance summary: {e}")
        return {"executive_summary": "Analysis unavailable", "key_strengths": [], "development_areas": []}
