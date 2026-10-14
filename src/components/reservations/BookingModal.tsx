import { type FormEvent } from "react";
import type { Room } from "../../types";
import { Calendar } from "lucide-react";

interface BookingModalProps {
  room: Room | null;
  dates: { checkIn: string; checkOut: string };
  customer: { customerFullName: string; customerPhone: string };
  setCustomer: (customer: {
    customerFullName: string;
    customerPhone: string;
  }) => void;
  loading: boolean;
  onSubmit: (e: FormEvent) => void;
  onClose: () => void;
}

export default function BookingModal({
  room,
  dates,
  customer,
  setCustomer,
  loading,
  onSubmit,
  onClose,
}: BookingModalProps) {
  if (!room) return null;

  const getNightsCount = () => {
    if (!dates.checkIn || !dates.checkOut) return 0;
    const diff =
      new Date(dates.checkOut).getTime() - new Date(dates.checkIn).getTime();
    return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  const nights = getNightsCount();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl">
        <h2 className="text-xl font-bold text-gray-900 mb-1">
          Book Room #{room.roomNumber}
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          {room.roomType} — {room.roomCategory}
        </p>

        <div className="bg-gray-50 p-3.5 rounded-lg border border-gray-200 text-sm space-y-1.5 mb-5">
          <div className="flex justify-between">
            <span className="text-gray-600 flex items-center gap-1">
              <Calendar className="w-4 h-4" /> Dates:
            </span>
            <span className="font-medium text-gray-900">
              {dates.checkIn} to {dates.checkOut}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Duration:</span>
            <span className="font-medium text-gray-900">{nights} night(s)</span>
          </div>
          <div className="flex justify-between border-t border-gray-200 pt-1.5 font-semibold text-base">
            <span className="text-gray-800">Estimated Total:</span>
            <span className="text-blue-600">${nights * room.pricePerNight}</span>
          </div>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Customer Full Name
            </label>
            <input
              type="text"
              required
              minLength={2}
              maxLength={100}
              placeholder="e.g. John Doe"
              value={customer.customerFullName}
              onChange={(e) =>
                setCustomer({ ...customer, customerFullName: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              required
              minLength={7}
              maxLength={20}
              placeholder="e.g. +1234567890"
              value={customer.customerPhone}
              onChange={(e) =>
                setCustomer({ ...customer, customerPhone: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-2.5 rounded-lg font-medium transition"
            >
              {loading ? "Booking..." : "Confirm Booking"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 rounded-lg font-medium transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}