/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useState, useEffect } from "react";
import HeaderResult from "./main/header";
import { getPosition, getResults } from "@/actions/get-results";
import { GetResults, PositionChip, PositionSummary } from "./types/results";
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
    const resposition = await getPosition();
    if (res.data) {
      const data: GetResults[] = res.data;
      const positionData: PositionSummary[] = resposition?.data || [];
      
      // Crear un mapa de posiciones con sus datos adicionales
      const positionMap = new Map<string, PositionSummary>();
      positionData.forEach((pos) => {
        positionMap.set(pos.positionId, pos);
      });

      const map = new Map<string, PositionChip>();
      let totalVotes = 0;

      data.forEach((c: GetResults) => {
        totalVotes += c.totalVotes;
        if (!map.has(c.positionId)) {
          const posInfo = positionMap.get(c.positionId);
          map.set(c.positionId, {
            positionId: c.positionId,
            positionName: c.positionName,
            candidates: [],
            totalVotes: 0,
            totalVotesPositon: posInfo?.totalVotesPositon || 0,
            validPercentage: posInfo?.validPercentage || 0,
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

  useEffect(() => {
    if (selectedPositionId) {
      const selectedPos = positions.find(p => p.positionId === selectedPositionId);
      if (selectedPos) {
        setStats(prev => ({
          ...prev,
          totalVotesPositon: selectedPos.totalVotesPositon || 0,
          validPercentage: selectedPos.validPercentage || 0,
        }));
      }
    }
  }, [selectedPositionId, positions]);

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