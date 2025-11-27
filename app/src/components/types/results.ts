export interface GetResults {
  candidateId: string;
  candidateName: string;
  positionId: string;
  positionName: string;
  totalVotes: number;
  imageId: string;
}

export interface ProcessedCandidate {
  id: string;
  name: string;
  votes: number;
  percentage: number;
  image: string;
  isWinner: boolean;
}

export interface PositionChip {
  positionId: string;
  positionName: string;
  candidates: ProcessedCandidate[];
  totalVotes: number;
  totalVotesPositon: number;
  validPercentage: number;
}

// Nuevo tipo para el endpoint de posiciones
export interface PositionSummary {
  positionId: string;
  name: string;
  totalVotesPositon: number;
  validPercentage: number;
}