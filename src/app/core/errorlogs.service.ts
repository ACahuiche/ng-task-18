import { Injectable, inject } from '@angular/core';
import { Firestore, Timestamp, addDoc, collection } from '@angular/fire/firestore';
import { AuthStateService } from '../shared/data-access/auth-state.service';

const collectionErrorLogs = 'errorlogs';

export interface ErrorLog{
  timestamp: Date;
  element: string;
  type: string;
  errorMessage: string;
}

@Injectable({
  providedIn: 'root'
})
export class ErrorlogsService {
  private _firestore = inject(Firestore);
  private _errorLogCollection = collection(this._firestore, collectionErrorLogs);
  private _authState = inject(AuthStateService);
 
  save(errorLog: ErrorLog){
    return addDoc(this._errorLogCollection, {
      ...errorLog, 
      timestamp: Timestamp.fromDate(errorLog.timestamp),
      userId:this._authState.currentUser?.uid});
  }
}
