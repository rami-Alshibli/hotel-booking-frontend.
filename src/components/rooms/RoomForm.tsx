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
  const inputClass =
    "w-full border border-slate-200 bg-slate-50/50 focus:bg-white rounded-xl px-3.5 py-2.5 text-sm text-slate-800 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all";

  return (
    <form
      onSubmit={onSubmit}
      className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200/80 space-y-5"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-slate-900">
          {editingId ? "Edit Room Details" : "Add New Room"}
        </h2>
        {editingId && (
          <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
            Editing Mode
          </span>
        )}
      </div>

      <AlertBanner type="error" message={error} />

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
            Room Number
          </label>
          <input
            type="number"
            required
            min="1"
            placeholder="e.g. 101"
            value={form.roomNumber}
            onChange={(e) => setForm({ ...form, roomNumber: e.target.value })}
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
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
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
            Room Type
          </label>
          <select
            value={form.roomType}
            onChange={(e) =>
              setForm({ ...form, roomType: e.target.value as RoomType })
            }
            className={inputClass}
          >
            <option value="Single">Single</option>
            <option value="Double">Double</option>
            <option value="Suite">Suite</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
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
            className={inputClass}
          >
            <option value="Standard">Standard</option>
            <option value="VIP">VIP</option>
          </select>
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white py-2.5 px-4 rounded-xl text-sm font-semibold shadow-sm shadow-indigo-200 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{editingId ? "Update" : "Add Room"}</span>
          </button>

          {editingId && (
            <button
              type="button"
              onClick={onCancel}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3.5 py-2.5 rounded-xl text-sm font-medium transition cursor-pointer"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </form>
  );
}