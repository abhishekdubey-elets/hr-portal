"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import { useStore } from "@/store";
import {
  LayoutDashboard, Briefcase, Users, FileSearch, Calendar,
  Bot, GitBranch, BarChart3, Settings, UserCheck, Search,
} from "lucide-react";

const items = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, group: "Navigation" },
  { label: "Jobs", href: "/recruitment/jobs", icon: Briefcase, group: "Navigation" },
  { label: "Candidates", href: "/recruitment/candidates", icon: Users, group: "Navigation" },
  { label: "Resume Screening", href: "/recruitment/resume-screening", icon: FileSearch, group: "Navigation" },
  { label: "Interviews", href: "/recruitment/interviews", icon: Calendar, group: "Navigation" },
  { label: "Employee Directory", href: "/employees/directory", icon: UserCheck, group: "Navigation" },
  { label: "AI Agents", href: "/ai-agents", icon: Bot, group: "Navigation" },
  { label: "Workflows", href: "/workflows", icon: GitBranch, group: "Navigation" },
  { label: "Analytics", href: "/analytics", icon: BarChart3, group: "Navigation" },
  { label: "Settings", href: "/settings", icon: Settings, group: "Navigation" },
  { label: "Post New Job", href: "/recruitment/jobs/new", icon: Briefcase, group: "Actions" },
  { label: "Screen Resumes", href: "/recruitment/resume-screening", icon: FileSearch, group: "Actions" },
];

export function CommandPalette() {
  const { commandPaletteOpen, setCommandPaletteOpen } = useStore();
  const router = useRouter();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCommandPaletteOpen(!commandPaletteOpen);
      }
      if (e.key === "Escape") setCommandPaletteOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [commandPaletteOpen, setCommandPaletteOpen]);

  if (!commandPaletteOpen) return null;

  const groups = Array.from(new Set(items.map((i) => i.group)));

  return (
    <div className="fixed inset-0 z-[200] flex items-start justify-center pt-24 px-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setCommandPaletteOpen(false)} />
      <div className="relative w-full max-w-xl bg-[#16161A] border border-[#1E1E24] rounded-2xl shadow-2xl overflow-hidden">
        <Command className="[&_[cmdk-root]]:bg-transparent">
          <div className="flex items-center gap-3 px-4 py-3 border-b border-[#1E1E24]">
            <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <Command.Input
              placeholder="Search pages, actions..."
              className="flex-1 bg-transparent text-white placeholder-gray-500 outline-none text-sm"
            />
            <kbd className="text-xs text-gray-500 bg-[#1E1E24] px-1.5 py-0.5 rounded">ESC</kbd>
          </div>
          <Command.List className="max-h-80 overflow-y-auto p-2">
            <Command.Empty className="py-8 text-center text-gray-500 text-sm">
              No results found.
            </Command.Empty>
            {groups.map((group) => (
              <Command.Group key={group} heading={group} className="[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:text-gray-500 [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wider">
                {items
                  .filter((i) => i.group === group)
                  .map((item) => (
                    <Command.Item
                      key={item.href}
                      value={item.label}
                      onSelect={() => {
                        router.push(item.href);
                        setCommandPaletteOpen(false);
                      }}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer text-gray-300 hover:text-white data-[selected=true]:bg-purple-500/15 data-[selected=true]:text-purple-400 transition-colors outline-none"
                    >
                      <item.icon className="w-4 h-4 flex-shrink-0" />
                      <span className="text-sm">{item.label}</span>
                    </Command.Item>
                  ))}
              </Command.Group>
            ))}
          </Command.List>
        </Command>
      </div>
    </div>
  );
}
