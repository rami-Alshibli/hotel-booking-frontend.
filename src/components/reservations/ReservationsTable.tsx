import type { Reservation } from "../../types";
import { XCircle } from "lucide-react";
import Badge from "../common/Badge";
import EmptyState from "../common/EmptyState";

interface ReservationsTableProps {
  reservations: Reservation[];
  loading: boolean;
  onCancel: (id: string) => void;
}

export default function ReservationsTable({
  reservations,
  loading,
  onCancel,
}: ReservationsTableProps) {
  if (loading || reservations.length === 0) {
    return (
      <EmptyState
        loading={loading}
        loadingText="Loading reservations..."
        emptyText="No reservations found."
      />
    );
  }

  const getRoomDisplay = (roomId: Reservation["roomId"]) => {
    if (typeof roomId === "object" && roomId !== null && "roomNumber" in roomId) {
      return `#${roomId.roomNumber} (${roomId.roomType})`;
    }
    return `#${String(roomId).slice(-5)}`;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 text-sm">
          <tr>
            <th className="p-4 font-semibold">Customer Name</th>
            <th className="p-4 font-semibold">Phone</th>
            <th className="p-4 font-semibold">Room</th>
            <th className="p-4 font-semibold">Check-In</th>
            <th className="p-4 font-semibold">Check-Out</th>
            <th className="p-4 font-semibold">Nights</th>
            <th className="p-4 font-semibold">Total Price</th>
            <th className="p-4 font-semibold">Status</th>
            <th className="p-4 font-semibold text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 text-sm">
          {reservations.map((res) => (
            <tr key={res._id} className="hover:bg-gray-50 transition">
              <td className="p-4 font-semibold text-gray-900">
                {res.customerFullName}
              </td>
              <td className="p-4 text-gray-600">{res.customerPhone}</td>
              <td className="p-4 font-bold text-gray-800">
                {getRoomDisplay(res.roomId)}
              </td>
              <td className="p-4 text-gray-700">
                {new Date(res.checkIn).toLocaleDateString("en-US")}
              </td>
              <td className="p-4 text-gray-700">
                {new Date(res.checkOut).toLocaleDateString("en-US")}
              </td>
              <td className="p-4 text-gray-700">{res.nights}</td>
              <td className="p-4 font-bold text-blue-600">${res.totalPrice}</td>
              <td className="p-4">
                <Badge label={res.status} />
              </td>
              <td className="p-4 text-right">
                {res.status === "Confirmed" ? (
                  <button
                    onClick={() => onCancel(res._id)}
                    className="inline-flex items-center gap-1 text-red-600 hover:text-red-800 font-semibold text-xs transition"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Cancel</span>
                  </button>
                ) : (
                  <span className="text-gray-400 text-xs">—</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}