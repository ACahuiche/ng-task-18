import { Component, effect, inject, input, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoryCreate, CategoryService } from '../../data-access/category.service';
import { Router } from '@angular/router';
import { isRequired } from '../../../core/category-form-validator';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-category-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  providers: [CategoryService],
  templateUrl: './category-form.component.html',
  styleUrl: './category-form.component.css'
})
export default class CategoryFormComponent {
  private _formBuilder = inject(FormBuilder);
  private _categoryService = inject(CategoryService);
  private _router = inject(Router);

  loading = signal(false);

  idCategory = input.required<string>();

  constructor() {
    effect(() => {
      const idCat = this.idCategory();
      if(idCat) {
        this.getCategory(idCat);
      }
    });
  }

  form = this._formBuilder.group({
    name: this._formBuilder.control('', Validators.required)
  });

  isRequired(field: 'name') {
    return isRequired(field, this.form);
  }

  async getCategory(id: string) {
    const categorySnapshot = await this._categoryService.getCategory(id);

    if(!categorySnapshot.exists()) return;

    const category = categorySnapshot.data();

    this.form.patchValue(category);
  }

  async submit() {
    if (this.form.invalid) return;

    try {
      this.loading.set(true);
      const {name} = this.form.value;

      const category: CategoryCreate = {
        name: name || ''
      };

      const id = this.idCategory();
      if (id) {
        await this._categoryService.update(id, category);
        this._router.navigateByUrl('/categories')
      }
      else {
        await this._categoryService.create(category);
        this.form.reset();
        this._router.navigateByUrl('/categories')
      }
      
    } catch (error) {
      toast.error('Ha ocurrido un error, no se creo la tarea');
      console.log(error);
    }
  }

  cancel() {
    this._router.navigateByUrl('/categories')
  }
}
