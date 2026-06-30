"use client";
import { format } from "date-fns";
import { Users, Briefcase, UserCheck, TrendingUp, Clock, Star, Video, ExternalLink } from "lucide-react";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { HiringFunnel } from "@/components/dashboard/HiringFunnel";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

const metrics = [
  { title: "Total Employees", value: 1247, trend: 3.2, icon: <Users className="w-5 h-5 text-purple-400" />, iconBg: "bg-purple-500/15" },
  { title: "Open Positions", value: 38, trend: -5.0, icon: <Briefcase className="w-5 h-5 text-blue-400" />, iconBg: "bg-blue-500/15" },
  { title: "Candidates (MTD)", value: 524, trend: 12.8, icon: <UserCheck className="w-5 h-5 text-green-400" />, iconBg: "bg-green-500/15" },
  { title: "Offers Accepted", value: 21, trend: 16.7, icon: <Star className="w-5 h-5 text-yellow-400" />, iconBg: "bg-yellow-500/15" },
  { title: "Avg. Time to Hire", value: "18d", trend: -8.3, icon: <Clock className="w-5 h-5 text-orange-400" />, iconBg: "bg-orange-500/15" },
  { title: "Retention Rate", value: "94.2", suffix: "%", trend: 1.1, icon: <TrendingUp className="w-5 h-5 text-emerald-400" />, iconBg: "bg-emerald-500/15" },
];

const upcomingInterviews = [
  { name: "Sarah Chen", role: "Senior Frontend Engineer", time: "2:00 PM Today", type: "video" },
  { name: "Marcus Rodriguez", role: "Product Designer", time: "4:00 PM Today", type: "video" },
  { name: "Priya Patel", role: "Data Scientist", time: "10:00 AM Tomorrow", type: "technical" },
];

export default function DashboardPage() {
  const today = format(new Date(), "EEEE, MMMM d");
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Good morning, Sarah</h1>
          <p className="text-gray-400 mt-0.5">{today} · Here&apos;s what&apos;s happening today</p>
        </div>
        <Button leftIcon={<Briefcase className="w-4 h-4" />} onClick={() => window.location.href = "/recruitment/jobs/new"}>Post New Job</Button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {metrics.map((m) => <MetricCard key={m.title} {...m} />)}
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card className="xl:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-white">Hiring Funnel</h2>
                <p className="text-sm text-gray-400 mt-0.5">This month&apos;s candidate pipeline</p>
              </div>
              <Badge variant="purple">June 2024</Badge>
            </div>
          </CardHeader>
          <CardContent><HiringFunnel /></CardContent>
        </Card>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">Upcoming Interviews</h2>
              <a href="/recruitment/interviews" className="text-xs text-purple-400 hover:text-purple-300">View all</a>
            </div>
          </CardHeader>
          <CardContent className="pt-3">
            <div className="space-y-3">
              {upcomingInterviews.map((iv) => (
                <div key={iv.name} className="flex items-start gap-3 p-3 bg-[#111114] rounded-xl">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                    {iv.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{iv.name}</p>
                    <p className="text-xs text-gray-400 truncate">{iv.role}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-purple-400">{iv.time}</span>
                      <Badge variant="info" dot>{iv.type}</Badge>
                    </div>
                  </div>
                  <button className="text-gray-400 hover:text-blue-400 transition-colors"><Video className="w-4 h-4" /></button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">Recent AI Activity</h2>
              <a href="/ai-agents" className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1">View agents <ExternalLink className="w-3 h-3" /></a>
            </div>
          </CardHeader>
          <CardContent className="pt-2"><RecentActivity /></CardContent>
        </Card>
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-white">Quick Actions</h2>
            <p className="text-sm text-gray-400 mt-0.5">Common tasks at your fingertips</p>
          </CardHeader>
          <CardContent><QuickActions /></CardContent>
        </Card>
      </div>
    </div>
  );
}
