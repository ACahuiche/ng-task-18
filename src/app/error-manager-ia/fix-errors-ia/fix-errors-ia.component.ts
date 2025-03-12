import { Component, inject, OnInit } from '@angular/core';
import { FixErrorsIaService } from '../fix-errors-ia.service';
import { ErrorLog, ErrorlogsService } from '../../core/errorlogs.service';
import { BaseContext } from '../../core/base-context';
import { Timestamp } from '@angular/fire/firestore';
import { AuthStateService } from '../../shared/data-access/auth-state.service';
import { Observable } from 'rxjs';
import { User } from '@angular/fire/auth';
import { HttpClient } from '@angular/common/http';

interface RandomUserResponse {
  results: {
    picture: {
      thumbnail: string;
    };
  }[];
}

@Component({
  selector: 'app-fix-errors-ia',
  standalone: true,
  imports: [],
  providers: [FixErrorsIaService],
  templateUrl: './fix-errors-ia.component.html',
  styleUrl: './fix-errors-ia.component.css'
})
export default class FixErrorsIaComponent extends BaseContext implements OnInit {
  private _Gemini = inject(FixErrorsIaService);
  private _errorLogService = inject(ErrorlogsService);
  private _authState = inject(AuthStateService)
  private _http = inject(HttpClient);
  userName: string;
  userEmail: string;
  urlPhoto: string;
  uidejem: string;
  user$: Observable<User | null>;

  constructor() {
    super();
    this.userName = '';
    this.urlPhoto = '';
    this.uidejem = '';
    this.userEmail = '';
    this.user$ = this._authState.authState$;
  }

  ngOnInit(): void {
    this.user$.subscribe(user => {
      if (user) {
        this.userName = user.displayName || 'Usuario registrado';
        this.userEmail = user.email || '';
        this.urlPhoto = user.photoURL || this.getRandomImageUser();
        this.uidejem = user.uid || '';
      }
    });
  }

  errorLog: ErrorLog = {
    timestamp: Timestamp.now(),
    element: '',
    errorMessage: ''
  };

  getRandomImageUser():string  {
    this._http.get<RandomUserResponse>('https://randomuser.me/api/').subscribe((data) => {
      this.urlPhoto = data.results[0].picture.thumbnail;
    });
    return this.urlPhoto;
  }

  async eventoError(){    
    try {
      this.lanzarError();
    } catch (error) {
      console.log('Generando solucion al error, espere...')
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

  lanzarError(){
    throw new Error('RangeError: Invalid array length');
  }

}
