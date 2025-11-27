import { PositionChip } from "../types/results";
import { CandidateCard } from "./candidate-card";

export function CandidatesGrid({ selectedPosition }: { selectedPosition: PositionChip }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {selectedPosition.candidates.map((candidate, index) => (
                <CandidateCard candidate={candidate} index={index} key={candidate.id} />
            ))}
        </div>
    );
}