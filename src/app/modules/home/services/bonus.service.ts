import { Injectable, signal } from '@angular/core';
import { Bonus } from '../models/home.model';

@Injectable({
  providedIn: 'root'
})
export class BonusService {
  private bonuses = signal<Bonus[]>([]);

  allBonuses = this.bonuses.asReadonly();

  add(bonus: Omit<Bonus, 'id'>) {
    const newBonus: Bonus = {
      ...bonus,
      id: Math.max(...this.bonuses().map(b => b.id), 0) + 1
    };
    this.bonuses.update(list => [...list, newBonus]);
  }

  delete(id: number) {
    this.bonuses.update(list => list.filter(b => b.id !== id));
  }
}
