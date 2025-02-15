import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../data-access/auth.service';
import { Router, RouterLink } from '@angular/router';
import { confirmedPassword, hasEmailError, isRequired } from '../../utils/validators';
import { toast } from 'ngx-sonner';
import { GoogleButtonComponent } from '../../ui/google-button/google-button.component';
import { FooterComponent } from '../../../partials/footer/footer.component';
import { ErrorlogsService, ErrorLog } from '../../../core/errorlogs.service';

export interface formSignIn {
  email: FormControl<string | null>;
  password: FormControl<string | null>;
}

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, GoogleButtonComponent, FooterComponent],
  providers: [AuthService, ErrorlogsService],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.css'
})
export default class SignInComponent {
  private _formBuilder = inject(FormBuilder);
  private _authService = inject(AuthService);
  private _router = inject(Router);
  private _errorLogService = inject(ErrorlogsService);

  errorLog: ErrorLog = {
    timestamp: new Date(),
    element: 'sign-in',
    type: 'component',
    errorMessage: ''
  };

  isRequired(field: 'email' | 'password') {
    return isRequired(field, this.form)
  }

  hasEmailError() {
    return hasEmailError(this.form);
  }

  confirmedPassword() {
    return confirmedPassword(this.form);
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
    catch(error) {
      if(error instanceof Error){
        this.errorLog = {
          timestamp: new Date(),
          element: 'sign-in: email',
          type: 'component',
          errorMessage: error.message
        }
      }
      else {
        this.errorLog = {
          timestamp: new Date(),
          element: 'sign-in: email',
          type: 'component',
          errorMessage: 'Error desconocido'
        }
      }
      this._errorLogService.save(this.errorLog);
      toast.error('Datos incorrectos');
    }
  }

  async signInWithGoogle() {
    try {
      await this._authService.signInWithGoogle();
      toast.success('Acceso correcto');
      this._router.navigate(['/tasks']);
    }
    catch(error) {
      if(error instanceof Error) {
        this.errorLog = {
          timestamp: new Date(),
          element: 'sign-in: GoogleAccount',
          type: 'component',
          errorMessage: error.message
        }
      }
      else{
        this.errorLog = {
          timestamp: new Date(),
          element: 'sign-in: GoogleAccount',
          type: 'component',
          errorMessage: 'Error desconocido'
        }
      }
      this._errorLogService.save(this.errorLog);
      toast.error('Datos incorrectos');
    }
  }
}
