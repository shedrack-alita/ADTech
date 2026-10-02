import { AlertCircle, CheckCircle2 } from "lucide-react";

export function FormMessage({ error, success }: { error?: string; success?: string }) {
  if (!error && !success) return null;
  if (error) {
    return (
      <div className="mb-4 flex items-start gap-2 rounded-lg bg-red-50 px-3.5 py-2.5 text-sm text-red-700">
        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
        <span>{error}</span>
      </div>
    );
  }
  return (
    <div className="mb-4 flex items-start gap-2 rounded-lg bg-emerald-50 px-3.5 py-2.5 text-sm text-emerald-700">
      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
      <span>{success}</span>
    </div>
  );
}
