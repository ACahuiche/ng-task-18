import { Injectable, inject } from '@angular/core';
import { Auth, authState, getAuth, signOut, User } from '@angular/fire/auth';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthStateService {

  private _auth = inject(Auth);

  get authState$(): Observable<User | null> {
    return authState(this._auth);
  }

  get currentUser() {
    return getAuth().currentUser;
  }

  logOutSesion() {
    return signOut(this._auth);
  }

  
}
