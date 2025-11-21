"use client";

import { Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { formatTime } from "@/lib/format";

interface HeaderProps {
  lastUpdated: string;
  isUpdating: boolean;
}

export function Header({ lastUpdated, isUpdating }: HeaderProps) {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    setTime(formatTime(lastUpdated)); // SOLO después del montaje
  }, [lastUpdated]);

  return (
    <header className="bg-slate-900 text-white shadow-md border-b border-slate-800 sticky top-0 z-50">
      <div className="flex items-center justify-between h-20 px-4">
        <h1 className="text-xl font-bold">Resultados Oficiales en Tiempo Real</h1>

        <div className="flex flex-col items-end">
          <div className="flex items-center gap-2 bg-slate-800/50 px-3 py-1.5 rounded-md border border-slate-700">
            <Clock className="h-4 w-4" />
            <span className="tabular-nums">{time ?? "—"}</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-wider">
            Última actualización
          </p>
        </div>
      </div>

      {isUpdating && (
        <div className="h-1 w-full bg-slate-800 overflow-hidden">
          <div className="h-full bg-blue-500 animate-progress-indeterminate origin-left"></div>
        </div>
      )}
    </header>
  );
}
