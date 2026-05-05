import { useMemo, useState } from "react";
import { bookings as initialBookings } from "../utils/mockData.js";

const roomTypes = ["Standard", "Deluxe", "Studio", "Suite", "Family", "Penthouse"];

const statusStyles = {
  Confirmed: "bg-brand-50 text-brand-700",
  "Checked-in": "bg-emerald-50 text-emerald-700",
  Pending: "bg-amber-50 text-amber-700",
  Cancelled: "bg-rose-50 text-rose-700",
};

const initialForm = {
  guest: "",
  email: "",
  roomType: "Deluxe",
  checkIn: "",
  checkOut: "",
};

export default function Booking() {
  const [form, setForm] = useState(initialForm);
  const [list, setList] = useState(initialBookings);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query.trim()) return list;
    const q = query.toLowerCase();
    return list.filter(
      (b) =>
        b.guest.toLowerCase().includes(q) ||
        b.id.toLowerCase().includes(q) ||
        b.roomType.toLowerCase().includes(q)
    );
  }, [list, query]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.guest || !form.checkIn || !form.checkOut) return;

    const newBooking = {
      id: `BK-${Math.floor(1000 + Math.random() * 9000)}`,
      guest: form.guest,
      email: form.email || "—",
      roomType: form.roomType,
      checkIn: form.checkIn,
      checkOut: form.checkOut,
      status: "Pending",
      total: 0,
    };

    setList((prev) => [newBooking, ...prev]);
    setForm(initialForm);
  };

  const handleCancel = (id) => {
    setList((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: "Cancelled" } : b))
    );
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm text-ink-500">Manage reservations</p>
          <h1 className="mt-1 text-2xl font-semibold text-ink-900 sm:text-3xl">
            Bookings
          </h1>
        </div>
        <div className="relative w-full sm:w-72">
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
            placeholder="Search bookings..."
            className="input pl-9"
          />
        </div>
      </div>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="card p-6 xl:col-span-1">
          <h2 className="text-base font-semibold text-ink-900">New booking</h2>
          <p className="text-sm text-ink-500">
            Fill in guest details to create a reservation
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label htmlFor="guest" className="label">
                Guest name
              </label>
              <input
                id="guest"
                name="guest"
                type="text"
                value={form.guest}
                onChange={handleChange}
                placeholder="e.g. Priya Sharma"
                className="input"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="label">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="guest@example.com"
                className="input"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="checkIn" className="label">
                  Check-in
                </label>
                <input
                  id="checkIn"
                  name="checkIn"
                  type="date"
                  value={form.checkIn}
                  onChange={handleChange}
                  className="input"
                  min="2024-01-01"
                  max="2099-12-31"
                  required
                />
              </div>
              <div>
                <label htmlFor="checkOut" className="label">
                  Check-out
                </label>
                <input
                  id="checkOut"
                  name="checkOut"
                  type="date"
                  value={form.checkOut}
                  onChange={handleChange}
                  className="input"
                  min="2024-01-01"
                  max="2099-12-31"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="roomType" className="label">
                Room type
              </label>
              <select
                id="roomType"
                name="roomType"
                value={form.roomType}
                onChange={handleChange}
                className="input"
              >
                {roomTypes.map((rt) => (
                  <option key={rt} value={rt}>
                    {rt}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button type="submit" className="btn-primary flex-1">
                Create booking
              </button>
              <button
                type="button"
                onClick={() => setForm(initialForm)}
                className="btn-ghost"
              >
                Reset
              </button>
            </div>
          </form>
        </div>

        <div className="card p-6 xl:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-ink-900">
                All bookings
              </h2>
              <p className="text-sm text-ink-500">
                {filtered.length} {filtered.length === 1 ? "result" : "results"}
              </p>
            </div>
          </div>

          <div className="mt-5 overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-xs font-medium uppercase tracking-wide text-ink-500">
                  <th className="pb-3 pr-4">Booking</th>
                  <th className="pb-3 pr-4">Guest</th>
                  <th className="pb-3 pr-4">Room</th>
                  <th className="pb-3 pr-4">Check-in</th>
                  <th className="pb-3 pr-4">Check-out</th>
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
                      No bookings match your search.
                    </td>
                  </tr>
                ) : (
                  filtered.map((b) => (
                    <tr key={b.id} className="text-ink-700">
                      <td className="py-3 pr-4 font-medium text-ink-900">
                        {b.id}
                      </td>
                      <td className="py-3 pr-4">
                        <div className="leading-tight">
                          <p className="font-medium text-ink-900">{b.guest}</p>
                          <p className="text-xs text-ink-500">{b.email}</p>
                        </div>
                      </td>
                      <td className="py-3 pr-4">{b.roomType}</td>
                      <td className="py-3 pr-4">{b.checkIn}</td>
                      <td className="py-3 pr-4">{b.checkOut}</td>
                      <td className="py-3 pr-4">
                        <span
                          className={`badge ${
                            statusStyles[b.status] || "bg-ink-100 text-ink-700"
                          }`}
                        >
                          {b.status}
                        </span>
                      </td>
                      <td className="py-3 pr-4 text-right">
                        <button
                          type="button"
                          onClick={() => handleCancel(b.id)}
                          disabled={b.status === "Cancelled"}
                          className="text-xs font-medium text-rose-600 hover:underline disabled:cursor-not-allowed disabled:text-ink-300 disabled:no-underline"
                        >
                          Cancel
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
