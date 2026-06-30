import { cn } from "@/lib/utils";

export function Table({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("w-full overflow-x-auto", className)}><table className="w-full">{children}</table></div>;
}

export function TableHeader({ children }: { children: React.ReactNode }) {
  return <thead className="border-b border-[#1E1E24]">{children}</thead>;
}

export function TableBody({ children }: { children: React.ReactNode }) {
  return <tbody className="divide-y divide-[#1E1E24]">{children}</tbody>;
}

export function TableRow({ children, className }: { children: React.ReactNode; className?: string }) {
  return <tr className={cn("hover:bg-[#1E1E24]/50 transition-colors", className)}>{children}</tr>;
}

export function TableHead({ children, className }: { children: React.ReactNode; className?: string }) {
  return <th className={cn("px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider", className)}>{children}</th>;
}

export function TableCell({ children, className }: { children: React.ReactNode; className?: string }) {
  return <td className={cn("px-4 py-3.5 text-sm text-gray-400", className)}>{children}</td>;
}
