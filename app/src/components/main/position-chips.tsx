import { PositionChip } from "../types/results";

interface Props {
  positions: PositionChip[];
  selectedPositionId: string | null;
  setSelectedPositionId: (id: string) => void;
}

export default function PositionChips({ positions, selectedPositionId, setSelectedPositionId }: Props) {
  return (
    <div className="flex flex-wrap gap-3 justify-center">
      {positions.map((pos) => (
        <button
          key={pos.positionId}
          onClick={() => setSelectedPositionId(pos.positionId)}
          className={`px-4 py-2 rounded-full font-semibold transition-all shadow-sm ${
            pos.positionId === selectedPositionId
              ? "bg-primary/90 text-white shadow-lg shadow-blue-500/30"
              : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
          }`}
        >
          {pos.positionName}
        </button>
      ))}
    </div>
  );
}
