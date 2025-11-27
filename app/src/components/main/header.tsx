"use client";

import { useState, useEffect } from "react";

interface HeaderStats {
  totalVotes: number;
  totalPositions: number;
  totalCandidates: number;
}

interface HeaderProps {
  stats: HeaderStats;
  lastUpdated: Date;
}

export default function HeaderResult({ stats, lastUpdated }: HeaderProps) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-primary text-secondary shadow-lg">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
        <h1 className="text-2xl md:text-4xl font-bold mb-4">
          🗳️ Resultados Electorales 2024
        </h1>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
          <div className="col-span-2 md:col-span-1 bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
            <p className="text-blue-100 text-xs uppercase tracking-wider mb-1">Fecha y Hora</p>
            <p className="text-sm md:text-base font-semibold">{time.toLocaleDateString("es-PE")}</p>
            <p className="text-lg md:text-xl font-bold">{time.toLocaleTimeString("es-PE")}</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
            <p className="text-blue-100 text-xs uppercase tracking-wider mb-1">Total Votos Registrados</p>
            <p className="text-xl md:text-2xl font-bold">{stats.totalVotes.toLocaleString("es-PE")}</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
            <p className="text-blue-100 text-xs uppercase tracking-wider mb-1">N° Puestos</p>
            <p className="text-xl md:text-2xl font-bold">{stats.totalPositions}</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
            <p className="text-blue-100 text-xs uppercase tracking-wider mb-1">Candidatos</p>
            <p className="text-xl md:text-2xl font-bold">{stats.totalCandidates}</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
            <p className="text-blue-100 text-xs uppercase tracking-wider mb-1">Última Actualización</p>
            <p className="text-lg md:text-xl font-bold">{lastUpdated.toLocaleTimeString("es-PE")}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
