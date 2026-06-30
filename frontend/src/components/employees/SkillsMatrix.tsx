"use client";
import { cn } from "@/lib/utils";

interface SkillEntry { skill: string; count: number; level: "beginner" | "intermediate" | "advanced" | "expert"; }
interface SkillsMatrixProps { skills: SkillEntry[]; }

const levelColor: Record<string, string> = {
  expert: "bg-purple-500 text-purple-100",
  advanced: "bg-blue-500 text-blue-100",
  intermediate: "bg-yellow-500 text-yellow-100",
  beginner: "bg-gray-600 text-gray-200",
};

const levelWidth: Record<string, string> = {
  expert: "w-full",
  advanced: "w-3/4",
  intermediate: "w-1/2",
  beginner: "w-1/4",
};

export function SkillsMatrix({ skills }: SkillsMatrixProps) {
  const sorted = [...skills].sort((a, b) => b.count - a.count);
  const max = sorted[0]?.count || 1;

  return (
    <div className="space-y-2">
      {sorted.map((s) => (
        <div key={s.skill} className="flex items-center gap-4">
          <div className="w-32 flex-shrink-0">
            <p className="text-sm text-gray-300 truncate">{s.skill}</p>
          </div>
          <div className="flex-1 h-6 bg-[#111114] rounded-lg overflow-hidden relative">
            <div
              className={cn("h-full rounded-lg flex items-center px-2 transition-all", levelColor[s.level])}
              style={{ width: `${(s.count / max) * 100}%` }}
            >
              <span className="text-xs font-medium">{s.count}</span>
            </div>
          </div>
          <span className={cn("text-xs px-2 py-0.5 rounded-full w-24 text-center flex-shrink-0", levelColor[s.level])}>{s.level}</span>
        </div>
      ))}
    </div>
  );
}
