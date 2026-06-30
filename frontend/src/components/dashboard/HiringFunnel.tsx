"use client";
const stages = [
  { label: "Applied", count: 524, color: "bg-gray-500" },
  { label: "Screened", count: 312, color: "bg-blue-500" },
  { label: "Interview", count: 148, color: "bg-purple-500" },
  { label: "Offer", count: 48, color: "bg-yellow-500" },
  { label: "Hired", count: 21, color: "bg-green-500" },
];

export function HiringFunnel() {
  const max = stages[0].count;
  return (
    <div className="space-y-3">
      {stages.map((stage, i) => (
        <div key={stage.label} className="flex items-center gap-4">
          <span className="w-20 text-xs text-gray-400 text-right flex-shrink-0">{stage.label}</span>
          <div className="flex-1 h-8 bg-[#111114] rounded-lg overflow-hidden relative">
            <div
              className={`h-full ${stage.color} rounded-lg transition-all duration-700 flex items-center px-3`}
              style={{ width: `${(stage.count / max) * 100}%` }}
            >
              <span className="text-xs font-semibold text-white">{stage.count}</span>
            </div>
          </div>
          <span className="w-16 text-xs text-gray-500 flex-shrink-0">
            {i > 0 ? `${Math.round((stage.count / stages[i-1].count) * 100)}%` : "100%"}
          </span>
        </div>
      ))}
    </div>
  );
}
