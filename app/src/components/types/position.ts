export interface GetPosition {
    id: string;
    name: string;
    description: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface PosPostion {
    name: string;
    description: string;
}

export interface UpdatePostion {
    name: string;
    description: string;
    isActive: boolean
}