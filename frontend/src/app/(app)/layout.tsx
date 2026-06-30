"use client";
import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopNav } from "@/components/layout/TopNav";
import { useStore } from "@/store";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { sidebarCollapsed, setSidebarCollapsed } = useStore();

  return (
    <div className="min-h-screen bg-[#0A0A0B]">
      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      <div style={{ marginLeft: sidebarCollapsed ? 72 : 256 }} className="transition-all duration-200">
        <TopNav />
        <main className="pt-16 min-h-screen">
          <div className="px-6 py-6 max-w-screen-2xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
