"use client";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { AnimatedCounter } from "@/lib/motion";

interface MetricCardProps {
  title: string;
  value: string | number;
  suffix?: string;
  prefix?: string;
  trend?: number;
  icon?: React.ReactNode;
  iconBg?: string;
  series?: number[];
  accent?: string; // hex for sparkline / glow
}

function Sparkline({ data, color }: { data: number[]; color: string }) {
  if (!data.length) return null;
  const w = 120;
  const h = 36;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const span = max - min || 1;
  const pts = data.map((d, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((d - min) / span) * (h - 6) - 3;
    return [x, y] as const;
  });
  const line = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");
  const area = `${line} L${w},${h} L0,${h} Z`;
  const id = `spark-${color.replace("#", "")}`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-9" preserveAspectRatio="none">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.28" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${id})`} />
      <path d={line} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function MetricCard({ title, value, suffix, prefix, trend, icon, iconBg, series, accent = "#8B5CF6" }: MetricCardProps) {
  const isPositive = (trend ?? 0) >= 0;
  const numeric = typeof value === "number" ? value : parseFloat(String(value).replace(/[^0-9.]/g, ""));
  const canAnimate = !Number.isNaN(numeric) && typeof value === "number";

  return (
    <div className="group relative overflow-hidden rounded-3xl border border-white/[0.06] bg-[#16161A]/90 p-5 shadow-md transition-all duration-300 ease-out hover:-translate-y-1 hover:border-white/[0.1] hover:shadow-lg">
      <div
        className="pointer-events-none absolute -right-8 -top-10 h-28 w-28 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: accent }}
      />
      <div className="relative flex items-start justify-between">
        <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">{title}</p>
        {icon && (
          <div className={cn("flex h-9 w-9 items-center justify-center rounded-xl ring-1 ring-inset ring-white/10", iconBg)}>
            {icon}
          </div>
        )}
      </div>
      <div className="relative mt-3 flex items-end gap-2">
        <p className="text-[26px] font-bold leading-none text-white tracking-tight">
          {canAnimate ? (
            <AnimatedCounter value={numeric} prefix={prefix} suffix={suffix} />
          ) : (
            <>
              {prefix}
              {value}
              {suffix}
            </>
          )}
        </p>
        {trend !== undefined && (
          <span
            className={cn(
              "mb-1 inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[11px] font-semibold",
              isPositive ? "bg-[#10B981]/12 text-[#34d399]" : "bg-[#f43f5e]/12 text-[#fb7185]"
            )}
          >
            {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {Math.abs(trend)}%
          </span>
        )}
      </div>
      {series && series.length > 1 && (
        <div className="relative mt-3 -mx-1">
          <Sparkline data={series} color={accent} />
        </div>
      )}
    </div>
  );
}
