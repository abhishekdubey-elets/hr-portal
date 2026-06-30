"use client";
import { FileSearch, UserPlus, Bot, BarChart3, Calendar, Briefcase } from "lucide-react";

const actions = [
  { icon: Briefcase, label: "Post Job", desc: "Create new opening", href: "/recruitment/jobs/new", color: "text-purple-400 bg-purple-500/10 hover:bg-purple-500/20" },
  { icon: FileSearch, label: "Screen Resumes", desc: "AI bulk screening", href: "/recruitment/resume-screening", color: "text-blue-400 bg-blue-500/10 hover:bg-blue-500/20" },
  { icon: UserPlus, label: "Add Employee", desc: "Onboard new hire", href: "/employees/onboarding", color: "text-green-400 bg-green-500/10 hover:bg-green-500/20" },
  { icon: Calendar, label: "Schedule Interview", desc: "Book time slot", href: "/recruitment/interviews", color: "text-yellow-400 bg-yellow-500/10 hover:bg-yellow-500/20" },
  { icon: Bot, label: "AI Agents", desc: "Manage automation", href: "/ai-agents", color: "text-orange-400 bg-orange-500/10 hover:bg-orange-500/20" },
  { icon: BarChart3, label: "Analytics", desc: "View insights", href: "/analytics", color: "text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20" },
];

export function QuickActions() {
  return (
    <div className="grid grid-cols-2 gap-3">
      {actions.map((a) => (
        <a key={a.label} href={a.href} className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${a.color}`}>
          <a.icon className="w-5 h-5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-white">{a.label}</p>
            <p className="text-xs text-gray-400">{a.desc}</p>
          </div>
        </a>
      ))}
    </div>
  );
}
