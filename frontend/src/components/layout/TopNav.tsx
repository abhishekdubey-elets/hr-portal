"use client";
import { usePathname } from "next/navigation";
import { Search, Bell, Sun, Moon, ChevronRight, LogOut, User, Settings } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useStore } from "@/store";
import { getInitials } from "@/lib/utils";
import { useState } from "react";

const breadcrumbMap: Record<string, string> = {
  dashboard: "Dashboard", recruitment: "Recruitment", jobs: "Jobs", new: "New Job",
  candidates: "Candidates", "resume-screening": "Resume Screening", interviews: "Interviews",
  employees: "Employees", directory: "Directory", onboarding: "Onboarding",
  performance: "Performance", skills: "Skills", "ai-agents": "AI Agents",
  workflows: "Workflows", analytics: "Analytics", settings: "Settings",
};

export function TopNav() {
  const pathname = usePathname();
  const { user, theme, toggleTheme, setCommandPaletteOpen, logout } = useStore();
  const [notifOpen, setNotifOpen] = useState(false);

  const segments = pathname.split("/").filter(Boolean);
  const breadcrumbs = segments.map((s) => breadcrumbMap[s] || s);

  const notifications = [
    { id: "1", title: "47 resumes screened", desc: "Senior Frontend Engineer", time: "5m ago", unread: true },
    { id: "2", title: "Offer accepted", desc: "Marcus Rodriguez — Designer", time: "2h ago", unread: true },
    { id: "3", title: "Interview reminder", desc: "Sarah Chen at 2:00 PM", time: "3h ago", unread: false },
  ];

  return (
    <header className="fixed top-0 right-0 left-0 z-30 h-16 bg-[#0A0A0B]/80 backdrop-blur-md border-b border-[#1E1E24] flex items-center px-6 gap-4">
      <div className="flex items-center gap-1.5 text-sm flex-1">
        <span className="text-gray-500">PeopleAI</span>
        {breadcrumbs.map((crumb, i) => (
          <span key={i} className="flex items-center gap-1.5">
            <ChevronRight className="w-3 h-3 text-gray-600" />
            <span className={i === breadcrumbs.length - 1 ? "text-white font-medium" : "text-gray-500"}>{crumb}</span>
          </span>
        ))}
      </div>
      <button onClick={() => setCommandPaletteOpen(true)} className="hidden md:flex items-center gap-2 px-3 py-2 bg-[#111114] border border-[#1E1E24] rounded-xl text-gray-400 text-sm hover:border-gray-500 transition-colors">
        <Search className="w-4 h-4" />
        <span>Quick search...</span>
        <span className="ml-4 text-xs bg-[#1E1E24] px-1.5 py-0.5 rounded">⌘K</span>
      </button>
      <button onClick={toggleTheme} className="w-9 h-9 rounded-xl bg-[#111114] border border-[#1E1E24] flex items-center justify-center text-gray-400 hover:text-white transition-colors">
        {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
      </button>
      <DropdownMenu.Root open={notifOpen} onOpenChange={setNotifOpen}>
        <DropdownMenu.Trigger asChild>
          <button className="relative w-9 h-9 rounded-xl bg-[#111114] border border-[#1E1E24] flex items-center justify-center text-gray-400 hover:text-white transition-colors">
            <Bell className="w-4 h-4" />
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-purple-500 rounded-full text-[10px] font-bold text-white flex items-center justify-center">2</span>
          </button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content className="w-80 bg-[#16161A] border border-[#1E1E24] rounded-2xl shadow-2xl p-1 z-50 mt-2" align="end">
            <div className="px-4 py-3 border-b border-[#1E1E24]"><p className="text-sm font-semibold text-white">Notifications</p></div>
            {notifications.map((n) => (
              <DropdownMenu.Item key={n.id} className="flex items-start gap-3 px-4 py-3 rounded-xl hover:bg-[#1E1E24] cursor-pointer outline-none">
                {n.unread && <div className="w-2 h-2 bg-purple-500 rounded-full mt-1.5 flex-shrink-0" />}
                {!n.unread && <div className="w-2 h-2 flex-shrink-0" />}
                <div>
                  <p className="text-sm text-white font-medium">{n.title}</p>
                  <p className="text-xs text-gray-400">{n.desc}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{n.time}</p>
                </div>
              </DropdownMenu.Item>
            ))}
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <button className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-xs font-bold text-white">
            {user ? getInitials(user.name) : "SA"}
          </button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content className="w-48 bg-[#16161A] border border-[#1E1E24] rounded-2xl shadow-2xl p-1 z-50 mt-2" align="end">
            <div className="px-3 py-2 border-b border-[#1E1E24] mb-1">
              <p className="text-sm font-medium text-white">{user?.name || "Sarah Admin"}</p>
              <p className="text-xs text-gray-400">{user?.email || "sarah@company.com"}</p>
            </div>
            <DropdownMenu.Item asChild>
              <a href="/settings" className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-gray-300 hover:text-white hover:bg-[#1E1E24] cursor-pointer outline-none">
                <User className="w-4 h-4" /> Profile
              </a>
            </DropdownMenu.Item>
            <DropdownMenu.Item asChild>
              <a href="/settings" className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-gray-300 hover:text-white hover:bg-[#1E1E24] cursor-pointer outline-none">
                <Settings className="w-4 h-4" /> Settings
              </a>
            </DropdownMenu.Item>
            <DropdownMenu.Separator className="my-1 h-px bg-[#1E1E24]" />
            <DropdownMenu.Item onClick={() => logout()} className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-red-400 hover:bg-red-500/10 cursor-pointer outline-none">
              <LogOut className="w-4 h-4" /> Sign out
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </header>
  );
}
