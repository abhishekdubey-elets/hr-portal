"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { LayoutDashboard, Briefcase, Users, Bot, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { label: "Home", icon: LayoutDashboard, href: "/dashboard" },
  { label: "Hiring", icon: Briefcase, href: "/recruitment" },
  { label: "People", icon: Users, href: "/employees" },
  { label: "AI", icon: Bot, href: "/ai-agents" },
  { label: "Insights", icon: BarChart3, href: "/analytics" },
];

export function MobileNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 px-3 pb-3 md:hidden">
      <div className="glass-nav mx-auto flex max-w-md items-center justify-around rounded-2xl border border-white/[0.08] px-2 py-1.5 shadow-lg">
        {items.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link key={item.href} href={item.href} className="relative flex flex-1 flex-col items-center gap-0.5 py-1.5">
              {active && (
                <motion.div
                  layoutId="mobile-active"
                  transition={{ type: "spring", stiffness: 500, damping: 40 }}
                  className="absolute inset-0 rounded-xl bg-[#8B5CF6]/12"
                />
              )}
              <item.icon className={cn("relative z-10 h-5 w-5 transition-colors", active ? "text-[#a78bfa]" : "text-gray-500")} />
              <span className={cn("relative z-10 text-[10px] font-medium transition-colors", active ? "text-white" : "text-gray-500")}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
