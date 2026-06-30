"use client";
import { SkillsMatrix } from "@/components/employees/SkillsMatrix";
import { Badge } from "@/components/ui/Badge";

const skillsData = [
  { skill: "React", count: 34, level: "advanced" as const },
  { skill: "TypeScript", count: 28, level: "advanced" as const },
  { skill: "Python", count: 22, level: "intermediate" as const },
  { skill: "AWS", count: 19, level: "intermediate" as const },
  { skill: "Figma", count: 15, level: "advanced" as const },
  { skill: "SQL", count: 31, level: "advanced" as const },
  { skill: "Node.js", count: 17, level: "intermediate" as const },
  { skill: "Kubernetes", count: 9, level: "expert" as const },
  { skill: "Go", count: 8, level: "advanced" as const },
  { skill: "Machine Learning", count: 11, level: "intermediate" as const },
  { skill: "GraphQL", count: 14, level: "intermediate" as const },
  { skill: "Docker", count: 21, level: "advanced" as const },
];

const gaps = [
  { skill: "Rust", gap: "High", desc: "Only 2 engineers with Rust experience" },
  { skill: "AI/ML", gap: "Medium", desc: "Growing need across product teams" },
  { skill: "Security", gap: "High", desc: "No certified security specialists" },
  { skill: "Mobile (React Native)", gap: "Medium", desc: "Mobile roadmap requires 5+ engineers" },
];

export default function SkillsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Skills Matrix</h1>
        <p className="text-gray-400 mt-0.5">Map team capabilities and identify skill gaps</p>
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-[#16161A] border border-[#1E1E24] rounded-2xl p-6">
          <h2 className="text-base font-semibold text-white mb-5">Skill Distribution</h2>
          <SkillsMatrix skills={skillsData} />
        </div>
        <div className="space-y-4">
          <div className="bg-[#16161A] border border-[#1E1E24] rounded-2xl p-5">
            <h2 className="text-base font-semibold text-white mb-4">Skill Gaps</h2>
            <div className="space-y-3">
              {gaps.map((g) => (
                <div key={g.skill} className="p-3 bg-[#111114] rounded-xl">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-white">{g.skill}</p>
                    <Badge variant={g.gap === "High" ? "error" : "warning"}>{g.gap} Gap</Badge>
                  </div>
                  <p className="text-xs text-gray-400">{g.desc}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-[#16161A] border border-[#1E1E24] rounded-2xl p-5">
            <h2 className="text-base font-semibold text-white mb-4">Top Skills by Level</h2>
            <div className="space-y-2">
              {[
                { level: "Expert", color: "bg-purple-500/15 text-purple-400", skills: ["Kubernetes", "Go"] },
                { level: "Advanced", color: "bg-blue-500/15 text-blue-400", skills: ["React", "TypeScript", "SQL", "Docker", "Figma"] },
                { level: "Intermediate", color: "bg-yellow-500/15 text-yellow-400", skills: ["Python", "AWS", "Node.js", "ML", "GraphQL"] },
              ].map(({ level, color, skills }) => (
                <div key={level} className={`p-3 rounded-xl ${color}`}>
                  <p className="text-xs font-semibold mb-1">{level}</p>
                  <div className="flex flex-wrap gap-1">
                    {skills.map((s) => <span key={s} className="text-xs bg-black/20 px-2 py-0.5 rounded-full">{s}</span>)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
