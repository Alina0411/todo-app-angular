import {Component, EventEmitter, OnInit, OnDestroy, Output} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatFormField, MatFormFieldModule} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MatLabel} from '@angular/material/form-field';
import {TaskDialogComponent} from '../task-dialog/task-dialog.component';
import {Subject, takeUntil} from 'rxjs';

@Component({
  selector: 'app-task-form',
  imports: [
    ReactiveFormsModule,
    MatFormField,
    MatInput,
    MatLabel,
    MatFormFieldModule
  ],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.scss'
})
export class TaskFormComponent implements OnInit, OnDestroy {
  @Output() formStatus = new EventEmitter<boolean>();
  @Output() submitted = new EventEmitter<any>();
  private destroy$ = new Subject<void>();
  
  taskForm = new FormGroup({
    title: new FormControl<string | null>('', Validators.required),
    description: new FormControl<string | null>(''),
  });

  ngOnInit() {
    this.taskForm.statusChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.formStatus.emit(this.taskForm.valid);
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  submit() {
    if (this.taskForm.valid) {
      const formValue = this.taskForm.value;
      this.submitted.emit({
        title: formValue.title || '',
        description: formValue.description || ''
      });
    }
  }
}
