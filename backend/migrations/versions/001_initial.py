"""Initial migration - create all tables

Revision ID: 001
Revises:
Create Date: 2024-01-01 00:00:00.000000
"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

revision: str = "001"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute("CREATE EXTENSION IF NOT EXISTS pgcrypto")

    op.create_table(
        "organizations",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("name", sa.String(255), nullable=False),
        sa.Column("slug", sa.String(100), nullable=False),
        sa.Column("plan", sa.String(50), nullable=False, server_default="starter"),
        sa.Column("industry", sa.String(100), nullable=True),
        sa.Column("size", sa.String(50), nullable=True),
        sa.Column("logo_url", sa.String(500), nullable=True),
        sa.Column("website", sa.String(255), nullable=True),
        sa.Column("settings", sa.JSON(), nullable=False, server_default="{}"),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_organizations_slug", "organizations", ["slug"], unique=True)

    op.create_table(
        "users",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("email", sa.String(255), nullable=False),
        sa.Column("hashed_password", sa.String(255), nullable=False),
        sa.Column("full_name", sa.String(255), nullable=True),
        sa.Column("role", sa.Enum("super_admin", "hr_admin", "recruiter", "hiring_manager", "dept_manager", "employee", name="userrole"), nullable=False, server_default="employee"),
        sa.Column("org_id", sa.Integer(), sa.ForeignKey("organizations.id", ondelete="CASCADE"), nullable=True),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default="true"),
        sa.Column("is_verified", sa.Boolean(), nullable=False, server_default="false"),
        sa.Column("avatar_url", sa.String(500), nullable=True),
        sa.Column("last_login", sa.DateTime(timezone=True), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_users_email", "users", ["email"], unique=True)
    op.create_index("ix_users_id", "users", ["id"])

    op.create_table(
        "jobs",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("title", sa.String(255), nullable=False),
        sa.Column("department", sa.String(100), nullable=True),
        sa.Column("employment_type", sa.Enum("full_time", "part_time", "contract", "internship", "freelance", name="employmenttype"), nullable=False, server_default="full_time"),
        sa.Column("experience_level", sa.Enum("entry", "mid", "senior", "lead", "executive", name="experiencelevel"), nullable=False, server_default="mid"),
        sa.Column("location", sa.String(255), nullable=True),
        sa.Column("is_remote", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("salary_min", sa.Numeric(12, 2), nullable=True),
        sa.Column("salary_max", sa.Numeric(12, 2), nullable=True),
        sa.Column("currency", sa.String(10), nullable=False, server_default="USD"),
        sa.Column("status", sa.Enum("draft", "open", "paused", "closed", name="jobstatus"), nullable=False, server_default="draft"),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("requirements", sa.Text(), nullable=True),
        sa.Column("benefits", sa.Text(), nullable=True),
        sa.Column("jd_versions", sa.JSON(), nullable=False, server_default="{}"),
        sa.Column("skills_required", sa.JSON(), nullable=False, server_default="[]"),
        sa.Column("org_id", sa.Integer(), sa.ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False),
        sa.Column("created_by", sa.Integer(), sa.ForeignKey("users.id", ondelete="SET NULL"), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
        sa.Column("closed_at", sa.DateTime(timezone=True), nullable=True),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_jobs_id", "jobs", ["id"])

    op.create_table(
        "candidates",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("name", sa.String(255), nullable=False),
        sa.Column("email", sa.String(255), nullable=False),
        sa.Column("phone", sa.String(50), nullable=True),
        sa.Column("resume_url", sa.String(1000), nullable=True),
        sa.Column("resume_text", sa.Text(), nullable=True),
        sa.Column("linkedin_url", sa.String(500), nullable=True),
        sa.Column("portfolio_url", sa.String(500), nullable=True),
        sa.Column("current_company", sa.String(255), nullable=True),
        sa.Column("current_title", sa.String(255), nullable=True),
        sa.Column("years_experience", sa.Numeric(4, 1), nullable=True),
        sa.Column("location", sa.String(255), nullable=True),
        sa.Column("job_id", sa.Integer(), sa.ForeignKey("jobs.id", ondelete="CASCADE"), nullable=False),
        sa.Column("stage", sa.Enum("applied", "screening", "interview", "offer", "hired", "rejected", "withdrawn", name="candidatestage"), nullable=False, server_default="applied"),
        sa.Column("ai_score", sa.JSON(), nullable=False, server_default="{}"),
        sa.Column("pros", sa.JSON(), nullable=False, server_default="[]"),
        sa.Column("cons", sa.JSON(), nullable=False, server_default="[]"),
        sa.Column("red_flags", sa.JSON(), nullable=False, server_default="[]"),
        sa.Column("skills", sa.JSON(), nullable=False, server_default="[]"),
        sa.Column("notes", sa.Text(), nullable=True),
        sa.Column("source", sa.String(100), nullable=True),
        sa.Column("screened_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_candidates_email", "candidates", ["email"])
    op.create_index("ix_candidates_id", "candidates", ["id"])

    op.create_table(
        "interviews",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("candidate_id", sa.Integer(), sa.ForeignKey("candidates.id", ondelete="CASCADE"), nullable=False),
        sa.Column("job_id", sa.Integer(), sa.ForeignKey("jobs.id", ondelete="CASCADE"), nullable=False),
        sa.Column("interviewer_id", sa.Integer(), sa.ForeignKey("users.id", ondelete="SET NULL"), nullable=True),
        sa.Column("scheduled_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("duration_minutes", sa.Integer(), nullable=False, server_default="60"),
        sa.Column("type", sa.Enum("technical", "behavioral", "culture", "system_design", "case_study", "hr_screening", "final", name="interviewtype"), nullable=False, server_default="technical"),
        sa.Column("status", sa.Enum("scheduled", "completed", "cancelled", "no_show", "rescheduled", name="interviewstatus"), nullable=False, server_default="scheduled"),
        sa.Column("meeting_link", sa.String(500), nullable=True),
        sa.Column("question_kit", sa.JSON(), nullable=False, server_default="{}"),
        sa.Column("scorecard", sa.JSON(), nullable=False, server_default="{}"),
        sa.Column("notes", sa.Text(), nullable=True),
        sa.Column("recording_url", sa.String(1000), nullable=True),
        sa.Column("overall_rating", sa.Integer(), nullable=True),
        sa.Column("recommendation", sa.String(50), nullable=True),
        sa.Column("completed_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
        sa.PrimaryKeyConstraint("id"),
    )

    op.create_table(
        "employees",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("user_id", sa.Integer(), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
        sa.Column("employee_number", sa.String(50), nullable=False),
        sa.Column("department", sa.String(100), nullable=True),
        sa.Column("designation", sa.String(255), nullable=True),
        sa.Column("manager_id", sa.Integer(), sa.ForeignKey("employees.id", ondelete="SET NULL"), nullable=True),
        sa.Column("hire_date", sa.Date(), nullable=True),
        sa.Column("probation_end_date", sa.Date(), nullable=True),
        sa.Column("skills", sa.JSON(), nullable=False, server_default="[]"),
        sa.Column("salary", sa.Numeric(12, 2), nullable=True),
        sa.Column("currency", sa.String(10), nullable=False, server_default="USD"),
        sa.Column("status", sa.Enum("active", "inactive", "on_leave", "terminated", "probation", name="employeestatus"), nullable=False, server_default="probation"),
        sa.Column("work_location", sa.String(255), nullable=True),
        sa.Column("work_type", sa.String(50), nullable=False, server_default="office"),
        sa.Column("org_id", sa.Integer(), sa.ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False),
        sa.Column("metadata", sa.JSON(), nullable=False, server_default="{}"),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("employee_number"),
        sa.UniqueConstraint("user_id"),
    )

    op.create_table(
        "onboarding_plans",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("employee_id", sa.Integer(), sa.ForeignKey("employees.id", ondelete="CASCADE"), nullable=False),
        sa.Column("plan", sa.JSON(), nullable=False, server_default="{}"),
        sa.Column("progress", sa.JSON(), nullable=False, server_default="{}"),
        sa.Column("is_completed", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("completed_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
        sa.PrimaryKeyConstraint("id"),
    )

    op.create_table(
        "performance_reviews",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("employee_id", sa.Integer(), sa.ForeignKey("employees.id", ondelete="CASCADE"), nullable=False),
        sa.Column("reviewer_id", sa.Integer(), sa.ForeignKey("employees.id", ondelete="SET NULL"), nullable=True),
        sa.Column("period", sa.String(50), nullable=False),
        sa.Column("period_start", sa.DateTime(timezone=True), nullable=True),
        sa.Column("period_end", sa.DateTime(timezone=True), nullable=True),
        sa.Column("self_review", sa.JSON(), nullable=False, server_default="{}"),
        sa.Column("manager_review", sa.JSON(), nullable=False, server_default="{}"),
        sa.Column("peer_reviews", sa.JSON(), nullable=False, server_default="[]"),
        sa.Column("ai_summary", sa.JSON(), nullable=False, server_default="{}"),
        sa.Column("goals", sa.JSON(), nullable=False, server_default="[]"),
        sa.Column("overall_rating", sa.Integer(), nullable=True),
        sa.Column("status", sa.Enum("draft", "self_review", "peer_review", "manager_review", "completed", "acknowledged", name="reviewstatus"), nullable=False, server_default="draft"),
        sa.Column("due_date", sa.DateTime(timezone=True), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
        sa.PrimaryKeyConstraint("id"),
    )

    op.create_table(
        "surveys",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("title", sa.String(255), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("survey_type", sa.String(50), nullable=False, server_default="engagement"),
        sa.Column("questions", sa.JSON(), nullable=False, server_default="[]"),
        sa.Column("responses", sa.JSON(), nullable=False, server_default="[]"),
        sa.Column("ai_analysis", sa.JSON(), nullable=False, server_default="{}"),
        sa.Column("is_anonymous", sa.Integer(), nullable=False, server_default="1"),
        sa.Column("status", sa.String(50), nullable=False, server_default="draft"),
        sa.Column("target_audience", sa.JSON(), nullable=False, server_default="{}"),
        sa.Column("org_id", sa.Integer(), sa.ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False),
        sa.Column("created_by", sa.Integer(), sa.ForeignKey("users.id", ondelete="SET NULL"), nullable=True),
        sa.Column("starts_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("ends_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
        sa.PrimaryKeyConstraint("id"),
    )

    op.create_table(
        "workflows",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("name", sa.String(255), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("trigger_type", sa.String(100), nullable=True),
        sa.Column("trigger_config", sa.JSON(), nullable=False, server_default="{}"),
        sa.Column("definition", sa.JSON(), nullable=False, server_default="{}"),
        sa.Column("status", sa.Enum("active", "inactive", "draft", "archived", name="workflowstatus"), nullable=False, server_default="draft"),
        sa.Column("runs_count", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("success_count", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("failure_count", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("last_run", sa.DateTime(timezone=True), nullable=True),
        sa.Column("last_run_status", sa.String(50), nullable=True),
        sa.Column("org_id", sa.Integer(), sa.ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False),
        sa.Column("created_by", sa.Integer(), sa.ForeignKey("users.id", ondelete="SET NULL"), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
        sa.PrimaryKeyConstraint("id"),
    )

    op.create_table(
        "analytics_events",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("event_type", sa.String(100), nullable=False),
        sa.Column("entity_type", sa.String(100), nullable=True),
        sa.Column("entity_id", sa.Integer(), nullable=True),
        sa.Column("user_id", sa.Integer(), sa.ForeignKey("users.id", ondelete="SET NULL"), nullable=True),
        sa.Column("org_id", sa.Integer(), sa.ForeignKey("organizations.id", ondelete="CASCADE"), nullable=True),
        sa.Column("properties", sa.JSON(), nullable=False, server_default="{}"),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_analytics_events_event_type", "analytics_events", ["event_type"])
    op.create_index("ix_analytics_events_created_at", "analytics_events", ["created_at"])


def downgrade() -> None:
    op.drop_table("analytics_events")
    op.drop_table("workflows")
    op.drop_table("surveys")
    op.drop_table("performance_reviews")
    op.drop_table("onboarding_plans")
    op.drop_table("employees")
    op.drop_table("interviews")
    op.drop_table("candidates")
    op.drop_table("jobs")
    op.drop_table("users")
    op.drop_table("organizations")

    op.execute("DROP TYPE IF EXISTS workflowstatus")
    op.execute("DROP TYPE IF EXISTS reviewstatus")
    op.execute("DROP TYPE IF EXISTS employeestatus")
    op.execute("DROP TYPE IF EXISTS interviewstatus")
    op.execute("DROP TYPE IF EXISTS interviewtype")
    op.execute("DROP TYPE IF EXISTS candidatestage")
    op.execute("DROP TYPE IF EXISTS jobstatus")
    op.execute("DROP TYPE IF EXISTS experiencelevel")
    op.execute("DROP TYPE IF EXISTS employmenttype")
    op.execute("DROP TYPE IF EXISTS userrole")
