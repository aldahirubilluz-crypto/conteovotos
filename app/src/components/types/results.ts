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
  votesPersonal: number;
  votesPublico: number;
  percentage: number;
  image: string;
  isWinner: boolean;
}

export interface PositionChip {
  positionId: string;
  positionName: string;
  candidates: ProcessedCandidate[];
  totalVotes: number;
  totalVotesPosition: number;
  validPercentage: number;
}

export interface PositionSummary {
  positionId: string;
  name: string;
  totalVotesPosition: number;
  validPercentage: number;
}