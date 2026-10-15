import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { apiRequest } from "../api/apiClient";
import type { Reservation } from "../types";
import { RefreshCw } from "lucide-react";
import ReservationFilters from "../components/reservations/ReservationFilters";
import ReservationsTable from "../components/reservations/ReservationsTable";
import AlertBanner from "../components/common/AlertBanner";
import ConfirmModal from "../components/common/ConfirmModal";
import Pagination from "../components/common/Pagination";

export default function ReservationsPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // قراءة page و limit من الرابط (أو وضع قيم افتراضية page=1 و limit=5)
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const limit = Math.max(1, Number(searchParams.get("limit")) || 5);

  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [totalPagesFromServer, setTotalPagesFromServer] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const [phoneFilter, setPhoneFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const [cancelTargetId, setCancelTargetId] = useState<string | null>(null);
  const [cancelLoading, setCancelLoading] = useState<boolean>(false);

  const fetchReservations = async () => {
    setLoading(true);
    setError("");
    try {
      // إرسال page و limit للباك إند
      const res = await apiRequest<any>(
        `/reservations?page=${page}&limit=${limit}`
      );
      const list =
        res.data || res.reservations || (Array.isArray(res) ? res : []);
      setReservations(list);

      // إذا كان الباك إند يرجع totalPages أو total، نستخدمه
      if (res.totalPages) {
        setTotalPagesFromServer(res.totalPages);
      } else if (res.total || res.count) {
        setTotalPagesFromServer(Math.ceil((res.total || res.count) / limit));
      } else {
        setTotalPagesFromServer(null);
      }
    } catch (err: any) {
      setError(err.message || "Failed to load reservations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, [page, limit]);

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

  // تحديث رقم الصفحة في الرابط
  const handlePageChange = (newPage: number) => {
    setSearchParams({ page: String(newPage), limit: String(limit) });
  };

  // تحديث عدد العناصر في الرابط وإرجاع المستخدم للصفحة 1
  const handleLimitChange = (newLimit: number) => {
    setSearchParams({ page: "1", limit: String(newLimit) });
  };

  // الفلترة حسب الهاتف والحالة
  const filteredReservations = reservations.filter((item) => {
    const matchesPhone = item.customerPhone
      .toLowerCase()
      .includes(phoneFilter.trim().toLowerCase());
    const matchesStatus =
      statusFilter === "ALL" || item.status === statusFilter;
    return matchesPhone && matchesStatus;
  });

  // في حال كان الباك إند يرجع كل الحجوزات دفعة واحدة، نقسمها أيضاً في الفرونت إند لضمان عمل الرابط بكل الأحوال
  const isClientPaginated = totalPagesFromServer === null || filteredReservations.length > limit;
  const totalPages = isClientPaginated
    ? Math.max(1, Math.ceil(filteredReservations.length / limit))
    : totalPagesFromServer || 1;

  const displayedReservations = isClientPaginated
    ? filteredReservations.slice((page - 1) * limit, page * limit)
    : filteredReservations;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-900">Reservations Log</h1>

        <button
          onClick={fetchReservations}
          className="self-start sm:self-auto flex items-center gap-2 text-sm bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-xl font-medium transition cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Refresh</span>
        </button>
      </div>

      <ReservationFilters
        phoneFilter={phoneFilter}
        setPhoneFilter={(val) => {
          setPhoneFilter(val);
          handlePageChange(1);
        }}
        statusFilter={statusFilter}
        setStatusFilter={(val) => {
          setStatusFilter(val);
          handlePageChange(1);
        }}
      />

      <AlertBanner type="error" message={error} />

      <ReservationsTable
        reservations={displayedReservations}
        loading={loading}
        onCancel={(id) => setCancelTargetId(id)}
      />

      {/* شريط التحكم بالصفحات المرتبط بالرابط */}
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        limit={limit}
        onPageChange={handlePageChange}
        onLimitChange={handleLimitChange}
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