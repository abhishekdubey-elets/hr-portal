"use client";
import { useState } from "react";
import Link from "next/link";
import { Plus, Search, Filter, MapPin, Clock, Users } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/Table";

const jobs = [
  { id: "1", title: "Senior Frontend Engineer", department: "Engineering", location: "Remote", type: "Full-time", level: "Senior", applicants: 127, status: "active", posted: "Jun 12, 2024" },
  { id: "2", title: "Product Designer", department: "Design", location: "San Francisco, CA", type: "Full-time", level: "Mid", applicants: 84, status: "active", posted: "Jun 10, 2024" },
  { id: "3", title: "Data Scientist", department: "Analytics", location: "New York, NY", type: "Full-time", level: "Senior", applicants: 63, status: "active", posted: "Jun 8, 2024" },
  { id: "4", title: "DevOps Engineer", department: "Infrastructure", location: "Remote", type: "Full-time", level: "Mid", applicants: 45, status: "active", posted: "Jun 6, 2024" },
  { id: "5", title: "Marketing Manager", department: "Marketing", location: "Austin, TX", type: "Full-time", level: "Lead", applicants: 98, status: "active", posted: "Jun 4, 2024" },
  { id: "6", title: "Customer Success Manager", department: "CS", location: "Remote", type: "Full-time", level: "Mid", applicants: 71, status: "paused", posted: "May 28, 2024" },
  { id: "7", title: "Backend Engineer (Go)", department: "Engineering", location: "Remote", type: "Full-time", level: "Senior", applicants: 52, status: "active", posted: "May 25, 2024" },
  { id: "8", title: "Head of People Ops", department: "HR", location: "San Francisco, CA", type: "Full-time", level: "Executive", applicants: 29, status: "draft", posted: "May 20, 2024" },
];

const statusVariant: Record<string, "success" | "warning" | "default"> = { active: "success", paused: "warning", draft: "default" };

export default function JobsPage() {
  const [search, setSearch] = useState("");
  const filtered = jobs.filter((j) => j.title.toLowerCase().includes(search.toLowerCase()) || j.department.toLowerCase().includes(search.toLowerCase()));
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Job Postings</h1>
          <p className="text-gray-400 mt-0.5">{jobs.length} positions · {jobs.filter(j => j.status === "active").length} active</p>
        </div>
        <Link href="/recruitment/jobs/new"><Button leftIcon={<Plus className="w-4 h-4" />}>Post New Job</Button></Link>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex-1 max-w-md">
          <Input placeholder="Search jobs..." value={search} onChange={(e) => setSearch(e.target.value)} prefixIcon={<Search className="w-4 h-4" />} />
        </div>
        <Button variant="outline" leftIcon={<Filter className="w-4 h-4" />}>Filter</Button>
      </div>
      <div className="bg-[#16161A] border border-[#1E1E24] rounded-2xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Job Title</TableHead><TableHead>Department</TableHead><TableHead>Location</TableHead>
              <TableHead>Level</TableHead><TableHead>Applicants</TableHead><TableHead>Status</TableHead>
              <TableHead>Posted</TableHead><TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((job) => (
              <TableRow key={job.id}>
                <TableCell className="font-medium text-white">{job.title}</TableCell>
                <TableCell>{job.department}</TableCell>
                <TableCell><span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-gray-500" />{job.location}</span></TableCell>
                <TableCell>{job.level}</TableCell>
                <TableCell><span className="flex items-center gap-1"><Users className="w-3 h-3 text-gray-500" />{job.applicants}</span></TableCell>
                <TableCell><Badge variant={statusVariant[job.status]} dot>{job.status}</Badge></TableCell>
                <TableCell><span className="flex items-center gap-1"><Clock className="w-3 h-3 text-gray-500" />{job.posted}</span></TableCell>
                <TableCell><Button variant="ghost" size="sm">View</Button></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
