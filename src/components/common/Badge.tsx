interface BadgeProps {
  label: string;
  variant?: "vip" | "standard" | "confirmed" | "cancelled" | "checkedin" | "checkedout";
}

export default function Badge({ label, variant }: BadgeProps) {
  const key = (variant || label).toLowerCase();

  const styles: Record<string, string> = {
    vip: "bg-amber-100 text-amber-800",
    standard: "bg-blue-50 text-blue-700",
    confirmed: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
    checkedin: "bg-blue-100 text-blue-800",
    checkedout: "bg-gray-100 text-gray-700",
  };

  return (
    <span
      className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
        styles[key] || "bg-gray-100 text-gray-700"
      }`}
    >
      {label}
    </span>
  );
}