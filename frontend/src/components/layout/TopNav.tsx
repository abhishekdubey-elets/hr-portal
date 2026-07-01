"use client";
import { usePathname } from "next/navigation";
import { Search, Bell, Sun, Moon, ChevronRight, LogOut, User, Settings, Sparkles } from "lucide-react";
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
  const unread = 2;

  const notifications = [
    { id: "1", title: "47 resumes screened", desc: "Senior Frontend Engineer", time: "5m ago", unread: true },
    { id: "2", title: "Offer accepted", desc: "Marcus Rodriguez — Designer", time: "2h ago", unread: true },
    { id: "3", title: "Interview reminder", desc: "Sarah Chen at 2:00 PM", time: "3h ago", unread: false },
  ];

  const iconBtn =
    "flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.03] text-gray-400 transition-all duration-200 hover:border-white/15 hover:text-white hover:bg-white/[0.06]";

  return (
    <div className="sticky top-0 z-30 px-4 pt-3 md:px-6">
      <header className="glass-nav flex h-14 items-center gap-3 rounded-2xl border border-white/[0.07] px-3 shadow-md">
        {/* Breadcrumbs */}
        <div className="flex flex-1 items-center gap-1.5 overflow-hidden pl-1 text-sm">
          <span className="hidden text-gray-500 sm:inline">PeopleAI</span>
          {breadcrumbs.map((crumb, i) => (
            <span key={i} className="flex items-center gap-1.5">
              <ChevronRight className="hidden h-3.5 w-3.5 text-gray-600 sm:inline" />
              <span className={i === breadcrumbs.length - 1 ? "truncate font-medium text-white" : "hidden truncate text-gray-500 sm:inline"}>
                {crumb}
              </span>
            </span>
          ))}
        </div>

        {/* Search / command */}
        <button
          onClick={() => setCommandPaletteOpen(true)}
          className="group hidden items-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.03] px-3 py-2 text-sm text-gray-400 transition-all hover:border-white/15 hover:text-gray-200 md:flex"
        >
          <Search className="h-4 w-4" />
          <span>Search or ask AI…</span>
          <kbd className="ml-6 rounded-md border border-white/10 bg-white/[0.05] px-1.5 py-0.5 text-[10px] font-medium text-gray-400">⌘K</kbd>
        </button>

        {/* Mobile search */}
        <button onClick={() => setCommandPaletteOpen(true)} className={`${iconBtn} md:hidden`} aria-label="Search">
          <Search className="h-4 w-4" />
        </button>

        {/* AI command */}
        <button
          onClick={() => setCommandPaletteOpen(true)}
          className="hidden h-9 items-center gap-1.5 rounded-xl border border-[#8B5CF6]/25 bg-[#8B5CF6]/12 px-3 text-sm font-medium text-[#c4b5fd] transition-all hover:bg-[#8B5CF6]/20 lg:flex"
        >
          <Sparkles className="h-4 w-4" /> Ask AI
        </button>

        {/* Theme toggle */}
        <button onClick={toggleTheme} className={iconBtn} aria-label="Toggle theme">
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>

        {/* Notifications */}
        <DropdownMenu.Root open={notifOpen} onOpenChange={setNotifOpen}>
          <DropdownMenu.Trigger asChild>
            <button className={`relative ${iconBtn}`} aria-label="Notifications">
              <Bell className="h-4 w-4" />
              {unread > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#8B5CF6] opacity-60" />
                  <span className="relative inline-flex h-4 w-4 items-center justify-center rounded-full bg-[#8B5CF6] text-[9px] font-bold text-white">
                    {unread}
                  </span>
                </span>
              )}
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content align="end" sideOffset={10} className="z-50 w-80 rounded-2xl border border-white/10 bg-[#16161A]/95 p-1.5 shadow-lg backdrop-blur-xl animate-scale-in">
              <div className="flex items-center justify-between px-3 py-2">
                <p className="text-sm font-semibold text-white">Notifications</p>
                <span className="rounded-full bg-[#8B5CF6]/15 px-2 py-0.5 text-[11px] font-medium text-[#c4b5fd]">{unread} new</span>
              </div>
              {notifications.map((n) => (
                <DropdownMenu.Item key={n.id} className="flex cursor-pointer items-start gap-3 rounded-xl px-3 py-2.5 outline-none hover:bg-white/[0.05]">
                  <span className={`mt-1.5 h-2 w-2 flex-shrink-0 rounded-full ${n.unread ? "bg-[#8B5CF6]" : "bg-transparent"}`} />
                  <div>
                    <p className="text-sm font-medium text-white">{n.title}</p>
                    <p className="text-xs text-gray-400">{n.desc}</p>
                    <p className="mt-0.5 text-[11px] text-gray-500">{n.time}</p>
                  </div>
                </DropdownMenu.Item>
              ))}
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>

        {/* Profile */}
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#7C3AED] to-[#3B82F6] text-xs font-bold text-white ring-2 ring-white/10 transition-transform hover:scale-105">
              {user ? getInitials(user.name) : "SA"}
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content align="end" sideOffset={10} className="z-50 w-52 rounded-2xl border border-white/10 bg-[#16161A]/95 p-1.5 shadow-lg backdrop-blur-xl animate-scale-in">
              <div className="mb-1 border-b border-white/[0.06] px-3 py-2">
                <p className="text-sm font-medium text-white">{user?.name || "Sarah Admin"}</p>
                <p className="text-xs text-gray-500">{user?.email || "sarah@company.com"}</p>
              </div>
              <DropdownMenu.Item asChild>
                <a href="/settings" className="flex cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-gray-300 outline-none hover:bg-white/[0.05] hover:text-white">
                  <User className="h-4 w-4" /> Profile
                </a>
              </DropdownMenu.Item>
              <DropdownMenu.Item asChild>
                <a href="/settings" className="flex cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-gray-300 outline-none hover:bg-white/[0.05] hover:text-white">
                  <Settings className="h-4 w-4" /> Settings
                </a>
              </DropdownMenu.Item>
              <DropdownMenu.Separator className="my-1 h-px bg-white/[0.06]" />
              <DropdownMenu.Item onClick={() => logout()} className="flex cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-[#fb7185] outline-none hover:bg-[#f43f5e]/10">
                <LogOut className="h-4 w-4" /> Sign out
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </header>
    </div>
  );
}
