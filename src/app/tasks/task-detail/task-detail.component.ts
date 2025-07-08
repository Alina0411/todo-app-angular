import {Component, inject, OnInit, OnDestroy} from '@angular/core';
import {MatFabButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {HeaderConfig} from '../../shared/components/models/header-config.model';
import {HeaderComponent} from '../../shared/components/header/header.component';
import {ActivatedRoute, Router} from '@angular/router';
import {TaskService} from '../../core/services/task.service';
import {Task, TaskStatus} from '../../core/models/task.model';
import {Subscription} from 'rxjs';
import {StatusInfoTextPipe} from '../../shared/pipes/task-status.pipe';

@Component({
  selector: 'app-task-detail',
  standalone: true,
  imports: [
    MatIcon,
    MatCardModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    HeaderComponent,
    StatusInfoTextPipe,
  ],
  templateUrl: './task-detail.component.html',
  styleUrl: './task-detail.component.scss'
})
export class TaskDetailComponent implements OnInit, OnDestroy {
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);
  taskService = inject(TaskService);

  task?: Task;
  TaskStatus = TaskStatus; // Для использования в шаблоне
  private subscription = new Subscription();

  headerConfig: HeaderConfig = {
    title: 'Детали задачи',
    showBackButton: true,
    onBackClick: () => this.viewTasks(),
  };

  viewTasks() {
    this.router.navigate(['/tasks']);
  }

  toggleTaskStatus() {
    if (this.task) {
      const newStatus = this.task.status === TaskStatus.Completed ? TaskStatus.NotCompleted : TaskStatus.Completed;
      this.taskService.updateTaskStatus(this.task.id, newStatus);
      // Обновляем локальное состояние для мгновенного отображения
      this.task = { ...this.task, status: newStatus };
    }
  }

  deleteTask() {
    if (this.task && confirm('Вы уверены, что хотите удалить эту задачу?')) {
      this.taskService.deleteTask(this.task.id);
      this.router.navigate(['/tasks']);
    }
  }

  ngOnInit() {
    this.subscription.add(
      this.activatedRoute.paramMap.subscribe(params => {
        const id = Number(params.get('id'));
        if (isNaN(id)) {
          this.router.navigate(['/tasks']);
          return;
        }
        
        const task = this.taskService.getTaskById(id);
        if (task) {
          this.task = task;
          this.headerConfig = {
            ...this.headerConfig,
            title: task.title
          };
        } else {
          this.router.navigate(['/tasks']);
        }
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
