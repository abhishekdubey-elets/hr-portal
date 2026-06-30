"use client";
import { useState } from "react";
import { Sparkles } from "lucide-react";
import { ResumeScreener } from "@/components/recruitment/ResumeScreener";
import { CandidateCard } from "@/components/recruitment/CandidateCard";
import { Badge } from "@/components/ui/Badge";
import { screenResumes } from "@/lib/api";
import type { Candidate } from "@/types";

export default function ResumeScreeningPage() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<Candidate[]>([]);
  const [processed, setProcessed] = useState(false);

  const handleProcess = async (files: File[]) => {
    setIsProcessing(true);
    try {
      const candidates = await screenResumes(files, "Senior Frontend Engineer with 5+ years React/TypeScript");
      setResults(candidates);
      setProcessed(true);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Resume Screening</h1>
          <p className="text-gray-400 mt-0.5">AI-powered screening with 94% accuracy</p>
        </div>
        {processed && (
          <div className="flex items-center gap-2">
            <Badge variant="success" dot>{results.length} screened</Badge>
            <Badge variant="purple"><Sparkles className="w-3 h-3 mr-1" />{results.filter((r) => r.scores.overall >= 80).length} shortlisted</Badge>
          </div>
        )}
      </div>
      {!processed && (
        <div className="max-w-2xl">
          <div className="bg-[#16161A] border border-[#1E1E24] rounded-2xl p-6">
            <h2 className="text-base font-semibold text-white mb-1">Upload Resumes</h2>
            <p className="text-sm text-gray-400 mb-5">AI will rank candidates by skill match, experience, and culture fit</p>
            <ResumeScreener onProcess={handleProcess} isProcessing={isProcessing} />
          </div>
        </div>
      )}
      {processed && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-white">Screening Results — ranked by AI score</h2>
            <button onClick={() => { setProcessed(false); setResults([]); }} className="text-sm text-purple-400 hover:text-purple-300 transition-colors">Screen more resumes</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {results.map((candidate) => <CandidateCard key={candidate.id} candidate={candidate} />)}
          </div>
        </div>
      )}
    </div>
  );
}
