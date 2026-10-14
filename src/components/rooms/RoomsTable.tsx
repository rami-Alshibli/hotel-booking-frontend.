import type { Room } from "../../types";
import { Edit, Trash2, ArrowUpDown } from "lucide-react";
import Badge from "../common/Badge";
import EmptyState from "../common/EmptyState";

interface RoomsTableProps {
  rooms: Room[];
  loading: boolean;
  onSort: (field: string) => void;
  onEdit: (room: Room) => void;
  onDelete: (id: string) => void;
}

export default function RoomsTable({
  rooms,
  loading,
  onSort,
  onEdit,
  onDelete,
}: RoomsTableProps) {
  if (loading || rooms.length === 0) {
    return (
      <EmptyState
        loading={loading}
        loadingText="Loading rooms..."
        emptyText="No rooms found. Add your first room above!"
      />
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 overflow-hidden">
      <table className="w-full text-left border-collapse">
        <thead className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 text-xs uppercase tracking-wider">
          <tr>
            <th className="p-4">
              <button
                type="button"
                onClick={() => onSort("roomNumber")}
                className="flex items-center gap-1.5 font-semibold hover:text-indigo-600 transition cursor-pointer"
              >
                <span>Room #</span>
                <ArrowUpDown className="w-3.5 h-3.5" />
              </button>
            </th>
            <th className="p-4 font-semibold">Type</th>
            <th className="p-4 font-semibold">Category</th>
            <th className="p-4">
              <button
                type="button"
                onClick={() => onSort("pricePerNight")}
                className="flex items-center gap-1.5 font-semibold hover:text-indigo-600 transition cursor-pointer"
              >
                <span>Price / Night</span>
                <ArrowUpDown className="w-3.5 h-3.5" />
              </button>
            </th>
            <th className="p-4 font-semibold text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-sm">
          {rooms.map((room) => (
            <tr key={room._id} className="hover:bg-slate-50/80 transition-colors">
              <td className="p-4 font-bold text-slate-900">
                #{room.roomNumber}
              </td>
              <td className="p-4 text-slate-600 font-medium">{room.roomType}</td>
              <td className="p-4">
                <Badge label={room.roomCategory} />
              </td>
              <td className="p-4 text-indigo-600 font-bold">
                ${room.pricePerNight}
                <span className="text-xs font-normal text-slate-400"> /night</span>
              </td>
              <td className="p-4">
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => onEdit(room)}
                    title="Edit Room"
                    className="p-2 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition cursor-pointer"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(room._id)}
                    title="Delete Room"
                    className="p-2 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}