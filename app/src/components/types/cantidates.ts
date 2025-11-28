export interface GetCantidatos {
    id: string;
    name: string;
    description: string;
    isActive: boolean;
    order: number;
    position: ProntPosition;
    imageId: string;
    imageUrl: string;
}

export interface PosCandidate {
    name: string;
    description: string;
    positionId: string;
    image?: File;
}

export interface UpdateCandidate {
    name: string;
    description: string;
    positionId: string;
    image?: File;
    isActive: boolean;
}


export interface ProntPosition {
    id: string;
    name: string;
    typePosition: string;
}
