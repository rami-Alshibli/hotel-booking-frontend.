import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  limit: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  limit,
  onPageChange,
  onLimitChange,
}: PaginationProps) {
  return (
    <div className="bg-white px-5 py-3.5 rounded-2xl shadow-xs border border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
      {/* التحكم بعدد العناصر في الصفحة (limit) */}
      <div className="flex items-center gap-2 text-slate-600">
        <span>Rows per page:</span>
        <select
          value={limit}
          onChange={(e) => onLimitChange(Number(e.target.value))}
          className="border border-slate-200 rounded-lg px-2.5 py-1 bg-slate-50 text-slate-800 font-medium focus:border-indigo-500 outline-none cursor-pointer"
        >
          <option value={1}>1</option>
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
        </select>
      </div>

      {/* أزرار التنقل بين الصفحات (page) */}
      <div className="flex items-center gap-3">
        <span className="text-slate-600">
          Page <strong className="text-slate-900">{currentPage}</strong> of{" "}
          <strong className="text-slate-900">{Math.max(1, totalPages)}</strong>
        </span>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            disabled={currentPage <= 1}
            onClick={() => onPageChange(currentPage - 1)}
            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none transition cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            type="button"
            disabled={currentPage >= totalPages}
            onClick={() => onPageChange(currentPage + 1)}
            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none transition cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}