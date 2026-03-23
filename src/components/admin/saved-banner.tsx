"use client";

import { useEffect, useState } from "react";
import { CheckCircle } from "lucide-react";

export function SavedBanner() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="mb-4 flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 p-3 text-green-800 text-sm font-medium">
      <CheckCircle size={16} />
      Cambios guardados
    </div>
  );
}
