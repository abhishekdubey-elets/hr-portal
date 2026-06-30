"use client";
import { useEffect, useState } from "react";
import { Play, Pause, Plus, GitBranch, CheckCircle, Activity } from "lucide-react";
import { WorkflowCanvas } from "@/components/workflows/WorkflowCanvas";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { getWorkflows } from "@/lib/api";
import { Skeleton } from "@/components/ui/Skeleton";
import type { Workflow } from "@/types";

const statusVariant: Record<string, "success" | "warning" | "default"> = {
  active: "success", paused: "warning", draft: "default"
};

export default function WorkflowsPage() {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    getWorkflows().then((data) => { setWorkflows(data); setLoading(false); });
  }, []);

  const toggleStatus = (id: string) => {
    setWorkflows((prev) => prev.map((w) => w.id === id ? { ...w, status: w.status === "active" ? "paused" : "active" } : w));
  };

  const activeCount = workflows.filter((w) => w.status === "active").length;
  const totalRuns = workflows.reduce((s, w) => s + w.runsTotal, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Workflows</h1>
          <p className="text-gray-400 mt-0.5">Automate HR processes with AI-powered pipelines</p>
        </div>
        <Button leftIcon={<Plus className="w-4 h-4" />}>New Workflow</Button>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label: "Active", value: activeCount, icon: <Activity className="w-5 h-5 text-green-400" />, bg: "bg-green-500/15" },
          { label: "Total Workflows", value: workflows.length, icon: <GitBranch className="w-5 h-5 text-purple-400" />, bg: "bg-purple-500/15" },
          { label: "Total Runs", value: totalRuns, icon: <CheckCircle className="w-5 h-5 text-blue-400" />, bg: "bg-blue-500/15" },
          { label: "Avg Steps", value: workflows.length ? Math.round(workflows.reduce((s, w) => s + w.steps.length, 0) / workflows.length) : 0, icon: <GitBranch className="w-5 h-5 text-yellow-400" />, bg: "bg-yellow-500/15" },
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
        <div className="space-y-4">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-32" />)}</div>
      ) : (
        <div className="space-y-4">
          {workflows.map((w) => (
            <div key={w.id} className="bg-[#16161A] border border-[#1E1E24] rounded-2xl overflow-hidden">
              <div className="flex items-center gap-5 p-5">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                  <GitBranch className="w-5 h-5 text-purple-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="text-sm font-semibold text-white">{w.name}</h3>
                    <Badge variant={statusVariant[w.status] || "default"} dot>{w.status}</Badge>
                  </div>
                  <p className="text-xs text-gray-400">{w.description}</p>
                  <div className="flex items-center gap-4 mt-1">
                    <span className="text-xs text-gray-500">Trigger: <span className="text-gray-300">{w.trigger}</span></span>
                    <span className="text-xs text-gray-500">{w.runsTotal} runs</span>
                    {w.lastRun && <span className="text-xs text-gray-500">Last: {w.lastRun}</span>}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setExpanded(expanded === w.id ? null : w.id)}
                  >
                    {expanded === w.id ? "Hide" : "View"} Steps
                  </Button>
                  <Button
                    size="sm"
                    variant={w.status === "active" ? "outline" : "primary"}
                    leftIcon={w.status === "active" ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    onClick={() => toggleStatus(w.id)}
                  >
                    {w.status === "active" ? "Pause" : "Activate"}
                  </Button>
                </div>
              </div>
              {expanded === w.id && (
                <div className="px-5 pb-5 border-t border-[#1E1E24] pt-4">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Pipeline Steps</p>
                  <WorkflowCanvas steps={w.steps} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
