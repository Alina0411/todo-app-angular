import {Component, inject, ViewChild} from '@angular/core';
import {TaskFormComponent} from '../task-form/task-form.component';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import {MatButton} from '@angular/material/button';



@Component({
  selector: 'app-task-dialog',
  imports: [
    TaskFormComponent,
    MatDialogContent,
    MatDialogActions,
    MatButton,
    MatDialogClose,
    MatDialogTitle,

  ],
  templateUrl: './task-dialog.component.html',
  styleUrl: './task-dialog.component.scss'
})
export class TaskDialogComponent {
  dialogRef = inject(MatDialogRef);
  isFormValid = false;
  @ViewChild(TaskFormComponent) taskFormComponent!: TaskFormComponent;


  onSave() {
    this.taskFormComponent.submit()
  }

  onSubmit(formData: {title: string, description?: string}) {
    this.dialogRef.close(formData);
  }
}
