import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../data-access/auth.service';
import { Router, RouterLink } from '@angular/router';
import { confirmedPassword, hasEmailError, isRequired } from '../../utils/validators';
import { toast } from 'ngx-sonner';
import { GoogleButtonComponent } from '../../ui/google-button/google-button.component';
import { ErrorlogsService, ErrorLog } from '../../../core/errorlogs.service';
import { FixErrorsIaService } from '../../../error-manager-ia/fix-errors-ia.service';
import { BaseContext } from '../../../core/base-context';
import { Timestamp } from '@angular/fire/firestore';

export interface formSignIn {
  email: FormControl<string | null>;
  password: FormControl<string | null>;
}

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, GoogleButtonComponent],
  providers: [AuthService, ErrorlogsService],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.css'
})
export default class SignInComponent extends BaseContext{
  private _formBuilder = inject(FormBuilder);
  private _authService = inject(AuthService);
  private _router = inject(Router);
  private _Gemini = inject(FixErrorsIaService);
  private _errorLogService = inject(ErrorlogsService);

  errorLog: ErrorLog = {
    timestamp: Timestamp.now(),
    element: '',
    errorMessage: ''
  };

  constructor() {
    super();
  }

  isRequired(field: 'email' | 'password') {
    return isRequired(field, this.form)
  }

  hasEmailError() {
    return hasEmailError(this.form);
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

  form = this._formBuilder.group<formSignIn>({
    email: this._formBuilder.control('', [
      Validators.required,
      Validators.email
    ]),
    password: this._formBuilder.control('', [
      Validators.required
    ])
  });

  async submit() {
    if (this.form.invalid) return;

    try {
      const { email, password } = this.form.value;

      if (email && password) {
        await this._authService.signIn({ email, password });
        toast.success('Acceso correcto');
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
      console.log('Error identificado, verificar con el admin el log de erorres')
    }
  }

  async signInWithGoogle() {
    try {
      await this._authService.signInWithGoogle();
      toast.success('Acceso correcto');
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
      console.log('Error identificado, verificar con el admin el log de erorres')
    }
  }
}
