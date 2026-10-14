import { useEffect, useState, type FormEvent } from "react";
import { apiRequest } from "../api/apiClient";
import type { Room } from "../types";
import RoomForm, { type RoomFormState } from "../components/rooms/RoomForm";
import RoomsTable from "../components/rooms/RoomsTable";
import ConfirmModal from "../components/common/ConfirmModal";

const initialFormState: RoomFormState = {
  roomNumber: "",
  pricePerNight: "",
  roomType: "Single",
  roomCategory: "Standard",
};

export default function RoomPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [form, setForm] = useState<RoomFormState>(initialFormState);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const [sortField, setSortField] = useState<string>("roomNumber");
  const [sortOrder, setSortOrder] = useState<"ASC" | "DESC">("ASC");

  // Modal state for deleting a room
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);

  const fetchRooms = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await apiRequest<any>(
        `/rooms?_sort=${sortField}&_order=${sortOrder}`
      );
      const roomsList = Array.isArray(res)
        ? res
        : res.data || res.rooms || res.items || res.results || [];
      setRooms(roomsList);
    } catch (err: any) {
      setError(err.message || "Failed to fetch rooms");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, [sortField, sortOrder]);

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
      fetchRooms();
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

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-800">Manage Rooms</h1>

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