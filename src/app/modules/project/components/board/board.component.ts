import { Component, OnInit, inject } from '@angular/core';
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
import { BoardService } from '../../services/board.service';

interface Task {
  id: string;
  title: string;
  description?: string;
}

interface Column {
  id: string;          // stage.id
  title: string;       // stage.name
  tasks: Task[];
}

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [CommonModule, CdkDropListGroup, CdkDropList, CdkDrag, FormsModule],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss'
})
export class BoardComponent implements OnInit {

  private readonly boardService = inject(BoardService);

  /** TODO: reemplazar por sprint activo real */
  private readonly sprintId: string = "3ce2dded-4dbf-4d4a-aa40-1f893ad26acb";

  columns: Column[] = [];

  isModalOpen = false;
  newTask: { title: string; description: string; columnId: string } = {
    title: '',
    description: '',
    columnId: '',
  };

  ngOnInit(): void {
    this.loadStages();
  }

  // =========================
  // Load stages (columns)
  // =========================
  private loadStages(): void {
    this.boardService.getSprintStages(this.sprintId).subscribe({
      next: (stages) => {
        this.columns = stages
          .sort((a, b) => a.orderIndex - b.orderIndex)
          .map(stage => ({
            id: stage.id.toString(),
            title: stage.name,
            tasks: []
          }));

        this.newTask.columnId = this.columns[0]?.id ?? '';
      },
      error: (err) => {
        console.error('Error loading stages', err);
      }
    });
  }


  // =========================
  // Drag & drop
  // =========================
  get taskListIds(): string[] {
    return this.columns.map(c => 'task-list-' + c.id);
  }

  dropColumn(event: CdkDragDrop<Column[]>) {
    if (event.previousIndex === event.currentIndex) return;

    moveItemInArray(this.columns, event.previousIndex, event.currentIndex);

    this.persistColumnOrder();
  }

  private persistColumnOrder(): void {
    this.columns.forEach((column, index) => {
      const stageId = Number(column.id);

      this.boardService.updateStage(
        this.sprintId,
        stageId,
        { orderIndex: index }
      ).subscribe({
        error: err => {
          console.error(
            `Error updating order for stage ${stageId}`,
            err
          );
        }
      });
    });
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

  // =========================
  // Columns (Stages)
  // =========================
  addColumn() {
    const name = prompt('Nombre de la nueva columna:');
    if (!name?.trim()) return;

    const orderIndex = this.columns.length;

    this.boardService.createStage(this.sprintId, {
      name: name.trim(),
      description: '',
      orderIndex,
      isDefault: false
    }).subscribe({
      next: (stage) => {
        this.columns.push({
          id: stage.id.toString(),
          title: stage.name,
          tasks: []
        });
      },
      error: (err) => console.error('Error creating stage', err)
    });
  }

  editColumnName(column: Column) {
    const newName = prompt('Nuevo nombre:', column.title);
    if (!newName?.trim()) return;

    this.boardService.updateStage(
      this.sprintId,
      Number(column.id),
      { name: newName.trim() }
    ).subscribe({
      next: (stage) => {
        column.title = stage.name;
      },
      error: (err) => console.error('Error updating stage', err)
    });
  }

  deleteColumn(columnId: string) {
    if (this.columns.length <= 1) {
      alert('Debe haber al menos una columna');
      return;
    }

    if (!confirm('¿Eliminar esta columna y todas sus tareas?')) return;

    this.boardService.deleteStage(this.sprintId, Number(columnId)).subscribe({
      next: () => {
        this.columns = this.columns.filter(c => c.id !== columnId);
        this.persistColumnOrder(); // 🔥 clave
      },
      error: (err) => console.error('Error deleting stage', err)
    });
  }


  // =========================
  // Tasks (local only)
  // =========================
  openCreateTaskModal(columnId?: string) {
    this.newTask = {
      title: '',
      description: '',
      columnId: columnId ?? this.columns[0]?.id ?? '',
    };
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  createTask() {
    if (!this.newTask.title.trim()) return;

    const column = this.columns.find(c => c.id === this.newTask.columnId);
    if (!column) return;

    column.tasks.push({
      id: Date.now().toString(36),
      title: this.newTask.title.trim(),
      description: this.newTask.description?.trim() || undefined,
    });

    this.closeModal();
  }

  deleteTask(columnId: string, taskId: string) {
    const column = this.columns.find(c => c.id === columnId);
    if (!column) return;

    column.tasks = column.tasks.filter(t => t.id !== taskId);
  }
}
