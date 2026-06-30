"use client";
import { cn } from "@/lib/utils";
import type { WorkflowStep } from "@/types";

interface WorkflowCanvasProps { steps: WorkflowStep[]; }

const stepStyle: Record<string, { bg: string; text: string; border: string; icon: string }> = {
  trigger: { bg: "bg-green-500/10", text: "text-green-400", border: "border-green-500/30", icon: "⚡" },
  condition: { bg: "bg-yellow-500/10", text: "text-yellow-400", border: "border-yellow-500/30", icon: "◇" },
  action: { bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/30", icon: "▶" },
  ai: { bg: "bg-purple-500/10", text: "text-purple-400", border: "border-purple-500/30", icon: "✦" },
  notification: { bg: "bg-orange-500/10", text: "text-orange-400", border: "border-orange-500/30", icon: "🔔" },
};

export function WorkflowCanvas({ steps }: WorkflowCanvasProps) {
  return (
    <div className="flex items-start gap-0 overflow-x-auto pb-2">
      {steps.map((step, i) => {
        const style = stepStyle[step.type] || stepStyle.action;
        return (
          <div key={step.id} className="flex items-center flex-shrink-0">
            <div className={cn("rounded-2xl border px-4 py-3 min-w-[120px] text-center", style.bg, style.border)}>
              <div className="text-lg mb-1">{style.icon}</div>
              <p className={cn("text-xs font-semibold uppercase tracking-wider mb-1", style.text)}>{step.type}</p>
              <p className="text-xs text-white font-medium">{step.label}</p>
            </div>
            {i < steps.length - 1 && (
              <div className="flex items-center px-1 flex-shrink-0">
                <div className="w-6 h-px bg-[#1E1E24]" />
                <div className="w-0 h-0 border-t-4 border-b-4 border-l-4 border-transparent border-l-[#1E1E24]" />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
