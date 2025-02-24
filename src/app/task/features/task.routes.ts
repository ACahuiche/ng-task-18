import { Routes } from "@angular/router";

export default [
    {
        path: '',
        loadComponent: () => import('./task-list/task-list.component')
    },
    {
        path: 'new',
        loadComponent: () => import('./task-form/task-form.component')
    },
    {
        path: 'edit/:idSite',
        loadComponent: () => import('./task-form/task-form.component')
    },
    {
        path: 'share/:nameSite/:urlSite/:descriptionSite',
        loadComponent: () => import('./task-form/task-form.component')
    }
] as Routes