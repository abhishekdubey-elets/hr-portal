"use client";
import { format } from "date-fns";
import { Users, Briefcase, UserCheck, TrendingUp, Clock, Star, Video, ArrowUpRight, Sparkles } from "lucide-react";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { HiringFunnel } from "@/components/dashboard/HiringFunnel";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Stagger, StaggerItem } from "@/lib/motion";

const metrics = [
  { title: "Total Employees", value: 1247, trend: 3.2, accent: "#8B5CF6", icon: <Users className="h-5 w-5 text-[#a78bfa]" />, iconBg: "bg-[#8B5CF6]/12", series: [1180, 1195, 1205, 1220, 1228, 1240, 1247] },
  { title: "Open Positions", value: 38, trend: -5.0, accent: "#3B82F6", icon: <Briefcase className="h-5 w-5 text-[#60a5fa]" />, iconBg: "bg-[#3B82F6]/12", series: [44, 43, 41, 42, 40, 39, 38] },
  { title: "Candidates (MTD)", value: 524, trend: 12.8, accent: "#10B981", icon: <UserCheck className="h-5 w-5 text-[#34d399]" />, iconBg: "bg-[#10B981]/12", series: [320, 360, 400, 430, 470, 500, 524] },
  { title: "Offers Accepted", value: 21, trend: 16.7, accent: "#F59E0B", icon: <Star className="h-5 w-5 text-[#fbbf24]" />, iconBg: "bg-[#F59E0B]/12", series: [12, 14, 15, 17, 18, 20, 21] },
  { title: "Avg. Time to Hire", value: "18d", trend: -8.3, accent: "#f43f5e", icon: <Clock className="h-5 w-5 text-[#fb7185]" />, iconBg: "bg-[#f43f5e]/12", series: [24, 23, 22, 21, 20, 19, 18] },
  { title: "Retention Rate", value: "94.2", suffix: "%", trend: 1.1, accent: "#0EA5E9", icon: <TrendingUp className="h-5 w-5 text-[#38bdf8]" />, iconBg: "bg-[#0EA5E9]/12", series: [92, 92.5, 93, 93.4, 93.8, 94, 94.2] },
];

const upcomingInterviews = [
  { name: "Sarah Chen", role: "Senior Frontend Engineer", time: "2:00 PM Today", type: "video" as const },
  { name: "Marcus Rodriguez", role: "Product Designer", time: "4:00 PM Today", type: "video" as const },
  { name: "Priya Patel", role: "Data Scientist", time: "10:00 AM Tomorrow", type: "technical" as const },
];

export default function DashboardPage() {
  const today = format(new Date(), "EEEE, MMMM d");
  return (
    <div className="space-y-6 pt-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-1.5 flex items-center gap-2">
            <Badge variant="purple" dot pulse>Live</Badge>
            <span className="text-xs text-gray-500">{today}</span>
          </div>
          <h1 className="text-[28px] font-bold tracking-tight text-white">
            Good morning, <span className="text-gradient">Sarah</span>
          </h1>
          <p className="mt-0.5 text-gray-400">Here&apos;s what&apos;s happening across your organization today.</p>
        </div>
        <Button variant="gradient" leftIcon={<Briefcase className="h-4 w-4" />} onClick={() => (window.location.href = "/recruitment/jobs/new")}>
          Post New Job
        </Button>
      </div>

      {/* Metrics — staggered reveal */}
      <Stagger className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6" stagger={0.05}>
        {metrics.map((m) => (
          <StaggerItem key={m.title}>
            <MetricCard {...m} />
          </StaggerItem>
        ))}
      </Stagger>

      {/* Asymmetrical primary row */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
        {/* Hiring funnel — wide */}
        <Card hover className="xl:col-span-7">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Hiring Funnel</CardTitle>
                <CardDescription>This month&apos;s candidate pipeline</CardDescription>
              </div>
              <Badge variant="purple">June 2024</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <HiringFunnel />
          </CardContent>
        </Card>

        {/* Upcoming interviews — narrow */}
        <Card hover className="xl:col-span-5">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Upcoming Interviews</CardTitle>
              <a href="/recruitment/interviews" className="flex items-center gap-1 text-xs font-medium text-[#a78bfa] transition-colors hover:text-[#c4b5fd]">
                View all <ArrowUpRight className="h-3 w-3" />
              </a>
            </div>
          </CardHeader>
          <CardContent className="space-y-2.5 pt-1">
            {upcomingInterviews.map((iv) => (
              <div key={iv.name} className="group flex items-start gap-3 rounded-2xl border border-white/[0.05] bg-white/[0.02] p-3 transition-colors hover:border-white/10 hover:bg-white/[0.04]">
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#7C3AED] to-[#3B82F6] text-xs font-bold text-white">
                  {iv.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-white">{iv.name}</p>
                  <p className="truncate text-xs text-gray-400">{iv.role}</p>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-xs text-[#a78bfa]">{iv.time}</span>
                    <Badge variant="info" dot>{iv.type}</Badge>
                  </div>
                </div>
                <button className="text-gray-500 transition-colors hover:text-[#60a5fa]" aria-label="Join call">
                  <Video className="h-4 w-4" />
                </button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Secondary row */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
        {/* AI activity — wide */}
        <Card hover className="xl:col-span-7">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#8B5CF6]/12">
                  <Sparkles className="h-4 w-4 text-[#a78bfa]" />
                </div>
                <CardTitle>Recent AI Activity</CardTitle>
              </div>
              <a href="/ai-agents" className="flex items-center gap-1 text-xs font-medium text-[#a78bfa] transition-colors hover:text-[#c4b5fd]">
                View agents <ArrowUpRight className="h-3 w-3" />
              </a>
            </div>
          </CardHeader>
          <CardContent className="pt-1">
            <RecentActivity />
          </CardContent>
        </Card>

        {/* Quick actions — narrow */}
        <Card hover className="xl:col-span-5">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks at your fingertips</CardDescription>
          </CardHeader>
          <CardContent>
            <QuickActions />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
