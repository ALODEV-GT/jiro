import { Injectable, signal } from '@angular/core';
import { Sprint } from '../models/project.model';

@Injectable({
  providedIn: 'root'
})
export class SprintService {
  private sprints = signal<Sprint[]>([
    // Datos de prueba
    {
      id: 1,
      name: 'Sprint 1',
      description: 'Primer sprint del proyecto',
      startDate: new Date('2025-12-09'),
      durationWeeks: 2,
      endDate: new Date('2025-12-23'),
      status: 'Activo'
    }
  ]);

  allSprints = this.sprints.asReadonly();

  add(sprint: Omit<Sprint, 'id' | 'endDate'>) {
    const endDate = new Date(sprint.startDate);
    endDate.setDate(endDate.getDate() + sprint.durationWeeks * 7);
    const newSprint: Sprint = {
      ...sprint,
      id: Math.max(...this.sprints().map((s: any) => s.id), 0) + 1,
      endDate
    };
    this.sprints.update((list: any) => [...list, newSprint]);
  }

  update(id: number, changes: Partial<Sprint>) {
    if (changes.startDate || changes.durationWeeks) {
      const current = this.sprints().find(s => s.id === id);
      if (current) {
        const start = changes.startDate ?? current.startDate;
        const duration = changes.durationWeeks ?? current.durationWeeks;
        const endDate = new Date(start);
        endDate.setDate(endDate.getDate() + duration * 7);
        changes = { ...changes, endDate };
      }
    }
    this.sprints.update((list: any) =>
      list.map((s: any) => s.id === id ? { ...s, ...changes } : s)
    );
  }

  delete(id: number) {
    this.sprints.update((list: any) => list.filter((s: any) => s.id !== id));
  }
}