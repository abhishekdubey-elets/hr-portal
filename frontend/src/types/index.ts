export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "hr" | "manager" | "employee";
  avatar?: string;
  department?: string;
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  currentCompany?: string;
  experience: number;
  location: string;
  skills: string[];
  scores: {
    skillMatch: number;
    experienceMatch: number;
    cultureMatch: number;
    overall: number;
  };
  stage: "applied" | "screening" | "interview" | "offer" | "hired" | "rejected";
  pros: string[];
  cons: string[];
  jobId: string;
  resumeUrl?: string;
  createdAt: string;
}

export interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  type: "Full-time" | "Part-time" | "Contract" | "Internship";
  level: "Junior" | "Mid" | "Senior" | "Lead" | "Executive";
  description?: string;
  requirements?: string[];
  salary?: { min: number; max: number; currency: string };
  applicants: number;
  status: "active" | "paused" | "draft" | "closed";
  posted: string;
  closingDate?: string;
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  department: string;
  location: string;
  startDate: string;
  status: "active" | "onboarding" | "leave" | "inactive";
  avatar?: string;
  manager?: string;
  skills: string[];
  performance?: number;
  salary?: number;
}

export interface OnboardingPlan {
  id: string;
  employeeId: string;
  employeeName: string;
  role: string;
  startDate: string;
  tasks: OnboardingTask[];
  progress: number;
}

export interface OnboardingTask {
  id: string;
  title: string;
  description?: string;
  category: "setup" | "training" | "meet" | "review";
  day: number;
  completed: boolean;
  assignee?: string;
}

export interface AIAgent {
  id: string;
  name: string;
  description: string;
  type: "screening" | "onboarding" | "analytics" | "engagement" | "compliance";
  status: "active" | "idle" | "training" | "error";
  tasksCompleted: number;
  accuracy: number;
  lastRun?: string;
  model: string;
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  trigger: string;
  steps: WorkflowStep[];
  status: "active" | "draft" | "paused";
  runsTotal: number;
  lastRun?: string;
}

export interface WorkflowStep {
  id: string;
  type: "trigger" | "condition" | "action" | "ai" | "notification";
  label: string;
  config?: Record<string, unknown>;
}

export interface Notification {
  id: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
  type: "info" | "success" | "warning" | "error";
}

export interface AnalyticsData {
  period: string;
  hired: number;
  applied: number;
  screened: number;
  interviewed: number;
}
