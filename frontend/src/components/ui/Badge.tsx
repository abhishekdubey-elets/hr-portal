import { cn } from "@/lib/utils";

type Variant = "default" | "purple" | "success" | "warning" | "error" | "info";

interface BadgeProps {
  children: React.ReactNode;
  variant?: Variant;
  dot?: boolean;
  className?: string;
}

const variantClasses: Record<Variant, string> = {
  default: "bg-gray-500/15 text-gray-400",
  purple: "bg-purple-500/15 text-purple-400",
  success: "bg-green-500/15 text-green-400",
  warning: "bg-yellow-500/15 text-yellow-400",
  error: "bg-red-500/15 text-red-400",
  info: "bg-blue-500/15 text-blue-400",
};

const dotColors: Record<Variant, string> = {
  default: "bg-gray-400",
  purple: "bg-purple-400",
  success: "bg-green-400",
  warning: "bg-yellow-400",
  error: "bg-red-400",
  info: "bg-blue-400",
};

export function Badge({ children, variant = "default", dot, className }: BadgeProps) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium", variantClasses[variant], className)}>
      {dot && <span className={cn("w-1.5 h-1.5 rounded-full flex-shrink-0", dotColors[variant])} />}
      {children}
    </span>
  );
}
