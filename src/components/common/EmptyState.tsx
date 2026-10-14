interface EmptyStateProps {
  loading?: boolean;
  loadingText?: string;
  emptyText: string;
}

export default function EmptyState({
  loading = false,
  loadingText = "Loading...",
  emptyText,
}: EmptyStateProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-10 text-center text-gray-500 text-sm">
      {loading ? loadingText : emptyText}
    </div>
  );
}