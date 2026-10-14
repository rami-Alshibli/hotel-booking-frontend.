import { type FormEvent } from "react";
import { Search } from "lucide-react";

interface AvailabilitySearchFormProps {
  dates: { checkIn: string; checkOut: string };
  setDates: (dates: { checkIn: string; checkOut: string }) => void;
  loading: boolean;
  onSubmit: (e: FormEvent) => void;
}

export default function AvailabilitySearchForm({
  dates,
  setDates,
  loading,
  onSubmit,
}: AvailabilitySearchFormProps) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">
        Find & Book a Room
      </h1>
      <p className="text-gray-500 text-sm mb-6">
        Select your check-in and check-out dates to see available rooms.
      </p>

      <form
        onSubmit={onSubmit}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Check-In Date
          </label>
          <input
            type="date"
            required
            value={dates.checkIn}
            onChange={(e) => setDates({ ...dates, checkIn: e.target.value })}
            className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Check-Out Date
          </label>
          <input
            type="date"
            required
            value={dates.checkOut}
            onChange={(e) => setDates({ ...dates, checkOut: e.target.value })}
            className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2.5 px-6 rounded-lg flex items-center justify-center gap-2 transition"
        >
          <Search className="w-5 h-5" />
          <span>{loading ? "Searching..." : "Check Availability"}</span>
        </button>
      </form>
    </div>
  );
}