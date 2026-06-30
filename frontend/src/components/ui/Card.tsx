import { cn } from "@/lib/utils";

interface CardProps { className?: string; children: React.ReactNode; }
interface CardHeaderProps { className?: string; children: React.ReactNode; }
interface CardContentProps { className?: string; children: React.ReactNode; }

export function Card({ className, children }: CardProps) {
  return (
    <div className={cn("bg-[#16161A] border border-[#1E1E24] rounded-2xl", className)}>
      {children}
    </div>
  );
}

export function CardHeader({ className, children }: CardHeaderProps) {
  return <div className={cn("px-6 pt-5 pb-4", className)}>{children}</div>;
}

export function CardContent({ className, children }: CardContentProps) {
  return <div className={cn("px-6 pb-5", className)}>{children}</div>;
}
