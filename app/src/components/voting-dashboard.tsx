"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/dashboard/header";
import { CandidateCard } from "@/components/dashboard/candidate-card";
import { ChartsSection } from "@/components/dashboard/charts-section";
import { Footer } from "@/components/dashboard/footer";
import { Loader2 } from "lucide-react";

// Mock data types
export interface Candidate {
  id: string;
  name: string;
  party: string;
  votes: number;
  percentage: number;
  color: string;
  image: string;
  isWinner: boolean;
}

export function VotingDashboard() {
  const [candidates, setCandidates] = useState<Candidate[]>([
    {
      id: "1",
      name: "Dr. Roberto Silva",
      party: "Lista A - Innovación",
      votes: 12450,
      percentage: 52.4,
      color: "var(--chart-1)",
      image: "/professional-man-portrait.png",
      isWinner: true,
    },
    {
      id: "2",
      name: "Lic. María González",
      party: "Lista B - Transparencia",
      votes: 11300,
      percentage: 47.6,
      color: "var(--chart-2)",
      image: "/professional-woman-portrait.png",
      isWinner: false,
    },
  ]);

  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [isUpdating, setIsUpdating] = useState(false);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setIsUpdating(true);

      // Simulate network delay and data update
      setTimeout(() => {
        setCandidates((prev) => {
          // Add random votes to simulate live counting
          const newVotes1 = prev[0].votes + Math.floor(Math.random() * 50);
          const newVotes2 = prev[1].votes + Math.floor(Math.random() * 45);
          const total = newVotes1 + newVotes2;

          return [
            {
              ...prev[0],
              votes: newVotes1,
              percentage: Number(((newVotes1 / total) * 100).toFixed(1)),
              isWinner: newVotes1 > newVotes2,
            },
            {
              ...prev[1],
              votes: newVotes2,
              percentage: Number(((newVotes2 / total) * 100).toFixed(1)),
              isWinner: newVotes2 > newVotes1,
            },
          ];
        });
        setLastUpdated(new Date());
        setIsUpdating(false);
      }, 1500); // 1.5s update animation
    }, 25000); // Update every 25 seconds

    return () => clearInterval(interval);
  }, []);

  const totalVotes = candidates.reduce((acc, curr) => acc + curr.votes, 0);

  return (
    <div className="flex flex-col max-h-screen bg-slate-50/50 dark:bg-slate-950">
      <Header lastUpdated={lastUpdated.toISOString()} isUpdating={isUpdating} />

      <div className="flex-1 p-4 md:p-6 lg:p-8 space-y-6 max-w-[1920px] mx-auto w-full">
        {/* Top Stats Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">
                Total Votos
              </p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white tabular-nums">
                {totalVotes.toLocaleString("es-PE")}
              </p>
            </div>
            <div className="h-10 w-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
                <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
                <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
              </svg>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">
                Mesas Escrutadas
              </p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">
                98.5%
              </p>
            </div>
            <div className="h-10 w-10 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center text-green-600 dark:text-green-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">
                Estado
              </p>
              <div className="flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
                <p className="text-xl font-bold text-green-600 dark:text-green-400">
                  En Vivo
                </p>
              </div>
            </div>
            {isUpdating && (
              <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 animate-pulse">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Actualizando...</span>
              </div>
            )}
          </div>
        </div>

        {/* Main Candidates Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {candidates.map((candidate, index) => (
            <CandidateCard
              key={candidate.id}
              candidate={candidate}
              rank={index + 1}
              totalVotes={totalVotes}
            />
          ))}
        </div>

        {/* Charts Section */}
        <ChartsSection candidates={candidates} />
      </div>

      <Footer />
    </div>
  );
}
