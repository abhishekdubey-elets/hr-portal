import json
import logging
from typing import Dict, Any, Optional
from app.services.ai_service import ai_service

logger = logging.getLogger(__name__)

SYSTEM_PROMPT = """You are an expert HR professional and talent acquisition specialist with 15+ years of experience writing compelling job descriptions that attract top talent. You write clear, inclusive, and engaging job descriptions that accurately represent the role and company culture."""

JD_TEMPLATE = """Generate 5 versions of a job description for the following role:

Role: {title}
Department: {department}
Employment Type: {employment_type}
Experience Level: {experience_level}
Location: {location}
Remote: {is_remote}
Salary Range: {salary_range}
Skills Required: {skills}
Description: {description}
Requirements: {requirements}
Benefits: {benefits}
Additional Context: {context}

Generate exactly these 5 versions in JSON format:
1. "professional" - Formal, comprehensive JD for corporate careers page (600-800 words)
2. "linkedin" - Engaging LinkedIn post format (300-400 words)
3. "indeed" - Indeed-optimized with clear sections (400-500 words)
4. "short" - Concise version for quick posting (150-200 words)
5. "internal" - Internal transfer/promotion posting (300-400 words)

Return a valid JSON object with keys: professional, linkedin, indeed, short, internal
Each value should be the complete text of that JD version."""


async def generate_job_descriptions(job_data: Dict[str, Any], additional_context: Optional[str] = None) -> Dict[str, str]:
    salary_range = "Not specified"
    if job_data.get("salary_min") and job_data.get("salary_max"):
        salary_range = f"{job_data['currency']} {job_data['salary_min']:,} - {job_data['salary_max']:,}"
    elif job_data.get("salary_min"):
        salary_range = f"From {job_data['currency']} {job_data['salary_min']:,}"

    prompt = JD_TEMPLATE.format(
        title=job_data.get("title", ""),
        department=job_data.get("department", "Not specified"),
        employment_type=job_data.get("employment_type", "Full-time"),
        experience_level=job_data.get("experience_level", "Mid-level"),
        location=job_data.get("location", "Not specified"),
        is_remote="Yes" if job_data.get("is_remote") else "No",
        salary_range=salary_range,
        skills=", ".join(job_data.get("skills_required", [])) or "Not specified",
        description=job_data.get("description", ""),
        requirements=job_data.get("requirements", ""),
        benefits=job_data.get("benefits", ""),
        context=additional_context or "None",
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
        versions = json.loads(json_str)
        return versions
    except Exception as e:
        logger.error(f"Failed to parse JD response: {e}")
        return {
            "professional": response,
            "linkedin": response,
            "indeed": response,
            "short": response[:500],
            "internal": response,
        }
