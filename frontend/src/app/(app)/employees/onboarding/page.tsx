"use client";
import { useState } from "react";
import { Plus, Sparkles } from "lucide-react";
import { OnboardingPlan } from "@/components/employees/OnboardingPlan";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import type { OnboardingTask } from "@/types";

const mockPlan = {
  employeeName: "Priya Patel",
  startDate: "July 1, 2024",
  tasks: [
    { id: "t1", title: "IT setup & account provisioning", description: "Laptop, email, Slack, GitHub access", category: "setup" as const, day: 1, completed: true },
    { id: "t2", title: "Meet your manager (1:1)", description: "Goals, expectations, working style", category: "meet" as const, day: 1, completed: true },
    { id: "t3", title: "Company culture & values session", description: "1hr with HR team", category: "training" as const, day: 2, completed: true },
    { id: "t4", title: "Product overview walkthrough", description: "Deep dive with Product team lead", category: "training" as const, day: 3, completed: false },
    { id: "t5", title: "Meet the Marketing team", description: "Team lunch & intro calls", category: "meet" as const, day: 4, completed: false },
    { id: "t6", title: "Complete compliance training", description: "Security, GDPR, HR policies", category: "training" as const, day: 7, completed: false },
    { id: "t7", title: "30-day check-in with manager", description: "Progress review and feedback", category: "review" as const, day: 30, completed: false },
    { id: "t8", title: "First project milestone review", description: "Present initial deliverables", category: "review" as const, day: 45, completed: false },
    { id: "t9", title: "Peer feedback collection", description: "360 feedback from team members", category: "review" as const, day: 60, completed: false },
    { id: "t10", title: "90-day performance review", description: "Formal review with manager & HR", category: "review" as const, day: 90, completed: false },
  ] as OnboardingTask[],
};

const newHires = [
  { name: "Priya Patel", role: "Marketing Manager", start: "Jul 1, 2024", progress: 30 },
  { name: "Alex Turner", role: "Backend Engineer", start: "Jul 8, 2024", progress: 10 },
  { name: "Bella Martinez", role: "UX Designer", start: "Jul 15, 2024", progress: 0 },
];

export default function OnboardingPage() {
  const [tasks, setTasks] = useState(mockPlan.tasks);
  const [selected, setSelected] = useState("Priya Patel");

  const toggleTask = (id: string) => {
    setTasks((prev) => prev.map((t) => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Onboarding</h1>
          <p className="text-gray-400 mt-0.5">AI-generated 90-day plans for new hires</p>
        </div>
        <Button leftIcon={<Plus className="w-4 h-4" />}>Add New Hire</Button>
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">New Hires</h2>
          {newHires.map((h) => (
            <button key={h.name} onClick={() => setSelected(h.name)} className={`w-full text-left p-4 rounded-2xl border transition-colors ${selected === h.name ? "bg-purple-500/10 border-purple-500/30" : "bg-[#16161A] border-[#1E1E24] hover:border-purple-500/20"}`}>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-xs font-bold text-white">
                  {h.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-white truncate">{h.name}</p>
                  <p className="text-xs text-gray-400 truncate">{h.role}</p>
                </div>
              </div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-500">Progress</span>
                <span className="text-xs font-medium text-white">{h.progress}%</span>
              </div>
              <div className="h-1.5 bg-[#111114] rounded-full overflow-hidden">
                <div className="h-full bg-purple-500 rounded-full" style={{ width: `${h.progress}%` }} />
              </div>
            </button>
          ))}
          <button className="w-full p-4 rounded-2xl border-2 border-dashed border-[#1E1E24] text-gray-500 text-sm hover:border-purple-500/30 hover:text-purple-400 transition-colors flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4" /> Generate AI Plan
          </button>
        </div>
        <div className="xl:col-span-3 bg-[#16161A] border border-[#1E1E24] rounded-2xl p-6">
          {selected ? (
            <OnboardingPlan
              employeeName={mockPlan.employeeName}
              startDate={mockPlan.startDate}
              tasks={tasks}
              onToggleTask={toggleTask}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <p className="text-gray-400">Select a new hire to view their onboarding plan</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
