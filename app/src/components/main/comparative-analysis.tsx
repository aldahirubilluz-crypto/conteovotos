import { PositionChip } from "../types/results";

export function ComparativeAnalysis({ selectedPosition }: { selectedPosition: PositionChip }) {
    const leader = selectedPosition.candidates[0];
    const runnerUp = selectedPosition.candidates[1];
    const voteDiff = leader.votes - runnerUp.votes;
    const percentDiff = (leader.percentage - runnerUp.percentage).toFixed(1);

    return (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-lg">
            <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                Análisis Comparativo
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg text-center">
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Diferencia de Votos</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">
                        {voteDiff.toLocaleString("es-PE")}
                    </p>
                </div>
                <div className="p-4 bg-purple-50 dark:bg-purple-950/30 rounded-lg text-center">
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Diferencia Porcentual</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">{percentDiff}%</p>
                </div>
                <div className="p-4 bg-green-50 dark:bg-green-950/30 rounded-lg text-center">
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Líder</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white truncate">
                        {leader.name.split(" ")[0]}
                    </p>
                </div>
            </div>
        </div>
    );
}
