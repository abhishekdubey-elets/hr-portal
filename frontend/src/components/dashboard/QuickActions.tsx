"use client";
import { FileSearch, UserPlus, Bot, BarChart3, Calendar, Briefcase, ArrowUpRight } from "lucide-react";

const actions = [
  { icon: Briefcase, label: "Post Job", desc: "Create new opening", href: "/recruitment/jobs/new", color: "text-[#a78bfa]", bg: "bg-[#8B5CF6]/10" },
  { icon: FileSearch, label: "Screen Resumes", desc: "AI bulk screening", href: "/recruitment/resume-screening", color: "text-[#60a5fa]", bg: "bg-[#3B82F6]/10" },
  { icon: UserPlus, label: "Add Employee", desc: "Onboard new hire", href: "/employees/onboarding", color: "text-[#34d399]", bg: "bg-[#10B981]/10" },
  { icon: Calendar, label: "Schedule", desc: "Book interview", href: "/recruitment/interviews", color: "text-[#fbbf24]", bg: "bg-[#F59E0B]/10" },
  { icon: Bot, label: "AI Agents", desc: "Manage automation", href: "/ai-agents", color: "text-[#fb923c]", bg: "bg-[#f97316]/10" },
  { icon: BarChart3, label: "Analytics", desc: "View insights", href: "/analytics", color: "text-[#38bdf8]", bg: "bg-[#0EA5E9]/10" },
];

export function QuickActions() {
  return (
    <div className="grid grid-cols-2 gap-3">
      {actions.map((a) => (
        <a
          key={a.label}
          href={a.href}
          className="group relative flex items-center gap-3 overflow-hidden rounded-2xl border border-white/[0.05] bg-white/[0.02] p-3 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-white/10 hover:bg-white/[0.04]"
        >
          <div className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl ${a.bg} ${a.color} ring-1 ring-inset ring-white/5`}>
            <a.icon className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-white">{a.label}</p>
            <p className="truncate text-xs text-gray-500">{a.desc}</p>
          </div>
          <ArrowUpRight className="h-4 w-4 flex-shrink-0 text-gray-600 opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100" />
        </a>
      ))}
    </div>
  );
}
