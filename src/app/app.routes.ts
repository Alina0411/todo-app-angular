import { Routes } from '@angular/router';
import {TaskListComponent} from './tasks/task-list/task-list.component';
import {TaskDetailComponent} from './tasks/task-detail/task-detail.component';

export const routes: Routes = [
  { path: 'tasks', component: TaskListComponent },
  { path: 'tasks/:id', component: TaskDetailComponent },
  { path: '', redirectTo: 'tasks', pathMatch: 'full' },
];
