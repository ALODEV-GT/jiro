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

export interface Contract {
    id: number;
    employeeId: number;
    projectId: number;
    baseSalary: number;
    role: 'Project Manager' | 'Project Owner' | 'Frontend' | 'Backend' | 'Fullstack';
    startDate: string;
    endDate?: string;
    isActive: boolean;
}

export interface Bonus {
    id: number;
    employeeId: number;
    projectId: number;
    amount: number;
    date: string;
    description?: string;
}

export interface Discount {
    id: number;
    employeeId: number;
    projectId: number;
    amount: number;
    date: string;
    reason?: string;
}

//Roles
export interface Rol {
    id: number;
    name: string;
    description: string;
    color: string;
    permissions: number[]
}

export interface Permissions {
    id: number;
    key: string;
    description: string;
    createdAt: string;
    updatedAt: string;
}