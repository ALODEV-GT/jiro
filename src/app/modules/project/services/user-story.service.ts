import { Injectable, signal } from '@angular/core';
import { UserStory } from '../models/project.model';

@Injectable({
  providedIn: 'root'
})
export class UserStoryService {
  private userStories = signal<UserStory[]>([
    {
      id: 1,
      name: 'Historia de Login',
      description: 'Como usuario, quiero loguearme para acceder al sistema. Criterios: Validar email y password.',
      points: 5,
      priority: 'Alta',
      productOwnerId: 1,
      assigneeId: 2,
      sprintId: 1
    }
  ]);

  allUserStories = this.userStories.asReadonly();

  add(story: Omit<UserStory, 'id'>) {
    const newStory: UserStory = {
      ...story,
      id: Math.max(...this.userStories().map((s: any) => s.id), 0) + 1
    };
    this.userStories.update((list: any) => [...list, newStory]);
  }

  update(id: number, changes: Partial<UserStory>) {
    this.userStories.update((list: any) =>
      list.map((s: any) => s.id === id ? { ...s, ...changes } : s)
    );
  }

  delete(id: number) {
    this.userStories.update((list: any) => list.filter((s: any) => s.id !== id));
  }
}