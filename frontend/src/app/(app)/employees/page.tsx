"use client";
import { useEffect, useState } from "react";
import { Users, TrendingUp, UserCheck, AlertCircle } from "lucide-react";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { EmployeeCard } from "@/components/employees/EmployeeCard";
import { getEmployees } from "@/lib/api";
import { Skeleton } from "@/components/ui/Skeleton";
import type { Employee } from "@/types";

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getEmployees().then((data) => { setEmployees(data); setLoading(false); });
  }, []);

  const active = employees.filter((e) => e.status === "active").length;
  const onboarding = employees.filter((e) => e.status === "onboarding").length;
  const avgPerf = employees.reduce((sum, e) => sum + (e.performance || 0), 0) / (employees.length || 1);

  const metrics = [
    { title: "Total Employees", value: 1247, trend: 3.2, icon: <Users className="w-5 h-5 text-purple-400" />, iconBg: "bg-purple-500/15" },
    { title: "Active", value: active + 1235, trend: 1.1, icon: <UserCheck className="w-5 h-5 text-green-400" />, iconBg: "bg-green-500/15" },
    { title: "Onboarding", value: onboarding + 14, trend: 8.0, icon: <TrendingUp className="w-5 h-5 text-blue-400" />, iconBg: "bg-blue-500/15" },
    { title: "At Risk", value: 7, trend: -2.1, icon: <AlertCircle className="w-5 h-5 text-red-400" />, iconBg: "bg-red-500/15" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Employees</h1>
        <p className="text-gray-400 mt-0.5">Manage your team and track performance</p>
      </div>
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {metrics.map((m) => <MetricCard key={m.title} {...m} />)}
      </div>
      <div>
        <h2 className="text-base font-semibold text-white mb-4">Team Overview</h2>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-44" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {employees.map((e) => <EmployeeCard key={e.id} employee={e} />)}
          </div>
        )}
      </div>
    </div>
  );
}
