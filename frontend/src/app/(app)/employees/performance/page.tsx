"use client";
import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown, Star, Award } from "lucide-react";
import { getEmployees } from "@/lib/api";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import type { Employee } from "@/types";

export default function PerformancePage() {
  const [employees, setEmployees] = useState<Employee[]>([]);

  useEffect(() => { getEmployees().then(setEmployees); }, []);

  const sorted = [...employees].sort((a, b) => (b.performance || 0) - (a.performance || 0));
  const avg = employees.reduce((s, e) => s + (e.performance || 0), 0) / (employees.length || 1);

  const ratingLabel = (p: number) => p >= 90 ? "Exceptional" : p >= 80 ? "Exceeds Expectations" : p >= 70 ? "Meets Expectations" : "Needs Improvement";
  const ratingVariant = (p: number): "success" | "info" | "warning" | "error" => p >= 90 ? "success" : p >= 80 ? "info" : p >= 70 ? "warning" : "error";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Performance</h1>
        <p className="text-gray-400 mt-0.5">Track team performance and identify top talent</p>
      </div>
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label: "Team Average", value: `${avg.toFixed(1)}%`, icon: <TrendingUp className="w-5 h-5 text-purple-400" />, bg: "bg-purple-500/15" },
          { label: "Top Performers", value: employees.filter(e => (e.performance || 0) >= 90).length, icon: <Award className="w-5 h-5 text-yellow-400" />, bg: "bg-yellow-500/15" },
          { label: "On Track", value: employees.filter(e => (e.performance || 0) >= 70 && (e.performance || 0) < 90).length, icon: <Star className="w-5 h-5 text-green-400" />, bg: "bg-green-500/15" },
          { label: "Needs Support", value: employees.filter(e => (e.performance || 0) < 70).length, icon: <TrendingDown className="w-5 h-5 text-red-400" />, bg: "bg-red-500/15" },
        ].map((m) => (
          <div key={m.label} className="bg-[#16161A] border border-[#1E1E24] rounded-2xl p-5">
            <div className="flex items-start justify-between mb-3">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">{m.label}</p>
              <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center", m.bg)}>{m.icon}</div>
            </div>
            <p className="text-2xl font-bold text-white">{m.value}</p>
          </div>
        ))}
      </div>
      <div className="bg-[#16161A] border border-[#1E1E24] rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-[#1E1E24]">
          <h2 className="text-base font-semibold text-white">Performance Rankings</h2>
        </div>
        <div className="divide-y divide-[#1E1E24]">
          {sorted.map((e, i) => (
            <div key={e.id} className="flex items-center gap-5 px-6 py-4 hover:bg-[#1E1E24]/40 transition-colors">
              <span className={cn("text-sm font-bold w-5 text-center flex-shrink-0", i === 0 ? "text-yellow-400" : i === 1 ? "text-gray-300" : i === 2 ? "text-orange-400" : "text-gray-600")}>
                {i + 1}
              </span>
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                {e.name.split(" ").map((n) => n[0]).join("")}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white">{e.name}</p>
                <p className="text-xs text-gray-400">{e.role} · {e.department}</p>
              </div>
              <Badge variant={ratingVariant(e.performance || 0)}>{ratingLabel(e.performance || 0)}</Badge>
              <div className="flex items-center gap-3 w-48 flex-shrink-0">
                <div className="flex-1 h-2 bg-[#111114] rounded-full overflow-hidden">
                  <div
                    className={cn("h-full rounded-full", (e.performance || 0) >= 90 ? "bg-green-500" : (e.performance || 0) >= 75 ? "bg-yellow-500" : "bg-red-500")}
                    style={{ width: `${e.performance}%` }}
                  />
                </div>
                <span className="text-sm font-bold text-white w-10 text-right">{e.performance}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
