import { useEffect, useState } from "react";
import StatCard from "../components/StatCard.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import { fetchDashboardStats, fetchDashboardAnalytics } from "../services/dashboardService.js";

// Chart Components
import ReservationTrendChart from "../components/charts/ReservationTrendChart.jsx";
import BookingStatusChart from "../components/charts/BookingStatusChart.jsx";
import RevenueChart from "../components/charts/RevenueChart.jsx";
import CustomerActivityChart from "../components/charts/CustomerActivityChart.jsx";

const iconBookings = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-white">
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <path d="M16 2v4M8 2v4M3 10h18" />
  </svg>
);

const iconRevenue = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-white">
    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
);

const iconCustomers = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-white">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const formatCurrency = (value) => {
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}m`;
  if (value >= 1000) return `$${(value / 1000).toFixed(1)}k`;
  return `$${value}`;
};

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        setError("");
        const [statsData, analyticsData] = await Promise.all([
          fetchDashboardStats(),
          fetchDashboardAnalytics(),
        ]);
        setStats(statsData);
        setAnalytics(analyticsData);
      } catch (err) {
        setError("Failed to load dashboard data. Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-full min-h-[60vh] items-center justify-center">
        <div className="text-lg text-ink-500 animate-pulse">Loading dashboard analytics...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-rose-200 bg-rose-50 p-6 text-rose-700">
        <h2 className="text-lg font-semibold mb-2">Error</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()} className="mt-4 btn-primary">Retry</button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between mb-4">
        <div>
          <h1 className="text-2xl font-semibold text-ink-900 sm:text-3xl">
            Hotel Analytics Dashboard
          </h1>
          <p className="mt-1 text-sm text-ink-500">Real-time insights and performance metrics</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn-ghost">Export Report</button>
          <button onClick={() => navigate('/bookings')} className="btn-primary">+ New Booking</button>
        </div>
      </div>

      {/* Top Stats Row */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Adjusted StatCard manually since the default one doesn't have custom colored icon backgrounds like the screenshot */}
        <div className="card p-0 overflow-hidden flex flex-row items-center transition-transform hover:-translate-y-1 hover:shadow-md">
          <div className="bg-amber-500 p-6 flex items-center justify-center">
            {iconBookings}
          </div>
          <div className="p-4 flex-1">
            <p className="text-[11px] font-bold uppercase tracking-wider text-ink-400">Today Booking</p>
            <p className="text-2xl font-semibold text-ink-900">{stats?.todayBooking || 0}</p>
          </div>
        </div>

        <div className="card p-0 overflow-hidden flex flex-row items-center transition-transform hover:-translate-y-1 hover:shadow-md">
          <div className="bg-emerald-500 p-6 flex items-center justify-center">
            {iconRevenue}
          </div>
          <div className="p-4 flex-1">
            <p className="text-[11px] font-bold uppercase tracking-wider text-ink-400">Total Amount</p>
            <p className="text-2xl font-semibold text-ink-900">{formatCurrency(stats?.totalAmount || 0)}</p>
          </div>
        </div>

        <div className="card p-0 overflow-hidden flex flex-row items-center transition-transform hover:-translate-y-1 hover:shadow-md">
          <div className="bg-rose-500 p-6 flex items-center justify-center">
            {iconCustomers}
          </div>
          <div className="p-4 flex-1">
            <p className="text-[11px] font-bold uppercase tracking-wider text-ink-400">Total Customer</p>
            <p className="text-2xl font-semibold text-ink-900">{stats?.totalCustomer || 0}</p>
          </div>
        </div>

        <div className="card p-0 overflow-hidden flex flex-row items-center transition-transform hover:-translate-y-1 hover:shadow-md">
          <div className="bg-cyan-500 p-6 flex items-center justify-center">
            {iconBookings}
          </div>
          <div className="p-4 flex-1">
            <p className="text-[11px] font-bold uppercase tracking-wider text-ink-400">Total Booking</p>
            <p className="text-2xl font-semibold text-ink-900">{stats?.totalBooking || 0}</p>
          </div>
        </div>
      </section>

      {/* Main Chart Row */}
      <section className="card p-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-base font-semibold text-ink-900">Customer Reservations</h2>
          <button className="text-ink-400 hover:text-ink-600">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
          </button>
        </div>
        <ReservationTrendChart data={analytics?.reservationTrend} />
      </section>

      {/* Two Column Charts Row */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="card p-6">
          <h2 className="mb-6 text-base font-semibold text-ink-900">Total Booking History</h2>
          <BookingStatusChart data={analytics?.bookingStatus} />
        </div>
        <div className="card p-6">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-base font-semibold text-ink-900">New Customers Trend</h2>
          </div>
          <CustomerActivityChart data={analytics?.customerActivity} />
        </div>
      </section>

      {/* Bottom Row */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="card p-6">
          <h2 className="mb-6 text-base font-semibold text-ink-900">Total Booking Amount vs Total Number of Booking</h2>
          <RevenueChart data={analytics?.revenueVsBookings} />
        </div>
        
        {/* Quick Activity Stats to match original functionality but styled nicely */}
        <div className="card p-6 flex flex-col justify-between">
           <h2 className="text-base font-semibold text-ink-900 mb-6">Today's Activity Snapshot</h2>
           <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl border border-ink-100 bg-ink-50 p-4 flex flex-col">
                <span className="text-sm text-ink-500 mb-1">Check-ins</span>
                <span className="text-3xl font-bold text-emerald-600">{stats?.checkinsToday || 0}</span>
              </div>
              <div className="rounded-xl border border-ink-100 bg-ink-50 p-4 flex flex-col">
                <span className="text-sm text-ink-500 mb-1">Check-outs</span>
                <span className="text-3xl font-bold text-blue-600">{stats?.checkoutsToday || 0}</span>
              </div>
              <div className="rounded-xl border border-ink-100 bg-ink-50 p-4 flex flex-col">
                <span className="text-sm text-ink-500 mb-1">Pending</span>
                <span className="text-3xl font-bold text-amber-500">{stats?.pendingBookings || 0}</span>
              </div>
              <div className="rounded-xl border border-ink-100 bg-ink-50 p-4 flex flex-col">
                <span className="text-sm text-ink-500 mb-1">Cancelled</span>
                <span className="text-3xl font-bold text-rose-500">{stats?.cancelledBookings || 0}</span>
              </div>
           </div>
        </div>
      </section>
    </div>
  );
}
