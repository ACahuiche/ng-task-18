import { Component, computed, inject, input, signal } from '@angular/core';
import { Category, CategoryService } from '../../data-access/category.service';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TimestampToDatePipe } from "../../../core/timestamp-to-date.pipe";

@Component({
  selector: 'app-category-table',
  standalone: true,
  imports: [RouterLink, FormsModule, TimestampToDatePipe],
  templateUrl: './category-table.component.html',
  styleUrl: './category-table.component.css'
})
export class CategoryTableComponent {
  categories = input.required<Category[]>();
  private _CategoryService = inject(CategoryService);

  searchTerm = signal<string>('');

  filteredCategories = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    return this.categories().filter(category => 
      category.name.toLowerCase().includes(term)
    );
  });

  deleteCategory(id: string) {
    this._CategoryService.delete(id);
  }

}
