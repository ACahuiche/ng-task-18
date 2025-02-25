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

  shareSite(name: string, urlSite: string, description: string) {
    name = encodeURIComponent(name);
    urlSite = encodeURIComponent(urlSite);
    description = encodeURIComponent(description);

    const url = `https://${window.location.hostname}/tasks/share/${name}/${urlSite}/${description}`;

    this.clipboardProcess(url,"Link para compartir generado", "Error al generar link para compartir");
  }

  copyToClipboard(url: string): void {
    this.clipboardProcess(url, "URL copiada al portapapeles", "Error al copiar la URL: ");
  }

  clipboardProcess(url: string, msgSuccess: string, msgFailed: string): void {
    navigator.clipboard.writeText(url).then(() => {
      toast.info(msgSuccess);
    }).catch((error) => {
      toast.error(msgFailed, error);
    });
  }

}
