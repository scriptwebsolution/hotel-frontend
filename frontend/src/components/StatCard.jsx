export default function StatCard({ label, value, delta, trend = "up", icon }) {
  const trendColor =
    trend === "up"
      ? "text-emerald-600 bg-emerald-50"
      : "text-rose-600 bg-rose-50";

  return (
    <div className="card p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-ink-500">{label}</p>
          <p className="mt-2 text-2xl font-semibold text-ink-900">{value}</p>
        </div>
        {icon && (
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
            {icon}
          </div>
        )}
      </div>
      {delta && (
        <div className="mt-4 flex items-center gap-2">
          <span className={`badge ${trendColor}`}>
            {trend === "up" ? "▲" : "▼"} {delta}
          </span>
          <span className="text-xs text-ink-500">vs. last week</span>
        </div>
      )}
    </div>
  );
}
