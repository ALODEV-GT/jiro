export type StoryPriority = 'LOW' | 'MEDIUM' | 'HIGH';

export interface UserStory {
    id: number;
    stageId: number | null;
    projectId: string;

    productOwnerId: string;
    developerId: string;

    name: string;
    description: string;
    points: number;
    priority: StoryPriority;
}

export type CreateStoryPayload = Omit<
    UserStory,
    'id' | 'stageId' | 'projectId'
>;

export type UpdateStoryPayload = Partial<CreateStoryPayload>;


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


export interface SprintStage {
  id: number;
  name: string;
  description: string;
  orderIndex: number;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}
