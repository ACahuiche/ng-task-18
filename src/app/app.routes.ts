import { Routes } from '@angular/router';
import { privateGuard, publicGuard } from './core/auth.guard';
import { newInfoGuard } from './core/new-info.guard';
import { adminOptionGuard } from './core/admin-options.guard';

export const routes: Routes = [
    { 
        canActivateChild: [ publicGuard ],
        path: 'auth',
        loadChildren: () => import('./auth/features/auth.routes')
    },
    {
        canActivateChild: [ privateGuard ],
        path: 'tasks',
        loadComponent: () => import('./shared/iu/layout.component'),
        loadChildren: () => import('./task/features/task.routes')
    },
    {
        canActivateChild: [ privateGuard ],
        path: 'categories',
        loadComponent: () => import('./shared/iu/layout.component'),
        loadChildren: () => import('./category/features/category.routes')
    },
    {
        canActivate: [ privateGuard, newInfoGuard ],
        path: 'userinfo',
        loadComponent: () => import('./user/feature/user-additional-info-form/user-additional-info-form.component')
    },
    {
        canActivate: [ privateGuard, adminOptionGuard ],
        path: 'errors',
        loadComponent: () => import('./error-manager-ia/fix-errors-ia/fix-errors-ia.component')
    },
    /*{
        canActivate: [ privateGuard, adminOptionGuard ],
        path: 'pokemons',
        loadComponent: () => import('./pokemon/features/choose-pokemon/choose-pokemon.component')
    },*/
    {
        path: '**',
        redirectTo: '/tasks'
    }
];
