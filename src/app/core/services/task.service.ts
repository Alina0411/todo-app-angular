import {Injectable, OnDestroy} from '@angular/core';
import {BehaviorSubject, Observable, Subject, takeUntil} from 'rxjs';
import {Task, TaskStatus} from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService implements OnDestroy {
  private tasksSubject = new BehaviorSubject<Task[]>([]);
  private currentId = 1;
  private destroy$ = new Subject<void>();

  constructor() {
    try {
      const saved = localStorage.getItem('tasks');
      if (saved) {
        const parsedTasks = JSON.parse(saved);
        this.tasksSubject.next(parsedTasks);
        const tasks = this.tasksSubject.getValue();
        this.currentId = tasks.length ? Math.max(...tasks.map(t => t.id)) + 1 : 1;
      }
    } catch (error) {
      console.error('Error loading tasks from localStorage:', error);
      this.tasksSubject.next([]);
      this.currentId = 1;
    }

    this.tasks$.pipe(takeUntil(this.destroy$)).subscribe(tasks => {
      try {
        localStorage.setItem('tasks', JSON.stringify(tasks));
      } catch (error) {
        console.error('Error saving tasks to localStorage:', error);
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get tasks$(): Observable<Task[]> {
    return this.tasksSubject.asObservable();
  }

  getCurrentTasks(): Task[] {
    return this.tasksSubject.value;
  }

  addTask(taskData: {title: string, description?: string}) {
    const newTask: Task = {
      id: this.currentId++,
      title: taskData.title.trim(),
      description: taskData.description?.trim(),
      status: TaskStatus.NotCompleted
    }
    
    const currentTasks = this.tasksSubject.value;
    if (currentTasks.some(task => task.id === newTask.id)) {
      newTask.id = this.currentId++;
    }
    
    this.tasksSubject.next([...currentTasks, newTask]);
  }

  deleteTask(id: number) {
    const currentTasks = this.tasksSubject.value;
    const updated = currentTasks.filter(task => task.id !== id);
    if (updated.length !== currentTasks.length) {
      this.tasksSubject.next(updated);
    }
  }

  updateTaskStatus(id: number, newStatus: TaskStatus) {
    const currentTasks = this.tasksSubject.value;
    const taskIndex = currentTasks.findIndex(task => task.id === id);

    if (taskIndex !== -1 && currentTasks[taskIndex].status !== newStatus) {
      const updatedTasks = [...currentTasks];
      updatedTasks[taskIndex] = { ...updatedTasks[taskIndex], status: newStatus };
      this.tasksSubject.next(updatedTasks);
    }
  }

  getTaskById(taskId: number): Task | undefined {
    if (!taskId || isNaN(taskId)) {
      return undefined;
    }
    return this.tasksSubject.value.find(task => task.id === taskId);
  }


}
