export default function Logo({ collapsed = false }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white shadow-sm">
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
          <path d="M3 21V8l9-5 9 5v13" />
          <path d="M9 21v-6h6v6" />
          <path d="M9 12h6" />
        </svg>
      </div>
      {!collapsed && (
        <div className="leading-tight">
          <p className="text-sm font-semibold text-ink-900">Axiora</p>
          <p className="text-[11px] text-ink-500">Hotel Management</p>
        </div>
      )}
    </div>
  );
}
