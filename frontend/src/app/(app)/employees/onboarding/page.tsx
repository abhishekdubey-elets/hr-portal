"use client";
import { useState } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import { Plus, Sparkles } from "lucide-react";
import { OnboardingPlan } from "@/components/employees/OnboardingPlan";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Skeleton } from "@/components/ui/Skeleton";
import { generateOnboardingPlan } from "@/lib/api";
import { generateId } from "@/lib/utils";
import type { OnboardingTask } from "@/types";

const mockPlan = {
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

interface Hire { name: string; role: string; start: string; progress: number }

const seedHires: Hire[] = [
  { name: "Priya Patel", role: "Marketing Manager", start: "Jul 1, 2024", progress: 30 },
  { name: "Alex Turner", role: "Backend Engineer", start: "Jul 8, 2024", progress: 10 },
  { name: "Bella Martinez", role: "UX Designer", start: "Jul 15, 2024", progress: 0 },
];

const emptyForm = { name: "", role: "", start: "" };

export default function OnboardingPage() {
  const [hires, setHires] = useState<Hire[]>(seedHires);
  const [tasks, setTasks] = useState(mockPlan.tasks);
  const [selected, setSelected] = useState("Priya Patel");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [generating, setGenerating] = useState(false);

  const selectedHire = hires.find((h) => h.name === selected);

  const toggleTask = (id: string) =>
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));

  const allowedCategories = ["setup", "training", "meet", "review"] as const;

  const handleGeneratePlan = async () => {
    if (!selectedHire) {
      toast.error("Select a new hire first");
      return;
    }
    setGenerating(true);
    const t = toast.loading(`Generating a 90-day plan for ${selectedHire.name}…`, {
      description: "Your local model is drafting the onboarding tasks.",
    });
    try {
      const dto = await generateOnboardingPlan(selectedHire.name, selectedHire.role);
      if (dto.length === 0) throw new Error("The model returned no tasks. Try again.");
      const generated: OnboardingTask[] = dto.map((d) => ({
        id: `ai-${generateId()}`,
        title: d.title,
        description: d.description,
        category: (allowedCategories.includes(d.category as (typeof allowedCategories)[number])
          ? d.category
          : "training") as OnboardingTask["category"],
        day: d.day,
        completed: false,
      }));
      setTasks(generated);
      toast.success(`Onboarding plan generated`, { id: t, description: `${generated.length} tasks for ${selectedHire.name}` });
    } catch (err) {
      toast.error("Couldn't generate plan", {
        id: t,
        description: err instanceof Error ? err.message : "Please try again.",
      });
    } finally {
      setGenerating(false);
    }
  };

  const set = (key: keyof typeof emptyForm, value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: false }));
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const next = { name: !form.name.trim(), role: !form.role.trim(), start: !form.start };
    if (Object.values(next).some(Boolean)) {
      setErrors(next);
      return;
    }
    const startLabel = format(new Date(`${form.start}T00:00:00`), "MMM d, yyyy");
    const hire: Hire = { name: form.name.trim(), role: form.role.trim(), start: startLabel, progress: 0 };
    setHires((prev) => [hire, ...prev]);
    setSelected(hire.name);
    setForm(emptyForm);
    setErrors({});
    setOpen(false);
    toast.success("New hire added", { description: `${hire.name} · starts ${startLabel}` });
  };

  return (
    <div className="space-y-6 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Onboarding</h1>
          <p className="mt-0.5 text-gray-400">AI-generated 90-day plans for new hires</p>
        </div>
        <Button variant="gradient" leftIcon={<Plus className="h-4 w-4" />} onClick={() => setOpen(true)}>
          Add New Hire
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-4">
        <div className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-400">New Hires</h2>
          {hires.map((h) => (
            <button
              key={h.name}
              onClick={() => setSelected(h.name)}
              className={`w-full rounded-2xl border p-4 text-left transition-all duration-200 ${selected === h.name ? "border-[#8B5CF6]/30 bg-[#8B5CF6]/10" : "border-white/[0.06] bg-[#16161A]/90 hover:-translate-y-0.5 hover:border-white/10"}`}
            >
              <div className="mb-2 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#7C3AED] to-[#3B82F6] text-xs font-bold text-white">
                  {h.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-white">{h.name}</p>
                  <p className="truncate text-xs text-gray-400">{h.role}</p>
                </div>
              </div>
              <div className="mb-1 flex items-center justify-between">
                <span className="text-xs text-gray-500">Progress</span>
                <span className="text-xs font-medium text-white">{h.progress}%</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-[#111114]">
                <div className="h-full rounded-full bg-gradient-to-r from-[#7C3AED] to-[#3B82F6] transition-all duration-500" style={{ width: `${h.progress}%` }} />
              </div>
            </button>
          ))}
          <button
            onClick={handleGeneratePlan}
            disabled={generating || !selectedHire}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-white/[0.08] p-4 text-sm text-gray-500 transition-colors hover:border-[#8B5CF6]/30 hover:text-[#a78bfa] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Sparkles className={`h-4 w-4 ${generating ? "animate-pulse" : ""}`} />
            {generating ? "Generating…" : selectedHire ? `Generate AI Plan for ${selectedHire.name.split(" ")[0]}` : "Generate AI Plan"}
          </button>
        </div>

        <div className="rounded-3xl border border-white/[0.06] bg-[#16161A]/90 p-6 xl:col-span-3">
          {generating ? (
            <div className="space-y-5">
              <div className="flex items-center gap-2 text-sm text-[#a78bfa]">
                <Sparkles className="h-4 w-4 animate-pulse" />
                Drafting a personalized 90-day plan with your local model…
              </div>
              <div className="space-y-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="flex items-start gap-3 rounded-xl border border-white/[0.05] bg-[#111114] p-3">
                    <Skeleton variant="circle" className="h-5 w-5" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-3.5 w-2/3" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : selectedHire ? (
            <OnboardingPlan
              employeeName={selectedHire.name}
              startDate={selectedHire.start}
              tasks={tasks}
              onToggleTask={toggleTask}
            />
          ) : (
            <div className="flex h-64 flex-col items-center justify-center text-center">
              <p className="text-gray-400">Select a new hire to view their onboarding plan</p>
            </div>
          )}
        </div>
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Add New Hire" description="Create an onboarding record and generate a 90-day plan." size="md">
        <form onSubmit={handleAdd} className="space-y-4">
          <Input label="Full name" placeholder="e.g. Jordan Lee" value={form.name} onChange={(e) => set("name", e.target.value)} error={errors.name ? "Required" : undefined} />
          <Input label="Role" placeholder="e.g. Product Manager" value={form.role} onChange={(e) => set("role", e.target.value)} error={errors.role ? "Required" : undefined} />
          <Input label="Start date" type="date" value={form.start} onChange={(e) => set("start", e.target.value)} error={errors.start ? "Required" : undefined} />
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" variant="gradient" leftIcon={<Plus className="h-4 w-4" />}>Add Hire</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
