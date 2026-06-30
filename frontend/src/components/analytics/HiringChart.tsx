"use client";
import type { AnalyticsData } from "@/types";

interface HiringChartProps { data: AnalyticsData[]; }

export function HiringChart({ data }: HiringChartProps) {
  const maxVal = Math.max(...data.map((d) => d.applied));

  return (
    <div className="space-y-4">
      <div className="flex items-end gap-3 h-40">
        {data.map((d) => (
          <div key={d.period} className="flex-1 flex flex-col items-center gap-1">
            <div className="w-full flex flex-col items-center justify-end gap-0.5 h-full relative">
              <div
                className="w-full bg-purple-500/20 rounded-t-lg relative overflow-hidden group cursor-pointer"
                style={{ height: `${(d.applied / maxVal) * 100}%` }}
                title={`Applied: ${d.applied}`}
              >
                <div className="absolute inset-0 bg-purple-500 opacity-30" />
              </div>
              <div
                className="w-full bg-blue-500 rounded-t-lg absolute bottom-0 opacity-80"
                style={{ height: `${(d.hired / maxVal) * 100}%`, width: "40%", left: "30%" }}
                title={`Hired: ${d.hired}`}
              />
            </div>
            <span className="text-xs text-gray-500">{d.period}</span>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-6 justify-center">
        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-purple-500/40" /><span className="text-xs text-gray-400">Applied</span></div>
        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-blue-500" /><span className="text-xs text-gray-400">Hired</span></div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="text-gray-500">
              <th className="text-left py-2">Month</th>
              <th className="text-right py-2">Applied</th>
              <th className="text-right py-2">Screened</th>
              <th className="text-right py-2">Interviewed</th>
              <th className="text-right py-2">Hired</th>
              <th className="text-right py-2">Conv. Rate</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1E1E24]">
            {data.map((d) => (
              <tr key={d.period} className="text-gray-300">
                <td className="py-2 font-medium">{d.period}</td>
                <td className="py-2 text-right">{d.applied}</td>
                <td className="py-2 text-right">{d.screened}</td>
                <td className="py-2 text-right">{d.interviewed}</td>
                <td className="py-2 text-right text-green-400 font-semibold">{d.hired}</td>
                <td className="py-2 text-right text-purple-400">{((d.hired / d.applied) * 100).toFixed(1)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
