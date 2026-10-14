import { useEffect, useState, type FormEvent } from "react";
import { apiRequest } from "../api/apiClient";
import type { Room, RoomType, RoomCategory } from "../types";
import { Plus, Trash2, Edit, ArrowUpDown, AlertCircle } from "lucide-react";


interface RoomFormState {
  roomNumber: string;
  pricePerNight: string;
  roomType: RoomType;
  roomCategory: RoomCategory;
}

const initialFormState: RoomFormState = {
  roomNumber: "",
  pricePerNight: "",
  roomType: "Single",
  roomCategory: "Standard",
};

export default function RoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [form, setForm] = useState<RoomFormState>(initialFormState);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // Sorting states matching backend (_sort & _order)
  const [sortField, setSortField] = useState<string>("roomNumber");
  const [sortOrder, setSortOrder] = useState<"ASC" | "DESC">("ASC");

const fetchRooms = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await apiRequest<any>(
        `/rooms?_sort=${sortField}&_order=${sortOrder}`
      );
      
      // استخراج مصفوفة الغرف مهما كان اسم الخاصية الراجعة من الباك إند
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

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this room?")) return;
    setError("");

    try {
      await apiRequest(`/rooms/${id}`, {
        method: "DELETE",
      });
      fetchRooms();
    } catch (err: any) {
      setError(err.message || "Failed to delete room");
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
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Manage Rooms</h1>
      </div>

      {/* Add / Edit Room Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
      >
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          {editingId ? "Edit Room" : "Add New Room"}
        </h2>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Room Number
            </label>
            <input
              type="number"
              required
              min="1"
              placeholder="e.g. 101"
              value={form.roomNumber}
              onChange={(e) => setForm({ ...form, roomNumber: e.target.value })}
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price / Night ($)
            </label>
            <input
              type="number"
              required
              min="0"
              placeholder="e.g. 120"
              value={form.pricePerNight}
              onChange={(e) =>
                setForm({ ...form, pricePerNight: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Room Type
            </label>
            <select
              value={form.roomType}
              onChange={(e) =>
                setForm({ ...form, roomType: e.target.value as RoomType })
              }
              className="w-full border border-gray-300 rounded-lg p-2.5 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="Single">Single</option>
              <option value="Double">Double</option>
              <option value="Suite">Suite</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              value={form.roomCategory}
              onChange={(e) =>
                setForm({
                  ...form,
                  roomCategory: e.target.value as RoomCategory,
                })
              }
              className="w-full border border-gray-300 rounded-lg p-2.5 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="Standard">Standard</option>
              <option value="VIP">VIP</option>
            </select>
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-4 rounded-lg font-medium flex items-center justify-center gap-1.5 transition"
            >
              <Plus className="w-4 h-4" />
              <span>{editingId ? "Update" : "Add Room"}</span>
            </button>

            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setForm(initialFormState);
                  setError("");
                }}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2.5 rounded-lg text-sm font-medium transition"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </form>

      {/* Rooms Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 text-sm">
            <tr>
              <th className="p-4">
                <button
                  type="button"
                  onClick={() => toggleSort("roomNumber")}
                  className="flex items-center gap-1 font-semibold hover:text-blue-600"
                >
                  <span>Room #</span>
                  <ArrowUpDown className="w-4 h-4" />
                </button>
              </th>
              <th className="p-4 font-semibold">Type</th>
              <th className="p-4 font-semibold">Category</th>
              <th className="p-4">
                <button
                  type="button"
                  onClick={() => toggleSort("pricePerNight")}
                  className="flex items-center gap-1 font-semibold hover:text-blue-600"
                >
                  <span>Price / Night</span>
                  <ArrowUpDown className="w-4 h-4" />
                </button>
              </th>
              <th className="p-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 text-sm">
            {loading ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-500">
                  Loading rooms...
                </td>
              </tr>
            ) : rooms.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-500">
                  No rooms found. Add your first room above!
                </td>
              </tr>
            ) : (
              rooms.map((room) => (
                <tr key={room._id} className="hover:bg-gray-50 transition">
                  <td className="p-4 font-bold text-gray-900">
                    #{room.roomNumber}
                  </td>
                  <td className="p-4 text-gray-700">{room.roomType}</td>
                  <td className="p-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        room.roomCategory === "VIP"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-blue-50 text-blue-700"
                      }`}
                    >
                      {room.roomCategory}
                    </span>
                  </td>
                  <td className="p-4 text-blue-600 font-semibold">
                    ${room.pricePerNight}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-3">
                      <button
                        onClick={() => handleEdit(room)}
                        title="Edit Room"
                        className="text-blue-600 hover:text-blue-800 transition"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(room._id)}
                        title="Delete Room"
                        className="text-red-500 hover:text-red-700 transition"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
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