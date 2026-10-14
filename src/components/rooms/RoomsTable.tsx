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
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <table className="w-full text-left border-collapse">
        <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 text-sm">
          <tr>
            <th className="p-4">
              <button
                type="button"
                onClick={() => onSort("roomNumber")}
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
                onClick={() => onSort("pricePerNight")}
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
          {rooms.map((room) => (
            <tr key={room._id} className="hover:bg-gray-50 transition">
              <td className="p-4 font-bold text-gray-900">
                #{room.roomNumber}
              </td>
              <td className="p-4 text-gray-700">{room.roomType}</td>
              <td className="p-4">
                <Badge label={room.roomCategory} />
              </td>
              <td className="p-4 text-blue-600 font-semibold">
                ${room.pricePerNight}
              </td>
              <td className="p-4">
                <div className="flex items-center justify-end gap-3">
                  <button
                    onClick={() => onEdit(room)}
                    title="Edit Room"
                    className="text-blue-600 hover:text-blue-800 transition"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => onDelete(room._id)}
                    title="Delete Room"
                    className="text-red-500 hover:text-red-700 transition"
                  >
                    <Trash2 className="w-5 h-5" />
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