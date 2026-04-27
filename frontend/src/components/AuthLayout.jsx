import Logo from "./Logo.jsx";

export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="grid min-h-screen grid-cols-1 bg-ink-50 lg:grid-cols-2">
      <section className="flex items-center justify-center px-6 py-10 sm:px-10">
        <div className="w-full max-w-md">
          <Logo />
          <div className="mt-10">
            <h1 className="text-2xl font-semibold text-ink-900 sm:text-3xl">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-2 text-sm text-ink-500">{subtitle}</p>
            )}
          </div>
          <div className="mt-8 card p-6 sm:p-8">{children}</div>
          {footer && (
            <p className="mt-6 text-center text-sm text-ink-500">{footer}</p>
          )}
        </div>
      </section>

      <aside className="relative hidden overflow-hidden bg-gradient-to-br from-brand-700 via-brand-600 to-brand-500 lg:block">
        <div className="absolute inset-0 opacity-25">
          <div className="absolute -left-20 top-12 h-72 w-72 rounded-full bg-white/30 blur-3xl" />
          <div className="absolute -right-10 bottom-10 h-80 w-80 rounded-full bg-white/20 blur-3xl" />
        </div>
        <div className="relative flex h-full flex-col justify-between p-12 text-white">
          <div className="flex items-center gap-2 text-sm font-medium text-white/80">
            <span className="h-1.5 w-1.5 rounded-full bg-white" />
            Axiora platform
          </div>

          <div className="space-y-6">
            <h2 className="text-3xl font-semibold leading-tight">
              Run your hotel like a five-star concierge.
            </h2>
            <p className="max-w-md text-sm text-white/80">
              Manage bookings, rooms, and guests in one elegant workspace —
              built for modern hospitality teams.
            </p>
            <ul className="space-y-3 text-sm text-white/90">
              {[
                "Real-time occupancy & revenue insights",
                "One-click guest check-in / check-out",
                "Secure access for staff and admins",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-3.5 w-3.5"
                    >
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <p className="text-xs text-white/70">
            © {new Date().getFullYear()} Axiora. All rights reserved.
          </p>
        </div>
      </aside>
    </div>
  );
}
