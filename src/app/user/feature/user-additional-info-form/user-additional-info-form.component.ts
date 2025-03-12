import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { isRequired } from '../../../core/new-user-info-form-validator';
import { UserService } from '../../data-access/user.service';
import { toast } from 'ngx-sonner';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-additional-info-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './user-additional-info-form.component.html',
  styleUrl: './user-additional-info-form.component.css'
})
export default class UserAdditionalInfoFormComponent {
  private _formBuilder = inject(FormBuilder);
  private _userService = inject(UserService);
  private _router = inject(Router);

  form = this._formBuilder.group({
    name: this._formBuilder.control('',Validators.required),
    lastname: this._formBuilder.control('', Validators.required),
    isMale: this._formBuilder.control<boolean>(true, Validators.required),
  });

  isRequired(field: 'name' | 'lastname'){
    return isRequired(field, this.form);
  }

  async submit() {
    if (this.form.invalid) return;

    try {
      const { name, lastname, isMale } = this.form.value;
      if(name && lastname){
        const data = {
          name: name || '', 
          lastname: lastname || '',
          isMale: typeof isMale === 'boolean' ? isMale : true 
        }
        await this._userService.saveDataBasicInfo(data);
        this.form.reset();
        toast.info('La informacion se guardo de forma correcta');
        this._router.navigateByUrl('/tasks')
      }
    } 
    catch (error) 
    {
      console.log(error);
    }
   
  }

}
