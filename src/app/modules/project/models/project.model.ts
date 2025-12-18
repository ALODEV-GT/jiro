export interface UserStory {
    id: number;
    name: string;
    description: string;
    points: number;
    priority: 'Baja' | 'Media' | 'Alta' | 'Crítica';
    productOwnerId: number;
    assigneeId: number;
    sprintId?: number;
}

export interface Sprint {
    id: string;
    name: string;
    description: string;
    startDate: Date;
    endDate: Date;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface Member {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    color: string;
}
