import { Component, effect, inject, input, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Task, TaskCreate, TaskService } from '../../data-access/task.service';
import { toast } from 'ngx-sonner';
import { Router } from '@angular/router';
import { hasUrlError, isRequiredToSave } from '../../../auth/utils/validators';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  providers: [TaskService],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.css'
})
export default class TaskFormComponent {
  private _formBuilder = inject(FormBuilder);
  private _taskService = inject(TaskService);
  private _router = inject(Router);

  loading = signal(false);

  idSite = input.required<string>();
  nameSite = input.required<string>();
  urlSite = input.required<string>();
  descriptionSite = input.required<string>();

  constructor() {
    effect(() => {
      const id = this.idSite();
      const name = this.nameSite();
      const url = this.urlSite();
      const description = this.descriptionSite();
      
      if (id) {
        this.getSite(id);
      }

      if (name && url && description) {
        this.infoShared(name, url, description);
      }
    });
  }

  form = this._formBuilder.group({
    title: this._formBuilder.control('', Validators.required),
    urlSite: this._formBuilder.control('', [
      Validators.required,
      Validators.pattern(/^(https?:\/\/)?([\w\-]+\.)+[\w\-]+(\/[\w\-./?%&=]*)?$/i)
    ]),
    description: this._formBuilder.control('', Validators.required)
  });

  isRequired(field: 'title' | 'urlSite' | 'description') {
    return isRequiredToSave(field, this.form)
  }

  hasUrlError() {
    return hasUrlError(this.form);
  }

  async submit() {
    if (this.form.invalid) return;
    try {
      this.loading.set(true)
      const {title, urlSite, description} = this.form.value;

      const task: TaskCreate = {
        title: title || '',
        urlSite: urlSite || '',
        description: description || ''
      };

      const id = this.idSite();
      if (id) {
        await this._taskService.update(id, task);
        toast.success('Sitio actualizado correctamente');
        this._router.navigateByUrl('/tasks')
      }
      else {
        await this._taskService.create(task);
        toast.success('Sitio guardado correctamente');
        this.form.reset();
        this._router.navigateByUrl('/tasks')
      }
      
    } catch (error) {
      toast.error('Ha ocurrido un error, no se creo la tarea');
      console.log(error);
    }
    finally{
      this.loading.set(false)
    }
  }

  cancel() {
    this._router.navigateByUrl('/tasks')
  }

  async getSite(id: string){
    const siteSnapshot = await this._taskService.getSite(id);

    if(!siteSnapshot.exists()) return;

    const site = siteSnapshot.data() as Task;

    this.form.patchValue(site);
  }

  infoShared(name:string, url:string, description:string){
    name = decodeURIComponent(name);
    url = decodeURIComponent(url);
    description = decodeURIComponent(description);
    
    this.form.patchValue({
      title: name,
      urlSite: url,
      description: description
    });
  }
    
}
