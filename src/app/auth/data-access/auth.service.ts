import { Injectable, inject } from '@angular/core';
import { Auth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInWithPopup,
  GoogleAuthProvider,
  RecaptchaVerifier
} from '@angular/fire/auth';

export interface User {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _auth = inject(Auth);

  async signup(user: User) {
    try {
      const recaptchaVerifier = new RecaptchaVerifier(this._auth, 'recaptcha-container', {
        size: 'invisible'
      });

      await recaptchaVerifier.verify();

      return await createUserWithEmailAndPassword(this._auth, user.email, user.password);
    } catch (error) {
      console.error("Error en el registro:", error);
      throw error;
    }
  }

  async signIn(user: User) {
    try {
      const recaptchaVerifier = new RecaptchaVerifier(this._auth, 'recaptcha-container', {
        size: 'invisible'
      });

      await recaptchaVerifier.verify();

      return await signInWithEmailAndPassword(this._auth, user.email, user.password); 
      
    } catch (error) {
      console.error("Error en autenticación:", error);
      throw error;
    }
  }

  async signInWithGoogle() {
    try {
      
      const recaptchaVerifier = new RecaptchaVerifier(this._auth, 'recaptcha-container', {
        size: 'invisible'
      });

      await recaptchaVerifier.verify();

      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });

      return await signInWithPopup(this._auth, provider);
    } catch (error) {
      console.error("Error en autenticación con Google:", error);
      throw error;
    }
  }
}
