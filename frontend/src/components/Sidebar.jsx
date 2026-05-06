import { NavLink, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import Logo from "./Logo.jsx";

const navItems = [
  {
    to: "/dashboard",
    label: "Dashboard",
    icon: (
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
        <rect x="3" y="3" width="7" height="9" rx="2" />
        <rect x="14" y="3" width="7" height="5" rx="2" />
        <rect x="14" y="12" width="7" height="9" rx="2" />
        <rect x="3" y="16" width="7" height="5" rx="2" />
      </svg>
    ),
  },
  {
    to: "/bookings",
    label: "Bookings",
    icon: (
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
    ),
  },
  {
    to: "/rooms",
    label: "Rooms",
    icon: (
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
        <path d="M10 20v-6h4v6" />
      </svg>
    ),
  },
  {
    label: "Customer",
    icon: (
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
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
    children: [
      { to: "/customer/customer-list", label: "Customer List" },
      { to: "/customer/guest-list", label: "Guest List" },
    ]
  },
  {
    label: "Room Facilities",
    icon: (
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
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
    children: [
      { to: "/room-facilities/facility-list", label: "Facility List" },
      { to: "/room-facilities/facility-details-list", label: "Facility Details List" },
      { to: "/room-facilities/room-size-list", label: "Room Size List" },
    ]
  },
];

export default function Sidebar({ open, onClose }) {
  const location = useLocation();
  const [expandedMenus, setExpandedMenus] = useState({});

  useEffect(() => {
    // Auto-expand menu if a child is active
    navItems.forEach((item) => {
      if (item.children && item.children.some(child => location.pathname.includes(child.to))) {
        setExpandedMenus(prev => ({ ...prev, [item.label]: true }));
      }
    });
  }, [location.pathname]);

  const toggleMenu = (label) => {
    setExpandedMenus(prev => ({ ...prev, [label]: !prev[label] }));
  };
  return (
    <>
      {open && (
        <button
          type="button"
          aria-label="Close sidebar overlay"
          onClick={onClose}
          className="fixed inset-0 z-30 bg-ink-900/40 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-ink-100 bg-white px-5 py-6 transition-transform duration-200 lg:static lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between">
          <Logo />
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-ink-500 hover:bg-ink-100 lg:hidden"
            aria-label="Close sidebar"
          >
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
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="mt-8 flex-1 space-y-1">
          {navItems.map((item) => (
            item.children ? (
              <div key={item.label} className="flex flex-col">
                <button
                  onClick={() => toggleMenu(item.label)}
                  className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                    expandedMenus[item.label] || item.children.some(child => location.pathname.includes(child.to))
                      ? "bg-[#28a745] text-white"
                      : "text-ink-600 hover:bg-ink-50 hover:text-ink-900"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-4 w-4 transition-transform ${expandedMenus[item.label] ? "rotate-180" : ""}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {expandedMenus[item.label] && (
                  <div className="ml-8 mt-1 space-y-1">
                    {item.children.map(child => (
                      <NavLink
                        key={child.to}
                        to={child.to}
                        onClick={onClose}
                        className={({ isActive }) =>
                          `block rounded-lg px-3 py-2 text-sm font-medium transition ${
                            isActive
                              ? "text-[#28a745]"
                              : "text-ink-500 hover:text-ink-900"
                          }`
                        }
                      >
                        {child.label}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                    isActive
                      ? "bg-brand-50 text-brand-700"
                      : "text-ink-600 hover:bg-ink-50 hover:text-ink-900"
                  }`
                }
              >
                {item.icon}
                <span>{item.label}</span>
              </NavLink>
            )
          ))}
        </nav>

        <div className="mt-6 rounded-2xl bg-gradient-to-br from-brand-600 to-brand-800 p-5 text-white">
          <p className="text-sm font-semibold">Need help?</p>
          <p className="mt-1 text-xs text-brand-100">
            Browse our docs or contact support to get the most out of Axiora.
          </p>
          <button
            type="button"
            className="mt-3 inline-flex w-full items-center justify-center rounded-lg bg-white/15 px-3 py-2 text-xs font-medium text-white backdrop-blur transition hover:bg-white/25"
          >
            Open support
          </button>
        </div>
      </aside>
    </>
  );
}
