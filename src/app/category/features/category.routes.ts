import { Routes } from "@angular/router";

export default [
    {
        path: '',
        loadComponent: () => import('./category/category.component')
    },
    {
        path: 'new',
        loadComponent: () => import('./category-form/category-form.component')
    },
    {
        path: 'edit/:idCategory',
        loadComponent: () => import('./category-form/category-form.component')
    }
] as Routes