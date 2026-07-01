"use client";
import { motion } from "framer-motion";

const stages = [
  { label: "Applied", count: 524, from: "#64748b", to: "#94a3b8" },
  { label: "Screened", count: 312, from: "#3B82F6", to: "#60a5fa" },
  { label: "Interview", count: 148, from: "#7C3AED", to: "#a78bfa" },
  { label: "Offer", count: 48, from: "#F59E0B", to: "#fbbf24" },
  { label: "Hired", count: 21, from: "#10B981", to: "#34d399" },
];

export function HiringFunnel() {
  const max = stages[0].count;
  return (
    <div className="space-y-2.5">
      {stages.map((stage, i) => (
        <div key={stage.label} className="flex items-center gap-4">
          <span className="w-20 flex-shrink-0 text-right text-xs text-gray-400">{stage.label}</span>
          <div className="relative h-9 flex-1 overflow-hidden rounded-xl bg-white/[0.03]">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${(stage.count / max) * 100}%` }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: i * 0.08 }}
              className="flex h-full items-center rounded-xl px-3"
              style={{ background: `linear-gradient(90deg, ${stage.from}, ${stage.to})` }}
            >
              <span className="text-xs font-semibold text-white drop-shadow">{stage.count}</span>
            </motion.div>
          </div>
          <span className="w-14 flex-shrink-0 text-xs text-gray-500">
            {i > 0 ? `${Math.round((stage.count / stages[i - 1].count) * 100)}%` : "100%"}
          </span>
        </div>
      ))}
    </div>
  );
}
