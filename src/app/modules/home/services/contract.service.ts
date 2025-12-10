import { Injectable, signal } from '@angular/core';
import { Contract } from '../models/home.model';

@Injectable({
  providedIn: 'root'
})
export class ContractService {

  private contracts = signal<Contract[]>([
    // Datos de prueba
    {
      id: 1,
      employeeId: 1,
      projectId: 1,
      baseSalary: 5000,
      role: 'Project Manager',
      startDate: new Date('2025-01-01'),
      isActive: true
    }
  ]);

  allContracts = this.contracts.asReadonly();

  add(contract: Omit<Contract, 'id' | 'isActive' | 'endDate'>) {
    const newContract: Contract = {
      ...contract,
      id: Math.max(...this.contracts().map(c => c.id), 0) + 1,
      isActive: true
    };
    this.contracts.update((list: any) => [...list, newContract]);
  }

  terminate(id: number, endDate: Date) {
    this.contracts.update((list: any) =>
      list.map((c: any) => c.id === id ? { ...c, isActive: false, endDate } : c)
    );
  }

  delete(id: number) {
    this.contracts.update((list: any) => list.filter((c: any) => c.id !== id));
  }

  getById(id: number): Contract | undefined {
    return this.contracts().find((c: any) => c.id === id);
  }
}