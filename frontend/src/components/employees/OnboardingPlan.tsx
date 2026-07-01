"use client";
import { useState } from "react";
import { CheckCircle, Circle, Calendar, Users, BookOpen, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import type { OnboardingTask } from "@/types";

const durations = [30, 60, 90] as const;
type Duration = (typeof durations)[number];

interface OnboardingPlanProps {
  employeeName: string;
  startDate: string;
  tasks: OnboardingTask[];
  onToggleTask?: (taskId: string) => void;
}

const categoryIcon: Record<string, React.ReactNode> = {
  setup: <Star className="w-3.5 h-3.5" />,
  training: <BookOpen className="w-3.5 h-3.5" />,
  meet: <Users className="w-3.5 h-3.5" />,
  review: <Calendar className="w-3.5 h-3.5" />,
};

const categoryColor: Record<string, string> = {
  setup: "text-purple-400 bg-purple-500/10",
  training: "text-blue-400 bg-blue-500/10",
  meet: "text-green-400 bg-green-500/10",
  review: "text-yellow-400 bg-yellow-500/10",
};

const dayGroups = [
  { label: "Week 1 (Days 1-7)", days: [1, 2, 3, 4, 5, 6, 7] },
  { label: "Month 1 (Days 8-30)", days: Array.from({ length: 23 }, (_, i) => i + 8) },
  { label: "Month 2-3 (Days 31-90)", days: Array.from({ length: 60 }, (_, i) => i + 31) },
];

export function OnboardingPlan({ employeeName, startDate, tasks, onToggleTask }: OnboardingPlanProps) {
  const [duration, setDuration] = useState<Duration>(90);

  const planTasks = tasks.filter((t) => t.day <= duration);
  const completed = planTasks.filter((t) => t.completed).length;
  const progress = planTasks.length ? Math.round((completed / planTasks.length) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">{employeeName}&apos;s {duration}-Day Plan</h3>
          <p className="text-sm text-gray-400">Starting {startDate}</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-white">{progress}%</p>
          <p className="text-xs text-gray-400">{completed}/{planTasks.length} tasks</p>
        </div>
      </div>
      <div className="inline-flex items-center gap-1 p-1 bg-[#111114] border border-[#1E1E24] rounded-xl">
        {durations.map((d) => (
          <button
            key={d}
            onClick={() => setDuration(d)}
            className={cn(
              "px-4 py-1.5 text-sm font-medium rounded-lg transition-colors",
              duration === d ? "bg-purple-500 text-white" : "text-gray-400 hover:text-white"
            )}
          >
            {d} Days
          </button>
        ))}
      </div>
      <div className="h-2 bg-[#111114] rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
      </div>
      {dayGroups.map((group) => {
        const groupTasks = planTasks.filter((t) => group.days.includes(t.day));
        if (groupTasks.length === 0) return null;
        return (
          <div key={group.label}>
            <h4 className="text-sm font-semibold text-gray-300 mb-3">{group.label}</h4>
            <div className="space-y-2">
              {groupTasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => onToggleTask?.(task.id)}
                  className={cn("flex items-start gap-3 p-3 rounded-xl border transition-colors cursor-pointer", task.completed ? "bg-green-500/5 border-green-500/20" : "bg-[#111114] border-[#1E1E24] hover:border-purple-500/30")}
                >
                  {task.completed ? <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" /> : <Circle className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className={cn("text-sm font-medium", task.completed ? "text-gray-400 line-through" : "text-white")}>{task.title}</p>
                      <span className={cn("inline-flex items-center gap-1 text-xs px-1.5 py-0.5 rounded-md", categoryColor[task.category])}>
                        {categoryIcon[task.category]} {task.category}
                      </span>
                    </div>
                    {task.description && <p className="text-xs text-gray-500 mt-0.5">{task.description}</p>}
                    <p className="text-xs text-gray-600 mt-0.5">Day {task.day}{task.assignee ? ` · ${task.assignee}` : ""}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
