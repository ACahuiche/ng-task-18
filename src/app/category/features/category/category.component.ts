import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CategoryTableComponent } from '../../ui/category-table/category-table.component';
import { CategoryService } from '../../data-access/category.service';


@Component({
  selector: 'app-category',
  standalone: true,
  imports: [RouterModule, CategoryTableComponent],
  providers: [CategoryService],
  templateUrl: './category.component.html',
  styleUrl: './category.component.css'
})
export default class CategoryComponent {
  categoryService = inject(CategoryService)
}
