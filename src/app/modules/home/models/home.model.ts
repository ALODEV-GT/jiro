export interface Project {
    id: number;
    name: string;
    description: string;
    active: boolean;
    monthlyIncome: number;
    createdAt?: Date;
}

export interface Employee {
    id: number;
    name: string;
    email: string;
    hiredDate?: Date;
}

export interface Contract {
    id: number;
    employeeId: number;
    projectId: number;
    baseSalary: number;
    role: 'Project Manager' | 'Project Owner' | 'Frontend' | 'Backend' | 'Fullstack';
    startDate: Date;
    endDate?: Date;
    isActive: boolean;
}

export interface Bonus {
    id: number;
    employeeId: number;
    projectId: number;
    amount: number;
    date: Date;
    description?: string;
}

export interface Discount {
    id: number;
    employeeId: number;
    projectId: number;
    amount: number;
    date: Date;
    reason?: string;
}

