import { Component, computed, inject, input, signal } from '@angular/core';
import { Task, TaskService } from '../../data-access/task.service';
import { RouterLink } from '@angular/router';
import { toast } from 'ngx-sonner';
import { TruncatePipe } from '../../../core/truncate.pipe';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [RouterLink, TruncatePipe, FormsModule],
  templateUrl: './table.component.html',
  styles: ``
})
export class TableComponent {
  tasks = input.required<Task[]>();
  private _taskService = inject(TaskService);

  searchTerm = signal<string>('');

  filteredTasks = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    return this.tasks().filter(task => 
      task.title.toLowerCase().includes(term) || 
      task.description.toLowerCase().includes(term) ||
      task.urlSite.toLowerCase().includes(term)
    );
  });

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
