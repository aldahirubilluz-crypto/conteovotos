/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useState, useEffect } from "react";
import HeaderResult from "./main/header";
import { getResults } from "@/actions/get-results";
import { GetResults, PositionChip } from "./types/results";
import PositionChips from "./main/position-chips";
import PositionContent from "./main/position-content";



export default function VotingDashboardPage() {
  const [positions, setPositions] = useState<PositionChip[]>([]);
  const [selectedPositionId, setSelectedPositionId] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalVotes: 0,
    totalPositions: 0,
    totalCandidates: 0,
  });
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const fetchResults = async () => {
    const res = await getResults();
    console.log(res);
    

    if (res.data) {
      const data: GetResults[] = res.data;
      const map = new Map<string, PositionChip>();
      let totalVotes = 0;

      data.forEach((c: GetResults) => {
        totalVotes += c.totalVotes;
        if (!map.has(c.positionId)) {
          map.set(c.positionId, {
            positionId: c.positionId,
            positionName: c.positionName,
            candidates: [],
            totalVotes: 0,
          });
        }
        const pos = map.get(c.positionId)!;
        pos.totalVotes += c.totalVotes;
        pos.candidates.push({
          id: c.candidateId,
          name: c.candidateName,
          votes: c.totalVotes,
          percentage: 0,
          image: c.imageId,
          isWinner: false,
        });
      });

      const processedPositions = Array.from(map.values()).map((pos) => {
        const sortedCandidates = pos.candidates
          .map((c) => ({
            ...c,
            percentage: Number(((c.votes / pos.totalVotes) * 100).toFixed(1)),
          }))
          .sort((a, b) => b.votes - a.votes);

        if (sortedCandidates.length > 0) sortedCandidates[0].isWinner = true;
        return { ...pos, candidates: sortedCandidates };
      });

      setPositions(processedPositions);
      setStats({
        totalVotes,
        totalPositions: processedPositions.length,
        totalCandidates: data.length,
      });
      setLastUpdated(new Date());

      if (!selectedPositionId && processedPositions.length > 0) {
        setSelectedPositionId(processedPositions[0].positionId);
      }
    }
  };

  useEffect(() => {
    fetchResults();
    const interval = setInterval(fetchResults, 30000);
    return () => clearInterval(interval);
  }, []);

  const selectedPosition = positions.find((p) => p.positionId === selectedPositionId);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <HeaderResult stats={stats} lastUpdated={lastUpdated} />
      <div className="py-2 space-y-6">
        <PositionChips
          positions={positions}
          selectedPositionId={selectedPositionId}
          setSelectedPositionId={setSelectedPositionId}
        />

        {selectedPosition && <PositionContent selectedPosition={selectedPosition} />}
      </div>
    </div>
  );
}