import { Routes } from "@angular/router";
import { mainNewInfoGuard } from "../../core/main-new-info.guard";

export default [
    {
        canActivate: [mainNewInfoGuard],
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