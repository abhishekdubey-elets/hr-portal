import json
import logging
from typing import Dict, Any, List
from app.services.ai_service import ai_service

logger = logging.getLogger(__name__)

SYSTEM_PROMPT = """You are an expert HR specialist in employee onboarding. You create personalized, comprehensive 30-60-90 day onboarding plans that help new employees integrate successfully, build relationships, and achieve early wins."""

ONBOARDING_PROMPT = """Create a detailed 30-60-90 day onboarding plan for a new employee:

Employee: {employee_name}
Role: {designation}
Department: {department}
Skills: {skills}
Work Type: {work_type}
Manager: {manager}
Org Context: {org_context}

Generate a JSON onboarding plan:
{{
  "overview": "Brief onboarding philosophy for this role",
  "day_30": {{
    "theme": "Learn & Observe",
    "goals": ["goal 1", "goal 2"],
    "tasks": [
      {{
        "week": 1,
        "title": "Task title",
        "description": "Task description",
        "category": "setup|learning|relationship|project",
        "priority": "high|medium|low",
        "owner": "employee|manager|hr",
        "resources": ["resource 1"]
      }}
    ],
    "success_metrics": ["metric 1", "metric 2"],
    "check_in": "What to discuss in 30-day check-in"
  }},
  "day_60": {{
    "theme": "Contribute & Connect",
    "goals": ["goal 1"],
    "tasks": [...],
    "success_metrics": [...],
    "check_in": "..."
  }},
  "day_90": {{
    "theme": "Own & Lead",
    "goals": ["goal 1"],
    "tasks": [...],
    "success_metrics": [...],
    "check_in": "..."
  }},
  "key_relationships": [
    {{"name": "Person/Team", "role": "Role", "purpose": "Why connect"}}
  ],
  "tools_and_access": ["Tool 1: description"],
  "recommended_learning": ["Course/resource 1"]
}}"""


async def generate_onboarding_plan(employee_data: Dict[str, Any], org_data: Dict[str, Any]) -> Dict[str, Any]:
    prompt = ONBOARDING_PROMPT.format(
        employee_name=employee_data.get("name", "New Employee"),
        designation=employee_data.get("designation", ""),
        department=employee_data.get("department", ""),
        skills=", ".join(employee_data.get("skills", [])),
        work_type=employee_data.get("work_type", "office"),
        manager=employee_data.get("manager_name", "TBD"),
        org_context=f"{org_data.get('name', '')} - {org_data.get('industry', '')}",
    )

    response = await ai_service.complete(
        messages=[{"role": "user", "content": prompt}],
        system=SYSTEM_PROMPT,
    )

    try:
        start = response.find("{")
        end = response.rfind("}") + 1
        json_str = response[start:end]
        return json.loads(json_str)
    except Exception as e:
        logger.error(f"Failed to parse onboarding plan: {e}")
        return {"day_30": {"tasks": []}, "day_60": {"tasks": []}, "day_90": {"tasks": []}}


# --- Flat preview plan (matches the frontend OnboardingPlan task model) ---

PREVIEW_SYSTEM = """You are an expert HR onboarding specialist. You design clear, actionable 90-day onboarding plans tailored to a specific role."""

PREVIEW_PROMPT = """Create a personalized 90-day onboarding plan for {name}, joining as a {role}.

Return ONLY a JSON object of this exact shape:
{{
  "tasks": [
    {{
      "title": "short task title",
      "description": "one concise sentence",
      "category": "setup" | "training" | "meet" | "review",
      "day": <integer between 1 and 90>
    }}
  ]
}}

Rules:
- Include 9 to 12 tasks.
- Spread days across the full ramp: several in week 1 (days 1-7), some in the first month, and later ones up to day 90.
- Include review milestones at day 30, day 60, and day 90 (category "review").
- "category" MUST be exactly one of: setup, training, meet, review.
- Tailor tasks to the {role} role."""

_ALLOWED = {"setup", "training", "meet", "review"}


async def generate_onboarding_plan_preview(name: str, role: str) -> List[Dict[str, Any]]:
    prompt = PREVIEW_PROMPT.format(name=name or "the new hire", role=role or "team member")
    response = await ai_service.complete(
        messages=[{"role": "user", "content": prompt}],
        system=PREVIEW_SYSTEM,
        response_format={"type": "json_object"},
    )

    try:
        start = response.find("{")
        end = response.rfind("}") + 1
        parsed = json.loads(response[start:end])
        raw = parsed.get("tasks", parsed if isinstance(parsed, list) else [])
    except Exception as e:
        logger.error(f"Failed to parse onboarding preview: {e}")
        return []

    tasks: List[Dict[str, Any]] = []
    for item in raw if isinstance(raw, list) else []:
        if not isinstance(item, dict):
            continue
        try:
            day = int(item.get("day", 1))
        except (TypeError, ValueError):
            day = 1
        day = max(1, min(90, day))
        category = str(item.get("category", "training")).lower().strip()
        if category not in _ALLOWED:
            category = "training"
        title = str(item.get("title", "")).strip()
        if not title:
            continue
        tasks.append({
            "title": title,
            "description": str(item.get("description", "")).strip(),
            "category": category,
            "day": day,
        })

    tasks.sort(key=lambda t: t["day"])
    return tasks
