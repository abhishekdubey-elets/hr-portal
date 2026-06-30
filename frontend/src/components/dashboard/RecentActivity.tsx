"use client";
import { Bot, FileSearch, UserCheck, TrendingDown, Calendar } from "lucide-react";

const activities = [
  { icon: FileSearch, color: "text-purple-400 bg-purple-500/10", title: "47 resumes screened", desc: "Senior Frontend Engineer • 94% avg score", time: "5 min ago" },
  { icon: UserCheck, color: "text-green-400 bg-green-500/10", title: "Offer accepted", desc: "Marcus Rodriguez — Product Designer", time: "2 hr ago" },
  { icon: TrendingDown, color: "text-red-400 bg-red-500/10", title: "Attrition risk flagged", desc: "2 employees in Engineering team", time: "3 hr ago" },
  { icon: Calendar, color: "text-blue-400 bg-blue-500/10", title: "Interview scheduled", desc: "Priya Patel — Data Scientist", time: "4 hr ago" },
  { icon: Bot, color: "text-yellow-400 bg-yellow-500/10", title: "Onboarding plan created", desc: "Emily Johnson starts Monday", time: "6 hr ago" },
];

export function RecentActivity() {
  return (
    <div className="space-y-3">
      {activities.map((a, i) => (
        <div key={i} className="flex items-start gap-3">
          <div className={`w-8 h-8 rounded-xl ${a.color} flex items-center justify-center flex-shrink-0`}>
            <a.icon className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-white font-medium">{a.title}</p>
            <p className="text-xs text-gray-400 truncate">{a.desc}</p>
          </div>
          <span className="text-xs text-gray-500 flex-shrink-0">{a.time}</span>
        </div>
      ))}
    </div>
  );
}
