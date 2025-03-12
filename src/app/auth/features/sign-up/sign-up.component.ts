import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { confirmedPassword, hasEmailError, isRequired, validateMinLenght } from '../../utils/validators';
import { AuthService } from '../../data-access/auth.service';
import { toast } from 'ngx-sonner';
import { Router, RouterLink } from '@angular/router';
import { GoogleButtonComponent } from '../../ui/google-button/google-button.component';
import { FixErrorsIaService } from '../../../error-manager-ia/fix-errors-ia.service';
import { ErrorLog, ErrorlogsService } from '../../../core/errorlogs.service';
import { BaseContext } from '../../../core/base-context';
import { Timestamp } from '@angular/fire/firestore';
import { CreateNewUser, UserService } from '../../../user/data-access/user.service';

export interface formSignUp {
  email: FormControl<string | null>;
  password: FormControl<string | null>;
  confirmPassword: FormControl<string | null>;
}

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, GoogleButtonComponent],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css'
})
export default class SignUpComponent extends BaseContext{
  private _Gemini = inject(FixErrorsIaService);
  private _errorLogService = inject(ErrorlogsService);
  private _formBuilder = inject(FormBuilder);
  private _authService = inject(AuthService);
  private _router = inject(Router);
  private _userService = inject(UserService);
  newUser: CreateNewUser;

  errorLog: ErrorLog = {
    timestamp: Timestamp.now(),
    element: '',
    errorMessage: ''
  };

  constructor() {
    super();

    this.newUser = {
      isConfig: false
    }

  }

  form = this._formBuilder.group<formSignUp>({
    email: this._formBuilder.control('', [
      Validators.required,
      Validators.email
    ]),
    password: this._formBuilder.control('', [
      Validators.required,
      Validators.minLength(6)
    ]),
    confirmPassword: this._formBuilder.control('', [
      Validators.required
    ])
  });

  isRequired(field: 'email' | 'password' | 'confirmPassword') {
    return isRequired(field, this.form)
  }

  hasEmailError() {
    return hasEmailError(this.form);
  }

  validateMinLenght() {
    return validateMinLenght(this.form);
  }

  confirmedPassword() {
    return confirmedPassword(this.form);
  }

  clearErrorLogObject() {
    this.errorLog = {
      timestamp: Timestamp.now(),
      element: '',
      errorMessage: ''
    };
  }

  async submit() {
    if (this.form.invalid) return;

    try {
      const { email, password } = this.form.value;

      if (email && password) {
        await this._authService.signup({ email, password });
        await this._userService.saveNewUser(this.newUser);
        toast.success('Usuario creado correctamente');
        this._router.navigate(['/tasks']);
      }
    }
    catch (error) {
      if(error instanceof Error){
        const context = this.getContext(error);
        const errSolution = await this._Gemini.EvaluateError(error.message);

        this.errorLog = {
          timestamp: Timestamp.now(),
          element: context.className,
          errorMessage: error.message,
          AISolution: errSolution
        }
      }
      else{
        const context = this.getContext();
        this.errorLog = {
          timestamp: Timestamp.now(),
          element: context.className,
          errorMessage: 'Error desconocido'
        }
      }
      this._errorLogService.save(this.errorLog);
      console.log('Error identificado, verificar con el admin el log de erorres');
    }
  }


  async submitWithGoogle() {
    try {
      await this._authService.signInWithGoogle();
      toast.success('Bienvenido de nuevo')
      this._router.navigate(['/tasks']);
    }
    catch (error) {
      if(error instanceof Error){
        const context = this.getContext(error);
        const errSolution = await this._Gemini.EvaluateError(error.message);

        this.errorLog = {
          timestamp: Timestamp.now(),
          element: context.className,
          errorMessage: error.message,
          AISolution: errSolution
        }
      }
      else{
        const context = this.getContext();
        this.errorLog = {
          timestamp: Timestamp.now(),
          element: context.className,
          errorMessage: 'Error desconocido'
        }
      }
      this._errorLogService.save(this.errorLog);
      console.log('Error identificado, verificar con el admin el log de erorres');
    }
  }
}
