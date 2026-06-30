"use client";
import { Briefcase, Users, UserCheck, Clock, TrendingUp, ArrowRight } from "lucide-react";
import Link from "next/link";

const metrics = [
  { label: "Open Positions", value: 38, icon: <Briefcase className="w-5 h-5 text-purple-400" />, bg: "bg-purple-500/15", href: "/recruitment/jobs" },
  { label: "Active Candidates", value: 524, icon: <Users className="w-5 h-5 text-blue-400" />, bg: "bg-blue-500/15", href: "/recruitment/candidates" },
  { label: "Offers Extended", value: 12, icon: <UserCheck className="w-5 h-5 text-green-400" />, bg: "bg-green-500/15", href: "/recruitment/candidates" },
  { label: "Avg Days to Hire", value: "18d", icon: <Clock className="w-5 h-5 text-yellow-400" />, bg: "bg-yellow-500/15", href: "/analytics" },
];

const shortcuts = [
  { label: "Job Postings", desc: "Manage open positions", href: "/recruitment/jobs", icon: Briefcase },
  { label: "Candidates", desc: "View pipeline", href: "/recruitment/candidates", icon: Users },
  { label: "Resume Screening", desc: "AI-powered screening", href: "/recruitment/resume-screening", icon: TrendingUp },
  { label: "Interviews", desc: "Schedule & manage", href: "/recruitment/interviews", icon: UserCheck },
];

export default function RecruitmentPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Recruitment</h1>
        <p className="text-gray-400 mt-0.5">End-to-end hiring powered by AI</p>
      </div>
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {metrics.map((m) => (
          <Link key={m.label} href={m.href}>
            <div className="bg-[#16161A] border border-[#1E1E24] rounded-2xl p-5 hover:border-purple-500/30 transition-colors cursor-pointer">
              <div className="flex items-start justify-between mb-3">
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">{m.label}</p>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${m.bg}`}>{m.icon}</div>
              </div>
              <p className="text-2xl font-bold text-white">{m.value}</p>
            </div>
          </Link>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {shortcuts.map((s) => (
          <Link key={s.label} href={s.href}>
            <div className="bg-[#16161A] border border-[#1E1E24] rounded-2xl p-5 flex items-center gap-4 hover:border-purple-500/30 transition-colors cursor-pointer group">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                <s.icon className="w-6 h-6 text-purple-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-white">{s.label}</p>
                <p className="text-xs text-gray-400">{s.desc}</p>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-purple-400 transition-colors" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
