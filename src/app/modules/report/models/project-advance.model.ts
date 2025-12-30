export interface Member {
  id: string;
  fullName: string;
  email: string;
  role: string;
}

export interface ProjectAdvance {
  projectId: string;
  projectName: string;
  client: string;
  projectStartDate: string;
  projectEndDate: string;
  sprintId: string;
  sprintName: string;
  sprintStatus: string;
  sprintStartDate: string;
  sprintEndDate: string;
  pointsDone: number;
  pointsPlanned: number;
  percentDone: number;
  members: Member[];
}
