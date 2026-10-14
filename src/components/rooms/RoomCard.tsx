import type { Room } from "../../types";
import { BedDouble, Sparkles } from "lucide-react";
import Badge from "../common/Badge";

interface RoomCardProps {
  room: Room;
  onSelect: (room: Room) => void;
}

export default function RoomCard({ room, onSelect }: RoomCardProps) {
  const isVip = room.roomCategory === "VIP";

  return (
    <div className="group bg-white rounded-2xl shadow-xs border border-slate-200/80 overflow-hidden flex flex-col justify-between hover:shadow-md hover:border-indigo-200 transition-all duration-200">
      <div>
        {/* Top Accent Strip */}
        <div
          className={`h-1.5 w-full ${
            isVip
              ? "bg-gradient-to-r from-amber-400 to-amber-500"
              : "bg-gradient-to-r from-indigo-500 to-indigo-600"
          }`}
        />

        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-slate-100 group-hover:bg-indigo-50 text-slate-700 group-hover:text-indigo-600 flex items-center justify-center transition-colors">
                {isVip ? (
                  <Sparkles className="w-5 h-5 text-amber-500" />
                ) : (
                  <BedDouble className="w-5 h-5" />
                )}
              </div>
              <div>
                <span className="text-lg font-bold text-slate-900 block leading-none">
                  Room #{room.roomNumber}
                </span>
                <span className="text-xs text-slate-500 mt-1 block">
                  {room.roomType} Room
                </span>
              </div>
            </div>
            <Badge label={room.roomCategory} />
          </div>

          <div className="border-t border-slate-100 pt-4 mt-4 flex items-baseline justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
              Rate
            </span>
            <div>
              <span className="text-2xl font-extrabold text-slate-900">
                ${room.pricePerNight}
              </span>
              <span className="text-xs text-slate-500"> / night</span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 pb-6">
        <button
          onClick={() => onSelect(room)}
          className="w-full bg-slate-900 hover:bg-indigo-600 active:scale-[0.98] text-white py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer"
        >
          Book This Room
        </button>
      </div>
    </div>
  );
}