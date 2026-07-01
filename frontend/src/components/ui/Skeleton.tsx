import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
  variant?: "default" | "circle" | "text";
}

export function Skeleton({ className, variant = "default" }: SkeletonProps) {
  return (
    <div
      className={cn(
        "skeleton-shimmer",
        variant === "circle" ? "rounded-full" : variant === "text" ? "rounded-md h-3.5" : "rounded-lg",
        className
      )}
    />
  );
}

/** Convenience block: a few shimmer lines for text-heavy loading states. */
export function SkeletonText({ lines = 3, className }: { lines?: number; className?: string }) {
  return (
    <div className={cn("space-y-2.5", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} variant="text" className={i === lines - 1 ? "w-3/5" : "w-full"} />
      ))}
    </div>
  );
}
