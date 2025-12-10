export interface Project {
  id: number;
  name: string;
  description: string;
  status: 'Abierto' | 'Cerrado';
  monthlyIncome: number;
  createdAt?: Date;
}