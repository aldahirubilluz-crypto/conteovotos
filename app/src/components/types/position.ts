export interface GetPosition {
  id: string;
  name: string;
  description: string;
  typePosition: string;
  totalVotes: number;
  validPercentage: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface PosPostion {
  name: string;
  description: string;
  typePosition: string;
  totalVotes: number;
  validPercentage: number;
}

export interface UpdatePostion {
  name: string;
  description: string;
  typePosition: string;
  totalVotes: number;
  validPercentage: number;
}
