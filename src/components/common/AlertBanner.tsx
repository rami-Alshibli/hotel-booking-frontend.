import { CheckCircle2, AlertCircle } from "lucide-react";

interface AlertBannerProps {
  type?: "success" | "error" | "";
  message: string;
}

export default function AlertBanner({ type = "error", message }: AlertBannerProps) {
  if (!message) return null;

  const isSuccess = type === "success";

  return (
    <div
      className={`p-4 rounded-lg flex items-center gap-2 text-sm font-medium border ${
        isSuccess
          ? "bg-green-50 text-green-700 border-green-200"
          : "bg-red-50 text-red-700 border-red-200"
      }`}
    >
      {isSuccess ? (
        <CheckCircle2 className="w-5 h-5 shrink-0" />
      ) : (
        <AlertCircle className="w-5 h-5 shrink-0" />
      )}
      <span>{message}</span>
    </div>
  );
}