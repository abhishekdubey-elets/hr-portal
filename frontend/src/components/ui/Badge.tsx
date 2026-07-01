import { cn } from "@/lib/utils";

type Variant = "default" | "purple" | "success" | "warning" | "error" | "info";

interface BadgeProps {
  children: React.ReactNode;
  variant?: Variant;
  dot?: boolean;
  pulse?: boolean;
  className?: string;
}

const variantClasses: Record<Variant, string> = {
  default: "bg-white/[0.06] text-gray-300 ring-1 ring-inset ring-white/10",
  purple: "bg-[#8B5CF6]/12 text-[#c4b5fd] ring-1 ring-inset ring-[#8B5CF6]/25",
  success: "bg-[#10B981]/12 text-[#6ee7b7] ring-1 ring-inset ring-[#10B981]/25",
  warning: "bg-[#F59E0B]/12 text-[#fcd34d] ring-1 ring-inset ring-[#F59E0B]/25",
  error: "bg-[#f43f5e]/12 text-[#fda4af] ring-1 ring-inset ring-[#f43f5e]/25",
  info: "bg-[#3B82F6]/12 text-[#93c5fd] ring-1 ring-inset ring-[#3B82F6]/25",
};

const dotColors: Record<Variant, string> = {
  default: "bg-gray-400",
  purple: "bg-[#a78bfa]",
  success: "bg-[#34d399]",
  warning: "bg-[#fbbf24]",
  error: "bg-[#fb7185]",
  info: "bg-[#60a5fa]",
};

export function Badge({ children, variant = "default", dot, pulse, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap",
        variantClasses[variant],
        className
      )}
    >
      {dot && (
        <span className="relative flex h-1.5 w-1.5">
          {pulse && (
            <span className={cn("absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping", dotColors[variant])} />
          )}
          <span className={cn("relative inline-flex h-1.5 w-1.5 rounded-full", dotColors[variant])} />
        </span>
      )}
      {children}
    </span>
  );
}
