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
    id: number;
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    status: string;
    createdAt: string;
    updatedAt: string;
}

export interface Member {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    color: string;
}
