"use client";
import { useEffect, useState } from "react";
import { TrendingUp, Users, Clock, Target } from "lucide-react";
import { HiringChart } from "@/components/analytics/HiringChart";
import { RetentionChart } from "@/components/analytics/RetentionChart";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { getAnalytics } from "@/lib/api";
import { Skeleton } from "@/components/ui/Skeleton";
import type { AnalyticsData } from "@/types";

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAnalytics().then((d) => { setData(d); setLoading(false); });
  }, []);

  const totalHired = data.reduce((s, d) => s + d.hired, 0);
  const totalApplied = data.reduce((s, d) => s + d.applied, 0);
  const convRate = totalApplied ? ((totalHired / totalApplied) * 100).toFixed(1) : "0";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Analytics</h1>
          <p className="text-gray-400 mt-0.5">Data-driven insights for smarter HR decisions</p>
        </div>
        <Badge variant="purple">H1 2024</Badge>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label: "Total Hired", value: totalHired, icon: <Users className="w-5 h-5 text-green-400" />, bg: "bg-green-500/15", trend: "+16.7%" },
          { label: "Total Applied", value: totalApplied, icon: <Target className="w-5 h-5 text-purple-400" />, bg: "bg-purple-500/15", trend: "+24.3%" },
          { label: "Conversion Rate", value: `${convRate}%`, icon: <TrendingUp className="w-5 h-5 text-blue-400" />, bg: "bg-blue-500/15", trend: "+2.1%" },
          { label: "Avg Time to Hire", value: "18d", icon: <Clock className="w-5 h-5 text-yellow-400" />, bg: "bg-yellow-500/15", trend: "-8.3%" },
        ].map((m) => (
          <div key={m.label} className="bg-[#16161A] border border-[#1E1E24] rounded-2xl p-5">
            <div className="flex items-start justify-between mb-3">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">{m.label}</p>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${m.bg}`}>{m.icon}</div>
            </div>
            <p className="text-2xl font-bold text-white">{m.value}</p>
            <p className="text-xs text-green-400 mt-1">{m.trend} vs last period</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-white">Hiring Pipeline</h2>
                <p className="text-sm text-gray-400 mt-0.5">Applications vs hires over time</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? <Skeleton className="h-64" /> : <HiringChart data={data} />}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-white">Retention Rate</h2>
                <p className="text-sm text-gray-400 mt-0.5">Monthly employee retention</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <RetentionChart />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-white">Key Insights</h2>
          <p className="text-sm text-gray-400 mt-0.5">AI-generated recommendations</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { title: "Hiring velocity up 24%", desc: "Resume screening automation reduced time-to-first-interview by 3 days.", color: "border-green-500/30 bg-green-500/5", badge: "Positive" as const, badgeVariant: "success" as const },
              { title: "June attrition spike", desc: "Engineering team shows 5.8% attrition — 2 high performers flagged at risk.", color: "border-red-500/30 bg-red-500/5", badge: "Alert" as const, badgeVariant: "error" as const },
              { title: "Offer acceptance at 91%", desc: "Competitive packages and faster offers driving acceptance rate improvement.", color: "border-blue-500/30 bg-blue-500/5", badge: "Insight" as const, badgeVariant: "info" as const },
            ].map((insight) => (
              <div key={insight.title} className={`p-4 rounded-2xl border ${insight.color}`}>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <p className="text-sm font-semibold text-white">{insight.title}</p>
                  <Badge variant={insight.badgeVariant}>{insight.badge}</Badge>
                </div>
                <p className="text-xs text-gray-400">{insight.desc}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
