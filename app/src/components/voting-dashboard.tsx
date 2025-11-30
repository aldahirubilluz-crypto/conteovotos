/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useState, useEffect } from "react";
import HeaderResult from "./main/header";
import { PositionChip, ProcessedCandidate } from "./types/results";
import PositionChips from "./main/position-chips";
import PositionContent from "./main/position-content";
import { GetPositionAction } from "@/actions/position";
import { getCantidatosAction } from "@/actions/cantidatos";
import { getRecordAction } from "@/actions/registro";
import { GetPosition } from "./types/position";
import { GetCantidatos } from "./types/cantidates";

interface Vote {
  id: string;
  mesa: string;
  candidateId: string;
  candidateName: string;
  totalVotes: number;
  typeVote: "PERSONAL" | "PUBLICO";
  position: {
    id: string;
    name: string;
    typePosition: "AUTORIDAD" | "INTEGRANTE";
  };
}

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
    const resPosition = await GetPositionAction();
    const resCandidatos = await getCantidatosAction();
    const resVotes = await getRecordAction();

    if (resPosition.data && resCandidatos.data && resVotes.data) {
      const positionsData = resPosition.data;
      const candidatesData = resCandidatos.data;
      const votesData: Vote[] = resVotes.data;

      const positionMap = new Map();
      positionsData.forEach((pos: GetPosition) => {
        const totalVotesForPosition = votesData
          .filter((vote) => vote.position.id === pos.id)
          .reduce((sum, vote) => sum + vote.totalVotes, 0);

        positionMap.set(pos.id, {
          positionId: pos.id,
          positionName: pos.name,
          typePosition: pos.typePosition,
          totalVotesPosition: pos.totalVotes,
          validPercentage: pos.validPercentage,
          totalVotesWithNulls: totalVotesForPosition,
          candidates: [],
        });
      });

      candidatesData.forEach((candidate: GetCantidatos) => {
        if (candidate.typeCandidate === "CANDIDATO") {
          const posId = candidate.position.id;
          const position = positionMap.get(posId);

          if (position) {
            position.candidates.push({
              id: candidate.id,
              name: candidate.name,
              votes: 0,
              votesPublico: 0,
              votesPersonal: 0,
              percentage: 0,
              image: candidate.imageId || "",
              isWinner: false,
            });
          }
        }
      });

      votesData.forEach((vote) => {
        const posId = vote.position.id;
        if (positionMap.has(posId)) {
          const position = positionMap.get(posId);
          const candidate = position.candidates.find((c: GetCantidatos) => c.id === vote.candidateId);

          if (candidate) {
            if (vote.typeVote === "PUBLICO") {
              candidate.votesPublico += vote.totalVotes;
            } else {
              candidate.votesPersonal += vote.totalVotes;
            }
          }
        }
      });

      positionMap.forEach((position) => {
        if (position.typePosition === "AUTORIDAD") {
          const totalPersonal = position.candidates.reduce((sum: number, c: ProcessedCandidate) => sum + c.votesPersonal, 0);
          const totalPublico = position.candidates.reduce((sum: number, c: ProcessedCandidate) => sum + c.votesPublico, 0);

          const ponderado = totalPersonal > 0 ? (totalPublico * 2) / totalPersonal : 0;

          position.candidates.forEach((candidate: ProcessedCandidate) => {
            const votesPersonalPonderado = candidate.votesPersonal * ponderado;
            candidate.votes = candidate.votesPublico + votesPersonalPonderado;
          });
        } else {
          position.candidates.forEach((candidate: ProcessedCandidate) => {
            candidate.votes = candidate.votesPublico + candidate.votesPersonal;
          });
        }

        const totalVotesCandidates = position.candidates.reduce((sum: number, c: ProcessedCandidate) => sum + c.votes, 0);

        position.candidates.forEach((candidate: ProcessedCandidate) => {
          candidate.percentage = totalVotesCandidates > 0
            ? Number(((candidate.votes / totalVotesCandidates) * 100).toFixed(2))
            : 0;
        });

        position.candidates.sort((a: ProcessedCandidate, b: ProcessedCandidate) => b.votes - a.votes);
        if (position.candidates.length > 0) {
          position.candidates[0].isWinner = true;
        }
      });

      const processedPositions = Array.from(positionMap.values());
      setPositions(processedPositions);

      let totalVotesWithNulls = 0;
      votesData.forEach((vote) => {
        totalVotesWithNulls += vote.totalVotes;
      });

      setStats({
        totalVotes: totalVotesWithNulls,
        totalPositions: positionsData.length,
        totalCandidates: candidatesData.filter((c: GetCantidatos) => c.typeCandidate === "CANDIDATO").length,
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