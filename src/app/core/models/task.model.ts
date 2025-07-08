export interface Task {
  id: number;
  title: string;
  description?: string;
  status: TaskStatus
}

export enum TaskStatus {
  Completed = 'completed',
  NotCompleted = 'not_completed',
}
