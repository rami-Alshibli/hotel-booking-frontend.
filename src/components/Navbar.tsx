import { Link, useLocation } from "react-router-dom";
import { Hotel, BedDouble, CalendarCheck, ClipboardList } from "lucide-react";

export default function Navbar() {
  const { pathname } = useLocation();

  const linkClass = (path: string): string =>
    `flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 font-medium text-sm ${
      pathname === path
        ? "bg-indigo-600 text-white shadow-sm shadow-indigo-200"
        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
    }`;

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand / Logo */}
        <Link to="/rooms" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-sm shadow-indigo-200 group-hover:bg-indigo-700 transition">
            <Hotel className="w-5 h-5" />
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-900">
            Stay<span className="text-indigo-600">Sync</span>
          </span>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-1.5 bg-slate-100/70 p-1 rounded-2xl border border-slate-200/60">
          <Link to="/rooms" className={linkClass("/rooms")}>
            <BedDouble className="w-4 h-4" />
            <span>Manage Rooms</span>
          </Link>
          <Link to="/book" className={linkClass("/book")}>
            <CalendarCheck className="w-4 h-4" />
            <span>Search & Book</span>
          </Link>
          <Link to="/reservations" className={linkClass("/reservations")}>
            <ClipboardList className="w-4 h-4" />
            <span>Reservations</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}