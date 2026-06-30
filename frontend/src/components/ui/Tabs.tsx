"use client";
import { cn } from "@/lib/utils";
import { createContext, useContext, useState } from "react";

interface TabsContextValue { value: string; onChange: (v: string) => void; }
const TabsContext = createContext<TabsContextValue>({ value: "", onChange: () => {} });

interface TabsProps { defaultValue?: string; value?: string; onValueChange?: (v: string) => void; children: React.ReactNode; className?: string; }

export function Tabs({ defaultValue = "", value, onValueChange, children, className }: TabsProps) {
  const [internal, setInternal] = useState(defaultValue);
  const current = value ?? internal;
  const onChange = (v: string) => { setInternal(v); onValueChange?.(v); };
  return <TabsContext.Provider value={{ value: current, onChange }}><div className={className}>{children}</div></TabsContext.Provider>;
}

export function TabsList({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("flex items-center gap-1 bg-[#111114] border border-[#1E1E24] rounded-xl p-1 w-fit", className)}>
      {children}
    </div>
  );
}

export function TabsTrigger({ value, children, className }: { value: string; children: React.ReactNode; className?: string }) {
  const { value: current, onChange } = useContext(TabsContext);
  const isActive = current === value;
  return (
    <button
      onClick={() => onChange(value)}
      className={cn(
        "px-3 py-1.5 text-sm font-medium rounded-lg transition-colors",
        isActive ? "bg-[#7C3AED] text-white" : "text-gray-400 hover:text-white"
      )}
    >
      {children}
    </button>
  );
}

export function TabsContent({ value, children, className }: { value: string; children: React.ReactNode; className?: string }) {
  const { value: current } = useContext(TabsContext);
  if (current !== value) return null;
  return <div className={className}>{children}</div>;
}
