import json
import logging
from typing import Dict, Any, Optional, List
from app.services.ai_service import ai_service

logger = logging.getLogger(__name__)

SYSTEM_PROMPT = """You are an expert interview coach and hiring specialist. You create comprehensive, role-specific interview kits with behavioral, technical, and situational questions along with detailed scoring rubrics."""

INTERVIEW_PROMPT = """Create a comprehensive interview kit for the following:

Role: {title}
Interview Type: {interview_type}
Experience Level: {experience_level}
Required Skills: {skills}
Number of Questions: {num_questions}
Candidate Context: {candidate_context}

Generate the interview kit as a JSON object:
{{
  "questions": [
    {{
      "id": 1,
      "category": "technical|behavioral|situational|cultural",
      "question": "The interview question",
      "what_to_look_for": "Key points to assess",
      "follow_ups": ["follow up 1", "follow up 2"],
      "time_allocation": <minutes>,
      "difficulty": "easy|medium|hard"
    }}
  ],
  "scoring_rubric": {{
    "technical_competency": {{"weight": 0.4, "criteria": ["criterion 1", "criterion 2"]}},
    "problem_solving": {{"weight": 0.2, "criteria": ["criterion 1"]}},
    "communication": {{"weight": 0.2, "criteria": ["criterion 1"]}},
    "culture_fit": {{"weight": 0.2, "criteria": ["criterion 1"]}}
  }},
  "time_allocation": {{
    "introduction": 5,
    "questions": {question_time},
    "candidate_questions": 10,
    "wrap_up": 5
  }},
  "interviewer_guide": "Brief guide for the interviewer",
  "red_flags_to_watch": ["red flag 1", "red flag 2"]
}}"""


async def generate_interview_kit(
    job_data: Dict[str, Any],
    interview_type: str,
    num_questions: int = 10,
    candidate_data: Optional[Dict[str, Any]] = None,
) -> Dict[str, Any]:
    candidate_context = "No specific candidate context"
    if candidate_data:
        candidate_context = f"Candidate: {candidate_data.get('name')}, Experience: {candidate_data.get('years_experience')} years, Skills: {', '.join(candidate_data.get('skills', []))}"

    prompt = INTERVIEW_PROMPT.format(
        title=job_data.get("title", ""),
        interview_type=interview_type,
        experience_level=job_data.get("experience_level", ""),
        skills=", ".join(job_data.get("skills_required", [])),
        num_questions=num_questions,
        candidate_context=candidate_context,
        question_time=num_questions * 5,
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
        logger.error(f"Failed to parse interview kit response: {e}")
        return {"questions": [], "scoring_rubric": {}, "time_allocation": {}, "interviewer_guide": "", "red_flags_to_watch": []}
