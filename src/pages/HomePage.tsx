import { useState, type FormEvent } from "react";
import { apiRequest } from "../api/apiClient";
import type { Room } from "../types";
import AvailabilitySearchForm from "../components/reservations/AvailabilitySearchForm";
import RoomCard from "../components/rooms/RoomCard";
import BookingModal from "../components/reservations/BookingModal";
import AlertBanner from "../components/common/AlertBanner";
import EmptyState from "../components/common/EmptyState";

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
      const res = await apiRequest<{ data: Room[] }>(
        `/reservations/availability?checkIn=${checkIn}&checkOut=${checkOut}`
      );
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

  return (
    <div className="space-y-8">
      <AvailabilitySearchForm
        dates={dates}
        setDates={setDates}
        loading={loading}
        onSubmit={handleCheckAvailability}
      />

      <AlertBanner type={feedback.type} message={feedback.message} />

      {hasSearched && (
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Available Rooms ({availableRooms.length})
          </h2>

          {availableRooms.length === 0 ? (
            <EmptyState emptyText="No rooms available for the selected dates. Try different dates!" />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {availableRooms.map((room) => (
                <RoomCard
                  key={room._id}
                  room={room}
                  onSelect={setSelectedRoom}
                />
              ))}
            </div>
          )}
        </div>
      )}

      <BookingModal
        room={selectedRoom}
        dates={dates}
        customer={customer}
        setCustomer={setCustomer}
        loading={bookingLoading}
        onSubmit={handleBooking}
        onClose={() => setSelectedRoom(null)}
      />
    </div>
  );
}