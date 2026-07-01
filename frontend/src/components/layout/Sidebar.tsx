"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import {
  LayoutDashboard, Users, Briefcase, Bot, GitBranch, BarChart3, Settings,
  ChevronLeft, ChevronRight, UserCheck, FileSearch, Calendar, FolderOpen,
  TrendingUp, Star, LogOut, ChevronsUpDown, Check, Sparkles,
} from "lucide-react";
import { useStore } from "@/store";
import { cn, getInitials } from "@/lib/utils";

const navSections = [
  { label: "Overview", items: [{ label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" }] },
  { label: "Recruitment", items: [
    { label: "Overview", icon: Briefcase, href: "/recruitment" },
    { label: "Jobs", icon: FolderOpen, href: "/recruitment/jobs" },
    { label: "Candidates", icon: Users, href: "/recruitment/candidates" },
    { label: "Resume Screening", icon: FileSearch, href: "/recruitment/resume-screening" },
    { label: "Interviews", icon: Calendar, href: "/recruitment/interviews" },
  ]},
  { label: "Employees", items: [
    { label: "Overview", icon: UserCheck, href: "/employees" },
    { label: "Directory", icon: Users, href: "/employees/directory" },
    { label: "Onboarding", icon: Star, href: "/employees/onboarding" },
    { label: "Performance", icon: TrendingUp, href: "/employees/performance" },
    { label: "Skills", icon: BarChart3, href: "/employees/skills" },
  ]},
  { label: "Intelligence", items: [
    { label: "AI Agents", icon: Bot, href: "/ai-agents" },
    { label: "Workflows", icon: GitBranch, href: "/workflows" },
    { label: "Analytics", icon: BarChart3, href: "/analytics" },
  ]},
];

const workspaces = [
  { id: "acme", name: "Acme Corp", plan: "Enterprise" },
  { id: "globex", name: "Globex Inc", plan: "Growth" },
];

interface SidebarProps { collapsed?: boolean; onToggle?: () => void; }

export function Sidebar({ collapsed = false, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useStore();
  const [workspace, setWorkspace] = useState(workspaces[0]);

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 84 : 268 }}
      transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
      className="fixed left-0 top-0 z-40 hidden h-full p-3 md:block"
    >
      <div className="glass-nav flex h-full flex-col overflow-hidden rounded-3xl border border-white/[0.07] bg-[#0F0F12]/80 shadow-lg">
        {/* Brand + workspace switcher */}
        <div className="px-3 pt-4 pb-3">
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button
                className={cn(
                  "group flex w-full items-center gap-2.5 rounded-2xl border border-white/[0.06] bg-white/[0.03] p-2 transition-colors hover:bg-white/[0.06]",
                  collapsed && "justify-center"
                )}
              >
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#7C3AED] to-[#3B82F6] shadow-[0_4px_14px_-4px_rgba(124,58,237,0.7)]">
                  <img src="/logo.svg" alt="PeopleAI" className="h-5 w-5" />
                </div>
                <AnimatePresence initial={false}>
                  {!collapsed && (
                    <motion.div
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.2 }}
                      className="flex min-w-0 flex-1 items-center gap-1 overflow-hidden"
                    >
                      <div className="min-w-0 flex-1 text-left">
                        <p className="truncate text-sm font-semibold text-white">{workspace.name}</p>
                        <p className="truncate text-[11px] text-gray-500">{workspace.plan}</p>
                      </div>
                      <ChevronsUpDown className="h-4 w-4 flex-shrink-0 text-gray-500" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content
                align="start"
                sideOffset={8}
                className="z-50 w-60 rounded-2xl border border-white/10 bg-[#16161A]/95 p-1.5 shadow-lg backdrop-blur-xl animate-scale-in"
              >
                <p className="px-2 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-gray-500">Workspaces</p>
                {workspaces.map((w) => (
                  <DropdownMenu.Item
                    key={w.id}
                    onClick={() => setWorkspace(w)}
                    className="flex cursor-pointer items-center gap-2.5 rounded-xl px-2 py-2 text-sm text-gray-300 outline-none hover:bg-white/[0.06] hover:text-white"
                  >
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-[#7C3AED] to-[#3B82F6] text-[11px] font-bold text-white">
                      {getInitials(w.name)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">{w.name}</p>
                      <p className="truncate text-[11px] text-gray-500">{w.plan}</p>
                    </div>
                    {workspace.id === w.id && <Check className="h-4 w-4 text-[#a78bfa]" />}
                  </DropdownMenu.Item>
                ))}
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        </div>

        {/* Nav */}
        <LayoutGroup>
          <nav className="scrollbar-thin flex-1 space-y-5 overflow-y-auto px-3 py-1">
            {navSections.map((section) => (
              <div key={section.label}>
                {!collapsed && (
                  <p className="mb-1.5 px-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-gray-600">
                    {section.label}
                  </p>
                )}
                {collapsed && <div className="mx-auto mb-2 h-px w-6 bg-white/[0.06]" />}
                <div className="space-y-0.5">
                  {section.items.map((item) => {
                    const isActive =
                      pathname === item.href ||
                      (item.href !== "/dashboard" && item.href !== "/recruitment" && item.href !== "/employees" && pathname.startsWith(item.href)) ||
                      (["/recruitment", "/employees"].includes(item.href) && pathname === item.href);
                    return (
                      <Link key={item.href} href={item.href} className="block">
                        <div
                          className={cn(
                            "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors duration-150",
                            collapsed && "justify-center",
                            isActive ? "text-white" : "text-gray-400 hover:bg-white/[0.05] hover:text-white"
                          )}
                        >
                          {isActive && (
                            <motion.div
                              layoutId="sidebar-active"
                              transition={{ type: "spring", stiffness: 500, damping: 40 }}
                              className="absolute inset-0 rounded-xl border border-[#8B5CF6]/25 bg-[#8B5CF6]/12"
                            >
                              <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r bg-[#a78bfa]" />
                            </motion.div>
                          )}
                          <item.icon
                            className={cn(
                              "relative z-10 h-[18px] w-[18px] flex-shrink-0 transition-transform duration-200 group-hover:scale-110",
                              isActive && "text-[#a78bfa]"
                            )}
                          />
                          {!collapsed && (
                            <span className="relative z-10 truncate text-sm font-medium">{item.label}</span>
                          )}
                          {collapsed && (
                            <div className="pointer-events-none absolute left-full z-50 ml-3 whitespace-nowrap rounded-lg border border-white/10 bg-[#16161A] px-2 py-1 text-xs text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                              {item.label}
                            </div>
                          )}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </LayoutGroup>

        {/* AI upsell (only when expanded) */}
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mx-3 mb-2 overflow-hidden rounded-2xl border border-white/[0.07] bg-gradient-to-br from-[#7C3AED]/15 to-[#3B82F6]/10 p-3"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-[#a78bfa]" />
                <p className="text-xs font-semibold text-white">AI Copilot</p>
              </div>
              <p className="mt-1 text-[11px] leading-relaxed text-gray-400">Ask anything about your people data.</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Profile + settings */}
        <div className="border-t border-white/[0.06] p-3">
          <Link href="/settings" className="block">
            <div className={cn("mb-1 flex items-center gap-3 rounded-xl px-3 py-2 text-gray-400 transition-colors hover:bg-white/[0.05] hover:text-white", collapsed && "justify-center")}>
              <Settings className="h-[18px] w-[18px] flex-shrink-0" />
              {!collapsed && <span className="text-sm font-medium">Settings</span>}
            </div>
          </Link>
          <div className={cn("flex items-center gap-2.5 rounded-xl px-2 py-1.5", collapsed && "justify-center")}>
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#7C3AED] to-[#3B82F6] text-xs font-bold text-white ring-2 ring-white/10">
              {user ? getInitials(user.name) : "SA"}
            </div>
            {!collapsed && (
              <>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-white">{user?.name || "Sarah Admin"}</p>
                  <p className="truncate text-[11px] text-gray-500">{user?.email || "sarah@company.com"}</p>
                </div>
                <button onClick={() => logout()} className="text-gray-500 transition-colors hover:text-[#fb7185]" title="Sign out">
                  <LogOut className="h-4 w-4" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {onToggle && (
        <button
          onClick={onToggle}
          className="absolute -right-0 top-24 flex h-6 w-6 items-center justify-center rounded-full border border-white/10 bg-[#1c1c22] text-gray-400 shadow-md transition-colors hover:text-white"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
        </button>
      )}
    </motion.aside>
  );
}
