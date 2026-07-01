import json
import logging
import io
from typing import Dict, Any, Optional, Tuple
from app.services.ai_service import ai_service

logger = logging.getLogger(__name__)

SYSTEM_PROMPT = """You are an expert AI recruiter with deep expertise in talent assessment. You analyze resumes against job requirements and provide structured, unbiased evaluations. You focus on skills, experience relevance, career trajectory, and red flags."""

SCREENING_PROMPT = """Analyze this resume against the job requirements and provide a comprehensive assessment.

JOB REQUIREMENTS:
Title: {title}
Required Skills: {skills}
Experience Level: {experience_level}
Requirements: {requirements}
Description: {description}

RESUME TEXT:
{resume_text}

Provide your analysis as a JSON object with these exact fields:
{{
  "name": "candidate full name from the resume, empty string if not found",
  "email": "candidate email from the resume, empty string if not found",
  "location": "candidate location/city from the resume, empty string if not found",
  "ai_score": {{
    "overall": <0-100>,
    "skill_match": <0-100>,
    "experience_match": <0-100>,
    "culture_match": <0-100>,
    "education_match": <0-100>
  }},
  "pros": ["list of strengths"],
  "cons": ["list of weaknesses"],
  "red_flags": ["list of red flags, empty if none"],
  "skills": ["list of skills found in resume"],
  "current_company": "current or most recent company",
  "current_title": "current or most recent title",
  "years_experience": <estimated years>,
  "summary": "2-3 sentence summary of the candidate",
  "recommendation": "strong_yes|yes|maybe|no|strong_no"
}}"""


async def extract_text_from_pdf(file_bytes: bytes) -> str:
    try:
        import PyPDF2
        reader = PyPDF2.PdfReader(io.BytesIO(file_bytes))
        text = ""
        for page in reader.pages:
            text += page.extract_text() + "\n"
        return text.strip()
    except Exception as e:
        logger.error(f"PDF extraction failed: {e}")
        return ""


async def extract_text_from_docx(file_bytes: bytes) -> str:
    try:
        import docx
        doc = docx.Document(io.BytesIO(file_bytes))
        text = "\n".join([para.text for para in doc.paragraphs])
        return text.strip()
    except Exception as e:
        logger.error(f"DOCX extraction failed: {e}")
        return ""


async def extract_resume_text(file_bytes: bytes, content_type: str) -> str:
    if "pdf" in content_type.lower():
        return await extract_text_from_pdf(file_bytes)
    elif "docx" in content_type.lower() or "word" in content_type.lower():
        return await extract_text_from_docx(file_bytes)
    else:
        try:
            return file_bytes.decode("utf-8", errors="ignore")
        except Exception:
            return ""


async def screen_resume(resume_text: str, job_data: Dict[str, Any]) -> Dict[str, Any]:
    prompt = SCREENING_PROMPT.format(
        title=job_data.get("title", ""),
        skills=", ".join(job_data.get("skills_required", [])),
        experience_level=job_data.get("experience_level", ""),
        requirements=job_data.get("requirements", ""),
        description=job_data.get("description", ""),
        resume_text=resume_text[:8000],
    )

    response = await ai_service.complete(
        messages=[{"role": "user", "content": prompt}],
        system=SYSTEM_PROMPT,
        response_format={"type": "json_object"},
    )

    try:
        start = response.find("{")
        end = response.rfind("}") + 1
        json_str = response[start:end]
        result = json.loads(json_str)
        return result
    except Exception as e:
        logger.error(f"Failed to parse screening response: {e}")
        return {
            "name": "",
            "email": "",
            "location": "",
            "ai_score": {"overall": 0, "skill_match": 0, "experience_match": 0, "culture_match": 0, "education_match": 0},
            "pros": [],
            "cons": ["Unable to parse resume"],
            "red_flags": [],
            "skills": [],
            "current_company": "",
            "current_title": "",
            "years_experience": 0,
            "summary": "Analysis failed",
            "recommendation": "maybe",
        }
