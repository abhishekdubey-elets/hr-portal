"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Users, Briefcase, Bot, GitBranch, BarChart3, Settings, ChevronLeft, ChevronRight, UserCheck, FileSearch, Calendar, FolderOpen, TrendingUp, Star, LogOut } from "lucide-react";
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

interface SidebarProps { collapsed?: boolean; onToggle?: () => void; }

export function Sidebar({ collapsed = false, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useStore();

  return (
    <aside style={{ width: collapsed ? 72 : 256 }} className="fixed left-0 top-0 h-full bg-[#111114] border-r border-[#1E1E24] z-40 flex flex-col overflow-hidden transition-all duration-200">
      <div className="flex items-center gap-3 px-4 py-5 border-b border-[#1E1E24] min-h-[64px]">
        <div className="w-8 h-8 flex-shrink-0">
          <img src="/logo.svg" alt="PeopleAI" className="w-8 h-8" />
        </div>
        {!collapsed && <span className="text-white font-bold text-lg whitespace-nowrap">PeopleAI</span>}
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
        {navSections.map((section) => (
          <div key={section.label} className="mb-4">
            {!collapsed && <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-1">{section.label}</p>}
            {section.items.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
              return (
                <Link key={item.href} href={item.href}>
                  <div className={cn("flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 group relative", isActive ? "bg-purple-500/15 text-purple-400" : "text-gray-400 hover:text-white hover:bg-[#1E1E24]")}>
                    {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-purple-500 rounded-r" />}
                    <item.icon className="w-5 h-5 flex-shrink-0" />
                    {!collapsed && <span className="text-sm font-medium whitespace-nowrap">{item.label}</span>}
                    {collapsed && (
                      <div className="absolute left-full ml-2 px-2 py-1 bg-[#1E1E24] text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                        {item.label}
                      </div>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="border-t border-[#1E1E24] p-3 space-y-1">
        <Link href="/settings">
          <div className={cn("flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors", pathname === "/settings" ? "bg-purple-500/15 text-purple-400" : "text-gray-400 hover:text-white hover:bg-[#1E1E24]")}>
            <Settings className="w-5 h-5 flex-shrink-0" />
            {!collapsed && <span className="text-sm font-medium">Settings</span>}
          </div>
        </Link>
        <div className={cn("flex items-center gap-3 px-3 py-2.5", collapsed ? "justify-center" : "")}>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
            {user ? getInitials(user.name) : "SA"}
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user?.name || "Sarah Admin"}</p>
              <p className="text-xs text-gray-400 truncate">{user?.email || "sarah@company.com"}</p>
            </div>
          )}
          {!collapsed && (
            <button onClick={() => logout()} className="text-gray-500 hover:text-red-400 transition-colors" title="Sign out">
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {onToggle && (
        <button onClick={onToggle} className="absolute -right-3 top-20 w-6 h-6 bg-[#1E1E24] border border-[#2A2A35] rounded-full flex items-center justify-center text-gray-400 hover:text-white transition-colors z-50">
          {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
        </button>
      )}
    </aside>
  );
}
