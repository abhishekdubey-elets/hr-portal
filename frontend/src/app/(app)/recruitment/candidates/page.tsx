"use client";
import { useState } from "react";
import { CandidateCard } from "@/components/recruitment/CandidateCard";
import type { Candidate } from "@/types";

const columns = [
  { id: "applied", label: "Applied", color: "border-gray-500/30" },
  { id: "screening", label: "Screening", color: "border-yellow-500/30" },
  { id: "interview", label: "Interview", color: "border-blue-500/30" },
  { id: "offer", label: "Offer", color: "border-purple-500/30" },
  { id: "hired", label: "Hired", color: "border-green-500/30" },
];

const mockCandidates: Candidate[] = [
  { id: "1", name: "Sarah Chen", email: "sarah@ex.com", role: "Sr. Frontend Engineer", currentCompany: "Google", experience: 6, location: "SF, CA", skills: ["React","TypeScript"], scores: { skillMatch: 95, experienceMatch: 90, cultureMatch: 92, overall: 92 }, stage: "interview", pros: ["Strong React"], cons: ["Budget"], jobId: "j1", createdAt: "" },
  { id: "2", name: "Marcus Rodriguez", email: "marcus@ex.com", role: "Frontend Engineer", currentCompany: "Meta", experience: 5, location: "NY, NY", skills: ["React","Vue"], scores: { skillMatch: 88, experienceMatch: 85, cultureMatch: 89, overall: 87 }, stage: "screening", pros: ["Full-stack"], cons: ["No TS"], jobId: "j1", createdAt: "" },
  { id: "3", name: "Emily Johnson", email: "emily@ex.com", role: "Frontend Dev", currentCompany: "Stripe", experience: 4, location: "Remote", skills: ["React","CSS"], scores: { skillMatch: 72, experienceMatch: 70, cultureMatch: 75, overall: 71 }, stage: "applied", pros: ["Testing"], cons: ["Junior"], jobId: "j1", createdAt: "" },
  { id: "4", name: "David Kim", email: "david@ex.com", role: "Product Designer", currentCompany: "Figma", experience: 5, location: "Austin", skills: ["Figma","Prototyping"], scores: { skillMatch: 91, experienceMatch: 88, cultureMatch: 85, overall: 88 }, stage: "offer", pros: ["UX focus"], cons: ["Less dev"], jobId: "j2", createdAt: "" },
  { id: "5", name: "Priya Patel", email: "priya@ex.com", role: "Data Scientist", currentCompany: "Netflix", experience: 7, location: "LA, CA", skills: ["Python","ML","SQL"], scores: { skillMatch: 93, experienceMatch: 95, cultureMatch: 88, overall: 92 }, stage: "hired", pros: ["Deep ML"], cons: ["Overqualified"], jobId: "j3", createdAt: "" },
  { id: "6", name: "James Wilson", email: "james@ex.com", role: "Backend Engineer", currentCompany: "AWS", experience: 6, location: "Seattle", skills: ["Go","Kubernetes","AWS"], scores: { skillMatch: 89, experienceMatch: 85, cultureMatch: 82, overall: 85 }, stage: "screening", pros: ["Cloud native"], cons: ["Location"], jobId: "j4", createdAt: "" },
];

export default function CandidatesPage() {
  const [candidates] = useState(mockCandidates);
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Candidate Pipeline</h1>
        <p className="text-gray-400 mt-0.5">{candidates.length} candidates across all stages</p>
      </div>
      <div className="grid grid-cols-5 gap-4 overflow-x-auto min-w-0">
        {columns.map((col) => {
          const colCandidates = candidates.filter((c) => c.stage === col.id);
          return (
            <div key={col.id} className={`border-t-2 ${col.color} pt-3`}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-300">{col.label}</h3>
                <span className="text-xs text-gray-500 bg-[#1E1E24] px-2 py-0.5 rounded-full">{colCandidates.length}</span>
              </div>
              <div className="space-y-3">
                {colCandidates.length === 0 ? (
                  <div className="border-2 border-dashed border-[#1E1E24] rounded-2xl p-6 text-center"><p className="text-xs text-gray-600">No candidates</p></div>
                ) : colCandidates.map((c) => <CandidateCard key={c.id} candidate={c} />)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
