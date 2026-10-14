import { Link, useLocation } from "react-router-dom";
import { Hotel, BedDouble, CalendarCheck } from "lucide-react";

export default function Navbar() {
  const { pathname } = useLocation();

  const linkClass = (path: string): string =>
    `flex items-center gap-2 px-4 py-2 rounded-lg transition-colors font-medium text-sm md:text-base ${
      pathname === path
        ? "bg-blue-600 text-white"
        : "text-gray-600 hover:bg-gray-100"
    }`;

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Brand / Logo */}
        <Link to="/rooms" className="flex items-center gap-2 text-blue-600 font-bold text-xl">
          <Hotel className="w-7 h-7" />
          <span>Hotel Booking</span>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-2">
          <Link to="/rooms" className={linkClass("/rooms")}>
            <BedDouble className="w-5 h-5" />
            <span>Manage Rooms</span>
          </Link>
          <Link to="/book" className={linkClass("/book")}>
            <CalendarCheck className="w-5 h-5" />
            <span>Search & Book</span>
          </Link>
          <Link to="/reservations" className={linkClass("/reservations")}>
            <Hotel className="w-5 h-5" />
            <span>Reservations</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}