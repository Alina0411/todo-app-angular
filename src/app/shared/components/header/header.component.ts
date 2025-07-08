import {Component, EventEmitter, Input, Output} from '@angular/core';
import {MatFabButton} from '@angular/material/button';

import {HeaderConfig} from '../models/header-config.model';
import {MatIcon} from '@angular/material/icon';
import {NgClass} from '@angular/common';
import {FilterComponent} from '../filter/filter.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    MatFabButton,
    MatIcon,
    NgClass,
    FilterComponent
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  @Input() config!: HeaderConfig;
  @Input() customClass = '';
  @Input() showFilter = false;
  @Output() openTaskDialog = new EventEmitter();
  @Output() goBack = new EventEmitter();
  @Output() statusChanged = new EventEmitter<'all' | 'not_completed' | 'completed'>();

  onFilterStatusChanged(status: 'all' | 'not_completed' | 'completed') {
    this.statusChanged.emit(status);
  }
}
