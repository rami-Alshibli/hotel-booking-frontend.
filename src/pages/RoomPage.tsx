import { useEffect, useState, type FormEvent } from "react";
import { useSearchParams } from "react-router-dom";
import { apiRequest } from "../api/apiClient";
import type { Room } from "../types";
import RoomForm, { type RoomFormState } from "../components/rooms/RoomForm";
import RoomsTable from "../components/rooms/RoomsTable";
import ConfirmModal from "../components/common/ConfirmModal";
import Pagination from "../components/common/Pagination";

const initialFormState: RoomFormState = {
  roomNumber: "",
  pricePerNight: "",
  roomType: "Single",
  roomCategory: "Standard",
};

export default function RoomPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // قراءة رقم الصفحة والعدد من الرابط (الافتراضي: صفحة 1، و 5 غرف بالصفحة)
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const limit = Math.max(1, Number(searchParams.get("limit")) || 5);

  const [rooms, setRooms] = useState<Room[]>([]);
  const [totalCount, setTotalCount] = useState<number | null>(null);
  const [form, setForm] = useState<RoomFormState>(initialFormState);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const [sortField, setSortField] = useState<string>("roomNumber");
  const [sortOrder, setSortOrder] = useState<"ASC" | "DESC">("ASC");

  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);

  // تحويل page و limit إلى start و end حسب ما يطلبه getRoomsController
  const start = (page - 1) * limit;
  const end = start + limit;

  const fetchRooms = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await apiRequest<any>(
        `/rooms?_sort=${sortField}&_order=${sortOrder}&start=${start}&end=${end}`
      );

      const roomsList = Array.isArray(res)
        ? res
        : res.data || res.rooms || res.items || res.results || [];

      setRooms(roomsList);

      // إذا كان الـ Service يرجع إجمالي عدد الغرف (total أو count)
      if (typeof res.total === "number" || typeof res.count === "number") {
        setTotalCount(res.total ?? res.count);
      } else {
        setTotalCount(null);
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch rooms");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, [sortField, sortOrder, page, limit]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    const payload = {
      roomNumber: Number(form.roomNumber),
      pricePerNight: Number(form.pricePerNight),
      roomType: form.roomType,
      roomCategory: form.roomCategory,
    };

    try {
      if (editingId) {
        await apiRequest(`/rooms/${editingId}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
      } else {
        await apiRequest("/rooms", {
          method: "POST",
          body: JSON.stringify(payload),
        });
      }

      setForm(initialFormState);
      setEditingId(null);
      fetchRooms();
    } catch (err: any) {
      setError(err.message || "Failed to save room");
    }
  };

  const handleEdit = (room: Room) => {
    setEditingId(room._id);
    setForm({
      roomNumber: String(room.roomNumber),
      pricePerNight: String(room.pricePerNight),
      roomType: room.roomType,
      roomCategory: room.roomCategory,
    });
    setError("");
  };

  const confirmDeleteRoom = async () => {
    if (!deleteTargetId) return;

    setDeleteLoading(true);
    setError("");
    try {
      await apiRequest(`/rooms/${deleteTargetId}`, { method: "DELETE" });
      setDeleteTargetId(null);

      // إذا حذفنا آخر عنصر في الصفحة الحالية، نرجع للصفحة السابقة تلقائياً
      if (rooms.length === 1 && page > 1) {
        setSearchParams({ page: String(page - 1), limit: String(limit) });
      } else {
        fetchRooms();
      }
    } catch (err: any) {
      setError(err.message || "Failed to delete room");
      setDeleteTargetId(null);
    } finally {
      setDeleteLoading(false);
    }
  };

  const toggleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "ASC" ? "DESC" : "ASC");
    } else {
      setSortField(field);
      setSortOrder("ASC");
    }
  };

  const handlePageChange = (newPage: number) => {
    setSearchParams({ page: String(newPage), limit: String(limit) });
  };

  const handleLimitChange = (newLimit: number) => {
    setSearchParams({ page: "1", limit: String(newLimit) });
  };

  // حساب إجمالي الصفحات (سواء كان الباك إند يرسل total أو يرسل مصفوفة فقط)
  const totalPages =
    totalCount !== null
      ? Math.max(1, Math.ceil(totalCount / limit))
      : rooms.length === limit
      ? page + 1
      : page;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Manage Rooms</h1>

      <RoomForm
        form={form}
        setForm={setForm}
        editingId={editingId}
        error={error}
        onSubmit={handleSubmit}
        onCancel={() => {
          setEditingId(null);
          setForm(initialFormState);
          setError("");
        }}
      />

      <RoomsTable
        rooms={rooms}
        loading={loading}
        onSort={toggleSort}
        onEdit={handleEdit}
        onDelete={(id) => setDeleteTargetId(id)}
      />

      {/* شريط الـ Pagination للغرف */}
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        limit={limit}
        onPageChange={handlePageChange}
        onLimitChange={handleLimitChange}
      />

      <ConfirmModal
        isOpen={Boolean(deleteTargetId)}
        title="Delete Room"
        message="Are you sure you want to delete this room? This action cannot be undone."
        confirmText="Delete Room"
        cancelText="Cancel"
        loading={deleteLoading}
        onConfirm={confirmDeleteRoom}
        onClose={() => setDeleteTargetId(null)}
      />
    </div>
  );
}