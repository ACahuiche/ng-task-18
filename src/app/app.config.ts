import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes, withComponentInputBinding()), 
    provideFirebaseApp(() => initializeApp({ 
      "projectId": "ng-task-18-6b5e9", 
      "appId": "1:226831158468:web:b45d98fe338a0522cccd91", 
      "storageBucket": "ng-task-18-6b5e9.firebasestorage.app", 
      "apiKey": "AIzaSyAUpeiA57Am3M5DGgs8UTf_EMlyYrghHh0", 
      "authDomain": "ng-task-18-6b5e9.firebaseapp.com", 
      "messagingSenderId": "226831158468" })), 
      provideAuth(() => getAuth()), provideFirestore(() => getFirestore())]
};
