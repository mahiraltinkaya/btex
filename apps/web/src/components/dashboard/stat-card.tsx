import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  trend?: string;
  trendUp?: boolean;
}

export function StatCard({
  icon: Icon,
  label,
  value,
  trend,
  trendUp,
}: StatCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl transition-colors duration-200 hover:bg-white/[0.06] sm:p-6">
      {/* Glow accent */}
      <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-[#e63946]/5 blur-2xl transition-all duration-300 group-hover:bg-[#e63946]/10" />

      <div className="relative flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-wider text-white/40">
            {label}
          </p>
          <p className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            {value}
          </p>
          {trend && (
            <p
              className={`text-xs font-medium ${
                trendUp ? "text-emerald-400" : "text-[#e63946]"
              }`}
            >
              {trendUp ? "↑" : "↓"} {trend}
            </p>
          )}
        </div>
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#e63946]/10">
          <Icon className="h-5 w-5 text-[#e63946]" />
        </div>
      </div>
    </div>
  );
}
