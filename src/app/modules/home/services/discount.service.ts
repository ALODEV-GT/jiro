import { Injectable, signal } from '@angular/core';
import { Discount } from '../models/home.model';

@Injectable({
  providedIn: 'root'
})
export class DiscountService {
  private discount = signal<Discount[]>([]);

  allDeductions = this.discount.asReadonly();

  add(deduction: Omit<Discount, 'id'>) {
    const newDeduction: Discount = {
      ...deduction,
      id: Math.max(...this.discount().map(d => d.id), 0) + 1
    };
    this.discount.update(list => [...list, newDeduction]);
  }

  delete(id: number) {
    this.discount.update(list => list.filter(d => d.id !== id));
  }
}