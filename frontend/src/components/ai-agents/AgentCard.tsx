"use client";
import { Bot, Zap, CheckCircle, AlertCircle, Clock, Activity } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import type { AIAgent } from "@/types";

interface AgentCardProps { agent: AIAgent; onToggle?: (id: string) => void; }

const typeColor: Record<string, string> = {
  screening: "text-purple-400 bg-purple-500/10",
  onboarding: "text-blue-400 bg-blue-500/10",
  analytics: "text-green-400 bg-green-500/10",
  engagement: "text-yellow-400 bg-yellow-500/10",
  compliance: "text-orange-400 bg-orange-500/10",
};

const statusIcon: Record<string, React.ReactNode> = {
  active: <CheckCircle className="w-3.5 h-3.5 text-green-400" />,
  idle: <Clock className="w-3.5 h-3.5 text-gray-400" />,
  training: <Activity className="w-3.5 h-3.5 text-purple-400" />,
  error: <AlertCircle className="w-3.5 h-3.5 text-red-400" />,
};

const statusVariant: Record<string, "success" | "default" | "purple" | "error"> = {
  active: "success", idle: "default", training: "purple", error: "error"
};

export function AgentCard({ agent: a, onToggle }: AgentCardProps) {
  return (
    <div className="bg-[#16161A] border border-[#1E1E24] rounded-2xl p-5 hover:border-purple-500/30 transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3">
          <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0", typeColor[a.type])}>
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">{a.name}</h3>
            <span className={cn("text-xs px-2 py-0.5 rounded-full", typeColor[a.type])}>{a.type}</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          {statusIcon[a.status]}
          <Badge variant={statusVariant[a.status]}>{a.status}</Badge>
        </div>
      </div>
      <p className="text-xs text-gray-400 mb-4 line-clamp-2">{a.description}</p>
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-[#111114] rounded-xl p-3 text-center">
          <p className="text-base font-bold text-white">{a.tasksCompleted.toLocaleString()}</p>
          <p className="text-xs text-gray-500">Tasks</p>
        </div>
        <div className="bg-[#111114] rounded-xl p-3 text-center">
          <p className="text-base font-bold text-green-400">{a.accuracy}%</p>
          <p className="text-xs text-gray-500">Accuracy</p>
        </div>
        <div className="bg-[#111114] rounded-xl p-3 text-center">
          <p className="text-xs font-medium text-gray-300 truncate">{a.lastRun || "Never"}</p>
          <p className="text-xs text-gray-500">Last Run</p>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500 flex items-center gap-1"><Zap className="w-3 h-3" />{a.model}</span>
        <div className="flex gap-2">
          <Button size="sm" variant="outline">Configure</Button>
          <Button size="sm" variant={a.status === "active" ? "danger" : "primary"} onClick={() => onToggle?.(a.id)}>
            {a.status === "active" ? "Pause" : "Activate"}
          </Button>
        </div>
      </div>
    </div>
  );
}
