"use client";

const retentionData = [
  { month: "Jan", rate: 96.2, attrition: 3.8 },
  { month: "Feb", rate: 95.8, attrition: 4.2 },
  { month: "Mar", rate: 96.5, attrition: 3.5 },
  { month: "Apr", rate: 95.1, attrition: 4.9 },
  { month: "May", rate: 96.8, attrition: 3.2 },
  { month: "Jun", rate: 94.2, attrition: 5.8 },
];

export function RetentionChart() {
  const max = 100;
  return (
    <div className="space-y-4">
      <div className="flex items-end gap-3 h-40">
        {retentionData.map((d) => (
          <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
            <div className="w-full flex flex-col items-end justify-end h-full">
              <div
                className="w-full rounded-t-lg bg-gradient-to-t from-green-600 to-green-400 opacity-80 cursor-pointer"
                style={{ height: `${(d.rate / max) * 100}%` }}
                title={`Retention: ${d.rate}%`}
              />
            </div>
            <span className="text-xs text-gray-500">{d.month}</span>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Avg Retention", value: `${(retentionData.reduce((s, d) => s + d.rate, 0) / retentionData.length).toFixed(1)}%`, color: "text-green-400" },
          { label: "Best Month", value: `${Math.max(...retentionData.map(d => d.rate))}%`, color: "text-blue-400" },
          { label: "Avg Attrition", value: `${(retentionData.reduce((s, d) => s + d.attrition, 0) / retentionData.length).toFixed(1)}%`, color: "text-red-400" },
        ].map((m) => (
          <div key={m.label} className="bg-[#111114] rounded-xl p-3 text-center">
            <p className={`text-base font-bold ${m.color}`}>{m.value}</p>
            <p className="text-xs text-gray-500">{m.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
