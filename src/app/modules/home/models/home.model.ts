export interface Project { //here
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
