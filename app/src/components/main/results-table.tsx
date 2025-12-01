/* eslint-disable @next/next/no-img-element */
import { PositionChip } from "../types/results";

const API = process.env.API_BASE_URL;

export function ResultsTable({ selectedPosition }: { selectedPosition: PositionChip }) {
    return (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-lg overflow-hidden">
            <div className="p-6 border-b border-slate-200 dark:border-slate-800">
                <h4 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <div className="h-1 w-6 bg-green-500 rounded-full"></div>Tabla de Resultados
                </h4>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-slate-50 dark:bg-slate-800">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Posición</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Candidato</th>
                            <th className="px-6 py-3 text-right text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Puntos</th>
                            <th className="px-6 py-3 text-right text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Porcentaje</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                        {selectedPosition.candidates.map((candidate, index) => (
                            <tr key={candidate.id} className={`${candidate.isWinner ? "bg-blue-50 dark:bg-blue-950/20" : "hover:bg-slate-50 dark:hover:bg-slate-800/50"} transition-colors`}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className={`inline-flex items-center justify-center h-8 w-8 rounded-full font-bold ${index === 0 ? "bg-yellow-400 text-yellow-900" : index === 1 ? "bg-slate-300 text-slate-700" : "bg-slate-200 text-slate-600"}`}>{index + 1}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={`${API}/images/${candidate.image}`}
                                            alt={candidate.name}
                                            className="h-10 w-10 rounded-full object-cover"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(candidate.name)}&size=40&background=random`;
                                            }}
                                        />
                                        <span className="font-semibold text-slate-900 dark:text-white">{candidate.name}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                    <span className="text-lg font-bold text-slate-900 dark:text-white">{Math.round(candidate.votes).toLocaleString("es-PE")}</span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                    <span className="text-lg font-bold text-blue-600 dark:text-blue-400">{candidate.percentage}%</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}