import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TableComponent } from '../../ui/table/table.component';
import { TaskService } from '../../data-access/task.service';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [RouterModule,TableComponent],
  providers: [TaskService],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css'
})
export default class TaskListComponent {
  tasksService = inject(TaskService);

}
