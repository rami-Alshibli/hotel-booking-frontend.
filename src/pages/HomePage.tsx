import { useState, type FormEvent } from "react";
import { apiRequest } from "../api/apiClient";
import type { Room } from "../types";
import { Search, CheckCircle2, AlertCircle, Calendar, BedDouble } from "lucide-react";

export default function HomePage() {
  const [dates, setDates] = useState({ checkIn: "", checkOut: "" });
  const [availableRooms, setAvailableRooms] = useState<Room[]>([]);
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [customer, setCustomer] = useState({
    customerFullName: "",
    customerPhone: "",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [bookingLoading, setBookingLoading] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error" | "";
    message: string;
  }>({ type: "", message: "" });

  const fetchAvailableRooms = async (checkIn: string, checkOut: string) => {
    setLoading(true);
    try {
      const res = await apiRequest<{
        success: boolean;
        count: number;
        data: Room[];
      }>(`/reservations/availability?checkIn=${checkIn}&checkOut=${checkOut}`);

      setAvailableRooms(res.data || []);
      setHasSearched(true);
    } catch (err: any) {
      setFeedback({
        type: "error",
        message: err.message || "Failed to check room availability",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCheckAvailability = async (e: FormEvent) => {
    e.preventDefault();
    setFeedback({ type: "", message: "" });
    setSelectedRoom(null);

    if (new Date(dates.checkOut) <= new Date(dates.checkIn)) {
      setFeedback({
        type: "error",
        message: "Check-out date must be after check-in date",
      });
      return;
    }

    await fetchAvailableRooms(dates.checkIn, dates.checkOut);
  };

  const handleBooking = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedRoom) return;

    setBookingLoading(true);
    setFeedback({ type: "", message: "" });

    try {
      await apiRequest("/reservations", {
        method: "POST",
        body: JSON.stringify({
          roomId: selectedRoom._id,
          customerFullName: customer.customerFullName.trim(),
          customerPhone: customer.customerPhone.trim(),
          checkIn: dates.checkIn,
          checkOut: dates.checkOut,
        }),
      });

      setFeedback({
        type: "success",
        message: `Room #${selectedRoom.roomNumber} booked successfully!`,
      });
      setSelectedRoom(null);
      setCustomer({ customerFullName: "", customerPhone: "" });

      // Refresh available rooms list
      await fetchAvailableRooms(dates.checkIn, dates.checkOut);
    } catch (err: any) {
      setFeedback({
        type: "error",
        message: err.message || "Failed to create reservation",
      });
    } finally {
      setBookingLoading(false);
    }
  };

  // Calculate nights for preview inside the booking modal
  const getNightsCount = () => {
    if (!dates.checkIn || !dates.checkOut) return 0;
    const diff =
      new Date(dates.checkOut).getTime() - new Date(dates.checkIn).getTime();
    return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  return (
    <div className="space-y-8">
      {/* Search Bar Card */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Find & Book a Room
        </h1>
        <p className="text-gray-500 text-sm mb-6">
          Select your check-in and check-out dates to see available rooms.
        </p>

        <form
          onSubmit={handleCheckAvailability}
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

      {/* Feedback Alert */}
      {feedback.message && (
        <div
          className={`p-4 rounded-lg flex items-center gap-2 text-sm font-medium ${
            feedback.type === "success"
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {feedback.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 shrink-0" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Available Rooms Grid */}
      {hasSearched && (
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Available Rooms ({availableRooms.length})
          </h2>

          {availableRooms.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-10 text-center text-gray-500">
              No rooms available for the selected dates. Try different dates!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {availableRooms.map((room) => (
                <div
                  key={room._id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col justify-between hover:shadow-md transition"
                >
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center gap-2">
                        <BedDouble className="w-5 h-5 text-blue-600" />
                        <span className="text-lg font-bold text-gray-900">
                          Room #{room.roomNumber}
                        </span>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          room.roomCategory === "VIP"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-blue-50 text-blue-700"
                        }`}
                      >
                        {room.roomCategory}
                      </span>
                    </div>

                    <p className="text-gray-600 text-sm mb-4">
                      Room Type:{" "}
                      <span className="font-semibold text-gray-900">
                        {room.roomType}
                      </span>
                    </p>

                    <div className="border-t border-gray-100 pt-4 mb-6">
                      <span className="text-2xl font-bold text-blue-600">
                        ${room.pricePerNight}
                      </span>
                      <span className="text-sm text-gray-500"> / night</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedRoom(room)}
                    className="w-full bg-gray-900 hover:bg-gray-800 text-white py-2.5 rounded-lg font-medium transition"
                  >
                    Book Now
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Booking Modal */}
      {selectedRoom && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl">
            <h2 className="text-xl font-bold text-gray-900 mb-1">
              Book Room #{selectedRoom.roomNumber}
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              {selectedRoom.roomType} — {selectedRoom.roomCategory}
            </p>

            {/* Booking Summary */}
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
                <span className="font-medium text-gray-900">
                  {getNightsCount()} night(s)
                </span>
              </div>
              <div className="flex justify-between border-t border-gray-200 pt-1.5 font-semibold text-base">
                <span className="text-gray-800">Estimated Total:</span>
                <span className="text-blue-600">
                  ${getNightsCount() * selectedRoom.pricePerNight}
                </span>
              </div>
            </div>

            <form onSubmit={handleBooking} className="space-y-4">
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
                    setCustomer({
                      ...customer,
                      customerFullName: e.target.value,
                    })
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
                  disabled={bookingLoading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-2.5 rounded-lg font-medium transition"
                >
                  {bookingLoading ? "Booking..." : "Confirm Booking"}
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedRoom(null)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 rounded-lg font-medium transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}