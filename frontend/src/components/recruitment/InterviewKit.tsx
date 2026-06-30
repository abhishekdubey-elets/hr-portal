"use client";
import { useState } from "react";
import { ChevronDown, ChevronUp, Brain } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

const sections = [
  {
    section: "Introduction",
    questions: [
      {
        question: "Tell me about yourself and why you're interested in this role.",
        guidance: "Look for clear communication, genuine enthusiasm, and alignment with role requirements. Assess how they frame their narrative.",
        timeMinutes: 5,
      },
      {
        question: "What motivated you to leave your current position?",
        guidance: "Listen for professional growth motivations vs. negative push factors. Red flags: badmouthing current employer.",
        timeMinutes: 3,
      },
    ],
  },
  {
    section: "Technical Assessment",
    questions: [
      {
        question: "Walk me through how you'd architect a real-time dashboard with React and WebSockets.",
        guidance: "Strong candidates will mention state management, connection handling, error boundaries, and performance optimizations.",
        timeMinutes: 10,
      },
      {
        question: "Explain the difference between useMemo and useCallback. When would you use each?",
        guidance: "Should demonstrate deep React knowledge. useMemo = memoized value, useCallback = memoized function. Expect examples.",
        timeMinutes: 5,
      },
      {
        question: "How do you approach performance optimization in a large-scale Next.js application?",
        guidance: "Look for: code splitting, image optimization, caching strategies, Core Web Vitals awareness, Lighthouse.",
        timeMinutes: 8,
      },
    ],
  },
  {
    section: "Behavioral",
    questions: [
      {
        question: "Tell me about a time you had to push back on a product decision. How did you handle it?",
        guidance: "STAR method expected. Look for assertiveness balanced with collaboration. Outcome should be constructive.",
        timeMinutes: 7,
      },
      {
        question: "Describe a situation where you had to learn a new technology quickly under pressure.",
        guidance: "Assess learning agility, resourcefulness, and ability to perform under constraints.",
        timeMinutes: 5,
      },
    ],
  },
  {
    section: "Culture & Closing",
    questions: [
      {
        question: "Where do you see yourself in 3 years? How does this role fit into that vision?",
        guidance: "Look for ambition aligned with company growth. Assess if they've done research on our trajectory.",
        timeMinutes: 4,
      },
      {
        question: "What questions do you have for us?",
        guidance: "Strong candidates ask about team dynamics, growth opportunities, tech stack evolution, and success metrics.",
        timeMinutes: 5,
      },
    ],
  },
];

export function InterviewKit() {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({ "Introduction": true });
  const [openQuestions, setOpenQuestions] = useState<Record<string, boolean>>({});

  const toggleSection = (s: string) => setOpenSections((p) => ({ ...p, [s]: !p[s] }));
  const toggleQuestion = (q: string) => setOpenQuestions((p) => ({ ...p, [q]: !p[q] }));

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <Brain className="w-4 h-4 text-purple-400" />
        <p className="text-sm text-gray-400">AI-generated interview kit · Senior Frontend Engineer</p>
        <Badge variant="purple">GPT-4o</Badge>
      </div>

      {sections.map((s) => (
        <div key={s.section} className="border border-[#1E1E24] rounded-xl overflow-hidden">
          <button
            onClick={() => toggleSection(s.section)}
            className="w-full flex items-center justify-between px-5 py-4 hover:bg-[#1E1E24]/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <h3 className="text-sm font-semibold text-white">{s.section}</h3>
              <Badge variant="default">{s.questions.length} questions</Badge>
              <span className="text-xs text-gray-500">
                ~{s.questions.reduce((acc, q) => acc + q.timeMinutes, 0)} min
              </span>
            </div>
            {openSections[s.section] ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
          </button>

          {openSections[s.section] && (
            <div className="border-t border-[#1E1E24] divide-y divide-[#1E1E24]">
              {s.questions.map((q, i) => (
                <div key={i} className="px-5 py-4">
                  <button
                    onClick={() => toggleQuestion(`${s.section}-${i}`)}
                    className="w-full flex items-start gap-3 text-left"
                  >
                    <span className="text-xs text-purple-400 font-bold mt-0.5 flex-shrink-0">Q{i + 1}</span>
                    <p className="text-sm text-white font-medium flex-1">{q.question}</p>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-xs text-gray-500">{q.timeMinutes}m</span>
                      {openQuestions[`${s.section}-${i}`]
                        ? <ChevronUp className="w-3 h-3 text-gray-400" />
                        : <ChevronDown className="w-3 h-3 text-gray-400" />}
                    </div>
                  </button>
                  {openQuestions[`${s.section}-${i}`] && (
                    <div className="mt-3 ml-6 p-3 bg-[#0A0A0B] rounded-xl border border-[#1E1E24]">
                      <p className="text-xs text-gray-400 leading-relaxed">
                        <span className="text-purple-400 font-semibold">Guidance: </span>
                        {q.guidance}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
