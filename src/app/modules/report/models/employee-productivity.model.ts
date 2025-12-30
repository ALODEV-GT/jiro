export interface EmployeeProductivity {
  project: {
    id: string;
    name: string;
    client: string;
    startDate: string;
    endDate: string;
  };
  story: {
    id: string;
    name: string;
    stage: string;
    points: number;
    priority: string;
  };
  sprint: {
    id: string;
    name: string;
    status: string;
    startDate: string;
    endDate: string;
  };
  productOwner: {
    id: string;
    fullName: string;
    email: string;
    role: string;
    hiredAt: string;
    terminatedAt: string;
  };
  developer: {
    id: string;
    fullName: string;
    email: string;
    role: string;
    hiredAt: string;
    terminatedAt: string;
  };
  fromDate: string;
  toDate: string;
  hoursSpent: number;
  stageChanges: number;
  totalStories: number;
  pointsDone: number;
}
