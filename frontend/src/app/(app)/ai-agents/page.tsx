"use client";
import { useEffect, useState } from "react";
import { Bot, Zap, CheckCircle, TrendingUp } from "lucide-react";
import { AgentCard } from "@/components/ai-agents/AgentCard";
import { getAgents } from "@/lib/api";
import { Skeleton } from "@/components/ui/Skeleton";
import type { AIAgent } from "@/types";

export default function AIAgentsPage() {
  const [agents, setAgents] = useState<AIAgent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAgents().then((data) => { setAgents(data); setLoading(false); });
  }, []);

  const activeCount = agents.filter((a) => a.status === "active").length;
  const totalTasks = agents.reduce((s, a) => s + a.tasksCompleted, 0);
  const avgAccuracy = agents.reduce((s, a) => s + a.accuracy, 0) / (agents.length || 1);

  const toggleAgent = (id: string) => {
    setAgents((prev) => prev.map((a) => a.id === id ? { ...a, status: a.status === "active" ? "idle" : "active" } : a));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">AI Agents</h1>
        <p className="text-gray-400 mt-0.5">Intelligent automation powered by Claude</p>
      </div>
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label: "Active Agents", value: activeCount, icon: <Bot className="w-5 h-5 text-purple-400" />, bg: "bg-purple-500/15" },
          { label: "Total Agents", value: agents.length, icon: <Zap className="w-5 h-5 text-blue-400" />, bg: "bg-blue-500/15" },
          { label: "Tasks Completed", value: totalTasks.toLocaleString(), icon: <CheckCircle className="w-5 h-5 text-green-400" />, bg: "bg-green-500/15" },
          { label: "Avg Accuracy", value: `${avgAccuracy.toFixed(1)}%`, icon: <TrendingUp className="w-5 h-5 text-yellow-400" />, bg: "bg-yellow-500/15" },
        ].map((m) => (
          <div key={m.label} className="bg-[#16161A] border border-[#1E1E24] rounded-2xl p-5">
            <div className="flex items-start justify-between mb-3">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">{m.label}</p>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${m.bg}`}>{m.icon}</div>
            </div>
            <p className="text-2xl font-bold text-white">{m.value}</p>
          </div>
        ))}
      </div>
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-56" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {agents.map((a) => <AgentCard key={a.id} agent={a} onToggle={toggleAgent} />)}
        </div>
      )}
    </div>
  );
}
