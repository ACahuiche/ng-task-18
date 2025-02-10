import { Component, inject, input } from '@angular/core';
import { Task, TaskService } from '../../data-access/task.service';
import { RouterLink } from '@angular/router';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './table.component.html',
  styles: ``
})
export class TableComponent {
  tasks = input.required<Task[]>();
  private _taskService = inject(TaskService);

  deleteSite(id:string) {
    this._taskService.delete(id);
  }

  copyToClipboard(url: string): void {
    navigator.clipboard.writeText(url).then(() => {
      toast.error('URL copiada al portapapeles');
    }).catch((error) => {
      console.error('Error al copiar la URL:', error);
    });
  }

}
