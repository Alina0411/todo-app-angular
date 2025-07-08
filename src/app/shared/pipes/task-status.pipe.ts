import {Pipe, PipeTransform} from '@angular/core';
import {TaskStatus} from '../../core/models/task.model';

@Pipe({
  name: 'statusInfoText'
})

export class StatusInfoTextPipe implements PipeTransform {
  transform(status: TaskStatus)  {
    return status === TaskStatus.Completed ? 'Выполнено' : 'Не выполнено';
  }

}
