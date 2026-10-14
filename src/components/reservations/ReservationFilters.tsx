import { Search } from "lucide-react";

interface ReservationFiltersProps {
  phoneFilter: string;
  setPhoneFilter: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
}

export default function ReservationFilters({
  phoneFilter,
  setPhoneFilter,
  statusFilter,
  setStatusFilter,
}: ReservationFiltersProps) {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col md:flex-row gap-4">
      <div className="flex-1 relative">
        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search by customer phone..."
          value={phoneFilter}
          onChange={(e) => setPhoneFilter(e.target.value)}
          className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      <div className="w-full md:w-48">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-2 text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none"
        >
          <option value="ALL">All Statuses</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Cancelled">Cancelled</option>
          <option value="CheckedIn">CheckedIn</option>
          <option value="CheckedOut">CheckedOut</option>
        </select>
      </div>
    </div>
  );
}