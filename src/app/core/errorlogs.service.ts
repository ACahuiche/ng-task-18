import { Injectable, inject } from '@angular/core';
import { Firestore, Timestamp, addDoc, collection } from '@angular/fire/firestore';
import { AuthStateService } from '../shared/data-access/auth-state.service';
import { environment } from '../../environments/environment';

export interface ErrorLog{
  timestamp: Timestamp;
  element: string;
  errorMessage: string;
  AISolution?: string;
  userId?:string;
}

@Injectable({
  providedIn: 'root'
})
export class ErrorlogsService {
  private _firestore = inject(Firestore);
  private _errorLogCollection = collection(this._firestore, environment.collectionLoggerName);
  private _authState = inject(AuthStateService);
 
  save(errorLog: ErrorLog){
    return addDoc(this._errorLogCollection, {
      ...errorLog,
      userId:this._authState.currentUser?.uid});
  }
}
