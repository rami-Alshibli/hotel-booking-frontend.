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

  // تحويل page و limit أيضاً إلى start و end احتياطاً إذا كان الباك إند يستخدمهما
  const start = (page - 1) * limit;
  const end = start + limit;

  const fetchReservations = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await apiRequest<any>(
        `/reservations?page=${page}&limit=${limit}&start=${start}&end=${end}`
      );

      const list =
        res.data ||
        res.reservations ||
        res.items ||
        res.results ||
        (Array.isArray(res) ? res : []);

      setReservations(list);

      // استخراج إجمالي الصفحات أو إجمالي العناصر مهما كانت تسميته في الباك إند
      const serverTotalPages =
        res.totalPages ??
        res.pages ??
        res.pagination?.totalPages ??
        res.meta?.totalPages;

      const serverTotalItems =
        res.total ??
        res.totalCount ??
        res.totalReservations ??
        res.pagination?.total ??
        res.meta?.total;

      if (typeof serverTotalPages === "number") {
        setTotalPagesFromServer(serverTotalPages);
      } else if (typeof serverTotalItems === "number") {
        setTotalPagesFromServer(Math.max(1, Math.ceil(serverTotalItems / limit)));
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

  const handlePageChange = (newPage: number) => {
    setSearchParams({ page: String(newPage), limit: String(limit) });
  };

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

  // إذا رجع السيرفر عناصر أكثر من الـ limit فهذا يعني أنه لم يقسمها، فنقسمها نحن في الفرونت إند
  const isUnpaginatedFromBackend = filteredReservations.length > limit;

  const displayedReservations = isUnpaginatedFromBackend
    ? filteredReservations.slice((page - 1) * limit, page * limit)
    : filteredReservations;

  // حساب إجمالي الصفحات بدقة
  const totalPages = isUnpaginatedFromBackend
    ? Math.max(1, Math.ceil(filteredReservations.length / limit))
    : totalPagesFromServer !== null
    ? totalPagesFromServer
    : reservations.length === limit
    ? page + 1
    : page;

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