"use client";
import { useState } from "react";
import { Video, FileText, RefreshCw, CheckCircle, Clock } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs";

const interviews = [
  { id: "i1", candidate: "Sarah Chen", role: "Senior Frontend Engineer", time: "Today, 2:00 PM", duration: "60 min", type: "video", interviewers: ["Alex Kim"], status: "scheduled" },
  { id: "i2", candidate: "Marcus Rodriguez", role: "Product Designer", time: "Today, 4:00 PM", duration: "45 min", type: "video", interviewers: ["Jamie Lee", "Chris Park"], status: "scheduled" },
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
  const upcoming = interviews.filter((i) => i.status === "scheduled");
  const completed = interviews.filter((i) => i.status === "completed");
  const cancelled = interviews.filter((i) => i.status === "cancelled");

  const renderList = (list: typeof interviews) => (
    <div className="space-y-3">
      {list.map((iv) => (
        <div key={iv.id} className="bg-[#16161A] border border-[#1E1E24] rounded-2xl p-5 flex items-center gap-5">
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
            {iv.candidate.split(" ").map((n) => n[0]).join("")}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-white">{iv.candidate}</h3>
              <Badge variant={statusVariant[iv.status] || "default"} dot>{iv.status}</Badge>
            </div>
            <p className="text-xs text-gray-400">{iv.role}</p>
            <div className="flex items-center gap-3 mt-1">
              <span className="flex items-center gap-1 text-xs text-gray-500"><Clock className="w-3 h-3" />{iv.time} · {iv.duration}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${typeColor[iv.type]}`}>{iv.type}</span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">Interviewers: {iv.interviewers.join(", ")}</p>
          </div>
          <div className="flex items-center gap-2">
            {iv.status === "scheduled" && <Button size="sm" leftIcon={<Video className="w-3.5 h-3.5" />}>Join</Button>}
            <Button size="sm" variant="outline" leftIcon={<FileText className="w-3.5 h-3.5" />}>Kit</Button>
            {iv.status === "scheduled" && <Button size="sm" variant="ghost" leftIcon={<RefreshCw className="w-3.5 h-3.5" />}>Reschedule</Button>}
            {iv.status === "completed" && <Button size="sm" variant="ghost" leftIcon={<CheckCircle className="w-3.5 h-3.5 text-green-400" />}>Review</Button>}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Interviews</h1>
          <p className="text-gray-400 mt-0.5">{upcoming.length} upcoming · {completed.length} completed</p>
        </div>
        <Button leftIcon={<Video className="w-4 h-4" />}>Schedule Interview</Button>
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
    </div>
  );
}
