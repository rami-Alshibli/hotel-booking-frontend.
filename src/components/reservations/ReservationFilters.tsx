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
    <div className="bg-white p-4 rounded-2xl shadow-xs border border-slate-200/80 flex flex-col md:flex-row gap-4">
      <div className="flex-1 relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search by customer phone..."
          value={phoneFilter}
          onChange={(e) => setPhoneFilter(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-slate-200 bg-slate-50/50 focus:bg-white rounded-xl text-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
        />
      </div>

      <div className="w-full md:w-52">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full border border-slate-200 bg-slate-50/50 focus:bg-white rounded-xl px-3 py-2 text-sm text-slate-700 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all cursor-pointer"
        >
          <option value="ALL">All Statuses</option>
          <option value="Confirmed">Active (Confirmed)</option>
          <option value="Cancelled">Cancelled</option>
          <option value="CheckedOut">Checked Out</option>
        </select>
      </div>
    </div>
  );
}