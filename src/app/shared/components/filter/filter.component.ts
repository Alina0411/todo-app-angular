import {Component, EventEmitter, Output} from '@angular/core';
import {MatFormField} from '@angular/material/form-field';
import {MatOption, MatSelect} from '@angular/material/select';


@Component({
  selector: 'app-filter',
  standalone: true,
  imports: [
    MatFormField,
    MatSelect,
    MatOption
  ],
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.scss'
})
export class FilterComponent {
  @Output() filterChange = new EventEmitter<'all' | 'not_completed' | 'completed'>();
  statusOptions = [
    { value: 'all', label: 'Все' },
    { value: 'completed', label: 'Выполненные' },
    { value: 'not_completed', label: 'Не выполненные' }
  ];

  selectedStatus = 'all';

  onSelectionChange(event: any) {
    this.filterChange.emit(event.value);
  }
}
