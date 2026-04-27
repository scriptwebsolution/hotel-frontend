const statusStyles = {
  Available: "bg-emerald-50 text-emerald-700",
  Occupied: "bg-amber-50 text-amber-700",
  Maintenance: "bg-rose-50 text-rose-700",
};

export default function RoomCard({ room, onBook }) {
  const {
    name,
    type,
    price,
    status = "Available",
    capacity,
    image,
    features = [],
  } = room;

  const isAvailable = status === "Available";

  return (
    <article className="card overflow-hidden transition duration-200 hover:-translate-y-0.5 hover:shadow-lg">
      <div className="relative h-44 w-full overflow-hidden bg-ink-100">
        {image ? (
          <img
            src={image}
            alt={name}
            className="h-full w-full object-cover transition duration-300 hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-ink-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="h-10 w-10"
            >
              <rect x="3" y="7" width="18" height="13" rx="2" />
              <path d="M7 7V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2" />
            </svg>
          </div>
        )}
        <span
          className={`badge absolute left-3 top-3 ${
            statusStyles[status] || "bg-ink-100 text-ink-700"
          }`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              isAvailable
                ? "bg-emerald-500"
                : status === "Occupied"
                ? "bg-amber-500"
                : "bg-rose-500"
            }`}
          />
          {status}
        </span>
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-brand-600">
              {type}
            </p>
            <h3 className="mt-1 text-base font-semibold text-ink-900">
              {name}
            </h3>
          </div>
          <div className="text-right">
            <p className="text-lg font-semibold text-ink-900">
              ${price}
              <span className="text-xs font-normal text-ink-500"> / night</span>
            </p>
          </div>
        </div>

        {capacity && (
          <p className="mt-2 text-sm text-ink-500">
            Sleeps up to {capacity} guests
          </p>
        )}

        {features.length > 0 && (
          <ul className="mt-4 flex flex-wrap gap-2">
            {features.map((f) => (
              <li
                key={f}
                className="badge bg-ink-50 text-ink-600"
              >
                {f}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-5 flex items-center gap-2">
          <button
            type="button"
            onClick={() => onBook?.(room)}
            disabled={!isAvailable}
            className="btn-primary flex-1"
          >
            {isAvailable ? "Book now" : "Unavailable"}
          </button>
          <button type="button" className="btn-ghost">
            Details
          </button>
        </div>
      </div>
    </article>
  );
}
