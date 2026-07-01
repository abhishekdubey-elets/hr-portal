"use client";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import { Plus, Users, Video, Wand2 } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useStore } from "@/store";
import { generateId } from "@/lib/utils";

interface Initial {
  candidate?: string;
  role?: string;
  type?: string;
  candidateId?: string;
  meetingLink?: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  initial?: Initial;
  onScheduled?: () => void;
}

const empty = { candidate: "", role: "", date: "", time: "", duration: "60", type: "video", interviewers: "", meetingLink: "" };

const VIRTUAL_TYPES = ["video", "technical"];

function to12h(t: string) {
  if (!t) return "";
  const [h, m] = t.split(":").map(Number);
  const ap = h >= 12 ? "PM" : "AM";
  const hh = ((h + 11) % 12) + 1;
  return `${hh}:${String(m).padStart(2, "0")} ${ap}`;
}

function randomMeetLink() {
  const seg = (n: number) => Math.random().toString(36).replace(/[^a-z]/g, "").padEnd(n, "x").slice(0, n);
  return `https://meet.google.com/${seg(3)}-${seg(4)}-${seg(3)}`;
}

const selectClass =
  "w-full rounded-xl border border-[#26262e] bg-[#111114] px-4 py-2.5 text-sm text-white outline-none transition-colors focus:border-[#8B5CF6]/70 focus:ring-4 focus:ring-[#8B5CF6]/12";

export function ScheduleInterviewModal({ open, onClose, initial, onScheduled }: Props) {
  const addInterview = useStore((s) => s.addInterview);
  const updateCandidate = useStore((s) => s.updateCandidate);
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  // Prefill when opened from a candidate
  useEffect(() => {
    if (open) {
      setForm({
        ...empty,
        candidate: initial?.candidate ?? "",
        role: initial?.role ?? "",
        type: initial?.type ?? "video",
        meetingLink: initial?.meetingLink ?? "",
      });
      setErrors({});
    }
  }, [open, initial?.candidate, initial?.role, initial?.type, initial?.meetingLink]);

  const set = (key: keyof typeof empty, value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: false }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const next: Record<string, boolean> = {
      candidate: !form.candidate.trim(),
      role: !form.role.trim(),
      date: !form.date,
      time: !form.time,
    };
    if (Object.values(next).some(Boolean)) {
      setErrors(next);
      return;
    }

    const when = `${format(new Date(`${form.date}T00:00:00`), "MMM d")}, ${to12h(form.time)}`;
    const isVirtual = VIRTUAL_TYPES.includes(form.type);
    addInterview({
      id: generateId(),
      candidate: form.candidate.trim(),
      role: form.role.trim(),
      time: when,
      duration: `${form.duration} min`,
      type: form.type,
      interviewers: form.interviewers
        ? form.interviewers.split(",").map((s) => s.trim()).filter(Boolean)
        : ["Unassigned"],
      status: "scheduled",
      candidateId: initial?.candidateId,
      meetingLink: isVirtual ? form.meetingLink.trim() || undefined : undefined,
    });

    // Move the candidate into the Interview stage on the pipeline board.
    if (initial?.candidateId) updateCandidate(initial.candidateId, { stage: "interview" });

    toast.success("Interview scheduled", { description: `${form.candidate.trim()} · ${when}` });
    onClose();
    onScheduled?.();
  };

  return (
    <Modal open={open} onClose={onClose} title="Schedule Interview" description="Set up an interview and add it to your upcoming schedule." size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input label="Candidate" placeholder="e.g. Jane Smith" value={form.candidate} onChange={(e) => set("candidate", e.target.value)} error={errors.candidate ? "Required" : undefined} />
          <Input label="Role" placeholder="e.g. Senior Frontend Engineer" value={form.role} onChange={(e) => set("role", e.target.value)} error={errors.role ? "Required" : undefined} />
          <Input label="Date" type="date" value={form.date} onChange={(e) => set("date", e.target.value)} error={errors.date ? "Required" : undefined} />
          <Input label="Time" type="time" value={form.time} onChange={(e) => set("time", e.target.value)} error={errors.time ? "Required" : undefined} />
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-300">Duration</label>
            <select value={form.duration} onChange={(e) => set("duration", e.target.value)} className={selectClass}>
              {["30", "45", "60", "90"].map((d) => <option key={d} value={d}>{d} minutes</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-300">Type</label>
            <select value={form.type} onChange={(e) => set("type", e.target.value)} className={selectClass}>
              {["video", "phone", "technical", "onsite"].map((t) => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
            </select>
          </div>
        </div>
        <Input label="Interviewers" placeholder="Comma-separated, e.g. Alex Kim, Raj Patel" prefixIcon={<Users className="h-4 w-4" />} value={form.interviewers} onChange={(e) => set("interviewers", e.target.value)} hint="Leave blank to assign later." />

        {VIRTUAL_TYPES.includes(form.type) && (
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label className="text-sm font-medium text-gray-300">Meeting Link</label>
              <button
                type="button"
                onClick={() => set("meetingLink", randomMeetLink())}
                className="flex items-center gap-1 text-xs font-medium text-[#a78bfa] transition-colors hover:text-[#c4b5fd]"
              >
                <Wand2 className="h-3 w-3" /> Generate
              </button>
            </div>
            <Input
              placeholder="https://meet.google.com/…"
              prefixIcon={<Video className="h-4 w-4" />}
              value={form.meetingLink}
              onChange={(e) => set("meetingLink", e.target.value)}
              hint="Attached to the Join button. Leave blank to add later."
            />
          </div>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="gradient" leftIcon={<Plus className="h-4 w-4" />}>Schedule</Button>
        </div>
      </form>
    </Modal>
  );
}
