import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string | number;
  suffix?: string;
  trend?: number;
  icon?: React.ReactNode;
  iconBg?: string;
}

export function MetricCard({ title, value, suffix, trend, icon, iconBg }: MetricCardProps) {
  const isPositive = (trend ?? 0) >= 0;
  return (
    <div className="bg-[#16161A] border border-[#1E1E24] rounded-2xl p-5">
      <div className="flex items-start justify-between mb-3">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">{title}</p>
        {icon && <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center", iconBg)}>{icon}</div>}
      </div>
      <div className="flex items-end gap-2">
        <p className="text-2xl font-bold text-white">{value}{suffix}</p>
        {trend !== undefined && (
          <span className={cn("flex items-center gap-0.5 text-xs font-medium mb-0.5", isPositive ? "text-green-400" : "text-red-400")}>
            {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {Math.abs(trend)}%
          </span>
        )}
      </div>
    </div>
  );
}
