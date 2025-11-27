"use client";


import { HeaderInfo } from "./hea-derInfo";
import { CandidatesGrid } from "./candidates-grid";
import { ComparativeAnalysis } from "./comparative-analysis";
import { ChartsSection } from "./charts-section";
import { ResultsTable } from "./results-table";
import { PositionChip } from "../types/results";

interface Props {
    selectedPosition: PositionChip;
}


export default function PositionContent({ selectedPosition }: Props) {
    return (
        <div className="w-full mx-auto px-4 md:px-6 space-y-6">
            <HeaderInfo selectedPosition={selectedPosition} />
            <CandidatesGrid selectedPosition={selectedPosition} />
            {selectedPosition.candidates.length >= 2 && (
                <ComparativeAnalysis selectedPosition={selectedPosition} />
            )}
            <ChartsSection selectedPosition={selectedPosition} />
            <ResultsTable selectedPosition={selectedPosition} />
        </div>
    );
}
