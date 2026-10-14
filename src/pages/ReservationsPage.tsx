import { useEffect, useState } from "react";
import { apiRequest } from "../api/apiClient";
import type { Reservation } from "../types";
import { RefreshCw } from "lucide-react";
import ReservationFilters from "../components/reservations/ReservationFilters";
import ReservationsTable from "../components/reservations/ReservationsTable";
import AlertBanner from "../components/common/AlertBanner";
import ConfirmModal from "../components/common/ConfirmModal";

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const [phoneFilter, setPhoneFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  // Modal state for cancellation
  const [cancelTargetId, setCancelTargetId] = useState<string | null>(null);
  const [cancelLoading, setCancelLoading] = useState<boolean>(false);

  const fetchReservations = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await apiRequest<any>("/reservations");
      const list =
        res.data || res.reservations || (Array.isArray(res) ? res : []);
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

  const confirmCancelReservation = async () => {
    if (!cancelTargetId) return;

    setCancelLoading(true);
    setError("");
    try {
      await apiRequest(`/reservations/${cancelTargetId}/cancel`, {
        method: "PATCH",
      });
      setCancelTargetId(null);
      fetchReservations();
    } catch (err: any) {
      setError(err.message || "Failed to cancel reservation");
    } finally {
      setCancelLoading(false);
    }
  };

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

      <ReservationFilters
        phoneFilter={phoneFilter}
        setPhoneFilter={setPhoneFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />

      <AlertBanner type="error" message={error} />

      <ReservationsTable
        reservations={filteredReservations}
        loading={loading}
        onCancel={(id) => setCancelTargetId(id)}
      />

      <ConfirmModal
        isOpen={Boolean(cancelTargetId)}
        title="Cancel Reservation"
        message="Are you sure you want to cancel this reservation? This action cannot be undone."
        confirmText="Yes, Cancel It"
        cancelText="Keep Reservation"
        loading={cancelLoading}
        onConfirm={confirmCancelReservation}
        onClose={() => setCancelTargetId(null)}
      />
    </div>
  );
}