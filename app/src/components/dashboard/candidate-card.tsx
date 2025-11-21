/* eslint-disable @next/next/no-img-element */
"use client";

import type { Candidate } from "@/components/voting-dashboard";
import { Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatNumber } from "@/lib/format";

interface CandidateCardProps {
  candidate: Candidate;
  rank: number;
  totalVotes: number;
}

export function CandidateCard({ candidate }: CandidateCardProps) {
  const isWinner = candidate.isWinner;

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border-2 transition-all duration-500",
        isWinner
          ? "bg-white dark:bg-slate-900 border-blue-500 dark:border-blue-500 shadow-xl shadow-blue-500/10"
          : "bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 opacity-90"
      )}
    >
      {isWinner && (
        <div className="absolute top-0 right-0 bg-blue-500 text-white px-4 py-1 rounded-bl-xl font-bold text-sm flex items-center gap-2 z-10">
          <Trophy className="h-4 w-4" />
          LIDERANDO
        </div>
      )}

      <div className="p-6 md:p-8 flex flex-col md:flex-row gap-6 md:gap-8 items-center md:items-start">
        {/* Avatar */}
        <div className="relative shrink-0">
          <div
            className={cn(
              "h-32 w-32 md:h-40 md:w-40 rounded-full overflow-hidden border-4 shadow-lg",
              isWinner
                ? "border-blue-500"
                : "border-slate-200 dark:border-slate-700"
            )}
          >
            <img
              src={candidate.image || "/placeholder.svg"}
              alt={candidate.name}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs font-bold px-3 py-1 rounded-full border border-slate-700 shadow-sm whitespace-nowrap">
            {candidate.party}
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 w-full text-center md:text-left space-y-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white leading-tight">
              {candidate.name}
            </h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">
              Candidato a la Presidencia
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-lg">
              <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">
                Votos
              </p>
              <p className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white tabular-nums tracking-tight">
                {formatNumber(candidate.votes)}
              </p>
            </div>

            <div
              className={cn(
                "p-3 rounded-lg",
                isWinner
                  ? "bg-blue-50 dark:bg-blue-900/20"
                  : "bg-slate-100 dark:bg-slate-800"
              )}
            >
              <p
                className={cn(
                  "text-xs uppercase tracking-wider font-semibold",
                  isWinner
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-slate-500 dark:text-slate-400"
                )}
              >
                Porcentaje
              </p>
              <p
                className={cn(
                  "text-2xl md:text-3xl font-bold tabular-nums tracking-tight",
                  isWinner
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-slate-900 dark:text-white"
                )}
              >
                {candidate.percentage}%
              </p>
            </div>
          </div>

          {/* Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-medium text-slate-500">
              <span>Progreso</span>
              <span>{candidate.percentage}%</span>
            </div>
            <div className="h-4 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className={cn(
                  "h-full transition-all duration-1000 ease-out rounded-full",
                  isWinner ? "bg-blue-500" : "bg-slate-400"
                )}
                style={{ width: `${candidate.percentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
