import { type FormEvent } from "react";
import type { RoomType, RoomCategory } from "../../types";
import { Plus } from "lucide-react";
import AlertBanner from "../common/AlertBanner";

export interface RoomFormState {
  roomNumber: string;
  pricePerNight: string;
  roomType: RoomType;
  roomCategory: RoomCategory;
}

interface RoomFormProps {
  form: RoomFormState;
  setForm: (form: RoomFormState) => void;
  editingId: string | null;
  error: string;
  onSubmit: (e: FormEvent) => void;
  onCancel: () => void;
}

export default function RoomForm({
  form,
  setForm,
  editingId,
  error,
  onSubmit,
  onCancel,
}: RoomFormProps) {
  return (
    <form
      onSubmit={onSubmit}
      className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-4"
    >
      <h2 className="text-lg font-semibold text-gray-800">
        {editingId ? "Edit Room" : "Add New Room"}
      </h2>

      <AlertBanner type="error" message={error} />

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
              onClick={onCancel}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2.5 rounded-lg text-sm font-medium transition"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </form>
  );
}