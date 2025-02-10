import { Component, inject } from "@angular/core";
import { Router, RouterModule } from "@angular/router";
import { AuthStateService } from "../data-access/auth-state.service";

@Component({
  standalone: true,
  imports: [RouterModule],
  selector: 'app-layout',
  template: `
    <header class="h-[80px] mb-8 w-full max-w-screen-lg mx-auto px-4">
      <nav class="flex items-center justify-between h-full">
      <a class="text-2xl font-bold" routerLink="/tasks"> Registro de sitios importantes</a>
      <button (click)="logOut()" type="button" class="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">Cerrar Sesion</button>
      </nav>
    </header>
    <router-outlet />
    `
})

export default class LayoutComponent {

  constructor() { }

  private authState = inject(AuthStateService);
  private router = inject(Router);

  async logOut() {
    this.router.navigateByUrl('/auth/sign-in');
    await this.authState.logOutSesion();
  }
}