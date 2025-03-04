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
      <span> <a routerLink="/tasks">Sitios</a> | <a routerLink="/categories">Categorias</a> </span>
      <button (click)="logOut()" type="button"
    class="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800 inline-flex items-center">
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="me-2 icon icon-tabler icons-tabler-outline icon-tabler-logout-2">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <path d="M10 8v-2a2 2 0 0 1 2 -2h7a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-7a2 2 0 0 1 -2 -2v-2" />
        <path d="M15 12h-12l3 -3" />
        <path d="M6 15l-3 -3" />
    </svg>
    Cerrar Sesión
</button>
      </nav>
    </header>
    <router-outlet />
    `
})

export default class LayoutComponent {

  private authState = inject(AuthStateService);
  private router = inject(Router);

  async logOut() {
    this.router.navigateByUrl('/auth/sign-in');
    await this.authState.logOutSesion();
  }
}