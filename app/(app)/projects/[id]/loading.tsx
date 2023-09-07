import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="py-6">
      <Loader2 size={32} className="animate-spin" />
    </div>
  );
}
