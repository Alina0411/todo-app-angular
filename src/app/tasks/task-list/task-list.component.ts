import {Component, inject, OnInit, OnDestroy} from '@angular/core';
import {MatList, MatListItem} from '@angular/material/list';
import {MatIcon} from '@angular/material/icon';
import {MatCheckbox} from '@angular/material/checkbox';
import {MatMiniFabButton} from '@angular/material/button';
import {MatDialog} from '@angular/material/dialog';
import {Router} from '@angular/router';
import {TaskService} from '../../core/services/task.service';
import {Task, TaskStatus} from '../../core/models/task.model';
import {TaskDialogComponent} from '../task-dialog/task-dialog.component';
import {HeaderComponent} from '../../shared/components/header/header.component';
import {HeaderConfig} from '../../shared/components/models/header-config.model';
import {StatusInfoTextPipe} from '../../shared/pipes/task-status.pipe';
import {Subject, takeUntil} from 'rxjs';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    MatIcon,
    MatList,
    MatListItem,
    MatCheckbox,
    MatMiniFabButton,
    HeaderComponent,
    StatusInfoTextPipe
  ],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss',
})
export class TaskListComponent implements OnInit, OnDestroy {
  filteredTasks: Task[] = []
  selectedFilter: 'all' | 'not_completed' | 'completed' = 'all';
  headerConfig: HeaderConfig = {
    title: 'Список задач',
    showAddButton: true,
    onAddClick: () => this.openAddTaskDialog()
  };
  taskService = inject(TaskService);
  dialog = inject(MatDialog);
  router = inject(Router);
  TaskStatus = TaskStatus;
  private destroy$ = new Subject<void>();

  ngOnInit() {
    this.taskService.tasks$.pipe(takeUntil(this.destroy$)).subscribe(tasks => {
      this.filteredTasks = this.filterTasks(tasks, this.selectedFilter);
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  openAddTaskDialog(): void {
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: '500px',
      data: {}
    });

    dialogRef.afterClosed().pipe(takeUntil(this.destroy$)).subscribe(result => {
      if (result) {
        this.taskService.addTask(result);
      }
    });
  }

  deleteTask(id: number, event: Event): void {
    event.stopPropagation();
    this.taskService.deleteTask(id);
  }

  onToggleStatus(task: Task): void {
    const newStatus = task.status === TaskStatus.Completed ? TaskStatus.NotCompleted : TaskStatus.Completed;
    this.taskService.updateTaskStatus(task.id, newStatus);
  }

  viewTaskDetails(taskId: number): void {
    this.router.navigate(['/tasks', taskId]);
  }

  onStatusFilterChange(status: 'all' | 'not_completed' | 'completed') {
    this.selectedFilter = status;
    const currentTasks = this.taskService.getCurrentTasks();
    this.filteredTasks = this.filterTasks(currentTasks, status);
  }

  filterTasks(tasks: Task[], filter: 'all' | 'not_completed' | 'completed'): Task[] {
    if (filter === 'all') {
      return tasks;
    }
    return tasks.filter(task => task.status === filter);
  }

  getEmptyStateMessage(): { title: string; description: string; icon: string } {
    const totalTasks = this.taskService.getCurrentTasks().length;
    
    if (totalTasks === 0) {
      return {
        title: 'Нет задач',
        description: 'Нажмите кнопку "+" чтобы добавить первую задачу',
        icon: 'assignment'
      };
    }
    
    switch (this.selectedFilter) {
      case 'completed':
        return {
          title: 'Нет выполненных задач',
          description: 'Выполните несколько задач, чтобы увидеть их здесь',
          icon: 'task_alt'
        };
      case 'not_completed':
        return {
          title: 'Все задачи выполнены!',
          description: 'Отличная работа! Все задачи завершены',
          icon: 'celebration'
        };
      default:
        return {
          title: 'Нет задач',
          description: 'Нажмите кнопку "+" чтобы добавить первую задачу',
          icon: 'assignment'
        };
    }
  }
}
