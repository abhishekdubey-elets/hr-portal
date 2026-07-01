import { cn } from "@/lib/utils";

export function Table({ children, className }: { children?: React.ReactNode; className?: string }) {
  return (
    <div className={cn("w-full overflow-x-auto scrollbar-thin", className)}>
      <table className="w-full border-separate border-spacing-0">{children}</table>
    </div>
  );
}

export function TableHeader({ children }: { children?: React.ReactNode }) {
  return <thead className="sticky top-0 z-10">{children}</thead>;
}

export function TableBody({ children }: { children?: React.ReactNode }) {
  return <tbody>{children}</tbody>;
}

export function TableRow({
  children,
  className,
  onClick,
}: {
  children?: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <tr
      onClick={onClick}
      className={cn(
        "group transition-colors [&>td]:border-b [&>td]:border-white/[0.05]",
        "hover:[&>td]:bg-white/[0.03]",
        onClick && "cursor-pointer",
        className
      )}
    >
      {children}
    </tr>
  );
}

export function TableHead({ children, className }: { children?: React.ReactNode; className?: string }) {
  return (
    <th
      className={cn(
        "bg-[#101014]/95 backdrop-blur-sm px-4 py-3 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider",
        "border-b border-white/[0.08] first:rounded-tl-xl last:rounded-tr-xl",
        className
      )}
    >
      {children}
    </th>
  );
}

export function TableCell({ children, className }: { children?: React.ReactNode; className?: string }) {
  return <td className={cn("px-4 py-3.5 text-sm text-gray-300 transition-colors", className)}>{children}</td>;
}
