import { Routes } from '@angular/router';
import { privateGuard, publicGuard } from './core/auth.guard';

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
        path: '**',
        redirectTo: '/tasks'
    }
];
