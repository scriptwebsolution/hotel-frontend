import { useMemo, useState } from "react";
import { guests as allGuests } from "../utils/mockData.js";

const statusStyles = {
  VIP: "bg-brand-50 text-brand-700",
  Active: "bg-emerald-50 text-emerald-700",
  New: "bg-amber-50 text-amber-700",
};

function getInitials(name) {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function Guests() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return allGuests.filter((g) => {
      const matchFilter = filter === "All" || g.status === filter;
      const matchQuery =
        !q ||
        g.name.toLowerCase().includes(q) ||
        g.email.toLowerCase().includes(q) ||
        g.country.toLowerCase().includes(q);
      return matchFilter && matchQuery;
    });
  }, [query, filter]);

  const totals = useMemo(
    () => ({
      total: allGuests.length,
      vip: allGuests.filter((g) => g.status === "VIP").length,
      active: allGuests.filter((g) => g.status === "Active").length,
      revenue: allGuests.reduce((sum, g) => sum + g.totalSpend, 0),
    }),
    []
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm text-ink-500">Customer relations</p>
          <h1 className="mt-1 text-2xl font-semibold text-ink-900 sm:text-3xl">
            Guests
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn-ghost">Export CSV</button>
          <button className="btn-primary">+ Add guest</button>
        </div>
      </div>

      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="card p-5">
          <p className="text-sm text-ink-500">Total guests</p>
          <p className="mt-2 text-2xl font-semibold text-ink-900">
            {totals.total}
          </p>
        </div>
        <div className="card p-5">
          <p className="text-sm text-ink-500">VIP members</p>
          <p className="mt-2 text-2xl font-semibold text-ink-900">
            {totals.vip}
          </p>
        </div>
        <div className="card p-5">
          <p className="text-sm text-ink-500">Active this month</p>
          <p className="mt-2 text-2xl font-semibold text-ink-900">
            {totals.active}
          </p>
        </div>
        <div className="card p-5">
          <p className="text-sm text-ink-500">Lifetime spend</p>
          <p className="mt-2 text-2xl font-semibold text-ink-900">
            ${totals.revenue.toLocaleString()}
          </p>
        </div>
      </section>

      <section className="card p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            {["All", "VIP", "Active", "New"].map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={`rounded-xl border px-3.5 py-2 text-sm font-medium transition ${
                  filter === f
                    ? "border-brand-200 bg-brand-50 text-brand-700"
                    : "border-ink-200 bg-white text-ink-600 hover:bg-ink-50"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="relative w-full lg:w-72">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search guests..."
              className="input pl-9"
            />
          </div>
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-xs font-medium uppercase tracking-wide text-ink-500">
                <th className="pb-3 pr-4">Guest</th>
                <th className="pb-3 pr-4">Country</th>
                <th className="pb-3 pr-4">Stays</th>
                <th className="pb-3 pr-4">Total spend</th>
                <th className="pb-3 pr-4">Last stay</th>
                <th className="pb-3 pr-4">Status</th>
                <th className="pb-3 pr-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="py-10 text-center text-sm text-ink-500"
                  >
                    No guests match your filters.
                  </td>
                </tr>
              ) : (
                filtered.map((g) => (
                  <tr key={g.id} className="text-ink-700">
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-100 text-xs font-semibold text-brand-700">
                          {getInitials(g.name)}
                        </span>
                        <div className="leading-tight">
                          <p className="font-medium text-ink-900">{g.name}</p>
                          <p className="text-xs text-ink-500">{g.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 pr-4">{g.country}</td>
                    <td className="py-3 pr-4">{g.stays}</td>
                    <td className="py-3 pr-4 font-medium text-ink-900">
                      ${g.totalSpend.toLocaleString()}
                    </td>
                    <td className="py-3 pr-4">{g.lastStay}</td>
                    <td className="py-3 pr-4">
                      <span
                        className={`badge ${
                          statusStyles[g.status] || "bg-ink-100 text-ink-700"
                        }`}
                      >
                        {g.status}
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-right">
                      <button
                        type="button"
                        className="text-xs font-medium text-brand-600 hover:underline"
                      >
                        View profile
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
