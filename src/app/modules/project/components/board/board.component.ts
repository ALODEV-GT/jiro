import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  CdkDropListGroup,
  CdkDropList,
  CdkDrag,
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { FormsModule } from '@angular/forms';

interface Task {
  id: string;
  title: string;
  description?: string;
}

interface Column {
  id: string;
  title: string;
  tasks: Task[];
}

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [CommonModule, CdkDropListGroup, CdkDropList, CdkDrag, FormsModule],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss'
})
export class BoardComponent {
  columns: Column[] = [
    { id: '1', title: 'Pendiente', tasks: [] },
    { id: '2', title: 'En desarrollo', tasks: [] },
    { id: '3', title: 'Finalizadas', tasks: [] },
  ];

  isModalOpen = false;
  newTask: { title: string; description: string; columnId: string } = {
    title: '',
    description: '',
    columnId: this.columns[0]?.id ?? '',
  };

  openCreateTaskModal(columnId?: string) {
    const defaultColumnId = columnId ?? this.columns[0]?.id ?? '';
    this.newTask = {
      title: '',
      description: '',
      columnId: defaultColumnId,
    };
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.newTask = { title: '', description: '', columnId: this.columns[0]?.id ?? '' };
  }

  createTask() {
    if (!this.newTask.title.trim()) return;

    const column =
      this.columns.find((c) => c.id === this.newTask.columnId) ?? this.columns[0];

    if (!column) return;

    const task: Task = {
      id: Date.now().toString(36),
      title: this.newTask.title.trim(),
      description: this.newTask.description?.trim() || undefined,
    };

    column.tasks.push(task);
    this.closeModal();
  }

  moveColumn(fromIndex: number, toIndex: number) {
    if (
      toIndex < 0 ||
      toIndex >= this.columns.length ||
      fromIndex === toIndex
    ) {
      return;
    }
    moveItemInArray(this.columns, fromIndex, toIndex);
  }

  dropTask(event: CdkDragDrop<Task[]>, columnId: string) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }

  addColumn() {
    const name = prompt('Nombre de la nueva columna:');
    if (name?.trim()) {
      this.columns.push({
        id: Date.now().toString(),
        title: name.trim(),
        tasks: [],
      });
    }
  }

  editColumnName(column: Column) {
    const newName = prompt('Nuevo nombre:', column.title);
    if (newName?.trim()) {
      column.title = newName.trim();
    }
  }

  deleteColumn(columnId: string) {
    if (this.columns.length <= 1) {
      alert('Debe haber al menos una columna');
      return;
    }
    if (confirm('¿Eliminar esta columna y todas sus tareas?')) {
      this.columns = this.columns.filter((c) => c.id !== columnId);
    }
  }

  deleteTask(columnId: string, taskId: string) {
    const column = this.columns.find((c) => c.id === columnId);
    if (!column) return;
    column.tasks = column.tasks.filter((t) => t.id !== taskId);
  }
}