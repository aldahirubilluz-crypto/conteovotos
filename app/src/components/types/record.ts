export interface GetRecord {
  id: string;
  candidateId: string;
  candidateName: string;
  mesa: string;
  totalVotes: string;
  typeVote: string;
  position: PositionSimple;
}

interface PositionSimple {
  id: string;
  name: string;
  typePosition: string;
}

export interface PosRecord {
  mesa: string;
  candidateId: string;
  totalVotes: number;
  typeVote: "PERSONAL" | "PUBLICO";
}
