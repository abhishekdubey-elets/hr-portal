"use client";
import { Mail, MapPin, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { cn, getInitials } from "@/lib/utils";
import type { Employee } from "@/types";

interface EmployeeCardProps { employee: Employee; }

const statusVariant: Record<string, "success" | "info" | "warning" | "default"> = {
  active: "success", onboarding: "info", leave: "warning", inactive: "default"
};

export function EmployeeCard({ employee: e }: EmployeeCardProps) {
  return (
    <div className="bg-[#16161A] border border-[#1E1E24] rounded-2xl p-5 hover:border-purple-500/30 transition-colors cursor-pointer">
      <div className="flex items-start gap-4 mb-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
          {getInitials(e.name)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-sm font-semibold text-white">{e.name}</p>
              <p className="text-xs text-gray-400">{e.role}</p>
            </div>
            <Badge variant={statusVariant[e.status] || "default"} dot>{e.status}</Badge>
          </div>
        </div>
      </div>
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <Mail className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="truncate">{e.email}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
          <span>{e.location}</span>
          <span className="text-gray-600">·</span>
          <span>{e.department}</span>
        </div>
      </div>
      {e.performance !== undefined && (
        <div className="flex items-center justify-between pt-3 border-t border-[#1E1E24]">
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Performance</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-24 h-1.5 bg-[#111114] rounded-full overflow-hidden">
              <div className={cn("h-full rounded-full", e.performance >= 90 ? "bg-green-500" : e.performance >= 75 ? "bg-yellow-500" : "bg-red-500")} style={{ width: `${e.performance}%` }} />
            </div>
            <span className="text-xs font-medium text-white">{e.performance}%</span>
          </div>
        </div>
      )}
    </div>
  );
}
