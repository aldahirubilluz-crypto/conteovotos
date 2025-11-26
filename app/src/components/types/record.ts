export interface GetRecord {
    id: string;
    candidateId: string;
    candidateName: string;
    mesa: string;
    totalVotes: string;
}

export interface PosRecord {
    mesa: string;
    candidateId: string;
    totalVotes: number;
}