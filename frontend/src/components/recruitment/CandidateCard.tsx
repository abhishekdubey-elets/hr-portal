"use client";
import { MapPin, Briefcase, Star, CalendarPlus } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { cn, getInitials } from "@/lib/utils";
import type { Candidate } from "@/types";

interface CandidateCardProps {
  candidate: Candidate;
  onSchedule?: (candidate: Candidate) => void;
}

const scoreColor = (s: number) => s >= 85 ? "text-green-400" : s >= 70 ? "text-yellow-400" : "text-red-400";
const scoreRing = (s: number) => s >= 85 ? "border-green-500/50" : s >= 70 ? "border-yellow-500/50" : "border-red-500/50";

export function CandidateCard({ candidate: c, onSchedule }: CandidateCardProps) {
  return (
    <div className="bg-[#16161A] border border-[#1E1E24] rounded-2xl p-4 hover:border-purple-500/30 transition-colors cursor-pointer group">
      <div className="flex items-start gap-3 mb-3">
        <div className={cn("w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-xs font-bold text-white flex-shrink-0 border-2", scoreRing(c.scores.overall))}>
          {getInitials(c.name)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white truncate">{c.name}</p>
          <p className="text-xs text-gray-400 truncate">{c.currentCompany}</p>
        </div>
        <div className="text-right flex-shrink-0">
          <p className={cn("text-lg font-bold", scoreColor(c.scores.overall))}>{c.scores.overall}</p>
          <p className="text-xs text-gray-500">score</p>
        </div>
      </div>
      <div className="space-y-1 mb-3">
        <div className="flex items-center gap-1.5 text-xs text-gray-400">
          <Briefcase className="w-3 h-3" />
          <span className="truncate">{c.role}</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-400">
          <MapPin className="w-3 h-3" />
          <span>{c.location}</span>
          <span className="text-gray-600">·</span>
          <span>{c.experience}y exp</span>
        </div>
      </div>
      <div className="flex flex-wrap gap-1 mb-3">
        {c.skills.slice(0, 3).map((s) => (
          <Badge key={s} variant="purple" className="text-xs">{s}</Badge>
        ))}
        {c.skills.length > 3 && <Badge variant="default">+{c.skills.length - 3}</Badge>}
      </div>
      <div className="grid grid-cols-3 gap-2 text-center">
        {[
          { label: "Skill", value: c.scores.skillMatch },
          { label: "Exp", value: c.scores.experienceMatch },
          { label: "Culture", value: c.scores.cultureMatch },
        ].map(({ label, value }) => (
          <div key={label} className="bg-[#111114] rounded-lg p-2">
            <p className={cn("text-xs font-bold", scoreColor(value))}>{value}%</p>
            <p className="text-xs text-gray-500">{label}</p>
          </div>
        ))}
      </div>
      {c.pros.length > 0 && (
        <div className="mt-3 flex items-start gap-1.5">
          <Star className="w-3 h-3 text-yellow-400 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-gray-400 line-clamp-1">{c.pros[0]}</p>
        </div>
      )}
      {onSchedule && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSchedule(c);
          }}
          className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl border border-[#8B5CF6]/25 bg-[#8B5CF6]/10 py-2 text-xs font-medium text-[#c4b5fd] transition-colors hover:bg-[#8B5CF6]/20"
        >
          <CalendarPlus className="h-3.5 w-3.5" />
          Schedule Interview
        </button>
      )}
    </div>
  );
}
