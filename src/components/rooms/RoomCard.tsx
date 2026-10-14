import type { Room } from "../../types";
import { BedDouble } from "lucide-react";
import Badge from "../common/Badge";

interface RoomCardProps {
  room: Room;
  onSelect: (room: Room) => void;
}

export default function RoomCard({ room, onSelect }: RoomCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col justify-between hover:shadow-md transition">
      <div>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <BedDouble className="w-5 h-5 text-blue-600" />
            <span className="text-lg font-bold text-gray-900">
              Room #{room.roomNumber}
            </span>
          </div>
          <Badge label={room.roomCategory} />
        </div>

        <p className="text-gray-600 text-sm mb-4">
          Room Type:{" "}
          <span className="font-semibold text-gray-900">{room.roomType}</span>
        </p>

        <div className="border-t border-gray-100 pt-4 mb-6">
          <span className="text-2xl font-bold text-blue-600">
            ${room.pricePerNight}
          </span>
          <span className="text-sm text-gray-500"> / night</span>
        </div>
      </div>

      <button
        onClick={() => onSelect(room)}
        className="w-full bg-gray-900 hover:bg-gray-800 text-white py-2.5 rounded-lg font-medium transition"
      >
        Book Now
      </button>
    </div>
  );
}