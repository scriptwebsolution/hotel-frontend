import { useEffect, useMemo, useState } from "react";
import RoomCard from "../components/RoomCard.jsx";
import { rooms as allRooms } from "../utils/mockData.js";
import { fetchRooms } from "../services/roomService.js";

const filters = ["All", "Available", "Occupied", "Maintenance"];

export default function Rooms() {
  const [active, setActive] = useState("All");
  const [query, setQuery] = useState("");
  const [backendRooms, setBackendRooms] = useState(allRooms);
  const [loadingRooms, setLoadingRooms] = useState(true);
  const [roomsError, setRoomsError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoadingRooms(true);
        setRoomsError("");
        const data = await fetchRooms();
        setBackendRooms(data);
      } catch (err) {
        setRoomsError(err.message || "Unable to reach backend.");
      } finally {
        setLoadingRooms(false);
      }
    };

    load();
  }, []);

  const visible = useMemo(() => {
    return backendRooms.filter((r) => {
      const matchStatus = active === "All" || r.status === active;
      const q = query.trim().toLowerCase();
      const matchQuery =
        !q ||
        r.name?.toLowerCase().includes(q) ||
        r.type?.toLowerCase().includes(q) ||
        String(r.id).toLowerCase().includes(q);
      return matchStatus && matchQuery;
    });
  }, [active, query, backendRooms]);

  const counts = useMemo(
    () => ({
      All: backendRooms.length,
      Available: backendRooms.filter((r) => r.status === "Available").length,
      Occupied: backendRooms.filter((r) => r.status === "Occupied").length,
      Maintenance: backendRooms.filter((r) => r.status === "Maintenance").length,
    }),
    [backendRooms]
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm text-ink-500">Inventory</p>
          <h1 className="mt-1 text-2xl font-semibold text-ink-900 sm:text-3xl">
            Rooms
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn-ghost">Import</button>
          <button className="btn-primary">+ Add room</button>
        </div>
      </div>

      {roomsError && (
        <section className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Backend room API not reachable. Showing fallback demo data.
        </section>
      )}

      <section className="card p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            {filters.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setActive(f)}
                className={`rounded-xl border px-3.5 py-2 text-sm font-medium transition ${
                  active === f
                    ? "border-brand-200 bg-brand-50 text-brand-700"
                    : "border-ink-200 bg-white text-ink-600 hover:bg-ink-50"
                }`}
              >
                {f}
                <span className="ml-2 text-xs text-ink-400">{counts[f]}</span>
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
              placeholder="Search rooms..."
              className="input pl-9"
            />
          </div>
        </div>
      </section>

      {loadingRooms ? (
        <div className="card flex items-center justify-center px-6 py-16 text-sm text-ink-500">
          Loading rooms from backend...
        </div>
      ) : visible.length === 0 ? (
        <div className="card flex flex-col items-center justify-center px-6 py-16 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-ink-100 text-ink-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </div>
          <h3 className="mt-4 text-base font-semibold text-ink-900">
            No rooms found
          </h3>
          <p className="mt-1 text-sm text-ink-500">
            Try adjusting your filters or search query.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {visible.map((room) => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>
      )}
    </div>
  );
}
