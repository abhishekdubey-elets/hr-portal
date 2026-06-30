import { cn } from "@/lib/utils";
import { Button } from "./Button";

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({ title, description, actionLabel, onAction, className }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-16 px-4 text-center", className)}>
      <svg
        className="w-16 h-16 text-gray-600 mb-4"
        fill="none"
        viewBox="0 0 64 64"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" opacity="0.4" />
        <path d="M24 28h16M24 36h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
        <circle cx="32" cy="22" r="4" stroke="currentColor" strokeWidth="2" opacity="0.6" />
      </svg>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-gray-400 text-sm max-w-xs mb-6">{description}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction}>{actionLabel}</Button>
      )}
    </div>
  );
}
