import { useEffect, useState } from "react";
import { apiRequest } from "../api/apiClient";
import type { Reservation, ReservationStatus } from "../types";
import { XCircle, Search, RefreshCw, AlertCircle } from "lucide-react";

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // Filters
  const [phoneFilter, setPhoneFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const fetchReservations = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await apiRequest<{
        success: boolean;
        data?: Reservation[];
        reservations?: Reservation[];
      }>("/reservations");

      const list = res.data || res.reservations || (Array.isArray(res) ? res : []);
      setReservations(list);
    } catch (err: any) {
      setError(err.message || "Failed to load reservations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const handleCancel = async (id: string) => {
    if (!window.confirm("Are you sure you want to cancel this reservation?")) {
      return;
    }

    setError("");
    try {
      await apiRequest(`/reservations/${id}/cancel`, {
        method: "PATCH",
      });
      fetchReservations();
    } catch (err: any) {
      setError(err.message || "Failed to cancel reservation");
    }
  };

  const getRoomDisplay = (roomId: Reservation["roomId"]) => {
    if (typeof roomId === "object" && roomId !== null && "roomNumber" in roomId) {
      return `#${roomId.roomNumber} (${roomId.roomType})`;
    }
    return `#${String(roomId).slice(-5)}`;
  };

  const statusBadgeClass: Record<ReservationStatus, string> = {
    Confirmed: "bg-green-100 text-green-800",
    Cancelled: "bg-red-100 text-red-800",
    CheckedIn: "bg-blue-100 text-blue-800",
    CheckedOut: "bg-gray-100 text-gray-800",
  };

  // Client-side filtering by phone & status
  const filteredReservations = reservations.filter((item) => {
    const matchesPhone = item.customerPhone
      .toLowerCase()
      .includes(phoneFilter.trim().toLowerCase());
    const matchesStatus =
      statusFilter === "ALL" || item.status === statusFilter;
    return matchesPhone && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Reservations Log</h1>

        <button
          onClick={fetchReservations}
          className="self-start sm:self-auto flex items-center gap-2 text-sm bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg font-medium transition"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Refresh</span>
        </button>
      </div>

      {/* Filter Bar */}
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

      {error && (
        <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Reservations Table */}
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
            {loading ? (
              <tr>
                <td colSpan={9} className="p-8 text-center text-gray-500">
                  Loading reservations...
                </td>
              </tr>
            ) : filteredReservations.length === 0 ? (
              <tr>
                <td colSpan={9} className="p-8 text-center text-gray-500">
                  No reservations found.
                </td>
              </tr>
            ) : (
              filteredReservations.map((res) => (
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
                  <td className="p-4 font-bold text-blue-600">
                    ${res.totalPrice}
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        statusBadgeClass[res.status] ||
                        "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {res.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    {res.status === "Confirmed" ? (
                      <button
                        onClick={() => handleCancel(res._id)}
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
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}