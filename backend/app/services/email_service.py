import logging
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from typing import List, Optional, Dict, Any

from app.config import settings

logger = logging.getLogger(__name__)


async def send_email(
    to: List[str],
    subject: str,
    html_body: str,
    text_body: Optional[str] = None,
    cc: Optional[List[str]] = None,
) -> bool:
    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        msg["From"] = f"{settings.EMAIL_FROM_NAME} <{settings.EMAIL_FROM}>"
        msg["To"] = ", ".join(to)
        if cc:
            msg["Cc"] = ", ".join(cc)

        if text_body:
            msg.attach(MIMEText(text_body, "plain"))
        msg.attach(MIMEText(html_body, "html"))

        with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT) as server:
            if settings.SMTP_TLS:
                server.starttls()
            if settings.SMTP_USER and settings.SMTP_PASSWORD:
                server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
            all_recipients = to + (cc or [])
            server.sendmail(settings.EMAIL_FROM, all_recipients, msg.as_string())

        logger.info(f"Email sent to {to}: {subject}")
        return True
    except Exception as e:
        logger.error(f"Failed to send email: {e}")
        return False


async def send_interview_invite(
    candidate_email: str,
    candidate_name: str,
    job_title: str,
    scheduled_at: str,
    meeting_link: Optional[str] = None,
) -> bool:
    html = f"""
    <h2>Interview Invitation - {job_title}</h2>
    <p>Dear {candidate_name},</p>
    <p>We are pleased to invite you for an interview for the <strong>{job_title}</strong> position.</p>
    <p><strong>Date & Time:</strong> {scheduled_at}</p>
    {f'<p><strong>Meeting Link:</strong> <a href="{meeting_link}">{meeting_link}</a></p>' if meeting_link else ''}
    <p>Best regards,<br>PeopleAI HR Team</p>
    """
    return await send_email([candidate_email], f"Interview Invitation - {job_title}", html)


async def send_offer_letter(
    candidate_email: str,
    candidate_name: str,
    job_title: str,
    start_date: str,
    salary: str,
) -> bool:
    html = f"""
    <h2>Offer Letter - {job_title}</h2>
    <p>Dear {candidate_name},</p>
    <p>We are delighted to extend an offer for the <strong>{job_title}</strong> position.</p>
    <p><strong>Start Date:</strong> {start_date}</p>
    <p><strong>Compensation:</strong> {salary}</p>
    <p>Please review the attached offer letter and respond within 5 business days.</p>
    <p>Best regards,<br>PeopleAI HR Team</p>
    """
    return await send_email([candidate_email], f"Job Offer - {job_title}", html)
