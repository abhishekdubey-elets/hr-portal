"use client";
import { useState } from "react";
import { toast } from "sonner";
import { Video, FileText, RefreshCw, CheckCircle, Clock, Plus } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs";
import { Modal } from "@/components/ui/Modal";
import { ScheduleInterviewModal } from "@/components/recruitment/ScheduleInterviewModal";
import { InterviewKit } from "@/components/recruitment/InterviewKit";
import { useStore } from "@/store";
import { useHydrated } from "@/hooks/useHydrated";
import type { ScheduledInterview } from "@/types";

const seedInterviews: ScheduledInterview[] = [
  { id: "i1", candidate: "Sarah Chen", role: "Senior Frontend Engineer", time: "Today, 2:00 PM", duration: "60 min", type: "video", interviewers: ["Alex Kim"], status: "scheduled", meetingLink: "https://meet.google.com/abc-defg-hij" },
  { id: "i2", candidate: "Marcus Rodriguez", role: "Product Designer", time: "Today, 4:00 PM", duration: "45 min", type: "video", interviewers: ["Jamie Lee", "Chris Park"], status: "scheduled", meetingLink: "https://meet.google.com/klm-nopq-rst" },
  { id: "i3", candidate: "Emily Johnson", role: "Data Scientist", time: "Tomorrow, 10:00 AM", duration: "90 min", type: "technical", interviewers: ["Sam Torres"], status: "scheduled" },
  { id: "i4", candidate: "David Kim", role: "Backend Engineer", time: "Jun 28, 11:00 AM", duration: "60 min", type: "video", interviewers: ["Alex Kim", "Raj Patel"], status: "completed" },
  { id: "i5", candidate: "Priya Patel", role: "DevOps Engineer", time: "Jun 27, 3:00 PM", duration: "45 min", type: "phone", interviewers: ["Morgan Lee"], status: "completed" },
  { id: "i6", candidate: "James Wilson", role: "Marketing Manager", time: "Jun 26, 1:00 PM", duration: "30 min", type: "phone", interviewers: ["Taylor Smith"], status: "cancelled" },
];

const typeColor: Record<string, string> = {
  video: "text-blue-400 bg-blue-500/10", technical: "text-purple-400 bg-purple-500/10",
  phone: "text-green-400 bg-green-500/10", onsite: "text-yellow-400 bg-yellow-500/10",
};
const statusVariant: Record<string, "success" | "info" | "error"> = { completed: "success", scheduled: "info", cancelled: "error" };

export default function InterviewsPage() {
  const [tab, setTab] = useState("upcoming");
  const [modalOpen, setModalOpen] = useState(false);
  const [initial, setInitial] = useState<{ candidate?: string; role?: string; type?: string; meetingLink?: string } | undefined>();
  const [kitFor, setKitFor] = useState<ScheduledInterview | null>(null);
  const stored = useStore((s) => s.interviews);
  const hydrated = useHydrated();

  // Store-scheduled interviews (newest) first, then the sample data.
  // Gate the persisted list until after hydration to avoid an SSR mismatch.
  const interviews = [...(hydrated ? stored : []), ...seedInterviews];
  const upcoming = interviews.filter((i) => i.status === "scheduled");
  const completed = interviews.filter((i) => i.status === "completed");
  const cancelled = interviews.filter((i) => i.status === "cancelled");

  const openSchedule = (init?: typeof initial) => {
    setInitial(init);
    setModalOpen(true);
  };

  const renderList = (list: ScheduledInterview[]) =>
    list.length === 0 ? (
      <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-white/[0.08] py-16 text-center">
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#8B5CF6]/10">
          <Clock className="h-6 w-6 text-[#a78bfa]" />
        </div>
        <p className="font-semibold text-white">No interviews here</p>
        <p className="mt-0.5 text-sm text-gray-400">Schedule an interview to see it appear in this list.</p>
      </div>
    ) : (
      <div className="space-y-3">
        {list.map((iv) => (
          <div key={iv.id} className="group flex items-center gap-5 rounded-3xl border border-white/[0.06] bg-[#16161A]/90 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-white/10 hover:shadow-lg">
            <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#7C3AED] to-[#3B82F6] text-sm font-bold text-white">
              {iv.candidate.split(" ").map((n) => n[0]).join("")}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-white">{iv.candidate}</h3>
                <Badge variant={statusVariant[iv.status] || "default"} dot>{iv.status}</Badge>
              </div>
              <p className="text-xs text-gray-400">{iv.role}</p>
              <div className="mt-1 flex items-center gap-3">
                <span className="flex items-center gap-1 text-xs text-gray-500"><Clock className="h-3 w-3" />{iv.time} · {iv.duration}</span>
                <span className={`rounded-full px-2 py-0.5 text-xs ${typeColor[iv.type] || "text-gray-400 bg-gray-500/10"}`}>{iv.type}</span>
              </div>
              <p className="mt-0.5 text-xs text-gray-500">Interviewers: {iv.interviewers.join(", ")}</p>
            </div>
            <div className="flex items-center gap-2">
              {iv.status === "scheduled" && (
                <Button
                  size="sm"
                  leftIcon={<Video className="h-3.5 w-3.5" />}
                  onClick={() => {
                    if (iv.meetingLink) {
                      window.open(iv.meetingLink, "_blank", "noopener,noreferrer");
                    } else {
                      toast("No meeting link yet", { description: "Add one via Reschedule to enable Join." });
                    }
                  }}
                >
                  Join
                </Button>
              )}
              <Button size="sm" variant="outline" leftIcon={<FileText className="h-3.5 w-3.5" />} onClick={() => setKitFor(iv)}>Kit</Button>
              {iv.status === "scheduled" && <Button size="sm" variant="ghost" leftIcon={<RefreshCw className="h-3.5 w-3.5" />} onClick={() => openSchedule({ candidate: iv.candidate, role: iv.role, type: iv.type, meetingLink: iv.meetingLink })}>Reschedule</Button>}
              {iv.status === "completed" && <Button size="sm" variant="ghost" leftIcon={<CheckCircle className="h-3.5 w-3.5 text-green-400" />} onClick={() => toast("Opening scorecard…", { description: iv.candidate })}>Review</Button>}
            </div>
          </div>
        ))}
      </div>
    );

  return (
    <div className="space-y-6 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Interviews</h1>
          <p className="mt-0.5 text-gray-400">{upcoming.length} upcoming · {completed.length} completed</p>
        </div>
        <Button variant="gradient" leftIcon={<Plus className="h-4 w-4" />} onClick={() => openSchedule(undefined)}>
          Schedule Interview
        </Button>
      </div>

      <Tabs defaultValue="upcoming" value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming ({upcoming.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({completed.length})</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled ({cancelled.length})</TabsTrigger>
        </TabsList>
        <div className="mt-4">
          <TabsContent value="upcoming">{renderList(upcoming)}</TabsContent>
          <TabsContent value="completed">{renderList(completed)}</TabsContent>
          <TabsContent value="cancelled">{renderList(cancelled)}</TabsContent>
        </div>
      </Tabs>

      <ScheduleInterviewModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        initial={initial}
        onScheduled={() => setTab("upcoming")}
      />

      <Modal
        open={!!kitFor}
        onClose={() => setKitFor(null)}
        title={kitFor ? `Interview Kit — ${kitFor.candidate}` : "Interview Kit"}
        description="Structured questions, timing, and evaluation guidance for this interview."
        size="xl"
      >
        <div className="-mr-2 max-h-[65vh] overflow-y-auto pr-2 scrollbar-thin">
          {kitFor && <InterviewKit role={kitFor.role} />}
        </div>
      </Modal>
    </div>
  );
}
