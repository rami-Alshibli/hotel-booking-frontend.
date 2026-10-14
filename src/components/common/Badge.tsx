interface BadgeProps {
  label: string;
  variant?: "vip" | "standard" | "confirmed" | "cancelled" | "checkedin" | "checkedout";
}

export default function Badge({ label, variant }: BadgeProps) {
  const key = (variant || label).toLowerCase();

  const styles: Record<string, string> = {
    vip: "bg-amber-50 text-amber-800 ring-amber-600/20",
    standard: "bg-slate-100 text-slate-700 ring-slate-500/20",
    confirmed: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
    cancelled: "bg-rose-50 text-rose-700 ring-rose-600/20",
    checkedin: "bg-indigo-50 text-indigo-700 ring-indigo-600/20",
    checkedout: "bg-slate-100 text-slate-600 ring-slate-500/20",
  };

  const dotColors: Record<string, string> = {
    vip: "bg-amber-500",
    standard: "bg-slate-400",
    confirmed: "bg-emerald-500",
    cancelled: "bg-rose-500",
    checkedin: "bg-indigo-500",
    checkedout: "bg-slate-400",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ring-1 ring-inset ${
        styles[key] || "bg-slate-100 text-slate-700 ring-slate-500/20"
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotColors[key] || "bg-slate-400"}`} />
      {label}
    </span>
  );
}