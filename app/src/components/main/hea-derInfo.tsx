import { PositionChip } from "../types/results";

export function HeaderInfo({ selectedPosition }: { selectedPosition: PositionChip }) {
    return (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-lg">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                {selectedPosition.positionName}
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
                {selectedPosition.candidates.length} candidatos • Total:{" "}
                {selectedPosition.totalVotes.toLocaleString("es-PE")} votos
            </p>
        </div>
    );
}