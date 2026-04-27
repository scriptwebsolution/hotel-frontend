import StatCard from "../components/StatCard.jsx";
import RoomCard from "../components/RoomCard.jsx";
import { bookings, rooms, stats } from "../utils/mockData.js";

const statusStyles = {
  Confirmed: "bg-brand-50 text-brand-700",
  "Checked-in": "bg-emerald-50 text-emerald-700",
  Pending: "bg-amber-50 text-amber-700",
  Cancelled: "bg-rose-50 text-rose-700",
};

const iconBookings = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-5 w-5"
  >
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <path d="M16 2v4M8 2v4M3 10h18" />
  </svg>
);

const iconRooms = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-5 w-5"
  >
    <path d="M3 12 12 4l9 8" />
    <path d="M5 10v10h14V10" />
  </svg>
);

const iconOccupancy = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-5 w-5"
  >
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21c0-4 4-7 8-7s8 3 8 7" />
  </svg>
);

const iconRevenue = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-5 w-5"
  >
    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
);

export default function Dashboard() {
  const featuredRooms = rooms.slice(0, 3);
  const recentBookings = bookings.slice(0, 4);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm text-ink-500">Welcome back, Aarav</p>
          <h1 className="mt-1 text-2xl font-semibold text-ink-900 sm:text-3xl">
            Hotel overview
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn-ghost">Export</button>
          <button className="btn-primary">+ New booking</button>
        </div>
      </div>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total bookings"
          value={stats.totalBookings}
          delta="12.4%"
          trend="up"
          icon={iconBookings}
        />
        <StatCard
          label="Total rooms"
          value={stats.totalRooms}
          delta="2 new"
          trend="up"
          icon={iconRooms}
        />
        <StatCard
          label="Occupancy"
          value={stats.occupancy}
          delta="3.1%"
          trend="up"
          icon={iconOccupancy}
        />
        <StatCard
          label="Revenue"
          value={stats.revenue}
          delta="5.8%"
          trend="up"
          icon={iconRevenue}
        />
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="card p-6 xl:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-ink-900">
                Recent bookings
              </h2>
              <p className="text-sm text-ink-500">
                Latest reservations made across your properties
              </p>
            </div>
            <button className="btn-ghost text-xs">View all</button>
          </div>

          <div className="mt-5 overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-xs font-medium uppercase tracking-wide text-ink-500">
                  <th className="pb-3 pr-4">Booking</th>
                  <th className="pb-3 pr-4">Guest</th>
                  <th className="pb-3 pr-4">Room</th>
                  <th className="pb-3 pr-4">Check-in</th>
                  <th className="pb-3 pr-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100">
                {recentBookings.map((b) => (
                  <tr key={b.id} className="text-ink-700">
                    <td className="py-3 pr-4 font-medium text-ink-900">
                      {b.id}
                    </td>
                    <td className="py-3 pr-4">{b.guest}</td>
                    <td className="py-3 pr-4">{b.roomType}</td>
                    <td className="py-3 pr-4">{b.checkIn}</td>
                    <td className="py-3 pr-4">
                      <span
                        className={`badge ${
                          statusStyles[b.status] || "bg-ink-100 text-ink-700"
                        }`}
                      >
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card p-6">
          <h2 className="text-base font-semibold text-ink-900">
            Today's activity
          </h2>
          <p className="text-sm text-ink-500">A quick snapshot of operations</p>

          <ul className="mt-5 space-y-4">
            {[
              { label: "Check-ins", value: 12, color: "bg-brand-500" },
              { label: "Check-outs", value: 8, color: "bg-emerald-500" },
              { label: "Pending requests", value: 5, color: "bg-amber-500" },
              { label: "Maintenance", value: 2, color: "bg-rose-500" },
            ].map((item) => (
              <li
                key={item.label}
                className="flex items-center justify-between rounded-xl border border-ink-100 bg-ink-50/60 px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <span className={`h-2.5 w-2.5 rounded-full ${item.color}`} />
                  <span className="text-sm text-ink-700">{item.label}</span>
                </div>
                <span className="text-sm font-semibold text-ink-900">
                  {item.value}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-ink-900">
              Featured rooms
            </h2>
            <p className="text-sm text-ink-500">Top-performing room types</p>
          </div>
          <button className="btn-ghost text-xs">Browse all</button>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {featuredRooms.map((room) => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>
      </section>
    </div>
  );
}
