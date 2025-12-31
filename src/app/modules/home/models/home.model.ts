export interface Project {
    id: string;
    name: string;
    description: string;
    client: string;
    monthlyIncome: number;
    active: boolean;
    createdAt?: string;
    updatedAt?: string;
    closedAt?: string;
}

export interface Employee {
    id: number;
    name: string;
    email: string;
    hiredDate?: string;
}

//Discount
export interface Discount {
    id: number;
    amount: number;
    reason: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateOrUpdateDiscount {
    amount: number;
    reason: string;
}

//Roles
export interface Rol {
    id: number;
    name: string;
    description: string;
    color: string;
    permissions: number[]
}

export interface Permission {
    id: number;
    key: string;
    description: string;
    createdAt: string;
    updatedAt: string;
}


//Contracts
export type ContractStatus = 'ACTIVE' | 'TERMINATED' | 'SUSPENDED';
export type ContractRole = 'BACKEND' | 'FRONTEND' | 'FULLSTACK' | string;

export interface Contract {
    id: number;
    baseSalary: number;
    role: ContractRole;
    startDate: string;   // YYYY-MM-DD
    endDate: string | null;
    status: ContractStatus;
    createdAt: string;  // ISO string
    updatedAt: string;  // ISO string
}

export interface CreateOrUpdateContract {
    baseSalary: number;
    role: ContractRole;
    startDate: string;
    endDate: string | null;
    status: ContractStatus;
}

//User
export interface User {
    id: string;
    firstName: string;
    lastName: string;
    dpi: string;
    email: string;
    roleId: string;
    roleColor: string;
    createdAt: string;
    updatedAt: string;
}

export interface UpdateMyUser {
    firstName: string;
    lastName: string;
    password?: string;
}

//Bonus
export interface Bonus {
    id: number;
    amount: number;
    reason: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateOrUpdateBonus {
    amount: number;
    reason: string;
}


//Payroll
export interface Payroll {
    id: number;
    employeeId: string;
    baseSalary: number;
    totalBonuses: number;
    totalDiscounts: number;
    totalPaid: number;
    paymentDate: string;
    fromDate: string;
    toDate: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateOrUpdatePayroll {
    baseSalary: number;
    totalBonuses: number;
    totalDiscounts: number;
    paymentDate: string;
    fromDate: string;
    toDate: string;
}


//Suspension
export interface Suspension {
    id: number;
    amount: number;
    reason: string;
    startDate: string;
    endDate: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateOrUpdateSuspension {
    amount: number;
    reason: string;
    startDate: string;
    endDate: string;
    createdAt: string;
}


//Income
export interface Income {
    id: number;
    amount: number;
    type: 'FIXED_PRICE' | 'HOURLY_RATE';
    description: string;
    billingDate: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateOrUpdateIncome {
    amount: number;
    type: string;
    description: string;
    billingDate: string;
}


//Expense
export interface Expense {
    id: number;
    projectId: string;
    employeeId: string | null;
    description: string;
    amount: number;
    type: ExpenseType;
    expenseDate: string;
    createdAt: string;
    updatedAt: string;
}


export interface CreateOrUpdateExpense {
    employeeId?: string | null;
    description: string;
    amount: number;
    type: ExpenseType;
    expenseDate: string;
}

export type ExpenseType =
    | 'SALARY'
    | 'OPERATIONAL'


//Member
export interface AddMemberRequest {
    userId: string;
}

export interface ProjectMember {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    color: string;
}

export type SprintStatus = 'PENDING' | 'ACTIVE' | 'COMPLETED';

//Sprint
export interface Sprint {
    id: string;
    name: string;
    description: string;
    startDate: string;   // YYYY-MM-DD
    endDate: string;     // YYYY-MM-DD
    status: SprintStatus;
    createdAt: string;   // ISO datetime
    updatedAt: string;   // ISO datetime
}

export interface CreateOrUpdateSprint {
    name: string;
    description: string;
    startDate: string;   // YYYY-MM-DD
    endDate: string;     // YYYY-MM-DD
    status: SprintStatus;
}



//Audit logs
export interface Audit {
    actorId: string;
    eventType: string;
    occurredAt: number;
    description: string;
}

export interface StoryEvent {
    id: string;
    projectId: string;
    productOwnerId: string;
    developerId: string;
    sprintId: string;
    name: string;
    description: string;
    points: number;
    priority: string;
    stage: string;
    audit: Audit;
}

export interface SprintEvent {
    id: string;
    projectId: string;
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    status: string;
    audit: Audit;
}

export interface ProjectEvent {
    id: string;
    name: string;
    description: string;
    client: string;
    status: string;
    monthlyIncome: number;
    audit: Audit;
}

export type ActivityEventType =
    | 'story.created'
    | 'story.moved'
    | 'story.updated'
    | 'story.deleted'
    | 'sprint.created'
    | 'sprint.updated'
    | 'sprint.deleted'
    | 'project.created'
    | 'project.closed'
    | 'project.updated'
    | 'project.deleted';

export type ActivityDetails =
    | StoryEvent
    | SprintEvent
    | ProjectEvent;

export interface ActivityLog {
    id: number;
    eventType: ActivityEventType;
    aggregateId: string;
    actorId: string;
    fullName: string;
    email: string;
    role: string;
    occurredAt: string;
    description: string;
    details: any;
}