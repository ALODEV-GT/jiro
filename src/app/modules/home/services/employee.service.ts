import { Injectable, signal } from '@angular/core';
import { Employee } from '../models/home.model';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private employees = signal<Employee[]>([
    { id: 1, name: 'Juan Pérez', email: 'juan@example.com' },
    { id: 2, name: 'María López', email: 'maria@example.com' },
    { id: 3, name: 'Carlos Gómez', email: 'carlos@example.com' }
  ]);

  allEmployees = this.employees.asReadonly();

  add(employee: Omit<Employee, 'id'>) {
    const newEmployee: Employee = {
      ...employee,
      id: Math.max(...this.employees().map(e => e.id), 0) + 1
    };
    this.employees.update(list => [...list, newEmployee]);
  }
}