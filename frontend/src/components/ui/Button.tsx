import { cn } from "@/lib/utils";
import React from "react";

type Variant = "primary" | "gradient" | "secondary" | "outline" | "ghost" | "danger";
type Size = "sm" | "md" | "lg" | "icon";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  loading?: boolean;
  children?: React.ReactNode;
}

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-[#7C3AED] hover:bg-[#8B5CF6] text-white border border-white/10 shadow-[0_6px_20px_-8px_rgba(124,58,237,0.7)] hover:shadow-[0_10px_28px_-8px_rgba(139,92,246,0.7)]",
  gradient:
    "text-white border border-white/10 bg-[length:200%_100%] bg-[linear-gradient(110deg,#7C3AED,#6366F1_45%,#3B82F6)] shadow-[0_8px_26px_-8px_rgba(99,102,241,0.75)] hover:bg-[position:100%_0] hover:shadow-[0_12px_34px_-8px_rgba(99,102,241,0.8)]",
  secondary:
    "bg-white/[0.06] hover:bg-white/[0.1] text-white border border-white/10",
  outline:
    "bg-transparent hover:bg-white/[0.05] text-gray-300 hover:text-white border border-[#26262e] hover:border-[#33333d]",
  ghost:
    "bg-transparent hover:bg-white/[0.06] text-gray-400 hover:text-white border border-transparent",
  danger:
    "bg-[#f43f5e]/12 hover:bg-[#f43f5e]/20 text-[#fb7185] border border-[#f43f5e]/25",
};

const sizeClasses: Record<Size, string> = {
  sm: "h-8 px-3 text-xs gap-1.5",
  md: "h-10 px-4 text-sm gap-2",
  lg: "h-12 px-6 text-[15px] gap-2",
  icon: "h-10 w-10 justify-center",
};

export function Button({
  variant = "primary",
  size = "md",
  leftIcon,
  rightIcon,
  loading,
  children,
  className,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={cn(
        "group relative inline-flex items-center justify-center rounded-xl font-medium",
        "transition-[transform,background,box-shadow,border-color,color] duration-300 ease-out",
        "active:scale-[0.97] hover:-translate-y-px",
        "disabled:opacity-50 disabled:pointer-events-none disabled:translate-y-0",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
    >
      {loading ? (
        <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-90" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : (
        leftIcon
      )}
      {children}
      {!loading && rightIcon}
    </button>
  );
}
