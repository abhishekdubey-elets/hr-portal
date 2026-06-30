"use client";
import { useEffect, useState } from "react";
import { Search, Filter, Grid, List } from "lucide-react";
import { EmployeeCard } from "@/components/employees/EmployeeCard";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { getEmployees } from "@/lib/api";
import type { Employee } from "@/types";

type View = "grid" | "list";
const statusVariant: Record<string, "success" | "info" | "warning" | "default"> = {
  active: "success", onboarding: "info", leave: "warning", inactive: "default"
};

export default function DirectoryPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [search, setSearch] = useState("");
  const [view, setView] = useState<View>("grid");

  useEffect(() => { getEmployees().then(setEmployees); }, []);

  const filtered = employees.filter((e) =>
    e.name.toLowerCase().includes(search.toLowerCase()) ||
    e.department.toLowerCase().includes(search.toLowerCase()) ||
    e.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Employee Directory</h1>
        <p className="text-gray-400 mt-0.5">{employees.length} employees across all departments</p>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex-1 max-w-md">
          <Input placeholder="Search by name, role, or department..." value={search} onChange={(e) => setSearch(e.target.value)} prefixIcon={<Search className="w-4 h-4" />} />
        </div>
        <Button variant="outline" leftIcon={<Filter className="w-4 h-4" />}>Filter</Button>
        <div className="flex items-center border border-[#1E1E24] rounded-xl overflow-hidden">
          <button onClick={() => setView("grid")} className={`p-2.5 transition-colors ${view === "grid" ? "bg-purple-500/20 text-purple-400" : "text-gray-400 hover:text-white"}`}><Grid className="w-4 h-4" /></button>
          <button onClick={() => setView("list")} className={`p-2.5 transition-colors ${view === "list" ? "bg-purple-500/20 text-purple-400" : "text-gray-400 hover:text-white"}`}><List className="w-4 h-4" /></button>
        </div>
      </div>
      {view === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((e) => <EmployeeCard key={e.id} employee={e} />)}
        </div>
      ) : (
        <div className="bg-[#16161A] border border-[#1E1E24] rounded-2xl overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead><TableHead>Role</TableHead><TableHead>Department</TableHead>
                <TableHead>Location</TableHead><TableHead>Status</TableHead><TableHead>Performance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((e) => (
                <TableRow key={e.id}>
                  <TableCell className="font-medium text-white">{e.name}</TableCell>
                  <TableCell>{e.role}</TableCell>
                  <TableCell>{e.department}</TableCell>
                  <TableCell>{e.location}</TableCell>
                  <TableCell><Badge variant={statusVariant[e.status] || "default"} dot>{e.status}</Badge></TableCell>
                  <TableCell>{e.performance ? `${e.performance}%` : "—"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
