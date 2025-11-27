/* eslint-disable @next/next/no-img-element */
import { ProcessedCandidate } from "../types/results";

const API = process.env.NEXT_PUBLIC_API_URL;

export function CandidateCard({ candidate, index }: { candidate: ProcessedCandidate; index: number }) {  
    return (
        <div
            className={`bg-white dark:bg-slate-900 p-6 rounded-xl border-2 shadow-lg transition-all ${candidate.isWinner
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30"
                    : "border-slate-200 dark:border-slate-700"
                }`}
        >
            <div className="flex items-center gap-4 mb-4">
                <div
                    className={`h-10 w-10 rounded-full flex items-center justify-center font-bold text-lg ${index === 0
                            ? "bg-yellow-400 text-yellow-900"
                            : index === 1
                                ? "bg-slate-300 text-slate-700"
                                : "bg-slate-200 text-slate-600"
                        }`}
                >
                    {index + 1}
                </div>

                <img
                    src={`${API}/images/${candidate.image}`}
                    alt={candidate.name}
                    className="w-28 h-28 object-cover rounded-md border"
                />

                <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-slate-900 dark:text-white text-lg truncate">
                        {candidate.name}
                    </h4>
                    <p className="text-slate-600 dark:text-slate-300">
                        {candidate.votes.toLocaleString("es-PE")} votos
                    </p>
                </div>
            </div>

            <div className="mb-2 flex justify-between items-center">
                <span className="text-sm text-slate-500 dark:text-slate-400">Porcentaje</span>
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {candidate.percentage}%
                </span>
            </div>

            <div className="h-3 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                    className="h-full bg-blue-600 transition-all duration-1000"
                    style={{ width: `${candidate.percentage}%` }}
                />
            </div>
        </div>
    );
}