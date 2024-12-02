import { Component, inject } from '@angular/core';
import { AuthStateService } from '../../../shared/data-access/auth-state.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css'
})
export default class TaskListComponent {

  private authState = inject(AuthStateService);
  private router = inject(Router);

  async logOut() {
    this.router.navigateByUrl('/auth/sign-in');
    await this.authState.logOutSesion();
    
  }
}
