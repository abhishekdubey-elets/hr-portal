import { cn } from "@/lib/utils";

interface CardProps {
  className?: string;
  children: React.ReactNode;
  hover?: boolean;
  interactive?: boolean;
  onClick?: () => void;
}

export function Card({ className, children, hover, interactive, onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "relative rounded-3xl border border-white/[0.06] bg-[#16161A]/90 shadow-md",
        "before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:h-px before:rounded-t-3xl",
        "before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent",
        (hover || interactive) &&
          "transition-all duration-300 ease-out hover:-translate-y-1 hover:border-white/[0.1] hover:shadow-lg",
        interactive && "cursor-pointer",
        className
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("px-6 pt-6 pb-4", className)}>{children}</div>;
}

export function CardContent({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("px-6 pb-6", className)}>{children}</div>;
}

export function CardTitle({ className, children }: { className?: string; children: React.ReactNode }) {
  return <h2 className={cn("text-lg font-semibold text-white tracking-tight", className)}>{children}</h2>;
}

export function CardDescription({ className, children }: { className?: string; children: React.ReactNode }) {
  return <p className={cn("text-sm text-gray-400 mt-0.5", className)}>{children}</p>;
}
